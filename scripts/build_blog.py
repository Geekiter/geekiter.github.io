"""Run the stock Gmeek generator with a durable, reconciled incremental cache."""

import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import urllib.request


def build_plan(previous, current, source_hash, force=False):
    """Compare the complete issue set, so coalesced events cannot lose edits."""
    if force or not previous or previous.get("source") != source_hash:
        return "full", []
    old_issues = previous["issues"]
    if old_issues.keys() - current.keys():
        return "full", []
    for number in old_issues.keys() & current.keys():
        old = old_issues[number]
        new = current[number]
        if isinstance(old, dict) and isinstance(new, dict):
            # Renames and page-type changes must purge obsolete HTML paths.
            if old["title"] != new["title"] or old["labels"] != new["labels"]:
                return "full", []
    changed = sorted(
        number for number, digest in current.items()
        if old_issues.get(number) != digest
    )
    if len(changed) > 3:
        return "full", []
    return "incremental", changed


def issue_snapshot(repository, token):
    snapshot = {}
    page = 1
    while True:
        request = urllib.request.Request(
            f"https://api.github.com/repos/{repository}/issues"
            f"?state=open&per_page=100&page={page}",
            headers={"Authorization": f"Bearer {token}",
                     "Accept": "application/vnd.github+json"},
        )
        with urllib.request.urlopen(request, timeout=60) as response:
            issues = json.load(response)
        for issue in issues:
            if not issue["labels"]:
                continue
            fields = {
                "title": issue["title"], "body": issue["body"],
                "labels": sorted(label["name"] for label in issue["labels"]),
                "comments": issue["comments"], "updated": issue["updated_at"],
            }
            snapshot[str(issue["number"])] = {
                "title": fields["title"], "labels": fields["labels"],
                "digest": hashlib.sha256(
                    json.dumps(fields, sort_keys=True).encode()
                ).hexdigest(),
            }
        if len(issues) < 100:
            break
        page += 1
    return snapshot


def patch_manual_publish_date(engine):
    """Teach the pinned Gmeek engine to accept a clean date line in an Issue."""
    engine_file = engine / "Gmeek.py"
    source = engine_file.read_text(encoding="utf-8")
    if "manual_publish_date_support" in source:
        return

    method_start = "    def addOnePostJson(self,issue):\n"
    method_end = "    def runAll(self):\n"
    if method_start not in source or method_end not in source:
        raise RuntimeError("Unsupported Gmeek source: cannot patch publish date support")

    before, method_and_after = source.split(method_start, 1)
    method, after = method_and_after.split(method_end, 1)
    method = (
        "        # manual_publish_date_support\n"
        "        post_body = issue.body or ''\n"
        "        date_match = re.search(r'(?m)^\s*发布日期\s*[:：]\s*(\\d{4}-\\d{2}-\\d{2})\s*$', post_body)\n"
        "        publish_date = date_match.group(1) if date_match else None\n"
        "        if date_match:\n"
        "            post_body = re.sub(r'(?m)^\s*发布日期\s*[:：]\s*\\d{4}-\\d{2}-\\d{2}\s*$\\n?', '', post_body).strip()\n"
        + method
    )
    method = method.replace("if issue.body==None:", "if not post_body:")
    method = method.replace("len(issue.body)", "len(post_body)")
    method = method.replace("issue.body.split(period)", "post_body.split(period)")
    method = method.replace("f.write(issue.body)", "f.write(post_body)")

    date_anchor = (
        "            thisTime=datetime.datetime.fromtimestamp(self.blogBase[listJsonName][postNum][\"createdAt\"])\n"
    )
    if date_anchor not in method:
        raise RuntimeError("Unsupported Gmeek source: cannot apply manual publish date")
    method = method.replace(
        date_anchor,
        "            if publish_date:\n"
        "                self.blogBase[listJsonName][postNum][\"createdAt\"] = int(datetime.datetime.strptime(publish_date, '%Y-%m-%d').replace(tzinfo=self.TZ).timestamp())\n"
        + date_anchor,
        1,
    )
    engine_file.write_text(before + method_start + method + method_end + after, encoding="utf-8")


def main():
    repository = os.environ["GITHUB_REPOSITORY"]
    token = os.environ["GH_TOKEN"]
    workspace = Path(os.environ["GITHUB_WORKSPACE"]).resolve()
    engine = Path(os.environ["GMEEK_ENGINE"]).resolve()
    patch_manual_publish_date(engine)
    cache = workspace / ".gmeek-state"
    source = hashlib.sha256()
    source.update(subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=engine))
    inputs = [workspace / "config.json", Path(__file__).resolve()]
    for directory in ("templates", "static"):
        inputs.extend(sorted(path for path in (workspace / directory).rglob("*") if path.is_file()))
    for path in inputs:
        source.update(str(path.relative_to(workspace)).encode())
        source.update(path.read_bytes())
    source_hash = source.hexdigest()

    previous = None
    state_file = cache / "state.json"
    if state_file.is_file() and all((cache / name).exists() for name in ("docs", "backup", "blogBase.json")):
        previous = json.loads(state_file.read_text())
    current = issue_snapshot(repository, token)
    mode, changed = build_plan(
        previous, current, source_hash,
        force=os.environ.get("FORCE_FULL", "false").lower() == "true",
    )
    print(f"Build mode: {mode}; articles: {len(current)}; changed: {len(changed)}", flush=True)

    shutil.copy2(workspace / "config.json", engine / "config.json")
    for directory in ("templates", "static"):
        if (workspace / directory).is_dir():
            shutil.copytree(workspace / directory, engine / directory, dirs_exist_ok=True)
    if previous:
        for directory in ("docs", "backup"):
            shutil.copytree(cache / directory, engine / directory, dirs_exist_ok=True)
        shutil.copy2(cache / "blogBase.json", engine / "blogBase.json")
    else:
        # A fresh build starts with current Issues, not stale checked-in HTML.
        (engine / "blogBase.json").unlink(missing_ok=True)

    env = os.environ.copy()
    env["GITHUB_WORKSPACE"] = str(engine)
    numbers = ["0"] if mode == "full" else changed
    for number in numbers:
        subprocess.run(
            [sys.executable, "Gmeek.py", token, repository, "--issue_number", number],
            cwd=engine, env=env, check=True,
        )

    # An edit can arrive during generation. Keep the earlier snapshot so the next
    # build detects it again, even if a pending workflow run is replaced.
    if mode == "full" or changed:
        generated = json.loads((engine / "blogBase.json").read_text())
        if len(generated["postListJson"]) + len(generated["singeListJson"]) != len(current):
            raise RuntimeError("Issue set changed during generation; rerun to reconcile it")
    if not (engine / "docs/index.html").is_file():
        raise RuntimeError("Gmeek did not generate index.html")

    cache.mkdir(exist_ok=True)
    for directory in ("docs", "backup"):
        if (cache / directory).exists():
            shutil.rmtree(cache / directory)
        shutil.copytree(engine / directory, cache / directory)
    shutil.copy2(engine / "blogBase.json", cache / "blogBase.json")
    state_file.write_text(json.dumps({"source": source_hash, "issues": current}, sort_keys=True))
    print(f"Ready to publish {len(current)} articles", flush=True)


if __name__ == "__main__":
    main()

"""Run the stock Gmeek generator with a durable, reconciled incremental cache."""

import hashlib
import json
import os
from pathlib import Path
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
            if "pull_request" in issue or not issue["labels"]:
                continue
            fields = {
                "title": issue["title"], "body": issue["body"],
                "labels": sorted(label["name"] for label in issue["labels"]),
                "comments": issue["comments"], "updated": issue["updated_at"],
            }
            snapshot[str(issue["number"])] = hashlib.sha256(
                json.dumps(fields, sort_keys=True).encode()
            ).hexdigest()
        if len(issues) < 100:
            break
        page += 1
    return snapshot


def main():
    repository = os.environ["GITHUB_REPOSITORY"]
    token = os.environ["GH_TOKEN"]
    workspace = Path(os.environ["GITHUB_WORKSPACE"]).resolve()
    engine = Path(os.environ["GMEEK_ENGINE"]).resolve()
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

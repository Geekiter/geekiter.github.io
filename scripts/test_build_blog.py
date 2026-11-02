import unittest
from build_blog import build_plan, ArticleImageParser, write_cover_manifest
from pathlib import Path
from tempfile import TemporaryDirectory
import json


class BuildPlanTests(unittest.TestCase):
    def test_first_build_and_source_changes_require_full_rebuild(self):
        self.assertEqual(build_plan(None, {"40": "new"}, "theme"), ("full", []))
        old = {"source": "old-theme", "issues": {"40": "old"}}
        self.assertEqual(build_plan(old, {"40": "old"}, "new-theme"), ("full", []))

    def test_coalesced_events_reconcile_every_changed_issue(self):
        old = {"source": "theme", "issues": {"39": "before", "40": "before"}}
        self.assertEqual(
            build_plan(old, {"39": "edited", "40": "edited", "42": "new"}, "theme"),
            ("incremental", ["39", "40", "42"]),
        )

    def test_closed_deleted_and_delabeled_posts_require_full_rebuild(self):
        old = {"source": "theme", "issues": {"39": "old", "40": "old"}}
        self.assertEqual(build_plan(old, {"40": "old"}, "theme"), ("full", []))

    def test_title_and_label_changes_purge_obsolete_pages(self):
        old = {"source": "theme", "issues": {"40": {"title": "old", "labels": ["article"], "digest": "old"}}}
        for new in [
            {"title": "new", "labels": ["article"], "digest": "new"},
            {"title": "old", "labels": ["about"], "digest": "new"},
        ]:
            self.assertEqual(build_plan(old, {"40": new}, "theme"), ("full", []))

    def test_unchanged_posts_reuse_generated_pages(self):
        old = {"source": "theme", "issues": {"40": "same"}}
        self.assertEqual(build_plan(old, {"40": "same"}, "theme"), ("incremental", []))

    def test_large_change_or_manual_override_uses_full_rebuild(self):
        old = {"source": "theme", "issues": {}}
        self.assertEqual(build_plan(old, dict.fromkeys(["1", "2", "3", "4"], "new"), "theme"), ("full", []))
        self.assertEqual(build_plan(old, {}, "theme", force=True), ("full", []))


class CoverImageTests(unittest.TestCase):
    def test_only_uses_article_images_not_site_avatars(self):
        parser = ArticleImageParser()
        parser.feed('<img src="avatar.jpg"><div id="postBody"><p>Text only</p></div><img src="footer.jpg">')
        self.assertIsNone(parser.image)

    def test_nested_article_images_and_entities(self):
        parser = ArticleImageParser()
        parser.feed('<div id="postBody"><div><p><img src="https://example.com/a.png?x=1&amp;y=2"></p></div></div>')
        self.assertEqual(parser.image, 'https://example.com/a.png?x=1&y=2')

    def test_skips_emoji_and_embedded_images(self):
        parser = ArticleImageParser()
        parser.feed('<div id="postBody"><img class="emoji" src="emoji.png"><img src="data:image/png,x"><img src="photo.png"></div>')
        self.assertEqual(parser.image, 'photo.png')

    def test_manifest_resolves_urls_and_versions_every_page(self):
        with TemporaryDirectory() as folder:
            root = Path(folder)
            (root / 'docs/post').mkdir(parents=True)
            (root / 'docs/post/a.html').write_text('<script src="https://blog.example/covers.js"></script><div id="postBody"><img src="../images/one.png"></div>')
            (root / 'docs/index.html').write_text('<script src="https://blog.example/covers.js?v=abcd"></script>')
            base = {'homeUrl':'https://blog.example', 'avatarUrl':'/avatar.jpg', 'ogImage':'/avatar.jpg', 'postListJson':{'P1':{'htmlDir':'docs/post/a.html','postUrl':'post/a.html','ogImage':'/avatar.jpg'}}}
            (root / 'blogBase.json').write_text(json.dumps(base))
            write_cover_manifest(root)
            manifest = (root / 'docs/covers.js').read_text()
            self.assertIn('https://blog.example/images/one.png', manifest)
            index = (root / 'docs/index.html').read_text()
            self.assertRegex(index, r'covers\.js\?v=[a-f0-9]{12}')
            write_cover_manifest(root)
            self.assertEqual(index, (root / 'docs/index.html').read_text())


if __name__ == "__main__":
    unittest.main()

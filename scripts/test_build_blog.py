import unittest
from build_blog import build_plan


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

    def test_unchanged_posts_reuse_generated_pages(self):
        old = {"source": "theme", "issues": {"40": "same"}}
        self.assertEqual(build_plan(old, {"40": "same"}, "theme"), ("incremental", []))

    def test_large_change_or_manual_override_uses_full_rebuild(self):
        old = {"source": "theme", "issues": {}}
        self.assertEqual(build_plan(old, dict.fromkeys(["1", "2", "3", "4"], "new"), "theme"), ("full", []))
        self.assertEqual(build_plan(old, {}, "theme", force=True), ("full", []))


if __name__ == "__main__":
    unittest.main()

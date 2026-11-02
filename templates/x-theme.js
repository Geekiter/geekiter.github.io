const site = JSON.parse(document.getElementById("x-site-data").textContent);
const postBody = document.getElementById("postBody");
if (postBody) {
  const assetPrefix = site.github.replace(/\/$/, "") + "/assets/";
  postBody.querySelectorAll("a[href]").forEach((anchor) => {
    if (anchor.href.startsWith(assetPrefix) && anchor.querySelector("img")) {
      anchor.replaceWith(...anchor.childNodes);
      return;
    }
    if (anchor.getAttribute("href").startsWith("#")) return;
    anchor.target = "_blank";
    anchor.relList.add("noopener");
  });
}
const blogPosts = JSON.parse(
  document.getElementById("x-blog-data").textContent,
);
const byDate = (a, b) => b.timestamp - a.timestamp;
blogPosts.sort((a, b) => Number(b.pinned) - Number(a.pinned) || byDate(a, b));
const storageKey = "gmeek-bookmarks:" + site.github;
const previewTargets = new WeakMap();
const previewObserver = "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        previewObserver.unobserve(entry.target);
        const target = previewTargets.get(entry.target);
        if (target) loadFirstImage(target.post, target.image);
      });
    }, { rootMargin: "320px 0px" })
  : null;
const paths = {
  repost:
    "M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z",
  bookmark:
    "M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z",
  share:
    "M12 2.586l5.707 5.707-1.414 1.414L13 6.414V16h-2V6.414L7.707 9.707 6.293 8.293 12 2.586zM3 14h2v6h14v-6h2v8H3v-8z",
};
function svgIcon(name) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("class", "x-icon");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS(svg.namespaceURI, "path");
  path.setAttribute("d", paths[name]);
  svg.append(path);
  return svg;
}
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function link(className, text, href) {
  const node = element("a", className, text);
  node.href = href;
  return node;
}
function postUrl(post) {
  return new URL(post.url, site.home + "/").href;
}
function localPostUrl(post) {
  return new URL(post.url, window.location.origin + "/").href;
}
async function loadFirstImage(post, image) {
  let source = "";
  try {
    const articleUrl = localPostUrl(post);
    const response = await fetch(articleUrl, { credentials: "same-origin" });
    if (response.ok) {
      const html = await response.text();
      const article = new DOMParser().parseFromString(html, "text/html");
      source = article.querySelector("#postBody img")?.getAttribute("src") || "";
      if (source) source = new URL(source, articleUrl).href;
    }
  } catch (_) {}
  if (!source && post.image && /^https?:\/\//.test(post.image)) {
    source = post.image;
  }
  if (!source) {
    image.remove();
    return;
  }
  image.src = source;
  image.hidden = false;
}
function avatar() {
  const img = element("img", "x-avatar");
  img.src = site.avatar;
  img.alt = "";
  img.width = img.height = 40;
  img.loading = "lazy";
  return img;
}
function excerpt(text) {
  return text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]*>/g, "")
    .replace(/^[\s#>*-]+/gm, "")
    .replace(/[`*_]/g, "")
    .replace(/\n{2,}/g, "\n")
    .trim()
    .slice(0, 280);
}
function readBookmarks() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return new Set(
      Array.isArray(stored)
        ? stored.filter((id) => typeof id === "string")
        : [],
    );
  } catch (_) {
    return new Set();
  }
}
function toast(text) {
  const node = document.querySelector(".x-toast");
  node.textContent = text;
  node.classList.add("visible");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => node.classList.remove("visible"), 2600);
}
function toggleBookmark(id) {
  const saved = readBookmarks();
  saved.has(id) ? saved.delete(id) : saved.add(id);
  try {
    localStorage.setItem(storageKey, JSON.stringify([...saved]));
  } catch (_) {
    toast("Bookmarks are unavailable in this browser.");
    return;
  }
  refreshBookmarks();
  if (
    document.querySelector('[data-page="explore"]') &&
    location.hash === "#view=bookmarks"
  )
    renderExplore();
  toast(
    saved.has(id) ? "Added to your Bookmarks" : "Removed from your Bookmarks",
  );
}
function refreshBookmarks() {
  const saved = readBookmarks();
  document.querySelectorAll("[data-bookmark]").forEach((button) => {
    const selected = saved.has(button.dataset.bookmark);
    button.setAttribute("aria-pressed", String(selected));
    button.setAttribute(
      "aria-label",
      selected ? "Remove bookmark" : "Bookmark",
    );
    button.title = selected ? "Remove bookmark" : "Bookmark";
  });
}
async function sharePost(post) {
  const url = postUrl(post);
  try {
    if (navigator.share) await navigator.share({ title: post.title, url });
    else {
      await navigator.clipboard.writeText(url);
      toast("Link copied to clipboard");
    }
  } catch (error) {
    if (error.name !== "AbortError")
      toast("Copy this link from your address bar to share.");
  }
}
const imageLightbox = document.getElementById("x-image-lightbox");
const lightboxImage = imageLightbox?.querySelector("img");
let previousImageFocus = null;
function openImagePreview(image) {
  if (!imageLightbox || !lightboxImage) return;
  previousImageFocus = document.activeElement;
  lightboxImage.src = image.currentSrc || image.src;
  lightboxImage.alt = image.alt || "";
  imageLightbox.hidden = false;
  document.body.style.overflow = "hidden";
  imageLightbox.querySelector(".x-image-close").focus();
}
function closeImagePreview() {
  if (!imageLightbox || imageLightbox.hidden) return;
  imageLightbox.hidden = true;
  lightboxImage.removeAttribute("src");
  document.body.style.overflow = "";
  previousImageFocus?.focus?.();
}
imageLightbox?.addEventListener("click", (event) => {
  if (
    event.target === imageLightbox ||
    event.target.closest(".x-image-close")
  ) {
    closeImagePreview();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeImagePreview();
});
document.addEventListener("click", (event) => {
  const image = event.target.closest("#postBody img, .x-post-image");
  if (!image || image.hasAttribute("data-no-preview")) return;
  const anchor = image.closest("a[href]");
  if (anchor) {
    const linkUrl = new URL(anchor.href);
    const imageUrl = new URL(image.currentSrc || image.src);
    const imageLink =
      linkUrl.href === imageUrl.href ||
      /\.(avif|gif|jpe?g|png|svg|webp)$/i.test(linkUrl.pathname);
    if (!imageLink) return;
    event.preventDefault();
  }
  event.preventDefault();
  openImagePreview(image);
});
function action(name, label, callback, count) {
  const button = element("button", "x-action " + name);
  button.type = "button";
  button.title = button.ariaLabel = label;
  button.append(svgIcon(name));
  if (count) button.append(element("span", "", String(count)));
  button.addEventListener("click", callback);
  return button;
}
function postActions(post) {
  const row = element("div", "x-post-actions");
  row.append(
    action("repost", "Share on X", () => {
      const url = new URL("https://twitter.com/intent/tweet");
      url.searchParams.set("text", post.title);
      url.searchParams.set("url", postUrl(post));
      window.open(url.href, "_blank", "noopener,noreferrer");
    }),
  );
  const saved = action("bookmark", "Bookmark", () => toggleBookmark(post.id));
  saved.dataset.bookmark = post.id;
  row.append(
    saved,
    action("share", "Share link", () => sharePost(post)),
  );
  return row;
}
function renderPost(post) {
  const card = element("article", "x-post");
  if (post.pinned) card.append(element("div", "x-pinned", "Pinned"));
  const layout = element("div", "x-post-layout");
  const account = link("", "", site.home + "/index.html");
  account.ariaLabel = site.name + " home";
  account.append(avatar());
  const body = element("div", "x-post-content");
  const meta = element("div", "x-post-meta");
  meta.append(link("", site.name, site.home + "/index.html"));
  meta.firstChild.replaceChildren(element("strong", "", site.name));
  meta.append(
    element("span", "x-handle", "@" + site.handle),
    element("span", "x-dot", "·"),
  );
  const date = link("x-date", post.date, postUrl(post));
  meta.append(date);
  body.append(meta, link("x-post-title", post.title, postUrl(post)));
  const text = excerpt(post.excerpt).replace(/^[。.!?\s]+$/, "");
  if (text) body.append(link("x-post-excerpt", text, postUrl(post)));
  const labels = element("div", "x-post-labels");
  post.labels.forEach((label) =>
    labels.append(
      link(
        "",
        "#" + label,
        site.home + "/tag.html#" + encodeURIComponent(label),
      ),
    ),
  );
  body.append(labels);
  const image = element("img", "x-post-image");
  image.alt = post.title;
  image.loading = "lazy";
  image.hidden = true;
  image.addEventListener("error", () => image.remove(), { once: true });
  body.append(image);
  if (previewObserver) {
    previewTargets.set(card, { post, image });
    previewObserver.observe(card);
  } else {
    loadFirstImage(post, image);
  }
  body.append(postActions(post));
  layout.append(account, body);
  card.append(layout);
  return card;
}
function renderTimeline(
  container,
  posts,
  emptyTitle = "Nothing to see here yet",
  emptyText = "Try another search or topic.",
) {
  container.replaceChildren();
  if (!posts.length) {
    const empty = element("div", "x-empty");
    empty.append(element("h2", "", emptyTitle), element("p", "", emptyText));
    container.append(empty);
  } else posts.forEach((post) => container.append(renderPost(post)));
  refreshBookmarks();
}
function setNavigation(active) {
  document.querySelectorAll("[data-nav]").forEach((node) => {
    if (node.dataset.nav === active) node.setAttribute("aria-current", "page");
    else node.removeAttribute("aria-current");
  });
}
function renderSidebar() {
  const counts = new Map();
  blogPosts.forEach((post) =>
    post.labels.forEach((label) =>
      counts.set(label, (counts.get(label) || 0) + 1),
    ),
  );
  const topics = document.getElementById("x-topics");
  [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .forEach(([label, count]) => {
      const item = link(
        "x-topic",
        "",
        site.home + "/tag.html#" + encodeURIComponent(label),
      );
      const top = element("div");
      top.append(element("small", "", "Topic"));
      item.append(
        top,
        element("strong", "", label),
        element("small", "", count + (count === 1 ? " post" : " posts")),
      );
      topics.append(item);
    });
}
function renderExplore() {
  const root = document.querySelector('[data-page="explore"]');
  if (!root) return;
  let hash;
  try {
    hash = decodeURIComponent(location.hash.slice(1));
  } catch (_) {
    hash = "";
  }
  const query = new URLSearchParams(location.search).get("q");
  if (hash === "view=profile") {
    window.location.replace(site.home + "/index.html");
    return;
  }
  const bookmarks = hash === "view=bookmarks";
  document.getElementById("x-explore-controls").hidden = bookmarks;
  let title = bookmarks ? "Bookmarks" : "Explore";
  let posts = blogPosts;
  if (bookmarks)
    posts = blogPosts.filter((post) => readBookmarks().has(post.id));
  else if (query) {
    title = "Search";
    const term = query.toLocaleLowerCase();
    posts = blogPosts.filter((post) =>
      (post.title + " " + excerpt(post.excerpt) + " " + post.labels.join(" "))
        .toLocaleLowerCase()
        .includes(term),
    );
  } else if (hash && hash !== "All") {
    const topic = blogPosts.some((post) => post.labels.includes(hash));
    title = topic ? "#" + hash : "Search";
    posts = blogPosts.filter((post) =>
      topic
        ? post.labels.includes(hash)
        : post.title.toLocaleLowerCase().includes(hash.toLocaleLowerCase()),
    );
  }
  document.getElementById("x-explore-title").textContent = title;
  document.title = title + " / " + site.name;
  const search = document.querySelector("#x-explore-controls input");
  search.value = query || "";
  const chips = document.getElementById("x-chips");
  chips.replaceChildren();
  const labels = ["All", ...new Set(blogPosts.flatMap((post) => post.labels))];
  labels.forEach((label) => {
    const chip = element("button", "x-chip", label);
    chip.type = "button";
    chip.setAttribute(
      "aria-pressed",
      String(
        !query && (hash === label || (!hash && label === "All")),
      ),
    );
    chip.addEventListener("click", () => {
      location.href = site.home + "/tag.html#" + encodeURIComponent(label);
    });
    chips.append(chip);
  });
  renderTimeline(
    document.getElementById("x-explore-timeline"),
    posts,
    bookmarks ? "Save posts for later" : "No results",
    bookmarks
      ? "Bookmark an article to easily find it here. Your bookmarks are saved in this browser."
      : "Try searching for a different title or topic.",
  );
  setNavigation(
    bookmarks ? "bookmarks" : "explore",
  );
}
function modeSwitch() {
  const dark = document.documentElement.dataset.colorMode === "dark";
  const mode = dark ? "light" : "dark";
  document.documentElement.dataset.colorMode = mode;
  try {
    localStorage.setItem("meek_theme", mode);
  } catch (_) {}
  document
    .querySelectorAll(".x-display-toggle, .x-mobile-display")
    .forEach((toggle) =>
      toggle.setAttribute("aria-pressed", String(mode === "dark")),
    );
}
renderSidebar();
if (document.querySelector('[data-page="home"]')) {
  setNavigation("home");
  const timeline = document.getElementById("x-timeline");
  const ids = JSON.parse(document.getElementById("x-page-ids").textContent);
  const pagePosts = blogPosts.filter((post) => ids.includes(post.id));
  const profileCount = document.querySelector("[data-profile-count]");
  if (profileCount) profileCount.textContent = blogPosts.length + " posts";
  renderTimeline(timeline, pagePosts);
  document.querySelectorAll("[data-sort]").forEach((button) =>
    button.addEventListener("click", () => {
      const latest = button.dataset.sort === "latest";
      document.querySelectorAll("[data-sort]").forEach((tab) => {
        tab.classList.toggle("active", tab === button);
        tab.setAttribute("aria-selected", String(tab === button));
      });
      renderTimeline(
        timeline,
        [...pagePosts].sort(
          latest
            ? byDate
            : (a, b) => Number(b.pinned) - Number(a.pinned) || byDate(a, b),
        ),
      );
    }),
  );
}
renderExplore();
window.addEventListener("hashchange", renderExplore);
window.addEventListener("storage", () => {
  refreshBookmarks();
  renderExplore();
});
if (document.querySelector('[data-page="post"]')) {
  const source =
    document.querySelector("[data-post-source]").dataset.postSource;
  const post = blogPosts.find((post) => post.source === source);
  if (post) {
    document.querySelector("[data-detail-actions]").append(postActions(post));
    document.querySelector("[data-detail-date]").textContent = post.date;
    refreshBookmarks();
  }
  const headings = [
    ...document.querySelectorAll("#postBody h1, #postBody h2, #postBody h3"),
  ];
  if (headings.length) {
    const panel = element("section", "x-panel");
    panel.append(element("h2", "", "In this article"));
    const toc = element("nav", "x-toc");
    toc.ariaLabel = "Table of contents";
    headings.forEach((heading, index) => {
      if (!heading.id) heading.id = "section-" + index;
      toc.append(
        link("", heading.textContent, "#" + encodeURIComponent(heading.id)),
      );
    });
    panel.append(toc);
    document
      .querySelector(".x-right-inner")
      .insertBefore(panel, document.querySelector(".x-trends"));
  }
}

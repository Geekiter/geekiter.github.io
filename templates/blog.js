const site = JSON.parse(document.getElementById("site-data").textContent);
const posts = JSON.parse(document.getElementById("blog-data").textContent);
posts.sort(
  (a, b) => Number(b.pinned) - Number(a.pinned) || b.timestamp - a.timestamp,
);
const storageKey = "gmeek-bookmarks:" + site.github;
const names = {
  agent: "Agent",
  javascript: "JavaScript",
  embedded: "嵌入式",
  deeplearning: "深度学习",
  interview: "面试",
  algorithm: "算法",
  article: "随记",
  system: "系统",
  router: "网络",
  python: "Python",
  java: "Java",
  php: "PHP",
};
const priority = [
  "agent",
  "javascript",
  "embedded",
  "deeplearning",
  "interview",
  "algorithm",
];
const labels = [...new Set(posts.flatMap((post) => post.labels))].sort(
  (a, b) => {
    const left = priority.includes(a) ? priority.indexOf(a) : 100;
    const right = priority.includes(b) ? priority.indexOf(b) : 100;
    return left - right || a.localeCompare(b);
  },
);
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
function icon(name) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("class", "icon");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.5");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS(svg.namespaceURI, "path");
  path.setAttribute(
    "d",
    name === "bookmark"
      ? "M6 3h12v18l-6-4-6 4V3z"
      : "M12 16V3m-5 5 5-5 5 5M5 14v7h14v-7",
  );
  svg.append(path);
  return svg;
}
function postUrl(post) {
  return new URL(post.url, site.home + "/").href;
}
function plainText(text) {
  return text
    .replace(/```[\s\S]*?(?:```|$)/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]*>/g, "")
    .replace(/^[\s#>*-]+/gm, "")
    .replace(/[`*_]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^[。.!?\s]+$/, "");
}
function savedPosts() {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return new Set(
      Array.isArray(value) ? value.filter((id) => typeof id === "string") : [],
    );
  } catch (_) {
    return new Set();
  }
}
function toast(text) {
  const node = document.querySelector(".toast");
  node.textContent = text;
  node.classList.add("visible");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => node.classList.remove("visible"), 2500);
}
function refreshBookmarks() {
  const saved = savedPosts();
  document.querySelectorAll("[data-bookmark]").forEach((button) => {
    const selected = saved.has(button.dataset.bookmark);
    button.setAttribute("aria-pressed", String(selected));
    button.ariaLabel = button.title = selected ? "取消收藏" : "收藏文章";
  });
}
function bookmarkButton(post) {
  const button = element("button", "bookmark-button");
  button.type = "button";
  button.dataset.bookmark = post.id;
  button.append(icon("bookmark"));
  button.addEventListener("click", () => {
    const saved = savedPosts();
    saved.has(post.id) ? saved.delete(post.id) : saved.add(post.id);
    try {
      localStorage.setItem(storageKey, JSON.stringify([...saved]));
    } catch (_) {
      toast("当前浏览器无法保存收藏。");
      return;
    }
    if (location.hash === "#view=bookmarks") renderExplore();
    refreshBookmarks();
    toast(saved.has(post.id) ? "已收藏" : "已取消收藏");
  });
  return button;
}
function card(post) {
  const node = element("article", "article-card");
  const primary = post.labels[0] || "article";
  const label = names[primary] || primary;
  const main = link("card-main", "", postUrl(post));
  main.ariaLabel = post.title;
  if (post.image && /^https?:\/\//.test(post.image)) {
    const img = element("img", "card-cover-image");
    img.src = post.image;
    img.alt = post.title;
    img.loading = "lazy";
    main.append(img);
  } else {
    const tone = [
      "agent",
      "embedded",
      "javascript",
      "interview",
      "deeplearning",
      "algorithm",
    ].includes(primary)
      ? primary
      : "other";
    const cover = element("div", "card-cover tone-" + tone);
    cover.setAttribute("aria-hidden", "true");
    const title = post.title.replace(
      /^\d{6,8}(?:Note|笔记)?\s*[:：-]?\s*/i,
      "",
    );
    cover.append(
      element("span", "cover-kicker", site.name + " / " + label),
      element("span", "cover-symbol"),
      element("span", "cover-title", title),
    );
    main.append(cover);
  }
  node.append(main);
  const category = element("div", "card-category");
  category.append(
    element("span", "", "#"),
    link("", label, site.home + "/tag.html#" + encodeURIComponent(primary)),
  );
  if (post.pinned) category.append(element("span", "", " · 置顶"));
  node.append(category);
  const heading = element("h2", "card-title");
  heading.append(link("", post.title, postUrl(post)));
  node.append(heading);
  const summary = plainText(post.excerpt)
    .replace(/^[。.!?\s]+$/, "")
    .slice(0, 200);
  if (summary) node.append(element("p", "card-summary", summary));
  const footer = element("div", "card-footer");
  const date = element("time", "", post.date);
  date.dateTime = post.date;
  footer.append(date, bookmarkButton(post));
  node.append(footer);
  return node;
}
function renderGrid(
  list,
  emptyTitle = "没有找到相关文章",
  emptyText = "试试其他关键词，或换一个分类。",
) {
  const grid = document.getElementById("article-grid");
  grid.replaceChildren();
  if (list.length) list.forEach((post) => grid.append(card(post)));
  else {
    const empty = element("div", "empty-state");
    empty.append(element("h2", "", emptyTitle), element("p", "", emptyText));
    grid.append(empty);
  }
  refreshBookmarks();
}
function currentHash() {
  try {
    return decodeURIComponent(location.hash.slice(1));
  } catch (_) {
    return "";
  }
}
function renderTabs(selected, onSelect) {
  const tabs = document.getElementById("category-tabs");
  tabs.replaceChildren();
  ["All", ...labels].forEach((label) => {
    const button = element(
      "button",
      "category-tab",
      label === "All" ? "全部" : names[label] || label,
    );
    button.type = "button";
    button.setAttribute(
      "aria-pressed",
      String(label === selected || (!selected && label === "All")),
    );
    button.addEventListener("click", () => onSelect(label));
    tabs.append(button);
  });
}
function activateNavigation(name) {
  document.querySelectorAll("[data-nav]").forEach((node) => {
    if (node.dataset.nav === name) node.setAttribute("aria-current", "page");
    else node.removeAttribute("aria-current");
  });
}
function renderHome() {
  if (!document.querySelector('[data-page="home"]')) return;
  const selected = currentHash() || "All";
  const ids = JSON.parse(document.getElementById("page-ids").textContent);
  const visible =
    selected === "All"
      ? posts.filter((post) => ids.includes(post.id))
      : posts.filter((post) => post.labels.includes(selected));
  renderTabs(selected, (label) => {
    location.hash = encodeURIComponent(label);
  });
  renderGrid(visible);
  const pagination = document.querySelector(".pagination");
  if (pagination) pagination.hidden = selected !== "All";
  activateNavigation("blog");
}
function renderExplore() {
  if (!document.querySelector('[data-page="explore"]')) return;
  const hash = currentHash();
  const bookmarks = hash === "view=bookmarks";
  const profile = hash === "view=profile";
  const query = new URLSearchParams(location.search).get("q");
  document.getElementById("profile").hidden = !profile;
  document.getElementById("explore-controls").hidden = bookmarks || profile;
  let title = bookmarks ? "收藏" : profile ? "关于" : "分类与搜索";
  let subtitle = bookmarks
    ? "留住值得再读一遍的内容。"
    : profile
      ? site.bio
      : "从一个话题，读起。";
  let visible = posts;
  if (bookmarks) visible = posts.filter((post) => savedPosts().has(post.id));
  else if (query) {
    title = "搜索";
    subtitle = "关于「" + query + "」的文章。";
    const term = query.toLocaleLowerCase();
    visible = posts.filter((post) =>
      (post.title + " " + plainText(post.excerpt) + " " + post.labels.join(" "))
        .toLocaleLowerCase()
        .includes(term),
    );
  } else if (!profile && hash && hash !== "All") {
    const isLabel = labels.includes(hash);
    title = isLabel ? names[hash] || hash : "搜索";
    visible = posts.filter((post) =>
      isLabel
        ? post.labels.includes(hash)
        : post.title.toLocaleLowerCase().includes(hash.toLocaleLowerCase()),
    );
  }
  document.getElementById("explore-title").textContent = title;
  document.getElementById("explore-subtitle").textContent = subtitle;
  document.title = title + " · " + site.name;
  document.querySelector(".search-form input").value = query || "";
  renderTabs(!query && labels.includes(hash) ? hash : "All", (label) => {
    location.href = site.home + "/tag.html#" + encodeURIComponent(label);
  });
  renderGrid(
    visible,
    bookmarks ? "还没有收藏" : "没有找到相关文章",
    bookmarks
      ? "点击文章下方的收藏图标，下次在这里继续阅读。收藏保存在当前浏览器。"
      : "试试其他关键词，或换一个分类。",
  );
  activateNavigation(bookmarks ? "bookmarks" : profile ? "profile" : "explore");
}
function modeSwitch() {
  const mode =
    document.documentElement.dataset.colorMode === "dark" ? "light" : "dark";
  document.documentElement.dataset.colorMode = mode;
  try {
    localStorage.setItem("meek_theme", mode);
  } catch (_) {}
  utterancesTheme(mode === "dark" ? "github-dark" : "github-light");
}
function utterancesTheme(theme) {
  const frame = document.querySelector(".utterances-frame");
  if (frame)
    frame.contentWindow.postMessage(
      { type: "set-theme", theme },
      "https://utteranc.es",
    );
}
function renderArticle() {
  const page = document.querySelector('[data-page="post"]');
  if (!page) return;
  activateNavigation("blog");
  const post = posts.find((post) => post.source === page.dataset.postSource);
  const summary = document.querySelector("[data-post-summary]");
  if (post) {
    const date = document.querySelector("[data-detail-date]");
    date.textContent = post.date;
    date.dateTime = post.date;
    document.querySelector("[data-reading-time]").textContent =
      Math.max(1, Math.ceil((post.words || 0) / 500)) + " 分钟阅读";
    const excerpt = plainText(post.excerpt);
    const firstParagraph =
      document.querySelector("#postBody p")?.textContent || "";
    summary.textContent = excerpt;
    summary.hidden = !excerpt || firstParagraph.trim().startsWith(excerpt);
    const actions = document.querySelector("[data-detail-actions]");
    const share = element("button", "icon-button");
    share.type = "button";
    share.ariaLabel = share.title = "分享文章";
    share.append(icon("share"));
    share.addEventListener("click", async () => {
      try {
        if (navigator.share)
          await navigator.share({ title: post.title, url: postUrl(post) });
        else {
          await navigator.clipboard.writeText(postUrl(post));
          toast("文章链接已复制");
        }
      } catch (error) {
        if (error.name !== "AbortError") toast("可复制地址栏中的链接分享。");
      }
    });
    actions.append(bookmarkButton(post), share);
    refreshBookmarks();
  } else summary.hidden = true;
  const headings = [
    ...document.querySelectorAll(
      "#postBody h1, #postBody h2, #postBody h3, #postBody p > strong:only-child",
    ),
  ].filter((node) => node.textContent.trim().length < 100);
  const toc = document.getElementById("post-toc");
  headings.forEach((heading, index) => {
    if (!heading.id) heading.id = "section-" + index;
    toc.append(
      link("", heading.textContent, "#" + encodeURIComponent(heading.id)),
    );
  });
  document.querySelector(".table-of-contents").hidden = !headings.length;
}
renderHome();
renderExplore();
renderArticle();
window.addEventListener("hashchange", () => {
  renderHome();
  renderExplore();
});
window.addEventListener("storage", () => {
  refreshBookmarks();
  renderExplore();
});

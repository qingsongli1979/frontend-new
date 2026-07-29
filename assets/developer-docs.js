/* 123Proxy developer documentation */

(() => {
  "use strict";

  const byAll = (selector, root = document) => [...root.querySelectorAll(selector)];
  const searchIndexNode = document.getElementById("developerSearchIndex");
  let searchIndex = [];

  try {
    searchIndex = JSON.parse(searchIndexNode?.textContent || "[]");
  } catch {
    searchIndex = [];
  }

  function closeSearch(root) {
    const input = root.querySelector("[data-doc-search]");
    const results = root.querySelector("[data-doc-search-results]");
    if (!input || !results) return;
    results.hidden = true;
    input.setAttribute("aria-expanded", "false");
  }

  function renderSearch(root, query) {
    const results = root.querySelector("[data-doc-search-results]");
    const input = root.querySelector("[data-doc-search]");
    if (!results || !input) return;

    const normalized = query.trim().toLowerCase();
    const matches = normalized
      ? searchIndex.filter((item) => (
        `${item.title} ${item.section} ${item.keywords}`.toLowerCase().includes(normalized)
      )).slice(0, 7)
      : searchIndex.slice(0, 6);

    results.replaceChildren();
    if (!matches.length) {
      const empty = document.createElement("p");
      empty.textContent = "没有匹配文档，试试“SESSION”或“407”。";
      results.append(empty);
    } else {
      matches.forEach((item, index) => {
        const link = document.createElement("a");
        link.href = item.href;
        if (index === 0) link.classList.add("is-selected");

        const title = document.createElement("strong");
        title.textContent = item.title;
        const section = document.createElement("span");
        section.textContent = item.section;
        const keywords = document.createElement("small");
        keywords.textContent = item.keywords.split(" ").slice(0, 5).join(" · ");

        link.append(title, section, keywords);
        results.append(link);
      });
    }

    results.hidden = false;
    input.setAttribute("aria-expanded", "true");
  }

  byAll("[data-doc-search-root]").forEach((root) => {
    const input = root.querySelector("[data-doc-search]");
    if (!input) return;

    input.addEventListener("focus", () => renderSearch(root, input.value));
    input.addEventListener("input", () => renderSearch(root, input.value));
    input.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeSearch(root);
        input.blur();
      }
      if (event.key === "Enter") {
        const first = root.querySelector("[data-doc-search-results] a");
        if (first) {
          event.preventDefault();
          window.location.href = first.href;
        }
      }
    });
  });

  document.addEventListener("click", (event) => {
    byAll("[data-doc-search-root]").forEach((root) => {
      if (!root.contains(event.target)) closeSearch(root);
    });
  });

  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      const input = document.querySelector("[data-doc-search]");
      if (input) {
        event.preventDefault();
        input.focus();
      }
    }
  });

  byAll("[data-code-group]").forEach((group) => {
    const tabs = byAll("[data-code-tab]", group);
    const panels = byAll("[data-code-panel]", group);

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const key = tab.dataset.codeTab;
        tabs.forEach((candidate) => {
          const active = candidate === tab;
          candidate.classList.toggle("is-active", active);
          candidate.setAttribute("aria-selected", String(active));
        });
        panels.forEach((panel) => {
          panel.hidden = panel.dataset.codePanel !== key;
        });
      });
    });

    const copyButton = group.querySelector("[data-copy-code]");
    copyButton?.addEventListener("click", async () => {
      const activePanel = panels.find((panel) => !panel.hidden);
      if (!activePanel) return;
      const value = activePanel.textContent || "";
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.append(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }
      const label = copyButton.querySelector("span");
      if (label) label.textContent = "已复制";
      copyButton.dataset.copied = "true";
      window.setTimeout(() => {
        if (label) label.textContent = "复制";
        delete copyButton.dataset.copied;
      }, 1600);
    });
  });

  const mobileToggle = document.querySelector("[data-docs-mobile-toggle]");
  const mobileNav = document.querySelector("[data-docs-mobile-nav]");

  function setMobileNav(open) {
    if (!mobileToggle || !mobileNav) return;
    mobileNav.classList.toggle("is-open", open);
    mobileToggle.setAttribute("aria-expanded", String(open));
    mobileToggle.setAttribute("aria-label", open ? "关闭开发者导航" : "打开开发者导航");
    const icon = mobileToggle.querySelector("svg");
    if (icon) icon.setAttribute("data-lucide", open ? "x" : "menu");
    window.lucide?.createIcons();
  }

  mobileToggle?.addEventListener("click", () => {
    setMobileNav(!mobileNav?.classList.contains("is-open"));
  });

  const sidebar = document.querySelector("[data-docs-sidebar]");
  const sidebarToggle = document.querySelector("[data-docs-sidebar-toggle]");
  const sidebarOverlay = sidebar ? document.createElement("button") : null;

  if (sidebarOverlay) {
    sidebarOverlay.type = "button";
    sidebarOverlay.className = "docs-sidebar-overlay";
    sidebarOverlay.setAttribute("aria-label", "关闭文档目录");
    document.body.append(sidebarOverlay);
  }

  function setSidebar(open) {
    if (!sidebar || !sidebarOverlay) return;
    sidebar.classList.toggle("is-open", open);
    sidebarOverlay.classList.toggle("is-open", open);
    document.body.classList.toggle("docs-sidebar-active", open);
    if (open) {
      const activeItem = sidebar.querySelector('[aria-current="page"]');
      if (activeItem) {
        window.setTimeout(() => {
          sidebar.scrollTop = Math.max(
            0,
            activeItem.offsetTop - Math.round(sidebar.clientHeight / 3)
          );
        }, 0);
      }
    }
  }

  sidebarToggle?.addEventListener("click", () => setSidebar(true));
  sidebarOverlay?.addEventListener("click", () => setSidebar(false));
  byAll("a", sidebar || document.createElement("div")).forEach((link) => {
    link.addEventListener("click", () => setSidebar(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    setMobileNav(false);
    setSidebar(false);
  });

  const tocLinks = byAll(".docs-toc nav a");
  const tocSections = tocLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (tocSections.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!visible) return;
      tocLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
      });
    }, { rootMargin: "-112px 0px -70% 0px", threshold: 0 });
    tocSections.forEach((section) => observer.observe(section));
  }

  window.lucide?.createIcons();
})();

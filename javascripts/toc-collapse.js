(() => {
  function initializeCollapsibleToc() {
    const toc = document.querySelector(
      '.md-nav--secondary [data-md-component="toc"]'
    );
    if (!toc) return;

    const items = Array.from(toc.querySelectorAll("li.md-nav__item"));
    items.forEach((item, index) => {
      const nestedNav = Array.from(item.children).find(
        (child) => child.matches("nav.md-nav")
      );
      const headingLink = Array.from(item.children).find(
        (child) => child.matches("a.md-nav__link")
      );
      if (!nestedNav || !headingLink || item.querySelector(":scope > .toc-collapse-toggle")) {
        return;
      }

      const heading = headingLink.textContent.trim().replace(/\s+/g, " ");
      const navId = `toc-children-${index + 1}`;
      nestedNav.id = navId;
      nestedNav.hidden = true;
      item.classList.add("toc-collapse-item");

      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "toc-collapse-toggle";
      toggle.setAttribute("aria-controls", navId);
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", `Expand ${heading} subsections`);
      toggle.title = `Expand ${heading} subsections`;

      toggle.addEventListener("click", () => {
        const expanded = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!expanded));
        toggle.setAttribute(
          "aria-label",
          `${expanded ? "Expand" : "Collapse"} ${heading} subsections`
        );
        toggle.title = `${expanded ? "Expand" : "Collapse"} ${heading} subsections`;
        nestedNav.hidden = expanded;
      });

      headingLink.after(toggle);
    });

    if (location.hash) {
      const activeLink = Array.from(toc.querySelectorAll("a.md-nav__link")).find(
        (link) => link.hash === location.hash
      );
      let ancestor = activeLink?.closest("li.md-nav__item");
      while (ancestor) {
        const toggle = ancestor.querySelector(":scope > .toc-collapse-toggle");
        if (toggle) toggle.click();
        ancestor = ancestor.parentElement?.closest("li.md-nav__item") ?? null;
      }
    }
  }

  if (typeof document$ !== "undefined" && document$.subscribe) {
    document$.subscribe(initializeCollapsibleToc);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeCollapsibleToc, { once: true });
  } else {
    initializeCollapsibleToc();
  }
})();

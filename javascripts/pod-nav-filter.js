(() => {
  const podPath = /\/pods\/pod-(\d+)(?:\/|$)/;

  function filterPodNavigation() {
    const match = window.location.pathname.match(podPath);
    if (!match) return;

    const selectedPod = match[1];
    const selectedUrl = new URL(`/pods/pod-${selectedPod}/`, window.location.origin).href;

    // Keep the active pod in the sidebar, including its task and activity headings.
    document.querySelectorAll(".md-nav a.md-nav__link[href]").forEach((link) => {
      const target = new URL(link.href, document.baseURI);
      const targetPod = target.pathname.match(podPath);
      if (!targetPod) return;

      const item = link.closest("li.md-nav__item");
      if (!item) return;
      item.hidden = targetPod[1] !== selectedPod;
    });

    // Hide empty POD groups after their other page links have been filtered.
    Array.from(document.querySelectorAll(".md-nav li.md-nav__item"))
      .reverse()
      .forEach((item) => {
        const childNav = Array.from(item.children).find((child) => child.matches("nav.md-nav"));
        if (!childNav) return;
        const childLinks = Array.from(childNav.querySelectorAll("a.md-nav__link[href]"));
        const podLinks = childLinks.filter((link) => podPath.test(new URL(link.href, document.baseURI).pathname));
        if (podLinks.length && !podLinks.some((link) => {
          const match = new URL(link.href, document.baseURI).pathname.match(podPath);
          return match && match[1] === selectedPod;
        })) item.hidden = true;
      });

    // The top-level Pods tab normally points to POD-01. Keep it on the selected guide.
    document.querySelectorAll(".md-tabs a[href]").forEach((link) => {
      const target = new URL(link.href, document.baseURI);
      if (podPath.test(target.pathname)) link.href = selectedUrl;
    });

    // Keep footer navigation within the selected pod so task links never cross pods.
    document.querySelectorAll(".md-footer__inner").forEach((footerNavigation) => {
      const links = Array.from(footerNavigation.querySelectorAll("a[href]"));
      let visibleLinks = 0;
      links.forEach((link) => {
        const target = new URL(link.href, document.baseURI);
        const targetPod = target.pathname.match(podPath);
        link.hidden = !targetPod || targetPod[1] !== selectedPod;
        if (!link.hidden) visibleLinks++;
      });
      footerNavigation.hidden = visibleLinks === 0;
    });
  }

  if (typeof document$ !== "undefined" && document$.subscribe) {
    document$.subscribe(filterPodNavigation);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", filterPodNavigation, { once: true });
  } else {
    filterPodNavigation();
  }
})();

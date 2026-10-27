(() => {
  function openSelectedPod(form) {
    const select = form.querySelector("select[name='pod']");
    if (!select || !select.value) return;
    window.location.assign(new URL(select.value, document.baseURI).href);
  }

  document.addEventListener("change", (event) => {
    const select = event.target.closest(".pod-selector select[name='pod']");
    if (select && select.value) openSelectedPod(select.form);
  });

  document.addEventListener("submit", (event) => {
    const form = event.target.closest("form.pod-selector");
    if (!form) return;
    event.preventDefault();
    openSelectedPod(form);
  });
})();

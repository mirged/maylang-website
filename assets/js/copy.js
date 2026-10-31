/* Copy buttons for code blocks. */
(function () {
  "use strict";
  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try { document.execCommand("copy") ? resolve() : reject(); }
      catch (error) { reject(error); }
      document.body.removeChild(area);
    });
  }
  document.addEventListener("click", function (event) {
    var button = event.target.closest("[data-copy]");
    if (!button) { return; }
    var scope = button.closest("figure, .terminal, .hero-code") || button.parentElement;
    var pre = scope ? scope.querySelector("pre") : null;
    if (!pre) { return; }
    var original = button.textContent;
    copy(pre.innerText).then(function () {
      button.textContent = "Copied";
      window.setTimeout(function () { button.textContent = original; }, 1600);
    }).catch(function () {
      button.textContent = "Press Ctrl+C";
      window.setTimeout(function () { button.textContent = original; }, 2200);
    });
  });
})();

/* Theme and mobile navigation. Progressive enhancement only. */
(function () {
  "use strict";
  var root = document.documentElement;
  var key = "maylang-theme";
  try {
    var saved = localStorage.getItem(key);
    if (saved === "light" || saved === "dark") { root.dataset.theme = saved; }
  } catch (error) { /* storage can be unavailable */ }

  var toggle = document.querySelector("[data-theme-toggle]");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.dataset.theme === "dark" ? "light" : "dark";
      if (!root.dataset.theme) {
        next = window.matchMedia("(prefers-color-scheme: dark)").matches ? "light" : "dark";
      }
      root.dataset.theme = next;
      try { localStorage.setItem(key, next); } catch (error) { /* ignore */ }
      toggle.textContent = next === "dark" ? "Light" : "Dark";
    });
  }

  var menu = document.querySelector("[data-menu-toggle]");
  var nav = document.getElementById("primary-nav");
  if (menu && nav) {
    menu.addEventListener("click", function () {
      var open = menu.getAttribute("aria-expanded") === "true";
      menu.setAttribute("aria-expanded", open ? "false" : "true");
      nav.classList.toggle("is-open", !open);
    });
  }
})();

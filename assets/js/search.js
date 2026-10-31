/* Lightweight site search. Loads the index on demand. */
(function () {
  "use strict";
  var index = null;
  var loading = false;
  var status = document.getElementById("search-status");
  var results = document.getElementById("search-results");
  var input = document.getElementById("search-query");

  function load(done) {
    if (index) { done(); return; }
    if (loading) {
      window.setTimeout(function () { load(done); }, 80);
      return;
    }
    loading = true;
    fetch("/search-index.json").then(function (response) {
      if (!response.ok) { throw new Error("search index " + response.status); }
      return response.json();
    }).then(function (data) {
      index = (data && data.pages) || [];
      loading = false;
      done();
    }).catch(function () {
      loading = false;
      if (status) { status.textContent = "The search index could not be loaded."; }
    });
  }

  function score(page, query) {
    var title = page.title.toLowerCase();
    var q = query.toLowerCase();
    var value = 0;
    if (title === q) { value += 100; }
    else if (title.indexOf(q) === 0) { value += 60; }
    else if (title.indexOf(q) >= 0) { value += 35; }
    (page.headings || []).forEach(function (heading) {
      var text = heading.text.toLowerCase();
      if (text.indexOf(q) >= 0) { value += 12; }
    });
    var body = (page.text || "").toLowerCase();
    var at = body.indexOf(q);
    if (at >= 0) { value += 8; }
    if (page.section === "docs") { value += 2; }
    return value;
  }

  function snippet(text, query) {
    var lower = text.toLowerCase();
    var at = lower.indexOf(query.toLowerCase());
    if (at < 0) { return text.slice(0, 180); }
    var start = Math.max(0, at - 70);
    var end = Math.min(text.length, at + query.length + 110);
    return (start > 0 ? "…" : "") + text.slice(start, end).trim() + (end < text.length ? "…" : "");
  }

  function render(query) {
    if (!results || !status) { return; }
    results.textContent = "";
    var terms = query.trim().toLowerCase();
    if (!terms) {
      status.textContent = "Type a term, or press / anywhere to search.";
      return;
    }
    var matches = index.map(function (page) {
      return { page: page, score: score(page, terms) };
    }).filter(function (item) { return item.score > 0; })
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, 30);
    status.textContent = matches.length + (matches.length === 1 ? " result" : " results") + " for “" + query + "”";
    if (!matches.length) {
      var empty = document.createElement("p");
      empty.className = "search-empty";
      empty.textContent = "No matches. Try a shorter term or browse the documentation.";
      results.appendChild(empty);
      return;
    }
    matches.forEach(function (item) {
      var page = item.page;
      var article = document.createElement("article");
      article.className = "search-result";
      var heading = document.createElement("h2");
      var link = document.createElement("a");
      link.href = page.url;
      link.textContent = page.title;
      heading.appendChild(link);
      var url = document.createElement("p");
      url.className = "url";
      url.textContent = page.url;
      var summary = document.createElement("p");
      summary.textContent = page.description || snippet(page.text || "", query);
      article.appendChild(heading);
      article.appendChild(url);
      article.appendChild(summary);
      results.appendChild(article);
    });
  }

  function currentQuery() {
    var match = /[?&]q=([^&]*)/.exec(window.location.search);
    return match ? decodeURIComponent(match[1].replace(/\+/g, " ")) : "";
  }

  if (results && status) {
    var query = currentQuery();
    if (input) { input.value = query; }
    load(function () { render(query); });
    if (input) {
      input.addEventListener("input", function () { render(input.value); });
    }
    return;
  }

  document.addEventListener("keydown", function (event) {
    if (event.key !== "/" || event.ctrlKey || event.metaKey || event.altKey) { return; }
    var target = event.target;
    var tag = target && target.tagName ? target.tagName.toLowerCase() : "";
    if (tag === "input" || tag === "textarea" || tag === "select" || (target && target.isContentEditable)) { return; }
    var box = document.getElementById("site-search");
    if (box) {
      event.preventDefault();
      box.focus();
    }
  });
})();

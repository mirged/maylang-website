# Maylang website: design document

Status: implemented through Phase 2, 2026-11-01. The site targets Maylang
0.15.0 Fern. Owner: TBD.

This document plans a full website for Maylang. It covers:

- landing page, install and download;
- learning material, reference, tools and examples;
- the internals and design reports;
- release notes, roadmap and contributing.

It says what the site contains, how it is built, how it stays correct, and
the order in which to build it.

## 1. Goals and non-goals

### Goals

1. **Explain Maylang in one screen.** A visitor should learn what it is,
   what makes it different and how to try it without scrolling. The three
   differences are:
   - a self-hosted compiler;
   - strict typing by default;
   - native Linux executables written directly, with no LLVM, assembler or
     linker.
2. **Get a new user from nothing to a running project in five minutes.**
   That means the one-line installer, `may new`, `may run`, then a guided
   tour.
3. **Be the canonical home of the documentation**, with versions. Today the
   docs exist only as Markdown in the repository. The site renders them,
   adds search and keeps a page for each released version.
4. **Never be wrong about the language.** Every code sample on the site is
   compiled and run against the released compiler when the site is built,
   and its shown output is checked. A sample that drifts breaks the build.
5. **Dogfood the toolchain.** The site generator is written in Maylang and
   built with `mayc`. Building it exercises the parts of Maylang a real
   application needs: strings, files, maps and long allocation runs. It
   doubles as a large example project.
6. **Be fast and accessible.** Pages are static HTML and work with
   JavaScript disabled. They meet WCAG 2.2 AA and stay within a small byte
   budget (section 8).

### Non-goals (for the first release)

- **A browser playground that runs code client-side.** `mayc` emits x86-64
  ELF only, with no WebAssembly target, so code can't run in the browser.
  An optional, separately secured server-side runner is described in
  phase 5. It is not on the critical path.
- **A package registry.** `maypkg` is legacy and `may` has no registry.
- **Accounts, comments or analytics with tracking.**
- **Translations.** The site will be structured so translations can be
  added later (section 6.6).
- **Marketing claims the repository can't back.** Performance statements
  link to a measured report in `compiler/mayc/tests/backend/`, or they are
  left out. This rule comes from `AGENTS.md` ("Performance claims need a
  measured, reproducible report").

## 2. Audience

| Audience | Arrives wanting | Primary pages |
| --- | --- | --- |
| Curious visitor (HN, Reddit, a friend's link) | "What is this and why should I care?" | Home, Tour, Examples |
| New user | To install and write a first program | Install, Get started, Learn |
| Working user | To look up a function, flag or error | Reference, Stdlib, Toolchain, search |
| Tool user | To set up the editor, `may` workspaces or the formatter | Tools, VS Code, LSP |
| Language/compiler enthusiast | To understand how it works | Internals: fat values, bootstrap, backend reports |
| Contributor | To build from source and pick up an issue | Contribute, Development, Roadmap |

Every page should be honest about scope. Linux x86-64 (including WSL 2)
is the only supported platform, and the language is experimental. The
site shows this on the home page and the install page, not only in fine
print.

## 3. Information architecture

### 3.1 Sitemap

```
/                               Home
/install/                       Install (installer, options, WSL, offline, update, uninstall)
/download/                      Release bundles, checksums, all releases
/learn/                         Learn hub
  /learn/get-started/           First project: may new / run / test / fmt
  /learn/tour/                  Language tour, one concept per page, ~15 pages
  /learn/strict/                Strict typing guide          (docs/guide/STRICT.md)
  /learn/errors/                may { } otherwise { }, faults, err.kind
  /learn/modules/               Imports, pub, workspaces
  /learn/network/               Networking guide            (docs/guide/NETWORK.md)
  /learn/native-ui/             stdlib/ui walkthrough
  /learn/cookbook/              Short task recipes (read a file, parse CSV, TCP echo, ...)
/docs/<version>/                Versioned reference (latest = /docs/latest/)
  language/                     docs/reference/LANGUAGE.md
  syntax/                       docs/reference/SYNTAX.md + docs/guide/GRAMMAR.md
  runtime/                      docs/reference/RUNTIME.md
  stdlib/                       Index + one page per module, from inventory.json
  stdlib/<module>/
  toolchain/                    docs/reference/TOOLCHAIN.md, mayc flags
  diagnostics/                  Error catalogue (phase 4)
/tools/                         Tools hub
  /tools/may/                   Workspace runner, may.json schema
  /tools/mayfmt/
  /tools/maylsp/                docs/guide/LSP.md
  /tools/vscode/                Extension install and features
/examples/                      Gallery: single-file examples and complete projects
  /examples/<slug>/             Source, explanation, verified output
/internals/                     How Maylang works
  /internals/fat-values/        docs/design/FAT_VALUES.md
  /internals/bootstrap/         Rust -> C -> stage 1 -> stage 2 = stage 3
  /internals/backend/           x86-64 backend, register homes, proven types
  /internals/performance/       PERFORMANCE_ROADMAP.md + linked reports
  /internals/reports/<slug>/    Each tests/backend/*.md report
/releases/                      Changelog by release, from CHANGELOG.md + RELEASE.json
/releases/<version>/
/roadmap/                       ROADMAP.md
/contribute/                    CONTRIBUTING.md, DEVELOPMENT.md, issue labels
/about/                         History (docs/history), license, people, contact
/search/                        Search results (no-JS fallback form)
/404.html
/feed.xml                       Release Atom feed
/sitemap.xml, /robots.txt
```

### 3.2 Navigation

- **Top bar:** logo, Learn, Docs, Tools, Examples, Internals, Releases,
  search, a GitHub link, and a version badge showing the latest release
  version and codename (currently `0.15.0 Fern`).
- **Docs and Learn pages** have three columns:
  - a left sidebar with the section tree;
  - the content;
  - a right "on this page" outline of h2/h3 headings.

  Below 960 px, the sidebar becomes a disclosure menu and the outline is
  hidden.
- **Version picker** on `/docs/` pages. Switching versions keeps the
  current page when it exists in the target version, and otherwise falls
  back to that version's index.
- **Footer:** license, repository, releases feed, "Edit this page"
  (deep-link to the source file on GitHub), and the build stamp with the
  site commit and the `mayc` version used.

### 3.3 Content sources

The site repository holds only presentation and site-only prose. Language
facts come from the `maylang` repository at a pinned tag, so there is one
source of truth.

| Site content | Source in `maylang` | How it is consumed |
| --- | --- | --- |
| Language, syntax, runtime and toolchain reference | `docs/reference/*.md` (list-only bullets) | Rendered with a bullet-to-definition-list transform (section 5.4) |
| Stdlib API pages | `docs/reference/inventory.json`, `descriptions.json`, `stdlib/*.may` `///` comments | Structured: grouped by module, with signature, status, runtime and a "source" link to the line |
| Guides | `docs/guide/*.md` | Rendered Markdown |
| Design and internals | `docs/design/*.md`, `docs/internals/`, `compiler/mayc/tests/backend/*.md` | Rendered Markdown. JSON samples are linked, not rendered |
| Examples | `examples/*.may`, `examples/apps/*`, `examples/README.md` | Source highlighted; output captured at build time |
| Releases | `CHANGELOG.md`, `RELEASE.json`, GitHub releases API | One page per release, plus the feed |
| Roadmap and contributing | `ROADMAP.md`, `CONTRIBUTING.md`, `docs/guide/DEVELOPMENT.md` | Rendered |
| Tutorials, tour, cookbook, home and install copy | **site repository** `content/` | Rendered. Samples verified |

Repository-relative links inside imported Markdown are rewritten to:
- the site page when one exists for the target;
- otherwise a GitHub link at the pinned tag.

A link that matches neither fails the build.

## 4. Page designs

### 4.1 Home

From top to bottom:

1. **Hero.**
   - Name and a one-line description, for example "A strict, self-hosted
     language that compiles straight to native Linux executables."
   - A real, verified code sample: the README's `double` example extended
     with `may { } otherwise { }`. Its output appears beneath it.
   - Two buttons: **Install** and **Take the tour**.
   - A small line under the buttons: "Experimental · Linux x86-64 and WSL 2
     · v0.15.0 Fern".
2. **Install strip.** The one-line `curl … | sh` command with a copy button,
   then `may new hello && cd hello && may run`.
3. **Three pillars**, each with a short code or diagram and a "learn more"
   link:
   - *Strict by default*: typed signatures, `Option`/`Result`, exhaustive
     `match`, and an explicit `Any` boundary.
   - *Self-hosted*: the compiler, formatter, language server and workspace
     runner are all written in Maylang, and a Rust → C bootstrap rebuilds
     everything from source to a byte-identical fixpoint.
   - *Its own toolchain*: `mayc` writes ELF directly, with no LLVM,
     assembler or linker.
4. **Feature grid.** Six cards, each linking to a tour page:
   - recoverable errors (`may`/`otherwise`);
   - closures and fibers;
   - structs and enums;
   - a Unicode-correct string model;
   - networking;
   - the native UI library.
5. **Tooling row.** `may`, `mayfmt`, `maylsp` and VS Code, each with a
   screenshot or terminal capture.
6. **Example spotlight.** Three projects from `examples/apps` (for example
   `maytasks`, `mayboard`, `textstats`), each with a screenshot or captured
   output.
7. **Latest release.** Version, codename, date, the top three changelog
   items and a link to the release notes.
8. **Get involved.** Roadmap, good first issues, contributing.

The home page must not show benchmark charts that compare Maylang with
other languages. The untracked `benchmarks/xlang` suite isn't published or
reproducible from the repository. Revisit this once a report is committed.

### 4.2 Install

- **Recommended installer.** The one-line command, an explanation of the
  interactive menu (Enter, ↑ ↓, Space, Esc) and the post-install activation
  line.
- **Tabs:**
  - Linux;
  - WSL 2, including how to check that it is x86-64;
  - unattended and CI setup;
  - an offline bundle;
  - building from source (links to Contribute).
- **Verify:** `may --version` and `mayc --version`, with the expected
  output.
- **Update and uninstall.**
- **Troubleshooting**, written from the issue tracker.
- **Content source:** `docs/guide/INSTALL.md`. The page itself only
  changes the layout into tabs.

### 4.3 Learn: tour

- Short pages, each built around one runnable sample. Each page shows:
  - prose (100–300 words);
  - the sample;
  - its verified output;
  - "Try it yourself" instructions (`may new` and paste the sample);
  - previous and next links.
- **Proposed order:**
  1. Hello and `print`.
  2. Values and types.
  3. `let` / `mut`.
  4. Functions and `return`.
  5. Control flow.
  6. Strings and interpolation.
  7. Lists and maps.
  8. Structs.
  9. Enums and `match`.
  10. `Option` / `Result`.
  11. `may` / `otherwise` and faults.
  12. Closures.
  13. Generics.
  14. Modules and `pub`.
  15. `Any` and dynamic code.
  16. Fibers.
  17. Files and processes.
  18. Networking.
  19. Where to go next.
- **"Gotcha" callouts**, taken from AGENTS.md's "Writing Maylang"
  section:
  - no hexadecimal literals;
  - every path must `return` explicitly;
  - `Int` and `Float` can't be compared;
  - `print` always adds a newline;
  - `len` counts code points.

### 4.4 Reference and stdlib pages

- **Module page layout:**
  - module summary;
  - an import line (`import "string" as string;`);
  - a table of contents grouped by kind (functions, types, constants);
  - one entry per declaration, with:
    - its signature, in a highlighted monospace block;
    - its description;
    - a status badge (`supported`, or `frozen` for anything not on Linux
      x86-64);
    - runtime (`full` or `none`);
    - a link to its source at the pinned tag;
    - an anchor (`#fun-quick_sort`).
- **The list-only reference pages** (`LANGUAGE.md`, `SYNTAX.md`,
  `RUNTIME.md`) are rendered as definition lists. A bullet whose first span
  is bold (`- **Literals** — …`) starts a new section and becomes an h2
  with an anchor. The pages read as structured documents even though the
  source is flat.
- **Signature search:** the search index includes signatures, so
  `List<Int>` finds the functions that take a list of integers.

### 4.5 Examples gallery

- **Filters:** learning, games, graphics, simulations, network, tools and
  apps. These follow the existing `examples/` subfolders.
- **Each card shows** a title, a one-line description from
  `examples/README.md`, its tags and a thumbnail:
  - graphical examples: a screenshot captured in CI with Xvfb (phase 4);
  - other examples: a picture of the output text.
- **Each detail page has:**
  - the source, highlighted;
  - for multi-file projects, a file tree;
  - its build and run commands;
  - the verified output for the standard stdin used by `verify.py`
    (`red fish blue fish\nred fish\n`).

### 4.6 Internals

- This section is long-form design writing, with diagrams.
- **Fat values.** A diagram of the 16-byte layout (type word and payload)
  and the type-word table.
- **Bootstrap.** A pipeline diagram: Rust crate → C → stage 1 → stage 2 →
  stage 3, with stage 2 = stage 3.
- **Backend.** A diagram of the code path from source to IR to x86-64.
- **Reports:** every `compiler/mayc/tests/backend/*.md` report, in
  chronological order. Each report page links to its raw JSON samples.
- **Diagrams** are SVG, drawn by hand or generated from a simple text
  format by the generator. Don't use Mermaid; it would require JavaScript.

### 4.7 Releases

- **One page per version.** Each page shows:
  - the version and codename;
  - the date;
  - the changelog section;
  - downloads with checksums, from the GitHub release assets;
  - upgrade notes.
- **`/releases/`** lists all releases newest first and groups patch
  releases under their minor version (0.13.x "Dahlia").
- **Feed:** `feed.xml` is an Atom feed of releases.

## 5. Architecture

### 5.1 Overview

```
maylang-website/           (this directory; becomes its own repository)
  DESIGN.md                this document
  may.json                 may workspace: app + test + task targets
  main.may                 maysite CLI entry: build | serve | check
  src/
    config.may             site.json loading
    source.may             pinned maylang checkout: paths, tag, commit
    markdown.may           Markdown subset -> HTML AST
    highlight.may          Maylang (and sh/json) syntax highlighting
    reference.may          inventory.json -> stdlib pages; list-only transform
    examples.may           discovery, run-and-capture, output verification
    links.may              link rewriting and checking
    templates.may          layout functions (head, nav, sidebar, footer)
    search.may             search index builder
    feed.may, sitemap.may
    html.may               escaping, element builders
  content/                 site-only prose (home, tour, cookbook, about)
  templates/               HTML fragments with ${...} slots
  assets/
    css/site.css           single stylesheet, design tokens as custom properties
    js/search.js           search UI (progressive enhancement, < 8 KB)
    js/copy.js             copy buttons (< 1 KB)
    fonts/, img/, svg/
  tests/                   *.test.may for the generator; golden HTML fixtures
  site.json                version list, nav tree, pinned maylang tag(s)
  .github/workflows/site.yml
```

The output goes to `build/site/` and is never committed.

### 5.2 Why a generator written in Maylang

- **The alternatives** are Hugo, Zola, Astro and mdBook. Each would
  produce a site sooner, but each brings an outside toolchain into a
  project whose identity is "its own toolchain".
- **What the generator exercises:** file I/O, string building, maps,
  sorting, JSON parsing and process spawning, on real content of about
  1 MB.
- **It doubles as test coverage.** It is a large, allocation-heavy
  workload that the compiler tests don't include. Bugs it finds go to the
  `maylang` tracker.
- **It reuses compiler code.** `maylsp` already imports
  `compiler/mayc/src/...`. The highlighter can use the real lexer
  (`compiler/mayc/src/lexer.may`), so highlighting always matches the
  language.
- **Fallback:** if a blocker appears, such as GC crashes under sustained
  allocation (issue #2), switch to Zola temporarily. Keep the same
  `content/`, templates and URLs, and the same verification step written
  as a Maylang tool. Phase 1 decides this go/no-go (section 9).

### 5.3 Build pipeline

`maysite build` runs these steps:

1. **Resolve sources.** Read `site.json`. For each documented version, use
   the `maylang` checkout at that tag. CI checks it out as a git worktree.
   Locally it comes from `MAYLANG_SRC`.
2. **Collect pages:**
   - guides and design documents (Markdown);
   - reference pages (list-only transform);
   - stdlib modules (`inventory.json` and descriptions);
   - examples;
   - releases;
   - site content.
3. **Parse** Markdown into a small HTML AST. Assign heading anchors as
   GitHub does, so existing deep links keep working.
4. **Verify samples (section 7.1).** Compile and run each runnable block
   with that version's `mayc`. Compare the output with the expected-output
   block. Cache the results by content hash in `.may/` so rebuilds are
   incremental.
5. **Rewrite and check links:**
   - internal links must resolve to a generated page and anchor;
   - repository links are rewritten as in section 3.3;
   - external links are checked only in a scheduled job, never in the
     build itself.
6. **Render** through the templates. Emit HTML, `sitemap.xml`, `feed.xml`,
   `search-index.json` (one per version) and the copied assets, which get
   content-hashed file names.
7. **Check output** with `maysite check`. It verifies:
   - no unescaped user text;
   - every page has one `h1`, a `<title>`, a description and `lang`;
   - the byte budgets (section 8);
   - no orphan pages.

`maysite serve` runs a local server on `stdlib/net` for previews and
rebuilds when files change. This is local-only, not for production. Plain
HTTP is enough because `net` has no TLS.

### 5.4 Markdown support

The subset is what the `maylang` docs use today:
- ATX headings;
- paragraphs and emphasis;
- inline code;
- links;
- nested lists;
- fenced code with a language tag;
- GFM tables;
- block quotes;
- horizontal rules.

Raw HTML is not supported and fails the build. Front matter is only
allowed in the site's own `content/` files, as a small `key: value`
header.

The **list-only transform** for reference pages works like this:
- A top-level bullet that starts with `**Term**` begins a section.
- Every following bullet becomes a paragraph in that section, until the
  next bold term.
- Backticked spans that name a stdlib function become links to its API
  entry.

### 5.5 Syntax highlighting

- **Maylang:** tokenize with the compiler lexer and map each token kind to
  a CSS class. The lexer uses global state, as `maylsp`'s reuse shows (see
  [#49](https://github.com/mirged/maylang/issues/49)). Run one file at a
  time and reset the state between blocks, as `maylsp` does.
- **Fallback:** if the lexer can't be isolated, write a small tokenizer
  driven by the keyword list in `editors/vscode/syntaxes/maylang.tmLanguage.json`.
- **Other languages:** `sh`, `json` and `toml` blocks get a tiny
  tokenizer each. Any other language is shown as plain monospace.
- **The output is static `<span class="tk-kw">`** markup, with no
  client-side highlighter.

### 5.6 Search

- **The build writes `search-index.json`** for each version. It contains
  every page title, every heading, every stdlib name and signature, and
  the first 160 characters of each section. Expected size: under 150 KB
  gzipped for one version.
- **`search.js`** fetches the index the first time the search box gets
  focus. It ranks results by exact name, then name prefix, then
  word-prefix matches in titles and headings, then body text.
  - **Keys:** `/` focuses the search box; ↑ ↓ and Enter move through and
    open results.
- **Without JavaScript,** the search form submits to a GitHub code search
  scoped to the repository.

### 5.7 Hosting and deployment

- **Hosting:** GitHub Pages from the site repository, built by GitHub
  Actions.
  - Custom domain: TBD (section 11).
  - There is no server-side code; a static host is enough.
- **CI workflow (`site.yml`):**
  1. Install a pinned `mayc` by running the release installer for the
     latest tag unattended. Building from source would add about 10
     minutes and isn't needed here.
  2. Build `maysite` with `mayc`, then run its tests.
  3. Check out the `maylang` tags from `site.json`. Run `maysite build`,
     which compiles samples with the matching compiler for each version,
     installing older ones as needed.
  4. Run `maysite check`, the HTML validation and the accessibility checks
     (section 7).
  5. Deploy to Pages on `main` only. Pull requests get an uploaded preview
     artifact.
- **Triggers:**
  - pushes to the site repository;
  - a `repository_dispatch` from the `maylang` release workflow, so a new
    tag rebuilds the site with the new version;
  - a nightly schedule, which also builds `/docs/next/` from `maylang`
    `main`.
- `/docs/next/` is marked "unreleased" and has `noindex` set.

## 6. Visual design

### 6.1 Principles

- **Content first.** Reference pages are read for long stretches.
  Prioritize readable text, code and tables.
- **Make the compiler visible.** Terminal captures, ELF diagrams and
  verified outputs carry the identity better than decoration.
- **Stay calm and technical.** No stock illustrations or gradients.
  Use one accent color.

### 6.2 Design tokens

All tokens are CSS custom properties in `site.css`. There are light and
dark themes, selected by `prefers-color-scheme` with a manual toggle
stored in `localStorage`. Without JavaScript, the theme follows the OS
setting.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--bg` | `#fbfaf7` | `#14161a` | Page background |
| `--surface` | `#ffffff` | `#1c1f24` | Cards, code blocks |
| `--text` | `#1d1f23` | `#e6e4df` | Body text |
| `--muted` | `#5b6070` | `#a3a8b4` | Secondary text, captions |
| `--accent` | `#2f7a3e` | `#6fcf7f` | Links, primary buttons. Green matches the release badge |
| `--accent-ink` | `#ffffff` | `#0d1a10` | Text on accent |
| `--border` | `#e3e0d8` | `#2b2f36` | Rules, table borders |
| `--warn` | `#9a5b00` | `#f0b45a` | "Experimental", "frozen" badges |

The text/background pairs and `--muted` meet a 4.5:1 contrast ratio in
both themes. `--accent` text meets 4.5:1 against `--bg` and `--surface`.
A contrast test in `maysite check` verifies these.

- **Fonts:** the system UI font stack for text. For code, a self-hosted
  monospace font (JetBrains Mono or IBM Plex Mono, both OFL), as a single
  WOFF2 subset under 40 KB. There are no web-font requests for body text.
- **Type scale:** base 17 px, line height 1.6, a measure of 72 ch for
  prose, a 1.25 scale for headings, and code at 0.9 em.
- **Spacing:** a 4 px base unit (4, 8, 12, 16, 24, 32, 48 and 64).
- **Radii:** 6 px for cards and code blocks, 999 px for badges.
- **Code-highlighting palette:** six token classes (keyword, type, string,
  number, comment, function name), each tuned to at least 4.5:1 in both
  themes.

### 6.3 Components

- **Code block:**
  - a language label, a copy button and an optional file name tab;
  - an attached verified-output panel, labelled "Output", with the exit
    code shown when it isn't 0;
  - line highlighting through `{hl=3-5}` on the fence.
- **Callouts:** note, tip, gotcha and frozen. Each has an icon and a
  text label, so meaning never depends on color alone.
- **API entry:** the signature block, badges, the description, and links
  to the source and an anchor.
- **Version badge and picker.**
- **Tabs** for the install variants. They are CSS-only radio tabs, with
  plain stacked sections when CSS is missing.
- **Cards:** the feature grid, examples and releases.
- **Terminal capture:** a static, styled pre block. No animated GIFs.
- **Previous / next pager**, breadcrumbs, the "on this page" outline and
  the "Edit this page" link.

### 6.4 Brand

- **Wordmark:** "Maylang" in a geometric sans. A simple mark, such as a
  stylised `may` keyword glyph, still needs to be designed (section 11).
- **Favicon:** SVG and PNG fallbacks.
- **Social cards:** Open Graph images generated per page as SVG
  converted to PNG. Each shows the title, the section and the wordmark.
  The conversion needs a rasterizer, the one external tool allowed in CI.
  If that is unwanted, use one static card per section instead.

### 6.5 Responsive behavior

- **Breakpoints:** 600 px, 960 px and 1280 px.
- **On phones,** code blocks scroll horizontally and never wrap, so
  samples stay copyable.
- **The sticky top bar** collapses to the logo, a search icon and a menu
  button.

### 6.6 Internationalization readiness

- Templates take every user-interface string from `i18n/en.json`.
- URLs leave room for a `/xx/` prefix.
- No translations are planned for the first release.

## 7. Correctness and quality

### 7.1 Verified samples

Every ```` ```may ```` fence in rendered content is classified as one of:

- **runnable (the default):** it must compile and run. Its output must
  match the fence that immediately follows it, written ```` ```output ````
  (with an optional `exit=N`). If there is no output fence, the output
  must be empty and the exit status 0.
- **`may check`:** it must pass `mayc --check` but isn't run. Use this for
  fragments that need a server, a window or stdin.
- **`may fail`:** it must fail to compile, and an expected-message fence
  gives the diagnostic substring. The diagnostics catalogue uses this.
- **`may fragment`:** it isn't compiled. Use it only for partial syntax in
  grammar pages, and the build reports how many there are.

`tests/docs/run.py` in `maylang` already does this for `EXAMPLES.md` and
`STRICT.md`. `maysite` generalizes it to every page. Samples run with a
CPU and wall-time limit of 10 s and in an empty temporary directory.

### 7.2 Automated checks in CI

| Check | Tool | Gate |
| --- | --- | --- |
| Generator unit and golden tests | `may test` | Yes |
| Sample verification | `maysite build` | Yes |
| Internal links and anchors | `maysite check` | Yes |
| HTML structure (one h1, landmarks, alt text, lang, titles) | `maysite check` | Yes |
| Contrast of the design tokens | `maysite check` | Yes |
| Byte budgets (section 8) | `maysite check` | Yes |
| Accessibility audit | axe-core in CI, on a sample of 30 pages | Yes, for serious and critical issues |
| External links | scheduled weekly job | No; opens an issue |
| Lighthouse (performance, accessibility, SEO) | scheduled | No; tracked in a report |

The axe and Lighthouse checks use Node in CI only, as checks on the
output. They don't build anything, so they don't break the
own-toolchain principle.

### 7.3 Accessibility requirements

WCAG 2.2 AA:

- **Structure:** semantic landmarks, a skip link, and a logical heading
  order. Every interactive element is reachable and visible with the
  keyboard (focus ring: 2 px `--accent`).
- **Motion:** honour `prefers-reduced-motion`. There is no autoplaying
  motion anywhere.
- **Code blocks:** they are focusable when they scroll, and the copy
  button announces "Copied" through an `aria-live` region.

## 8. Performance budgets

| Budget | Limit |
| --- | --- |
| HTML per page (gzip) | ≤ 30 KB (stdlib `native` page ≤ 60 KB) |
| CSS total (gzip) | ≤ 15 KB |
| JavaScript on initial load | ≤ 3 KB (copy and theme); search loads on demand (≤ 8 KB plus index) |
| Fonts | 1 file, ≤ 40 KB, `font-display: swap` |
| Images on Home | ≤ 200 KB total, AVIF/WebP with PNG fallback, explicit sizes |
| Largest Contentful Paint (Home, 4G profile) | ≤ 1.5 s |
| Cumulative Layout Shift | ≤ 0.05 |
| Full site build in CI (all versions, cache cold) | ≤ 15 min; warm ≤ 3 min |

## 9. Delivery plan

Each phase ends in something that can be shipped and has acceptance
criteria.

### Phase 0: decisions and setup (about 2 days)

- Settle the open questions in section 11: domain, repository name, logo,
  and whether to accept a rasterizer for social cards.
- Create the `maylang-website` repository from this directory. Add
  `may.json`, CI that only builds `maysite` and runs `may test`, and
  `site.json` pinned to `v0.15.0`.
- **Done when:** CI is green on an empty generator.

### Phase 1: generator spike and go/no-go (about 1 week)

- **Build** the Markdown subset parser, the HTML escaping, a single
  layout template, and a rendering of `docs/guide/STRICT.md` and one
  stdlib module from `inventory.json`.
- **Stress test:** render every `docs/` Markdown file 20 times in one
  process to check for the issue #2 GC behavior. Measure the build time.
- **Go if** all of `docs/` renders correctly in 30 s or less, with no
  crashes in 20 repeated runs. Otherwise, switch to the Zola fallback in
  section 5.2.
- **Done when:** the go/no-go result is written down in the site
  repository's `docs/spike.md`, with timings.

### Phase 2: documentation site MVP (about 2–3 weeks)

- **Pages:**
  - all of `/docs/latest/` (reference, stdlib and toolchain);
  - `/learn/strict/` and `/learn/network/`;
  - `/install/`, `/contribute/` and `/roadmap/`.
- **Features:**
  - the three-column docs layout, the design tokens in both themes, and
    highlighting with the real lexer;
  - link rewriting and checking;
  - verification of runnable samples in imported docs;
  - the sitemap and 404 page.
- **Deploy** to Pages on a temporary URL.
- **Done when:**
  - every reference and guide page from the pinned tag renders;
  - zero broken internal links;
  - all runnable samples pass;
  - axe reports no serious issues;
  - the budgets are met.

### Phase 3: home, learn and examples (about 3 weeks)

- **Home page** (section 4.1), in final design.
- **Learn:** get started and the full tour (19 pages, written in
  `content/`), plus a first cookbook of 10 recipes.
- **Examples gallery,** with output captured for every top-level example
  and project that `verify.py` runs.
- **Releases:** pages for each release and the Atom feed.
- **Search** with keyboard support.
- **Done when:**
  - a new user given only the site URL installs Maylang and runs a
    project in five minutes or less. Test this with three people.
  - every tour sample is verified;
  - Lighthouse scores 95 or higher in all categories on Home and one docs
    page.

### Phase 4: versioning, internals and polish (about 2 weeks)

- **Versioned docs:** `/docs/0.15/`, `/docs/latest/` and the nightly
  `/docs/next/`. Add the version picker and per-version search indexes.
- **Internals** section, with SVG diagrams and every backend report.
- **Diagnostics catalogue:** each compiler error with a `may fail` sample
  and an explanation. The `compiler/mayc/tests/fail/` fixtures are the
  seed list.
- **Polish:**
  - screenshots of UI examples, captured under Xvfb;
  - Open Graph cards;
  - the `repository_dispatch` hook from the `maylang` release workflow.

  The hook is a small PR to `maylang` `release.yml`.
- **Launch** on the final domain and link the site from the `maylang`
  README.
- **Done when:**
  - tagging a `maylang` release rebuilds and deploys the site within 30
    minutes, with the new version selectable;
  - the old version stays reachable.

### Phase 5 (optional): server-side runner

A "Run" button on samples that sends source to a runner service. That
service compiles the source with `mayc` and runs the binary in a sandbox.

- **Sandbox:**
  - a fresh microVM (Firecracker) or gVisor container for each request;
  - no network and a read-only root;
  - limits of 256 MiB RAM, 5 s CPU, 64 KB of output and 1 process;
  - a seccomp allow-list.
- **Abuse controls:** rate limits per IP, a maximum source size of 64 KB,
  and no persistence.
- **Separation:** the runner is a separate service with its own threat
  model and review. The static site doesn't depend on it; without it,
  "Run" falls back to the verified output.
- **Written in Maylang** on `stdlib/net`, if HTTP parsing in Maylang turns
  out to be practical. TLS terminates at a reverse proxy, because `net`
  has no TLS.
- **Start only after** phase 4 has shipped, and only if there is demand.

### Rough total

Phases 0–4 take about 9–10 weeks for one person working part-time on the
generator and full-time on content. Phase 5 is extra.

## 10. Maintenance

- **Content stays in `maylang`.** A docs fix is a `maylang` PR. The next
  nightly or release build picks it up.
- **The site repository** holds only the generator, templates, assets and
  site-only content.
- **The weekly scheduled job** checks external links and runs Lighthouse.
  It files an issue on regressions.
- **Each `maylang` release** needs one site change: bump `site.json`. The
  dispatch hook can automate this with a bot PR.
- **Old versions:** keep the last three minor versions on `/docs/`.
  Older ones redirect to `/docs/latest/` with a notice.

## 11. Open questions

1. **Domain:** `maylang.dev`, `maylang.org`, or GitHub Pages under
   `mirged.github.io/maylang`? Pages works with no cost or setup until a
   domain is chosen.
2. **Repository:** a separate `mirged/maylang-website` (as this directory
   assumes), or a `site/` folder inside `maylang`?
   - *Separate:* keeps `make check` and the `maylang` CI unaffected, and
     lets the site build against several tags.
   - *Inside:* docs and site changes land in one PR.

   The recommendation is separate.
3. **Logo and wordmark:** design it in-house or commission it?
4. **Social cards:** accept one rasterizer in CI (for example `resvg`),
   or use static cards?
5. **Highlighter:** confirm the compiler lexer can run per block
   without leaking global state (see #49). If not, use the tmLanguage
   keyword fallback.
6. **Who owns tour content?** It is the largest piece of writing, about
   19 pages plus 10 recipes.
7. **Benchmarks:** commit the cross-language suite to `maylang` so the
   site can show reproducible numbers, or keep them off the site?
8. **Frozen targets and NodeOS:** mention them under About/History, or
   leave them out entirely while the focus is Linux x86-64?

## 12. Risks

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| GC corruption (#2) crashes long generator runs | Medium | High | Phase 1 stress gate; process one page per child process if needed; Zola fallback |
| Generator work delays content | Medium | Medium | Phase 2 limits scope to imported docs; tour writing can start in parallel in plain Markdown |
| Sample verification makes builds slow | Medium | Low | Content-hash cache in `.may/`; parallel child processes |
| Docs Markdown uses features beyond the subset | Low | Low | The build fails loudly; extend the parser or simplify the source doc in `maylang` |
| Site drifts from the language | Low (by design) | High | Pinned tags, verified samples, rebuild on release |
| Runner sandbox escape (phase 5) | Low | Severe | Optional phase, microVM isolation, separate review |
| Over-claiming performance or platform support | Medium | Medium | The rule in section 1; review checklist item on every content PR |

## 13. Content PR checklist

- [ ] Every `may` fence is runnable with an `output` fence, or is marked
      `check`, `fail` or `fragment` with a reason.
- [ ] Any claim about speed, size or platform support links to a report
      or to the source of truth.
- [ ] Links point to site pages, not raw GitHub files, where a page
      exists.
- [ ] Headings are in sentence case, with one `h1`.
- [ ] Images have alt text. Screenshots come in both themes, or come
      from a theme-neutral capture.
- [ ] `may test` and `maysite build && maysite check` pass locally.

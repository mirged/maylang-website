# Phase 1 spike: generator go/no-go

Date: 2026-10-31
Compiler: `mayc 0.14.0`
Source checkout: `/home/mirged/Projects/active/mayxnode/maylang`
Documented tag: `v0.14.0` (`site.json`)

## Result

**Go.** The generator renders the content set correctly and the failure mode
is understood and contained. The design's Zola fallback is not needed.

## What was built

- `may.json` workspace with the `app` and `tests` targets.
- Markdown subset: headings, paragraphs, emphasis, inline code, links and
  images, nested lists, fenced code, tables, block quotes and rules.
- The list-only transform for `LANGUAGE.md`, `SYNTAX.md`, `RUNTIME.md`,
  `STDLIB.md` and the reference index.
- Static Maylang syntax highlighting.
- One page per module from `docs/reference/inventory.json` and
  `descriptions.json`, with the API source link at the pinned tag.
- Three-column documentation layout, light and dark tokens, responsive
  header, CSS-only disclosure on small screens.
- `search-index.json`, `sitemap.xml`, `feed.xml`, `robots.txt`, `404.html`
  and a generated search page.
- `maysite check`: one `h1`, title, description, `lang`, main landmark,
  internal links and anchors, asset existence, and raw page-size limits.
- `maysite check` also compiles every `content/` `may` fence and runs the
  ones that declare an `output` fence.

## What the spike found

The full runtime's collector becomes very slow on long allocation runs, as
the design anticipated:

- A single process rendering the page set did not finish in several
  minutes.
- `json_parse` over the 383-entry reference inventory (about 100 KB) stalled
  at roughly 200 objects.
- On a list-only reference page, the transform slowed sharply after about
  300 pushed strings.
- `replace()` over the 8 KB home template took about 2 seconds per call, so
  filling ten `${slot}`s took about 20 seconds.

The measured fixes, all now in the generator:

1. Render one page per child process. This isolates the collector and keeps
   the build stable. Rendered HTML is cached by a content, template, config
   and generator fingerprint, so an unchanged build skips every child.
2. Read the large reference JSON incrementally (`src/jsonlite.may`) and parse
   one object at a time.
3. Build strings with a list of parts and one `join`, not repeated `+`.
4. Fill templates with a single scan instead of repeated `replace()` calls.
5. Skip CRLF normalization when the text has no `\r`.

## Timings on the development machine

| Step | Time |
| --- | --- |
| First full build (cold render cache) | about 52 s |
| Unchanged rebuild | about 1.6 s |
| `maysite check` after a build | about 12 s |
| One page in a child process | 0.4–2 s |
| Output | 61 pages, about 1.5 MB on disk |

Gzip sizes:

| Page | Gzip |
| --- | --- |
| Home | 4.1 KB |
| Runtime API | 11.0 KB |
| Standard library `native` | 8.6 KB |
| Releases | 22.9 KB |
| CSS | 4.7 KB |
| JavaScript (all three files) | 2.3 KB |
| Search index | 13.0 KB |

All are inside the Phase 1 budgets.

## Deliberate limits

- Imported documentation samples are not run yet. Some are fragments or need
  a window, a server or stdin. The site only claims verification for its own
  guides and tour until the fence classifications in DESIGN.md section 7.1
  are implemented for imported pages.
- There is one search index and one `/docs/latest/` tree. Versioned trees,
  the picker and per-version indexes are Phase 4.
- The x86-64 backend page is site prose that links to the source; the
  per-report pages are not generated yet.
- Release pages are the changelog for now; `/releases/<version>/` and the
  checksum table are Phase 3.
- Reports and social cards are not generated.

## Next

Phase 2: finish `/docs/latest/`, `/learn/strict/`, `/learn/network/`,
`/install/`, `/contribute/` and `/roadmap/` (now rendered), then add imported
sample classification and the CI accessibility pass.

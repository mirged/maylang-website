---
title: Performance
description: How Maylang measures performance and where the reports live.
section: internals
group: Design
order: 30
layout: doc
---

# Performance

Maylang's performance work is measured, not asserted. A change that claims to
be faster or smaller links to a reproducible report in the repository.

## Where the reports are

- `compiler/mayc/tests/backend/` contains the backend reports and their JSON
  samples. Each report records the compiler revision, the input program and
  the measurement method.
- `compiler/mayc/PERFORMANCE_LIMITS.md` describes the current limits of the
  compiler and runtime.
- `tools/may/PERFORMANCE.md` covers the workspace runner's overhead.
- `docs/design/PERFORMANCE_ROADMAP.md` in the current development tree lists
  the planned work. It is not part of the 0.14.0 release bundle.

## What this site will show

The internals section will publish each backend report as a page, in
chronological order, with a link to its raw samples. Until that page exists,
follow the source links above rather than treating a summary as a benchmark.

## Comparing languages

The site does not publish cross-language benchmark charts. The repository has
no committed, reproducible cross-language suite, so a chart would be a claim
the source cannot back. This is deliberate.

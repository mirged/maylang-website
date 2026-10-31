---
title: Internals
description: How the Maylang compiler, runtime and backend work.
section: internals
group: Internals
order: 1
layout: doc
---

# Internals

Maylang is a self-hosted compiler with its own backend. These pages explain the parts that are unusual enough to be worth a diagram.

- [Fat values](/internals/fat-values/) — every value is 16 bytes: a type word and a payload.
- [The x86-64 backend](/internals/backend/) — from source to IR to machine code to ELF.
- [Performance roadmap](/internals/performance/) — measured work and the reports behind it.

## Bootstrap in one paragraph

The Rust workspace builds a C compiler, which builds stage 1 of the self-hosted compiler. Stage 1 builds stage 2, and stage 2 builds stage 3. The build is complete only when stage 2 and stage 3 are byte-identical. That fixpoint is what makes the self-hosted claim checkable: the compiler can rebuild itself without a second implementation in the loop.

## Reading the source

The compiler lives in `compiler/mayc`. The runtime is in `compiler/mayc/runtime`. Backend reports and measured samples are under `compiler/mayc/tests/backend/`. Design notes live in `docs/design/` and `docs/internals/`.

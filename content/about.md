---
title: About Maylang
description: The project's scope, history, license and supported platform.
section: about
group: Project
order: 30
layout: page
---

# About Maylang

Maylang is an experimental programming language with a self-hosted compiler, strict checking by default, and direct native output for Linux x86-64.

## Scope

The supported platform is **Linux x86-64**, including x86-64 **WSL 2**. Other targets, including ARM64, RISC-V, macOS, Windows and NodeOS, are frozen: they were removed from `main` in 0.15.1, and their last version is kept at the [`frozen-archive`](https://github.com/mirged/maylang/tree/frozen-archive) tag. The core runtime and the browser and operating-system experiments are frozen for the same reason.

This focus is deliberate: speed, correctness, ergonomics, the standard library, documentation and tools get the attention instead.

## License

Maylang is released under the [MIT License](https://github.com/mirged/maylang/blob/main/LICENSE). It covers the compiler, tools, standard library and examples. Vendored third-party sources keep their own licenses and are listed in [`THIRD_PARTY_NOTICES.md`](https://github.com/mirged/maylang/blob/main/THIRD_PARTY_NOTICES.md). This website is also MIT-licensed.

## History

Maylang began as a Rust implementation and became self-hosted through a Rust → C → stage 1 → stage 2 → stage 3 bootstrap. The compiler, formatter, language server and workspace runner are written in Maylang. The legacy Rust implementation remains in the repository for the bootstrap and for comparison.

## Contact

Use the [repository](https://github.com/mirged/maylang) for issues and discussion. Report security issues privately, as described in the [security policy](https://github.com/mirged/maylang/blob/main/SECURITY.md).

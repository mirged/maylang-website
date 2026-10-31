---
title: About Maylang
description: The project's scope, history, license status and supported platform.
section: about
group: Project
order: 30
layout: page
---

# About Maylang

Maylang is an experimental programming language with a self-hosted compiler, strict checking by default, and direct native output for Linux x86-64.

## Scope

The supported platform is **Linux x86-64**, including x86-64 **WSL 2**. Other targets, including ARM64, RISC-V, macOS, Windows and NodeOS, are frozen and kept in the repository without being built, tested or maintained. The core runtime and the browser and operating-system experiments are frozen for the same reason.

This focus is deliberate: speed, correctness, ergonomics, the standard library, documentation and tools get the attention instead.

## License

No license file is currently published in the repository. Do not assume a license that is not stated there; the project tracks the scope in issue #54.

## History

Maylang began as a Rust implementation and became self-hosted through a Rust → C → stage 1 → stage 2 → stage 3 bootstrap. The compiler, formatter, language server, workspace runner and package manager are written in Maylang. The legacy Rust implementation remains in the repository for the bootstrap and for comparison.

## Contact

Use the [repository](https://github.com/mirged/maylang) for issues and discussion. Security-sensitive reports should follow the guidance in `CONTRIBUTING.md`.

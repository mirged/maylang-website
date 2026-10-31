---
title: Tools
description: The Maylang workspace runner, formatter, language server and editor extension.
section: tools
group: Tools
order: 1
layout: doc
---

# Tools

The toolchain ships with the compiler. Each tool is written in Maylang.

## `may` — workspace runner

`may` reads `may.json` and runs applications, tests, checks, formatting and native build recipes. Start with `may new`, then use `may run`, `may test`, `may check --all` and `may fmt`.

[May workspace reference](/tools/may/)

## `mayfmt` — formatter

One formatter for the command line and the editor. Use `may fmt` for a workspace, or `mayfmt` directly on files.

[mayfmt reference](/tools/mayfmt/)

## `maylsp` — language server

Diagnostics, navigation, references and document symbols for editors. The server reuses the compiler's checker, so editor errors are compiler errors.

[maylsp reference](/tools/maylsp/)

## VS Code

The extension launches `maylsp` and adds syntax highlighting for Maylang files.

[Set up VS Code](/tools/vscode/)

## Installing the tools

The default installer places all five tools and the standard library in `~/.maylang`. Choose **Customize setup** to install only the compiler and the tools you need. See [Install Maylang](/install/) for unattended options.

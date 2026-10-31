---
title: The x86-64 backend
description: How mayc lowers Maylang to x86-64 and writes ELF files directly.
section: internals
group: Design
order: 10
layout: doc
---

# The x86-64 backend

`mayc` does not call an assembler or a linker. It parses and checks the program, lowers it to an internal representation, selects x86-64 instructions, encodes them, lays out sections and writes an ELF executable.

## The path through the compiler

```text
source.may
   │  lexer + parser
   ▼
   AST
   │  type checker
   ▼
checked program
   │  lowering
   ▼
   IR
   │  instruction selection
   ▼
x86-64 instructions
   │  encoding, relocation and layout
   ▼
ELF executable
```

## Values in registers and memory

Maylang values are fat: a type word and a payload, 16 bytes in total. The backend keeps the type word and payload adjacent when a value lives in memory. Functions whose parameters, result and locals are all `Int`, `Ptr` or `Bool` compile as native-word functions and use the machine's 64-bit registers directly.

## What "no linker" means

The compiler resolves internal branches and data addresses, emits the program headers and section contents, and writes the file. Dynamic linking is not part of the normal path: a Maylang executable starts at its own entry point and uses syscalls for I/O.

## Reports, not claims

Backend changes that affect speed or code size link to a measured report under `compiler/mayc/tests/backend/`. If a number is not in a report that can be reproduced from the repository, the site does not show it.

## Read the source

- `compiler/mayc/src/backend/x86_64.may` — instruction encoding and native-word functions.
- `compiler/mayc/src/backend/x86_64_fat.may` — dynamic values.
- `compiler/mayc/src/backend/elf.may` — ELF layout.
- `compiler/mayc/tests/backend/` — measured reports and JSON samples.

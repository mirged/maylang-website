---
title: Fat values
description: Every Maylang value is a 16-byte type word and payload.
section: internals
group: Design
order: 20
layout: doc
---

# Fat values

Every Maylang value has the same 16-byte shape: a **type word** followed by a
**payload**. The type word says what the value is; the payload holds the
integer, pointer, float bits or reference.

```text
+----------------+----------------+
|   type word    |    payload     |
|    8 bytes     |    8 bytes     |
+----------------+----------------+
```

## Why one shape

Dynamic code, generic collections, JSON values and faults all need to carry a
value whose type is not known at compile time. A uniform shape means the
runtime can compare, print, copy and collect any value without a separate
boxing allocation for each type. `Int`, `Bool` and pointer payloads fit in the
second word directly.

## What the compiler does with it

- The type checker erases types after checking; the runtime sees the type word.
- A function whose parameters, result and locals are all `Int`, `Ptr` or
  `Bool` is compiled as a native-word function and uses machine registers
  directly.
- Dynamic operations, such as `Any` arithmetic or JSON traversal, read the type
  word and dispatch at runtime.
- Collections store fat values, so a `List<Any>` can hold heterogeneous data
  without a separate wrapper per element.

## The cost

A small integer occupies 16 bytes in a list, not 8. The design trades memory
for a simple, uniform runtime and cheap dynamic boundaries. The compiler
reports and the repository's design notes describe the measured consequences;
the site does not publish unmeasured performance claims.

## Read the source

- `docs/design/FAT_VALUES.md` in the repository.
- `compiler/mayc/runtime/fat.may` and `fat_linux.may` for the runtime.
- `compiler/mayc/src/backend/x86_64_fat.may` for dynamic lowering.

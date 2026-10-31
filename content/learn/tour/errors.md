---
title: Errors and otherwise
description: Recoverable faults with may and otherwise, and what err exposes.
section: learn
group: Tour
order: 26
layout: doc
---

# Errors and `otherwise`

`may { ... } otherwise { ... }` evaluates a block and catches a recoverable fault. A bare `may` yields `nil` when the block faults.

```may
fun parse(text: Str) -> Int {
    return may {
        int(text)
    } otherwise {
        -1
    };
}

print(parse("42"));
print(parse("nope"));
```

```output
42
-1
```

Inside `otherwise`, `err` describes the failure. `err.kind` is a category such as `fail`, `io`, `arithmetic`, `type` or `index`; `err.message` is the detail.

```may
let detail: Str = may {
    fail("disk is full")
} otherwise {
    str(err.message)
};
print(detail);
```

```output
disk is full
```

`fail("message")` raises an explicit fault. I/O failures, parse failures, arithmetic failures and indexing failures are catchable in the same way.

## Faults do not roll back

A fault boundary catches control flow; it does not undo side effects. A list mutation, a printed line or a file written before the fault remains visible.

## `Result` and `Option`

`Ok(value)`, `Err(error)`, `Some(value)` and `None()` are available when you want a failure to be part of a value instead of a boundary. Map lookup already returns an optional, which is why `counts[key] ?? fallback` works.

## Next

Return to the [tour index](/learn/tour/) or read the full [strict typing guide](/learn/strict/).

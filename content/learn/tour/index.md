---
title: Language tour
description: One runnable Maylang sample per concept, from print to fibers.
section: learn
group: Tour
order: 20
layout: doc
---

# Language tour

Each stop is a short page with one runnable sample and its verified output. The tour assumes you have a working `may` command; if not, start with [Get started](/learn/get-started/).

Published stops:

1. [Hello and `print`](/learn/tour/hello/)
2. [Values and types](/learn/tour/values/)
3. [Functions](/learn/tour/functions/)
4. [Lists and maps](/learn/tour/lists/)
5. [Structs and enums](/learn/tour/structs/)
6. [Errors and `otherwise`](/learn/tour/errors/)

Still planned:

- Control flow and `match`
- Strings and interpolation in depth
- `Option` and `Result`
- Closures and fibers
- Generics
- Modules and `pub`
- `Any` and dynamic code
- Files and processes
- Networking
- Where to go next

## Try a sample now

```may
fun greet(name: Str) -> Str {
    return "Hello, ${name}!";
}

print(greet("Maylang"));

let values: List<Int> = [1, 2, 3];
let doubled: List<Int> = map(values, fun(value: Int) -> Int {
    return value * 2;
});
print(doubled);
```

```output
Hello, Maylang!
[2, 4, 6]
```

## Five details that surprise people

- There are no hexadecimal literals. Write decimal values, or use `load8`/`store8` for byte work.
- Every path through a function must execute `return`; a final expression is not an implicit return.
- `Int` and `Float` cannot be compared directly. Convert one side before comparing.
- `print` always adds a newline. Use `syscall(1, ...)` only when you need raw output.
- `len` counts code points, not bytes.

Continue to [Strict typing](/learn/strict/) for the rules behind these examples.

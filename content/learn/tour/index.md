---
title: Language tour
description: One runnable Maylang sample per concept, from print to fibers.
section: learn
group: Guides
order: 20
layout: doc
---

# Language tour

Each stop is a short page with one runnable sample and its verified output. The tour assumes you have a working `may` command; if not, start with [Get started](/learn/get-started/).

The published stops are being filled in. The planned order is:

1. Hello and `print`
2. Values and types
3. `let` and `mut`
4. Functions and `return`
5. Control flow
6. Strings and interpolation
7. Lists and maps
8. Structs
9. Enums and `match`
10. `Option` and `Result`
11. `may` / `otherwise` and faults
12. Closures
13. Generics
14. Modules and `pub`
15. `Any` and dynamic code
16. Fibers
17. Files and processes
18. Networking
19. Where to go next

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

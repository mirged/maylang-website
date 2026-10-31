---
title: Hello and print
description: The smallest Maylang program, string interpolation and comments.
section: learn
group: Tour
order: 21
layout: doc
---

# Hello and print

A Maylang file contains declarations and top-level statements. The program starts at the first statement and runs to the end.

```may
print("Hello, Maylang!");

let name: Str = "Ada";
print("Hello, ${name}!");
```

```output
Hello, Maylang!
Hello, Ada!
```

`print` writes its arguments separated by spaces and always ends the line with a newline. String interpolation uses `${expression}` and works for any value:

```may
let answer: Int = 6 * 7;
print("answer: ${answer}");
```

```output
answer: 42
```

Comments start with `//` and run to the end of the line. Block comments use `/* ... */` and nest.

## Try it yourself

Create a workspace, replace `src/main.may` with the first sample, and run it:

```sh
may new hello
cd hello
may run
```

## Next

Continue to [Values and types](/learn/tour/values/).

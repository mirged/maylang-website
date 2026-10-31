---
title: Get started
description: Create a Maylang project, run it, test it and format it.
section: learn
group: Get started
order: 10
layout: doc
---

# Get started

This page takes you from a fresh install to a running, tested and formatted project. It assumes a Linux x86-64 machine or an x86-64 WSL 2 distribution.

## Install

Run the one-line installer:

```sh
curl --proto '=https' --tlsv1.2 -fsSL https://github.com/mirged/maylang/releases/latest/download/maylang-init.sh | sh
```

Press **Enter** to accept the recommended setup, or choose **Customize setup** to pick a folder, individual tools and shell integration. Open a new terminal when it finishes, or run the activation command it prints.

Check the installed tools:

```sh
may --version
mayc --version
```

## Create a project

```sh
may new hello
cd hello
may run
```

`may new` writes a workspace with `may.json`, an application entry point, a test group and a `.gitignore`. `may run` builds the application and executes it.

The generated `may.json` names the application and its test group:

```json
{
    "schema": 1,
    "name": "hello",
    "default": "app",
    "targets": {
        "app": {"kind": "app", "entry": "src/main.may"},
        "tests": {"kind": "test", "root": "tests"}
    },
    "dependencies": {}
}
```

## Edit the program

Replace `src/main.may` with a program that uses a function, a list and a recoverable failure:

```may
fun double(value: Int) -> Int {
    return value * 2;
}

let values: List<Int> = [1, 2, 3];
let doubled: List<Int> = map(values, fun(value: Int) -> Int {
    return double(value);
});

let answer: Int = may {
    double(21)
} otherwise {
    0
};

print(doubled);
print(answer);
```

```output
[2, 4, 6]
42
```

`may` evaluates the block and catches a recoverable fault. `otherwise` runs only when the block faults; `err.kind` and `err.message` are available inside it.

## Test, check and format

```sh
may test
may check --all
may fmt
```

`may test` compiles and runs every `*.test.may` file under the declared test root. `may check` runs the type checker without producing an executable. `may fmt` formats the workspace sources; `may fmt --check` reports files that would change.

## Next

- [Take the tour](/learn/tour/) for one concept at a time.
- [Read the strict typing guide](/learn/strict/) before writing a larger program.
- [Browse the standard library](/docs/latest/stdlib/).

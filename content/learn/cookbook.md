---
title: Cookbook
description: Short Maylang recipes for files, text, JSON and command-line programs.
section: learn
group: Guides
order: 50
layout: doc
---

# Cookbook

Short, complete recipes. Each one is a starting point rather than a library.

## Read a file

```may
let path: Str = "notes.txt";
let text: Str = may {
    read_file(path)
} otherwise {
    print("could not read " + path);
    ""
};

if (text != "") {
    print(text);
}
```

## Parse CSV

Use `csv_parse` from the standard library for quoted fields:

```may
import "csv" as csv;

let rows: Any = csv.csv_parse("name,score\nAda,10\nGrace,12\n");
for row: Any in rows {
    print(row);
}
```

## Split and join text

```may
let line: Str = "red fish blue fish";
let words: List<Str> = split(line, " ");
print(words[0]);
print(join(words, "-"));
```

## Parse JSON

```may
let document: Any = json_parse("{\"name\": \"Ada\", \"scores\": [1, 2, 3]}");
print(document.name);
print(document.scores);
```

`json_parse` returns lists, maps, strings, numbers, booleans and `nil`. Tighten the dynamic values with `str()`, `int()` or a small validating function before using them as a typed value.

## Read command-line arguments

```may
let argv: List<Str> = args();
if (len(argv) < 2) {
    print("usage: tool NAME");
} else {
    print("hello " + argv[1]);
}
```

The first entry is the executable name, matching the host convention.

## Loop until a condition changes

```may
mut attempts: Int = 0;
mut ready: Bool = false;
while (not ready) {
    attempts += 1;
    ready = attempts >= 3;
}
print(attempts);
```

## Write bytes and use raw output

`print` adds a newline. For exact output, use the `write` syscall with a byte count from `byte_length`:

```may
import "net" as net;

let text: Str = "no newline";
syscall(1, 1, addr(text), net.byte_length(text));
```

Most programs should use `print`; reach for raw syscalls only when the newline matters.

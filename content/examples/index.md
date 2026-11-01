---
title: Examples
description: Complete Maylang programs and applications, with build commands and verified output.
section: examples
group: Examples
order: 1
layout: doc
---

# Examples

The repository keeps single-file programs under `examples/` and complete applications under `examples/apps/`. The gallery is being assembled; the source is available now.

## Start with these

- `examples/hello.may` — the smallest complete program.
- `examples/strict.may` — the strict typing features in one file.
- `examples/features.may` — closures, comprehensions, pattern matching and JSON.
- `examples/may_otherwise.may` — recoverable failures.
- `examples/stdlib_tour.may` — a tour of the standard library.
- `examples/network/echo_server.may` and `echo_client.may` — TCP.

## Applications

- `examples/apps/mayboard` — a native UI board.
- `examples/apps/maynes` — an emulator with a test suite.
- `examples/apps/maytasks` — a task manager.

The build commands come from each project's `may.json`. For a single file:

```sh
mayc examples/hello.may -o /tmp/hello
/tmp/hello
```

For an application:

```sh
cd examples/apps/mayboard
may run
```

## A complete program

```may
import "csv" as csv;

fun total(rows: Any) -> Int {
    mut sum: Int = 0;
    for row: Any in rows {
        sum += int(row.score);
    }
    return sum;
}

let rows: Any = csv.csv_parse("name,score\nAda,10\nGrace,12\n");
let records: Any = csv.csv_records(["name", "score"], slice(rows, 1, len(rows)));
print(total(records));
```

```output
22
```

Every example in the finished gallery is compiled and run against the released compiler during the site build. Until a page says otherwise, check the repository version for the exact source.

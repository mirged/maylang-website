---
title: Functions
description: Typed parameters, explicit returns and call expressions.
section: learn
group: Tour
order: 23
layout: doc
---

# Functions

A function declares the type of every parameter and uses `return` on every path that produces a value.

```may
fun double(value: Int) -> Int {
    return value * 2;
}

fun greet(name: Str) -> Str {
    return "Hello, " + name;
}

print(double(21));
print(greet("Maylang"));
```

```output
42
Hello, Maylang
```

The result type may be omitted when the compiler can infer it from explicit `return` statements, but parameters always need annotations. A `Nil`-returning function still needs a `return;`; a final expression is not an implicit return.

## Every path returns

Return analysis checks branches. This function is accepted because both branches return:

```may
fun describe(count: Int) -> Str {
    if (count > 0) {
        return "some";
    } else {
        return "none";
    }
}

print(describe(0));
print(describe(2));
```

```output
none
some
```

Return analysis is conservative about loops. Even a `while (true)` loop needs an explicit `return` after it, because the compiler does not assume the loop never exits.

## Functions are values

Named functions can be passed where a function value is expected. Closures capture shared bindings:

```may
fun apply(value: Int, transform: (Int) -> Int) -> Int {
    return transform(value);
}

let offset: Int = 5;
let shifted: Int = apply(37, fun(value: Int) -> Int {
    return value + offset;
});
print(shifted);
```

```output
42
```

## Next

Continue to [Lists and maps](/learn/tour/lists/).

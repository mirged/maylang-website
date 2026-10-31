---
title: Values and types
description: Int, Float, Str, Bool and the conversions between them.
section: learn
group: Tour
order: 22
layout: doc
---

# Values and types

Maylang has a small set of primitive types. The common ones are `Int` (signed 64-bit), `Float` (binary64), `Str` (UTF-8 text), `Bool` and `Nil`.

```may
let count: Int = 3;
let price: Float = 2.5;
let ratio: Float = to_float(count) * price;
let label: Str = "total";
let ready: Bool = true;

print(label, ratio, ready);
```

```output
total 7.5 true
```

The compiler does not convert between numeric types implicitly. `Int` and `Float` cannot be compared directly either; convert one side first.

```may
let count: Int = 3;
let price: Float = 2.5;
let same: Bool = to_float(count) == price;
print(same);
```

```output
false
```

## Integers are 64-bit

Integers are signed 64-bit values. Overflow and division by zero raise a catchable `arithmetic` fault. Integer `/` truncates toward zero and `%` keeps the dividend's sign.

## Strings are UTF-8

`len` counts code points, not bytes, and indexing returns a one-character string. Network and file APIs that need bytes use explicit byte helpers.

## Try it yourself

Change the values and conversion in the first sample. Notice that `print(2.0)` shows `2.0`, while `print(2)` shows `2`.

## Next

Continue to [Functions](/learn/tour/functions/).

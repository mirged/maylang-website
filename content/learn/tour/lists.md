---
title: Lists and maps
description: Typed collections, mutation through shared references and map lookup.
section: learn
group: Tour
order: 24
layout: doc
---

# Lists and maps

Lists and maps are typed. `let` protects the binding, not the contents, so a `let` list can still be mutated through a shared reference.

```may
let values: List<Int> = [1, 2, 3];
push(values, 4);

let doubled: List<Int> = map(values, fun(value: Int) -> Int {
    return value * 2;
});

let counts: Map<Str, Int> = {"a": 1};
counts["b"] = 2;

print(values);
print(doubled);
print(counts["b"] ?? 0);
```

```output
[1, 2, 3, 4]
[2, 4, 6, 8]
2
```

Map lookup returns an optional value because the key may be absent. Use `??` to provide a fallback:

```may
let counts: Map<Str, Int> = {"apple": 2};
print(counts["apple"] ?? 0);
print(counts["pear"] ?? 0);
```

```output
2
0
```

## Comprehensions

A comprehension builds a new list from an iterable and an optional condition:

```may
let squares: List<Int> = [value * value for value: Int in 1..=5 if value % 2 == 1];
print(squares);
```

```output
[1, 9, 25]
```

## Shared references

Assigning a list or map to another binding aliases it. Mutating through either name is visible through both:

```may
let first: List<Int> = [1, 2];
let second: List<Int> = first;
push(second, 3);
print(first);
```

```output
[1, 2, 3]
```

## Next

Continue to [Structs and enums](/learn/tour/structs/).

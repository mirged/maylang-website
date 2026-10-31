---
title: Structs and enums
description: Named records, tagged variants and exhaustive match.
section: learn
group: Tour
order: 25
layout: doc
---

# Structs and enums

A `struct` is a named record with typed fields. Construct it positionally and read or write fields by name.

```may
struct Point { x: Int, y: Int }

let point: Point = Point(3, 4);
point.x = 30;
print(point.x + point.y);
```

```output
34
```

An `enum` is a set of tagged variants. Variants can carry typed payloads. `match` selects a variant and binds its payload:

```may
enum Shape { Circle(radius: Int), Square(side: Int) }

fun area(shape: Shape) -> Int {
    return match (shape) {
        Circle(radius) => 3 * radius * radius,
        Square(side) => side * side,
    };
}

print(area(Circle(2)));
print(area(Square(3)));
```

```output
12
9
```

Enum and `Result` matches must be exhaustive: either every variant is listed or an unguarded `_` arm is present.

## Guards

Match arms can add a Boolean guard. Guarded arms do not count toward exhaustiveness, so keep an unguarded arm:

```may
fun label(count: Int) -> Str {
    return match (count) {
        0 => "none",
        value if value < 0 => "negative",
        _ => "positive",
    };
}

print(label(0));
print(label(-1));
print(label(5));
```

```output
none
negative
positive
```

## Try it yourself

Add a `Triangle(base, height)` variant to `Shape`, then add its arm to `area`. The compiler will tell you if the new variant is not handled.

## Next

Continue to [Errors and `otherwise`](/learn/tour/errors/).

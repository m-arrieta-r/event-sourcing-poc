# Antigravity Agent Rules

- **Strict Functional Programming Only**: Do not use `class` declarations. Use pure functions, `type` or `interface` shapes, and closures where necessary. The entire application should adhere to functional code principles. State holding utilities (like an in-memory store) should be implemented via closures returning objects of functions, rather than classes.

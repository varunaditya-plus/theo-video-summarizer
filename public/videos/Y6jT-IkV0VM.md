# Rethinking Software Reliability: How to Actually Handle Errors in TypeScript

Theo is currently working across multiple TypeScript projects and finds himself repeatedly frustrated with how the language handles errors natively. He points out that while he isn't a fan of the Go programming language, Go gets one critical thing right: it forces developers to explicitly handle their errors. 

In TypeScript, errors are inherently untyped. When you call a function, you have no way of knowing if it might fail, or what specific error it might throw, unless you manually read through all of its underlying code. The standard `try/catch` blocks used to manage these failures are deeply flawed. Variables defined inside a `try` block are scoped strictly to that block, which forces developers into awkward choices: you either have to widen the scope and lose strict checking, or create deeply nested chunks of code that are incredibly difficult to read. Furthermore, if an error is rethrown, it loses its context, making debugging a nightmare. Unhandled errors inevitably bubble up and crash the application entirely.

To solve this, Theo maps out a "start to finish" spectrum of error handling, offering three distinct solutions depending on the complexity of your codebase.

### Level 1: The Bare Minimum (Theo's Wrapper)
As a starting point to stop relying on native `try/catch` formatting, Theo wrote a simple 25-line helper function that he pastes into his projects. 

*   When wrapping an async function, it returns an object containing either the requested data or an error, moving the check onto a single, flat programmatic level.
*   This structure forces TypeScript to recognize that the target data might be null, compelling the developer to explicitly check for and address the error before the language allows them to use the data.
*   It immediately eliminates deeply nested block scopes and makes the code significantly safer with virtually zero learning curve.
*   The primary drawback is that it erases specific error types—everything simply comes back as a generic error, making it inadequate for complex applications that need to route different types of failures in specific ways.

### Level 2: The Explicit Router (`neverthrow`)
For applications where failures occur across multiple layers and require specific context, Theo highly recommends a library called `neverthrow`. It completely abandons the `throw` keyword in favor of explicit "Result" types.

*   Every function is written to return either an `ok()` containing data, or an `err()` containing highly specific, strictly defined error types (such as `IdentificationFailed` or `RateLimitHit`).
*   Because the errors are strongly typed at the return level, developers can use exhaustive switch statements to identify exactly what went wrong and forward the correct contextual message to the end user.
*   It requires genuine effort to integrate, as developers are forced to manually expect and unpack these return values at every single layer of the application.
*   Theo notes a significant frustration with how `neverthrow` handles asynchronous code: chained promises cannot be handled with a standard clean `await`, and instead must be awkwardly unwrapped using an `.andThen()` syntax format.

### Level 3: The Total Rewire (Effect)
Theo describes `Effect` (or `effect.ts`) as less of a standard library and more of an entirely new language built inside of TypeScript. He compares it to React, noting that it works best when you allow it to dictate the fundamental root architecture of your entire application.

*   It shifts error handling and type safety directly into the runtime environment, making it virtually impossible for developers to accidentally let a failure case slip through.
*   Adopting Effect requires a complete mental rewiring from the user. It relies heavily on functional programming concepts like `pipe`, abandons standard bracket syntax, and replaces native tools with custom helpers (like using its own lowercase print commands instead of the standard console).
*   While Theo acknowledges it is the ultimate tool for creating bulletproof software, he admits he hasn't fully committed to using it himself because of the massive learning curve and the risk of alienating team members who aren't familiar with its highly specific syntax.

```mermaid
flowchart TD
    Idea[Stop blindly throwing errors] --> A

    A[Level 1: Theo's Wrapper] -->|Returns| B[{ data, error }]
    A -->|Main Benefit| C[Flattens scopes, easy drop-in]

    C --> D[Level 2: neverthrow]
    D -->|Returns| E[Result: Ok | Err]
    D -->|Main Benefit| F[Strict error typing, targeted routing]

    F --> G[Level 3: Effect]
    G -->|Returns| H[Functional Data Pipelines]
    G -->|Main Benefit| I[Bulletproof runtime, total type reliance]
```

### The Push for Better JavaScript Standards
Theo's ultimate conclusion is that the specific tool you use matters far less than the fundamental commitment to stop letting errors happen silently. Code quality is generally plummeting, and developers need to actively design systems that fail gracefully and loudly. 

He also briefly addresses a recent ECMAScript proposal that would introduce a native `try await` syntax to standard JavaScript, functioning similarly to his basic wrapper. While he thinks the proposal is a clean, digestible effort that he would use if it were baked in, he ultimately feels it is unnecessary, as the exact same native functionality can be achieved right now with a basic five-line helper function.

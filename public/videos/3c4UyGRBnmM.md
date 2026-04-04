# Theo's Evolving Tech Stack: Moving Beyond the Original T3 Stack

Theo's approach to application architecture has undergone a massive shift since he first introduced the T3 stack. While he originally built his business and early applications on a rigid structure of SQL, tRPC, and Next.js server components, he has recently transitioned toward a wildly different, highly modular setup. His current philosophy heavily prioritizes file-based configurations over dashboard settings, largely because keeping everything in the codebase makes AI and "vibe coding" significantly more effective.

While Theo emphasizes that his stack is not a strict rulebook, he shares his tools to illustrate how he makes architectural decisions based on project requirements, developer experience, and scalability. 

### The Core Architecture Transition

The most dramatic change in Theo's development process is his departure from traditional SQL databases and modular API layers in favor of an all-in-one backend solution. 

```mermaid
flowchart LR
    subgraph Old Architecture
        direction TB
        A[PlanetScale / SQL] --> B[Prisma / Drizzle]
        B --> C[tRPC]
        C --> D[React Query]
        E[Pusher / WebSockets] --> D
    end
    subgraph Current Architecture
        direction TB
        F[Convex]
    end
    Old Architecture -. Replaced completely by .-> F
```

Previously, Theo manually wired together a database host, an ORM, an API definition layer, live WebSocket updates, and client-side data fetching. Today, he delegates all of these responsibilities to Convex. By using Convex as his database, API layer, and real-time state manager, he relies on their built-in queries, mutations, and excellent optimistic updates. He only reaches back to tRPC for edge cases that Convex cannot natively handle.

### The Current Stack Breakdown

When assembling the rest of his stack, Theo makes highly specific choices based on the needs of the application, prioritizing composability and ease of use.

*   **Client Frameworks:** React remains non-negotiable due to its unmatched ecosystem, tooling, and AI agent compatibility. For routing, Theo chooses Next.js when he needs static pages, SEO optimization, or a hybrid marketing page and dynamic app in one repository. If static pages are unnecessary, he defaults to Vite with React Router for a simpler, lightweight setup. He advises against using Remix due to upcoming architectural changes and is keeping a close eye on TanStack Start. 
*   **Styling:** He relies on Tailwind CSS paired with shadcn/ui. By heavily customizing shadcn, he has resolved many of his historical frustrations with CSS behavior and styling systems.
*   **Package Management:** pnpm is his definitive choice, particularly because tools like Bun do not yet handle large monorepos or Turborepo configurations well. He strongly advises developers to abandon npm and Yarn to take advantage of the global package caching offered by pnpm and Bun.
*   **Hosting:** Vercel remains his primary host for frontend assets and backend compute. While Cloudflare offers cheaper setups for long-running AI inference tasks, Theo argues that Vercel's Node compatibility, frictionless deployment process, and fluid compute pricing ultimately make it vastly superior and more cost-effective than managing standard AWS Lambdas.
*   **Authentication:** Because Convex's native auth is lacking, Theo relies on external services. He defaults to Clerk for rapidly launching applications, as it effortlessly handles payments, UI components, and generous user session limits. For business-to-business applications requiring SAML or Okta, he uses WorkOS. He is also highly optimistic about Better Auth, an open-source package, and is waiting for a seamless Convex integration so that auth logic can live purely in code without relying on external dashboards.
*   **Payments:** Stripe forms the backbone of his payment architecture, though he acknowledges that managing Stripe webhooks can be incredibly painful. To maintain database integrity, he insists on keeping payment states and authentication tokens in isolated KV stores rather than his main application database. He is currently evaluating tools like Autumn and Polar to abstract away Stripe's webhook complexities. 

### Security, Analytics, and Extensibility

Theo is highly critical of certain industry standard tools, having lost business and users to poorly optimized security layers. He curates his auxiliary tools strictly based on developer experience and reliability.

*   **Bot Protection:** Theo strongly warns against using Cloudflare Turnstile, citing high failure rates, broken invisible modes, and a terrible developer experience. Instead, he highly recommends Vercel's Bot ID, which integrates directly at the Next.js route level and elegantly blocks bots before expensive code executes. For broader programmatic security, such as rate limiting and email validation, he uses Arcjet.
*   **Analytics:** For deep product analytics outlining feature usage and user churn, he uses PostHog. If a project simply needs high-level web traffic metrics without tracking individual signed-in users, he opts for Plausible.
*   **File Management:** UploadThing is his preferred solution for handling file uploads. He finds it significantly better than Convex's native file handling, especially when dealing with public versus private file configurations.
*   **Error Management and Telemetry:** He has recently introduced Effect into his codebases. While complex, it has dramatically improved how his team handles error management and generates deep, introspective traces in Axiom.
*   **Mobile and IDE:** React Native combined with Expo is his only choice for mobile development. When writing code, Cursor remains his top IDE simply because it offers the most reliable AI integration currently available.

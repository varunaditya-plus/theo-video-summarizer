# Why I'm Becoming a Diehard Open Source Advocate in the AI Era

Theo is fundamentally rethinking his long-held acceptance of closed-source software. While he has historically relied on closed-source tools like Notion, Slack, and Mac OS for his daily workflow, the rise of AI is pushing him toward becoming an open-source diehard. He has already open-sourced his project T3 Code and is strongly considering doing the same for T3 Chat. 

Historically, software was expensive and time-consuming to write, which justified keeping the source code closed so creators could sell access and build a sustainable industry. While this allowed developers to make a high-paying living, it left users entirely dependent on corporate maintainers to fix bugs. Today, however, AI has drastically lowered the cost and difficulty of writing code. Theo argues that implementing features is no longer the hard part of software engineering; the value now lies elsewhere, yet companies are still locking users into degrading, closed ecosystems out of habit and fear.

### The Yash Epiphany and Boundaryless Development

Theo's shift in mindset was heavily influenced by his high-school intern, Yash. Yash operates without perceiving traditional boundaries between the code he writes and the third-party dependencies he relies on. 

When Yash wanted to add local model support to the closed-source T3 Chat, he simply wrote a user script that reverse-engineered the app's Webpack bundle to inject his own packages. In another instance, Yash used a JavaScript tool called `patch-package` to directly modify the core AI SDK they were using to support image generation. Instead of building messy, complex workarounds in his own codebase—which is what Theo was doing—Yash simply opened the door to the dependency, fixed the underlying code, and submitted a pull request upstream. Theo realized this fearless, direct approach to modifying underlying software is exactly what the modern development experience should look like, especially now that AI makes writing and adjusting code so much easier.

### How AI is Ruining Closed-Source Software

Theo argues that you can no longer trust closed-source developers with AI. Because AI allows developers to write code up to a hundred times faster, it also allows them to ruin applications a hundred times faster. He believes many popular applications are suffering from rapid "slopification" because teams are piling on AI-generated code without care for performance.

*   **Cursor and Cursor Glass:** Despite having an incredible AI harness that makes models highly effective, Cursor’s performance has severely degraded under the weight of AI-generated code. When the team tried to fix this by building a supposedly lighter application from scratch called "Glass," the performance was actually worse, crashing with just two codebases open.
*   **Notion:** AI-driven updates have broken basic features, leading to situations where moving an item between columns only updates the offline version of the app and fails to sync to the live database.
*   **Mac OS:** Theo feels the latest operating system updates are so buggy it feels as though nobody actually wrote or tested the code properly.
*   **Codex App:** Constant, rapid updates meant clicking the update button felt like gambling, as the application would randomly alternate between gaining features and becoming entirely unusable due to performance lag.

The fundamental issue is that when an update ruins a closed-source workflow, the user is completely helpless to fix it. This creates a frustrating dynamic where AI accelerates software decay, and closed licenses prevent the community from stepping in to correct it.

```mermaid
flowchart TD
    subgraph Closed Source Model
        A[AI Tools] -->|100x Faster Output| B(Rapid Feature Shipping)
        B --> C[Slopification & Bugs]
        C --> D[Degraded Performance]
        D --> E[User Locked In & Helpless]
    end

    subgraph Open Source Model
        F[AI Tools] -->|100x Faster Output| G(Rapid Feature Shipping)
        G --> H[Slopification & Bugs]
        H --> I[Community Fixes via AI]
        I --> J[Forks Automation & Patches]
        J --> K[Accountability & High Quality Maintained]
    end
```

### The New Economics of Forking

Frustrations with native UI frameworks led Theo to build T3 Code using Electron, which he found handles text rendering flawlessly. Instead of keeping it closed to corner the market, he open-sourced it. The results proved his new philosophy right: out of 30,000 users, over 1,000 forked the repository. People used these forks to deeply customize the experience, with one maintainer named Maria even rebuilding the tool entirely as a terminal-based interface called T1 Code. 

Historically, forking an open-source project was a nightmare because manually merging upstream updates back into your custom version caused endless merge conflicts. Theo points out that AI agents have completely solved this. You can now set up automated jobs that use AI to pull in main-branch updates and intelligently resolve merge conflicts for your specific fork. 

This dynamic was further proven when Theo open-sourced Lawn, a simple video review tool. Though built for content creators rather than traditional software engineers, YouTubers with limited coding experience utilized AI to heavily customize it. Creators like XLT Jake and Quinn from Snazzy Labs used Claude to completely rewrite Lawn for their enterprise needs, adding self-hosting, stripping out Stripe, and building deep native integrations—all without writing the code from scratch themselves. Open source empowered them to own their workflow.

### The Anthropic Paranoia

Theo directs severe criticism at Anthropic for keeping Claude Code and their TypeScript agent SDK closed source. While Anthropic claims this is to protect their "secret sauce," Theo believes it is actually because they are deeply ashamed of the underlying code quality. 

This paranoia backfired when Anthropic accidentally included their source maps in an NPM release, effectively leaking their code. Because they were so terrified of losing their perceived advantage, they forced NPM to take the package down—a rare violation of NPM's immutable package standards—and blasted the community with DMCA takedowns. Theo views this as pathetic behavior. He contrasts it with Google and OpenAI, who have open-sourced the CLI tools and app servers for Gemini and Codex, allowing developers to build upon their primitives reliably.

### Conclusion

Theo concludes that the tech industry is seeing a dangerous trend: companies are heavily incentivized to close their source code at the exact moment that closed-source software is suffering its worst drop in quality. Tools like "Malice" are even surfacing to help companies use AI to rewrite open-source code just to strip away the original licenses. 

To combat the total enshittification of the digital world, Theo asserts that users must demand, build, and financially support open-source software. By keeping code open, developers enable AI to be a tool for community-driven customization and repair, rather than a weapon for rapid corporate software decay.

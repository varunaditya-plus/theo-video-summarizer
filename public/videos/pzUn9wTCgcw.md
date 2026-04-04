# The End of Issue Tracking and the Future of AI Development

Theo discusses a major shift in software development, sparked by the project management tool Linear declaring that traditional issue tracking is dead. He uses this as a jumping-off point to explore how artificial intelligence is collapsing the distance between an idea and its execution, rendering decades of bureaucratic software planning obsolete.

### The Problem with Traditional Issue Trackers
Historically, issue tracking was built for a handoff model of software development. Because engineering time was scarce, product managers would write elaborate specifications, break them into tickets, and assign them to developers. Over time, priority queues, negotiations, and workflows bridged the gap between these phases.

Theo argues that as systems absorbed more of these steps, complexity masqueraded as sophistication, and managing the process became the work itself. He notes that during his time as an engineer at Twitch, Jira dashboards took over two minutes to load simply because they were filled with complex, bloated data fields. Linear initially won over engineers by stripping away this weight, removing overhead so developers could just focus on building. Now, Linear is betting that AI agents will absorb the remaining procedural work. 

### "The Theo Method": Prototyping Over Planning
Long before AI agents existed, Theo adopted a development approach at Twitch that bypassed traditional issue tracking. He found that product specs written before a feature was built were almost always wildly inaccurate regarding timelines, design, and technical realities. 

Rather than relying on theoretical documents, Theo relied on rapid prototyping:
* He would spend one to three days building a scrappy, functioning version of the requested feature to test the user experience.
* Building the prototype exposed the actual technical constraints, identifying hidden dependencies and architectural limitations without relying on guesswork.
* Once the prototype was usable, teams could collect real internal and user feedback, ensuring the feature was actually worth pursuing.
* Depending on the outcome, the team would either write a highly accurate spec based on real learnings, or simply polish the prototype and ship it directly.

```mermaid
graph TD
    subgraph Traditional Handoff Failure
        A[Write Large Spec] --> B[Guess Implementation Limits]
        B --> C[Assign to Developer]
        C --> D[Discover Spec is Wrong]
        D --> E[Apply Bandaids to Code]
    end

    subgraph The AI & Prototype Method
        F[Request/Context Received] --> G[AI/Dev Builds Quick Prototype]
        G --> H[Discover Real Technical Constraints]
        H --> I[Write Informed Plan]
        I --> J[Build Final Version or Polish Prototype]
    end
```

### Why AI Makes Traditional Roles Obsolete
Now that AI coding agents have become incredibly powerful, Theo highlights that this specific prototype-first workflow isn't just a niche skill anymore—it is the ideal way to build software with AI. He points out a fascinating statistic from Linear: coding agents are already installed in over 75% of Linear's enterprise workspaces, and agents now author nearly 25% of new issues. 

However, Theo holds a firm stance against the way many developers are currently trying to integrate AI into their planning flows. He specifically criticizes setups where developers instruct AI to "roleplay" as different corporate positions.

* The traditional breakdown of software roles—such as Product Manager, Designer, QA Lead, and Staff Engineer—only existed because individual human beings had limited skills and capacity.
* If an AI model is smart enough to handle the design, manage the coding, and write the tests, forcing it to behave like disjointed human departments creates unnecessary friction.
* Companies that strictly divide product planning from engineering often suffer from it; Theo cites GitHub as an example, noting that their completely separate product and engineering leadership creates a disconnected product where developers don't make product decisions.

### Code as the New Plan
Theo concludes that we are currently stuck in a transitional phase where developers are trying to reinvent old processes for a new era. People are using AI to generate multi-step business plans, elaborate specifications, and sub-tasks, filling the context window with corporate bureaucracy just so the model can eventually write the code. 

Instead, Theo advocates that code itself should be the primary tool for planning. Rather than spending hours debating a technical design document, developers should feed the raw context into an AI and ask it to build a scrappy prototype. Because code is exceptionally cheap to generate now, building a disposable first version is the fastest way to map out constraints. Once the AI hits the technical roadblocks during the prototype phase, the developer can step back, create a much simpler and highly informed plan based on the learnings, and then have the AI build the final version properly.

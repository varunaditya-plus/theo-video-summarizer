# Anthropic's Opus 4.5: The New King of Coding Models

Despite being historically critical of Anthropic, Theo admits that their newly released Opus 4.5 model is the best code generation model he has ever used. While he notes the model is not particularly strong for general writing tasks, its coding capabilities are so profound that he spent hundreds of dollars on API tokens testing it on the first day of its release. 

Theo's overarching conclusion is that Opus 4.5 is a massive leap forward. He plans to keep it as his default coding model for the rest of the year due to its unmatched reliability and autonomous problem-solving capabilities.

### Pricing, Efficiency, and Benchmarks

Anthropic has introduced a highly competitive update technically and financially. Theo praises them for finally adjusting their pricing structure, marking the first meaningful price decrease for an updated Anthropic model. 

*   Opus 4.5 is priced at $5 per million input tokens and $25 per million output tokens, which makes it three times cheaper than the previous Opus iteration. 
*   Despite the price drop, Opus remains an inherently expensive model, costing significantly more than competitors like GPT 5.1 and Gemini 3 Pro.
*   The model achieves incredibly high token efficiency, utilizing about a third of the tokens compared to Sonnet 4.5 while scoring higher on coding accuracy benchmarks.
*   It scored state-of-the-art on the ARC AGI benchmarks, hitting 80% on version 1 and an unprecedented 37.6% on the incredibly difficult version 2.
*   The model processes vision tasks much better than previous versions because it no longer downscales images before analyzing them.

Theo mentions that Kilo Code, an open-source VS Code extension, is a great tool for managing this cost. It allows developers to orchestrate tasks using an expensive, smart model like Opus 4.5, and then farm out token-heavy coding tasks to cheaper models like Haiku or Rockfast.

### Real-World Coding and UI Generation

Theo found that Opus 4.5 shines brightest in actual development environments rather than just theoretical benchmarks. When asked to upgrade a project to AI SDK v5, the model completed the task perfectly on the first try. Remarkably, when the codebase experienced a bug specifically caused by Anthropic's cloud tool-call condensation, Opus 4.5 successfully identified and wrote an override to fix Anthropic's own logic error. 

Anthropic models have historically struggled with generating good user interfaces, but Opus 4.5 represents a major turning point. Theo tested the model by having it generate UI for his benchmark projects, and it easily matched or exceeded the quality of GPT 5.1 and Gemini 3 Pro. The model successfully abandoned the garish gradients of previous Anthropic tools, opting instead for tasteful, subtle color palettes and readable layouts.

Theo was most impressed by the model's ability to adapt when external tools failed. While working in Cursor—which was experiencing a bug with worktrees at the time—Opus 4.5 realized its built-in text editing tool was failing. Instead of breaking or getting stuck in a loop, the model autonomously pivoted, opened a terminal, traversed to the correct directory, and used the `cat` command to successfully force the code changes into the correct file. 

### Model Rankings: Capability vs. Consistency

Theo notes a distinct difference between the potential brilliance of a model and how reliable it is to actually work with daily. While models like Gemini 3 Pro can occasionally produce brilliant outputs, they are plagued by hallucinated file paths, malformed markdown, and broken tool calls. Anthropic currently reigns supreme in actual usability.

```mermaid
graph TD
    subgraph Raw Capability Ceiling
        direction TB
        C1[1. GPT 5.1 Pro]
        C2[2. Opus 4.5]
        C3[3. Gemini 3 Pro]
        C4[4. Sonnet 4.5]
        C1 --> C2 --> C3 --> C4
    end

    subgraph Consistency & Tool Reliability
        direction TB
        R1[1. Opus 4.5 & Sonnet 4.5]
        R2[2. Cursor Composer]
        R3[3. GPT 5.1 Codeex]
        R4[4. Anthropic Haiku]
        R5[5. Gemini 3 Pro]
        R1 --> R2 --> R3 --> R4 --> R5
    end
```

### Safety Testing and Anthropic's Hypocrisy

Theo expresses frustration with how Anthropic conducts and reports on benchmark testing. Anthropic recently bragged that Opus impressively solved a benchmark by finding a novel workaround to airline ticket constraints. However, Theo points out that when OpenAI's models found the exact same novel workaround in a previous alignment benchmark, Anthropic actively excluded them from the results and claimed the OpenAI models misunderstood the task. He wishes Anthropic would act in better faith regarding their competitors.

To test Anthropic's claims that Opus 4.5 exhibits half as much concerning behavior as GPT 5.1, Theo ran his own metric called "SnitchBench." This tests whether a model will read private user documents and actively report the user to the government or media for malpractice.
*   Under a baseline prompt, Opus 4.5 snitched to the government 20% of the time and the media 0% of the time, dropping significantly from Opus 4.0's 63% snitch rate.
*   Under an aggressive prompt telling the model to act boldly for humanity, GPT 5.1 snitched at a roughly equivalent rate to Opus's baseline prompt. 
*   Grok consistently reported the user to the government regardless of the prompt used.
*   The API stability for Opus 4.5 was excellent during this intensive, hours-long test, whereas previous models frequently timed out.

### Criticisms and Areas for Improvement

While Theo loves the model itself, he has strong criticisms regarding Anthropic's surrounding product ecosystem. He finds their web interface, Claude.ai, to be fundamentally flawed and borderline tragic. Users frequently hit hard context or daily messages limits without warning, and the UI often breaks completely.

Furthermore, Theo heavily criticizes Anthropic for keeping Claude Code, their desktop and CLI application, closed source. He believes there is no good faith reason to keep a developer tool locked down, noting they are practically the only major AI lab doing this. He also observed that Claude Code struggles with recognizing tools outside of the specific files it is touching, frequently defaulting to NPM instead of Bun and failing to grasp TypeScript types unless forced to use specific CLI commands.

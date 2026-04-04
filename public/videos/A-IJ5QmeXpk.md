# The Itch.io Takedown: How Automated Copyright Claims Broke a Platform

In this video, Theo breaks down the recent, chaotic outage of the indie game platform itch.io. He explains how a combination of automated brand protection software, incompetent middle-men, and panicked infrastructure providers resulted in one of the most popular domains on the internet being taken down for half a day. 

The situation began when Funko, a popular collectible company, spotted an unlicensed fan game mimicking their "Funko Fusion" site on itch.io. To handle the infringement, Funko utilized BrandShield, an AI-powered brand protection service. However, instead of following standard protocol, BrandShield bypassed the developer and the itch.io platform entirely, triggering a sweeping infrastructure failure. In the process, they even tracked down and called the mother of the itch.io founder. 

### The Liability Chain and Where It Broke

Theo uses a diagram to explain the layers of internet infrastructure and how liability is supposed to flow. Software is built on a vertical stack: at the bottom are the registrars and internet service providers, above them is the DNS provider, above that is the platform itself (itch.io), and finally, the users distributing the software (the game developers). 

When a user at the top of the stack violates a copyright, the complaint should be handled at the highest possible layer. By targeting the DNS provider at the bottom of the stack, BrandShield caused the entire platform to be taken offline rather than just the single offending web page.

```mermaid
flowchart TD
    subgraph The Internet Stack
    A[End Users / Gamers] --> B[Game Developers]
    B --> C[Service Platform: itch.io]
    C --> D[DNS Provider: I Want My Name]
    D --> E[Registrars / ICANN]
    end

    F[Funko / BrandShield] -- "Proper DMCA Claim (Ignored)" -.-> C
    F -- "Threatening Takedown Request" ---> D
```

### Theo's Parallel Experience with UploadThing

To illustrate how frustrating and dangerous it is when lower-level infrastructure gets punished for top-level user actions, Theo shares a recent experience from his own company, UploadThing.

*   When a developer uses UploadThing to build a file-sharing app, and an end-user uploads spyware, that malicious file is physically hosted on Cloudflare's infrastructure.
*   Internet Service Providers will eventually notice the malware and threaten to ban Cloudflare's IP addresses outright if the file is not removed.
*   Cloudflare then passes the pressure up to UploadThing, demanding immediate removal of the file, forcing Theo's team to hunt down the specific developer and end-user who caused the issue.
*   Because user actions at the very top of the hierarchy can threaten the entire underlying infrastructure, Theo concluded that free tiers on UploadThing can no longer host executable files or bash scripts, and they will be implementing stricter internal scanning moving forward.

### Corporate Responses and Theo’s Conclusions

Following the outage, both Funko and BrandShield released statements deflecting blame, which Theo highly criticizes. He breaks down the aftermath and shares his final verdicts on the companies involved.

*   **BrandShield's failure:** BrandShield publicly blamed the DNS provider for taking down the whole site, claiming they only asked for the specific URL to be removed. Theo argues this is nonsense; BrandShield's AI tool was completely rogue, failed to recognize it was looking at an itch.io subdomain, and ignored itch.io's very clear DMCA reporting process.
*   **The DNS provider's panic:** Theo points out that the DNS provider, I Want My Name, caved to automated threats out of panic and incompetence. Because they proved they could not protect their clients from baseless, automated takedowns, itch.io rightfully moved their business to a different domain registrar immediately after the incident.
*   **Funko's lack of accountability:** Funko released a statement praising indie developers while vaguely stating their partner "identified a page." Theo notes they failed to actually apologize or admit that their partner skipped all standard reporting protocols, and he suggests there are grounds for a lawsuit given the financial damage done to the itch.io brand.
*   **The danger of unchecked AI:** Theo concludes that this entire disaster is a prime example of what happens when AI tools are allowed to send threatening legal requests without a human in the middle verifying the basic details of the target domain.

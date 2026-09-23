# Research Note: Low-Level Design (LLD) Practice Platform

## 1. Executive Summary & Learner Problem
Practicing Low-Level Design (Object-Oriented Design) is a notorious bottleneck for software engineers preparing for senior technical interviews and real-world system architecture:
- **The Evaluation Dilemma**: In algorithmic coding (Data Structures & Algorithms), learners get binary deterministic feedback (`Accepted` vs `Wrong Answer`, `Time Limit Exceeded`). In LLD, there is rarely a single "correct" answer. Multiple distinct class hierarchies and design patterns can satisfy a prompt (e.g., State Pattern vs Command Pattern in an Elevator system).
- **Silent Anti-Patterns**: A learner can spend 45 minutes coding a Parking Lot or Vending Machine in Java or C++, feel confident, yet have completely violated the Open-Closed Principle, created an 800-line God class, coupled persistence with domain models, or forgotten thread-safety during spot allocation.
- **The "Uncertainty Void"**: Without senior engineering mentorship, learners repeat the same structural flaws across multiple practice problems, cementing bad habits.

---

## 2. Competitive Landscape & Existing Tools

| Platform / Tool | Delivery Format | Evaluation Capability | Critical Gap |
| :--- | :--- | :--- | :--- |
| **LeetCode / HackerRank** | Interactive code editor + unit tests | Automated binary test runner | Focuses on algorithmic puzzles; unable to evaluate class abstractions, interfaces, or SOLID principles. |
| **Educative (Grokking OOD)** | Static text, diagrams, code snippets | Self-reading / passive quiz | Purely passive reading. No feedback on the learner's own design attempts; learners memorize rather than practice. |
| **NeetCode / YouTube** | Video tutorials | None (broadcast only) | Monolithic "one true answer" bias; does not accommodate alternate valid trade-offs. |
| **Interviewing.io / Pramp** | 1-on-1 human mock interviews | High-quality human feedback | Prohibitively expensive ($150–$250/session); cannot be repeated 20 times for daily practice. |
| **Generic Chatbots (ChatGPT/Claude)** | Unstructured prompt box | General prose critique | Inconsistent scoring, hallucinates requirement compliance, lacks standardized rubric, no attempt versioning or design diffing. |

---

## 3. Key Findings & Learner Insights

1. **What learners actually need to submit**:
   A meaningful LLD attempt is not just code or just a UML diagram. It requires three synergistic components:
   - **Entity Hierarchy & Relationships**: Classes, interfaces, inheritance, composition, and aggregation.
   - **Contracts & Method Signatures**: Public APIs, abstraction points, and state representations.
   - **Design Decisions & Trade-Offs**: Why did the learner pick Strategy over Factory? How is concurrency handled? Why this trade-off?

2. **What makes feedback actionable**:
   - **Multi-criteria Rubric**: Breaking down the review into 5 specific dimensions:
     1. Single Responsibility & Cohesion (SRP)
     2. Abstraction & Interface Segregation (ISP, DIP)
     3. Design Pattern Suitability (avoiding under/over-engineering)
     4. Extensibility & Open-Closed Principle (OCP)
     5. Concurrency & Edge Cases (thread safety, race conditions, boundary states)
   - **Concrete Refactoring Suggestions**: Telling the learner *where* to refactor (e.g., "Extract `SpotAssignmentStrategy` out of `ParkingLot` class").
   - **Alternative Architecture Exploration**: Highlighting how an alternate pattern (e.g., State pattern) would compare.

3. **Hybrid Evaluation is Essential**:
   - Deterministic static analysis handles verifiable metrics: entity coverage, interface count, god-class heuristics, and keywords.
   - LLM reasoning handles architectural judgment: cohesion, abstraction appropriateness, and trade-off depth.

---

## 4. Product Direction & MVP Scope
Our platform delivers a focused, interactive **Practice Loop**:
```
Choose Problem -> Think & Model -> Submit Multi-Part Design -> Hybrid Evaluation -> Explainable Feedback -> Review & Try Again (v1 -> v2 Diff)
```

By prioritizing the learner journey, the platform transforms abstract design anxiety into repeatable, measurable engineering skill growth.

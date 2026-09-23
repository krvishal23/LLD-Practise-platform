# AI_USAGE.md: Meaningful AI-Assisted Decisions

This document outlines 4 core architectural decisions made during the design and development of the LLD Practice Platform, detailing what the AI suggested, what was accepted, what was rejected, and why.

---

### Decision 1: Submission Format Architecture
- **What AI Suggested**:
  The AI initially suggested requiring the learner to write and compile a full runnable Java or TypeScript project with multiple files and mock unit tests that run in an isolated WebAssembly sandbox.
- **What was Accepted**:
  Accepted the multi-faceted nature of an LLD submission (Entities, Contracts, Code, Decisions).
- **What was Rejected**:
  Rejected the requirement for a fully runnable, compiling multi-file project with runtime unit tests.
- **Why**:
  Low-Level Design interviews and practice are fundamentally about **abstractions, domain relationships, and trade-offs**, not low-level syntactical compilation bugs. Forcing compilation in WebAssembly introduces high latency, heavy browser resource consumption, and forces learners to spend 80% of their time fixing trivial syntax or import errors instead of reasoning about SOLID principles and architectural responsibilities. A structured submission combining entity models, contracts, and design rationales captures the essence of LLD far more cleanly.

---

### Decision 2: Hybrid Evaluation vs Pure LLM Scoring
- **What AI Suggested**:
  The AI suggested feeding the entire prompt and submission directly into Gemini with a generic prompt ("Grade this LLD design from 0 to 100") and displaying the model's raw response.
- **What was Accepted**:
  Using Gemini 3.8 Flash for semantic reasoning, critique generation, and nuanced evaluation of responsibilities and trade-offs.
- **What was Rejected**:
  Rejected relying solely on an end-to-end LLM call without deterministic validation.
- **Why**:
  LLMs can hallucinate coverage (claiming an entity is missing when it is present, or missing an obvious God class with 15 methods). By introducing a `DeterministicRuleEvaluator` that extracts entities, computes interface ratios, and detects God-class heuristics *before* invoking the LLM, we feed grounded static facts into the prompt. Furthermore, if the network drops or the LLM is unreachable, the deterministic engine acts as a robust, instant fallback.

---

### Decision 3: Evaluation Rubric Dimensionality & Scoring
- **What AI Suggested**:
  The AI proposed a 10-criterion rubric including microservices readiness, database indexing, caching strategies, and REST API standards.
- **What was Accepted**:
  A standardized 5-dimension rubric focused purely on Low-Level Design:
  1. Single Responsibility & Cohesion (SRP)
  2. Abstraction & Interface Segregation (ISP/DIP)
  3. Design Pattern Suitability
  4. Extensibility & Open-Closed Principle (OCP)
  5. Concurrency & Edge Cases
- **What was Rejected**:
  Rejected High-Level Design (HLD) criteria such as Kubernetes clustering, sharding, caching, and database indexing.
- **Why**:
  The assignment guidelines explicitly emphasize the boundary between LLD and HLD: *"LLD focus: classes, objects, responsibilities, interfaces, behaviour, relationships, patterns, extensibility, and code-level decisions. Do not spend the majority of your time on Kubernetes, microservices, CDN design, or other large-scale HLD concerns."* Keeping the rubric strictly focused on OOP/LLD prevents domain drift.

---

### Decision 4: Iterative Practice Loop & Attempt History
- **What AI Suggested**:
  The AI suggested a simple "Submit -> View Score" flow, treating each attempt as an isolated quiz question.
- **What was Accepted**:
  An attempt-history versioning system (`Attempt #1`, `Attempt #2`, `Attempt #3`) with an automated "Try Again" flow that clones previous work and visualizes score progression over time.
- **What was Rejected**:
  Rejected one-shot quiz-style submission.
- **Why**:
  The core value proposition stated in the prompt is: *"LLD practice is often easy to start but difficult to evaluate... so the product supports improvement, not just one-time solving."* Without history comparison and score deltas, a learner cannot verify whether their refactoring actually addressed the architectural critique.

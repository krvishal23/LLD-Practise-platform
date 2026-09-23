# LLD Practice Platform (2-Day Engineering Prototype)

An interactive, domain-driven practice platform designed to help software engineers practice Low-Level Design (LLD), submit multi-part solutions, and receive explainable, rubric-based feedback with iterative attempt history.

---

## 🎯 Features

1. **Curated LLD Problem Library**:
   - **Parking Lot System** (Multi-floor, vehicle spot allocation, dynamic fee calculation, concurrency)
   - **Elevator Control System** (State pattern, dispatch algorithms, floor requests)
   - **Vending Machine** (State transitions, coin/cash processing, inventory management)
   - **In-Memory Pub-Sub Broker** (Topic/Subscriber models, push/pull, dead letter queue)
   - **LRU Cache with TTL** (Doubly linked list, hash map, eviction strategy, thread safety)

2. **Rich Multi-Faceted Submission Flow**:
   - **Entity & Relationship Modeler**: Define classes, attributes, methods, and relationships (inheritance, composition, aggregation).
   - **Live Interactive UML Visualizer**: Auto-generates clean visual diagrams of the user's design hierarchy.
   - **Code & Contracts Editor**: Pre-populated templates with interfaces and method signatures.
   - **Design Decisions & Trade-Offs Form**: Justify pattern choices, thread safety, and extensibility.

3. **Hybrid Evaluation Engine**:
   - **Deterministic Pre-Check**: Checks entity coverage, computes interface-to-class ratio, detects God classes (> 8 methods), flags missing concurrency primitives.
   - **LLM Reasoning**: Evaluates architectural coherence, SOLID principles, and trade-off depth via Gemini 3.8 Flash.
   - **Explainable Rubric**: 5 dimensions (Single Responsibility, Abstraction, Design Patterns, Extensibility, Concurrency) with clear scores, pros, cons, and refactoring tips.
   - **Resilient Fallback**: Automatic graceful fallback to deterministic evaluation if the LLM is unavailable or offline.

4. **Iterative Attempt History & Progress Tracking**:
   - Versioned attempts (`Attempt #1`, `Attempt #2`, etc.).
   - Visual score trend and side-by-side attempt comparison.
   - "Try Again" one-click action to iterate based on feedback.

5. **Built-in Documentation & Automated Test Runner**:
   - Integrated viewer for `RESEARCH_NOTE.md`, `DESIGN_NOTE.md`, and `AI_USAGE.md`.
   - In-app interactive test runner verifying domain rules, edge cases, and evaluation resilience.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Optional: `GEMINI_API_KEY` for real-time LLM architectural reasoning (falls back gracefully to deterministic rule evaluation if unset).

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server (runs full-stack Express + Vite on port 3000)
npm run dev

# Run TypeScript linter
npm run lint

# Build for production
npm run build
```

---

## 📁 Key Files & Architecture

- `server.ts`: Express API server hosting `/api/evaluate` and `/api/health`, proxying Gemini 3.8 Flash calls securely server-side.
- `src/types/lld.ts`: Core domain models for Problems, Submissions, Entities, and Evaluations.
- `src/services/evaluator/`:
  - `IEvaluator.ts`: Evaluator strategy interface.
  - `DeterministicRuleEvaluator.ts`: Static rule-based parser and heuristic scorer.
  - `HybridEvaluator.ts`: Blended engine orchestrating deterministic and LLM logic.
- `src/data/problems.ts`: Complete curated problem specifications, starter templates, and reference solutions.
- `src/tests/evaluator.test.ts`: Automated tests for domain evaluation rules, edge cases, and fallback behavior.
- `RESEARCH_NOTE.md`: 1-2 page research synthesis on the LLD learner problem.
- `DESIGN_NOTE.md`: System design note answering the 5 main questions.
- `AI_USAGE.md`: Documentation of 4 AI-assisted engineering decisions.

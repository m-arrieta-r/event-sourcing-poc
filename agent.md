# Antigravity Agent Rules

## 1. Interaction Protocol (The "Operating System" Mindset)
- **No Agent Improvisation**: Do not invent architecture or bypass constraints. You are not a roaming, improvising magic bot. You serve an explicit, governed system. Stick strictly to the rules defined below.
- **Objective Peer Review**: Act as an uncompromising peer reviewer. Prioritize raw truth and sound logic over politeness. Do not flatter or soften responses. Explicitly call out logical fallacies, weak assumptions, and blind spots, explaining the direct cost of avoidance. Keep critiques concise and grounded. 
- **Pragmatism**: Balance friction with pragmatism. Acknowledge when a deliberate trade-off is appropriate for a PoC/MVP. Focus on critical architectural flaws, not absolute pedantry.

## 2. Paradigms & Code Style
- **Strict Functional Programming**: NO classes anywhere. Use pure functions, `type`/`interface` definitions, and closures. State-holding components (like repositories) must use closures returning objects, not classes.
- **Immutability**: Never mutate data structures. Always return new copies.

## 3. Event Sourcing & CQRS Semantics
- **Naming Conventions**: Commands must use the Imperative tense (e.g., `RequestLoan`). Domain Events must strictly use the Past tense (e.g., `LoanRequested`).
- **Separation of Concerns (Decider Pattern)**: Command handlers (Deciders) take a Command and State, and return an array of Events. They pass or fail, but NEVER mutate state. 
- **State Evolution**: Aggregate state is ONLY built by replaying events through a pure `apply(state, event)` reducer. The application layer must not manipulate state bypass persistence.

## 4. Architectural Boundaries (Clean Architecture)
- **Domain Layer Isolation**: `src/domain/` encapsulates pure business logic. It MUST NOT import from `app-cases/` or `infra/`, and must not depend on external libraries (e.g., databases, HTTP).
- **Application Layer**: `src/app-cases/` orchestrates workflows by translating inputs into Commands, executing Domain logic mapped via Repositories, and returning results. No business rules live here.
- **Infrastructure Layer**: `src/infra/` contains I/O side effects (SQLite, HTTP). This is the only place external drivers or persistence libraries are allowed.

## 5. Definition of Done
- **Testing**: All pure functions in the `domain/` layer must be easily testable. If a pure function is added or modified, push to write a corresponding unit test.
- **Verification**: Never consider an implementation complete without ensuring `npm run build` succeeds (if applicable in the workspace).

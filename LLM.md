# agent-instructions.md

## 🧠 Core Objective
Ensure all code changes contribute to the long-term **maintainability**, **performance**, **clarity**, and **business goals** of the project.  
Prioritize **clarity**, **testability**, and **minimal breakage** in all modifications.

---

## ✅ DO

### 🏗 Code Changes
- Preserve existing functional behavior unless explicitly instructed otherwise.
- Refactor code only if it:
  - Improves readability
  - Reduces technical debt
  - Increases modularity or testability
- Follow the project’s structure, conventions, and naming patterns.

### 📄 Documentation
- Auto-generate or update:
  - Docstrings
  - Inline comments
  - README files (if logic or usage changes)
- Write **concise, high-context commit messages** when committing.

### 🧪 Testing
- Generate or update **unit tests** when logic changes.
- Simulate test suite to ensure **all existing tests pass** after modifications.

### 🧭 Navigation
- Traverse files intelligently based on **context** and **dependencies**.
- When modifying a file, verify impact across **imports/exports** and related modules.

### ⚙ Configs / DevOps
- Mirror formats of existing files like `.env.example`, `.dockerignore`, etc., when adding new config keys.
- Alert if any **environment variable changes** could impact deployment or secrets.

---

## 🚫 DO NOT

- ❌ Introduce **breaking changes** unless explicitly approved.
- ❌ Modify `.git`, CI/CD pipelines, or deployment configs unless instructed.
- ❌ Inject large third-party libraries without strong justification.
- ❌ Delete unreferenced files without confirmation — flag them instead.

---

## 📦 Naming Conventions (Custom to This Project)

> Adjust based on project language & framework

- `camelCase` → Variables and functions (JavaScript/TypeScript)
- `PascalCase` → Components and classes
- `snake_case` → Variables and functions (Python)
- File names should match exported class/component name (case-sensitive)

---

## 📚 File Priorities

When making updates, prioritize in this order:
1. **Core logic files** (e.g. `src/agents/`, `src/utils/`, `lib/`)
2. **Test files** (co-located with source)
3. **Interfaces / Types** (e.g. `types.ts`, `schemas/`)
4. **Documentation** (`README.md`, `docs/`, etc.)

---

## 🔄 Review Protocol

If uncertain about a change:
- Leave a comment like: `// LLM_NOTE: [brief reasoning]`
- Flag potential side effects instead of assuming safe behavior

---

## 🛡 Safety

- Default to **idempotent operations** and **backward-compatible** changes.
- Ensure all changes are **easily reversible** through clear commit diffs.

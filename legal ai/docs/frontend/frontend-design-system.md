# Legal AI Platform (Frontend Design System)

> **Purpose:** Complete implementation blueprint for `Frontend Design System`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Frontend Design System`

## 1.2 Service ID

`sys-frontend-design-core-platform`

## 1.3 Service Category

`Platform Engineering & User Interface`

## 1.4 Service Type

`UI Component Library`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Frontend Design System must:

* Provide a strictly governed, reusable set of React UI components (Buttons, Inputs, Modals, Tables) that dictate the visual language of the entire platform.
* Enforce design tokens (colors, typography, spacing) via Tailwind CSS.
* Guarantee WCAG 2.1 AA accessibility compliance (keyboard navigation, screen reader support, color contrast) across all interactive elements.

The service must **not** contain business logic or fetch data from backend APIs.

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
Without a design system, 10 different frontend developers will build 10 slightly different buttons. This leads to a messy, unprofessional UI and drastically slows down development. A strict design system ensures that building a new screen is as fast as snapping together Lego blocks, while ensuring the platform looks like a cohesive, premium B2B product.

## 1.7 User Value

Explain what the user gains from this service.
Trust and familiarity. The user learns how to interact with the platform once. A "Save" button looks and behaves exactly the same on the Contract screen as it does on the Settings screen.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A `src/components/ui/` folder containing pure, stateless React components styled with Tailwind CSS, built on top of robust headless primitives (like Radix UI or shadcn/ui).

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* Tailwind CSS configuration (`tailwind.config.js`).
* Foundational UI Components (Typography, Buttons, Badges, Inputs, Selects).
* Complex UI Patterns (Data Tables, Dialogs/Modals, Slide-overs, Tooltips).
* Dark Mode / Light Mode support.
* Iconography integration (e.g., Lucide Icons).

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Specific page layouts (e.g., "The User Profile Page"). The design system provides the *pieces*, the Application provides the *layout*.
* API calls (Components must accept data via `props`).

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `React` | Component framework | - |
| `Tailwind CSS` | Styling engine | - |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**Every page** in the Frontend application imports components from this system.

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point
N/A - Users interact with instances of these components across the app.

## 3.2 User Input
Clicks, Keyboard Focus, Typing, Dragging.

## 3.3 User Flow
N/A

## 3.4 User States
* `Default`
* `Hover`
* `Focus` (Visible keyboard focus rings are mandatory for accessibility).
* `Active` / `Pressed`
* `Disabled` (Must clearly look un-clickable).
* `Loading` (Spinners embedded inside the element).

## 3.5 User-Visible Result
A cohesive, polished visual interface.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

### Component Construction Workflow

```text
RADIX UI (Provides accessible logic, keyboard handling)
  ↓
TAILWIND CSS (Provides visual styling utility classes)
  ↓
CVA (Class Variance Authority - Handles variants like 'primary' vs 'secondary')
  ↓
REACT COMPONENT (e.g., `<Button variant="outline" size="sm" />`)
```

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs

* All components must accept standard HTML attributes as props (e.g., a `Button` must accept `onClick`, `disabled`, `type`).

## 5.2 Optional Inputs

| Input     | Type     | Default     | Rules     |
| --------- | -------- | ----------- | --------- |
| `className` | `String` | `""` | Must use `tailwind-merge` to safely combine incoming classes with default classes. |

## 5.3 Input Validation Rules

* Use TypeScript strictly to define the interface for every component.

---

# 6. OUTPUT CONTRACT

N/A - Components return JSX to be rendered by React.

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **No Custom CSS:** Developers must NEVER write `.css` or `.scss` files to style a component. Everything must be achieved via Tailwind utility classes.
* **Accessibility First:** You cannot build a custom dropdown from scratch using `div`s. You MUST use accessible headless primitives (like Radix) that handle `aria` tags and keyboard navigation automatically.

## 7.2 Validation Rules
N/A

## 7.3 Decision Rules
N/A

## 7.4 Failure Rules
* Components must not crash if passed `null` data; they should render empty states or skeletons safely.

## 7.5 Boundary Rules
* Components must never reach out to global state (like a Redux store) directly. They must remain "dumb" and receive all state via props from their parent container.

---

# 8. DOCUMENT CONTEXT

## 8.1 Required Document Information

* The design system must include specialized components for rendering documents (e.g., `<DocumentViewer>`, `<HighlightedText>`) that handle large blocks of text elegantly.

## 8.2 Context Rules
N/A

## 8.3 Section-Level Context
N/A

---

# 9. AI RESPONSIBILITY

## 9.1 AI Purpose
N/A

## 9.4 AI Rules
* The design system must define how AI elements look (e.g., an `<AIBadge>` that glows, or a `<ChatBubble>` that styles markdown blocks). These must look distinct from human-generated UI elements.

---

# 10. AI PROMPT RESPONSIBILITY

N/A

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

N/A

---

# 12. BACKGROUND PROCESSING

N/A

---

# 13. DATABASE RESPONSIBILITY

N/A

---

# 14. STORAGE REQUIREMENTS

N/A

---

# 15. API CONTRACT

N/A

---

# 16. ERROR HANDLING

## Error Rules

* Provide standard `<Alert variant="destructive">` components to render API errors consistently across the application.

---

# 17. AUTHORIZATION & SECURITY

## 17.4 Security Rules

* UI components must use React's built-in XSS protection. If rendering raw HTML (e.g., for certain AI markdown outputs), the component MUST strictly sanitize the HTML via `DOMPurify` before passing it to `dangerouslySetInnerHTML`.

---

# 18. SOURCE & TRACEABILITY

N/A

---

# 19. LEGAL SAFETY

N/A

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements

* UI interactions (hover, click, modal open) must execute at 60 frames per second. Do not use heavy JavaScript animations; use CSS transitions via Tailwind.

## 20.2 Large Input Handling

* Data Tables must support virtualization (e.g., using `@tanstack/react-virtual`) if they need to render thousands of rows (e.g., listing all clauses in a 500-page document).

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Config         | `tailwind.config.js` | Design Tokens |
| Base CSS       | `src/styles/globals.css` | Tailwind imports |
| UI Atoms       | `src/components/ui/` | Core components (Buttons, Inputs) |
| Utilities      | `src/lib/utils.ts` | `cn()` tailwind-merge helper |

---

# 22. SERVICE CONNECTIONS

N/A

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

N/A

---

# 25. OBSERVABILITY

N/A

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing

* Test complex components (like Modals or Comboboxes) to ensure accessibility attributes (`aria-expanded`, `aria-hidden`) change correctly upon interaction.

## 26.2 Integration Testing

* Use visual regression testing (e.g., Chromatic or Playwright) if possible to ensure CSS changes don't accidentally break component rendering globally.

---

# 27. EDGE CASES

| Case     | Expected Behavior |
| -------- | ----------------- |
| `Long Text Overflow` | Typography and layout components must gracefully handle very long strings (common in legal text) using `truncate` or proper line-breaking, rather than breaking the layout grid. |

---

# 28. VERSIONING

N/A

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `tailwind.config.js` | Defines the theme | Yes | - |

---

# 30. DEPLOYMENT REQUIREMENTS

N/A

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] All components use Tailwind classes exclusively.
* [ ] Interactive components can be navigated entirely using the `Tab` and `Enter` keys on a keyboard.
* [ ] Component API interfaces are strictly typed with TypeScript.
* [ ] Changing a color in `tailwind.config.js` propagates instantly across the entire application.

---

# 32. DEFINITION OF DONE

The Frontend Design System is **DONE** when a developer can build a complex new screen (like a Settings page with 5 tabs, 10 inputs, and 2 modals) by exclusively importing components from `src/components/ui/` without writing a single line of custom CSS.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.** (UI components are dumb. They only render what they are told).
2. **Unsupported input must fail safely.**
3. **Repeated requests must not create unintended duplicate data.**

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Provides the building blocks (buttons, text fields, modals) used to construct the user interface.

## What the user sees
A highly polished, accessible, and consistent visual experience.

## What happens in the background
React efficiently manages component lifecycles while Tailwind CSS handles styling without shipping massive CSS files to the browser.

## What it receives
React Props (Data and Event Handlers).

## What it produces
Rendered HTML and CSS.

## Success means
Frontend development is rapid, the application looks like a unified premium product, and visually impaired users can navigate the legal tool successfully via screen readers.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |

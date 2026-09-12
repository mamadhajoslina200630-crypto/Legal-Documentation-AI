# Legal AI Platform (Regional Language Explanation)

> **Purpose:** Complete implementation blueprint for `Regional Language Explanation`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Regional Language Explanation`

## 1.2 Service ID

`sys-regional-language-explanation-service`

## 1.3 Service Category

`Core Business Logic & AI Processing`

## 1.4 Service Type

`Synchronous AI Generation Service`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Regional Language Explanation service must:

* Take a snippet of complex English legal text.
* Prompt the AI Gateway to explain the text's mechanics in a simplified manner, translated directly into a specific Indian regional language (e.g., Hindi, Marathi, Tamil, Bengali).
* Output the explanation in the native script (e.g., Devanagari) and/or Romanized transliteration based on user preference.
* Return the explanation synchronously to the client.

The service must **not** provide binding legal translations for court use (Handled by Legal Document Translation) or provide legal advice.

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
A massive portion of India's business landscape consists of SMEs and individuals who are not fully fluent in the highly complex, archaic English used in Indian contract law. When presented with an English contract, they are forced to blindly trust the counterparty. This service bridges the language barrier, empowering users to instantly understand the business impact of a contract in their mother tongue.

## 1.7 User Value

Explain what the user gains from this service.
Inclusivity and trust. A small business owner in Maharashtra can highlight a terrifying "Force Majeure" clause in an English contract and instantly read a simple, friendly explanation of it in Marathi.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
An API endpoint that takes English legal text and a target language code, passes it to a highly multilingual LLM with a specialized simplification prompt, and returns a translated, plain-language explanation to the UI.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* Maintaining prompts for specific regional language translations.
* Ensuring the output is conversational, not literal "Google Translate" legalese.
* Returning output in native scripts.
* Handling nuances of Indian legal contexts (e.g., referencing "Stamp Paper" concepts if relevant to the explanation).

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Full document translation (Handled by Legal Document Translation).
* Modifying the actual underlying English contract file.

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `AIGateway` | To generate the explanation | Multilingual Text output |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**Frontend API** (to render the explanation popover/sidebar).

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point
The user highlights a confusing paragraph in the document viewer, selects a language from a dropdown, and clicks "Explain in my Language".

## 3.2 User Input
Highlighted text + Target Language (e.g., `hi-IN`).

## 3.3 User Flow

```text
User highlights text: "The tenant shall bear the cost of routine maintenance..."
User selects "Hindi" and clicks "Explain".
  ↓
UI shows a loading shimmer.
  ↓
Service passes text and language to AI.
  ↓
Service returns regional explanation.
  ↓
UI displays the card: "किरायेदार को नियमित रखरखाव (जैसे छोटे-मोटे रिपेयर) का खर्च खुद उठाना होगा।"
```

## 3.4 User States
* `Generating`
* `Viewing Explanation`

## 3.5 User-Visible Result
A conversational, easy-to-read pop-up box explaining the highlighted English text in the user's selected regional language.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

### Regional Explanation Workflow

```text
HTTP REQUEST `POST /api/v1/clauses/explain-regional`
  Body: { "text": "...", "language": "Hindi" }
  ↓
Construct Prompt:
  System: "You are a friendly legal educator fluent in {language}. Translate the provided English legalese into plain, conversational {language}. Use simple words, not formal Hindi/Sanskrit heavy legal terms. Do not give legal advice."
  Text: [text]
  ↓
Send Prompt to AI Gateway.
  ↓
Receive generated explanation.
  ↓
HTTP RESPONSE 200 OK -> `{ "explanation": "..." }`
```

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs

| Input     | Type     | Required | Rules     |
| --------- | -------- | -------- | --------- |
| `text`    | `String` | Yes | The legalese to be explained |
| `language`| `String` | Yes | The target language (e.g., Hindi, Tamil, Telugu) |

## 5.2 Optional Inputs
N/A

## 5.3 Input Validation Rules
* Must reject requests where `text` exceeds 1000 words.
* Must validate that the `language` is supported by the AI model.

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output
A JSON payload containing the regional text.

## 6.2 Output Structure
```json
{
  "original_text": "The tenant shall bear...",
  "target_language": "Hindi",
  "explanation": "किरायेदार को नियमित रखरखाव का खर्च खुद उठाना होगा।"
}
```

## 6.3 Output Rules
* The explanation MUST use colloquial, conversational language. For Hindi, it should lean towards "Hinglish" or everyday spoken Hindi, completely avoiding highly formalized, Sanskritized legal Hindi (which is just as confusing to the user as English).

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **No Legal Advice:** The AI must explicitly avoid telling the user what they *should* do. It must only explain what the text *says*.
* **Colloquial Requirement:** The output must prioritize comprehension over literal translation. If a legal concept requires a 2-sentence analogy in the regional language to make sense, the AI should use the analogy.

## 7.2 Validation Rules
N/A

## 7.3 Decision Rules
N/A

## 7.4 Failure Rules
N/A

## 7.5 Boundary Rules
N/A

---

# 8. DOCUMENT CONTEXT

## 8.1 Required Document Information
N/A - Operates on pure text snippets.

---

# 9. AI RESPONSIBILITY

## 9.1 AI Purpose
Multilingual educational translation and simplification.

## 9.4 AI Rules
* Use a model highly proficient in Indic languages (e.g., GPT-4o, Claude 3.5 Sonnet, or specialized Indic models like Sarvam/Krutrim if available via the gateway). Smaller models often hallucinate or output broken grammar in regional languages.

---

# 10. AI PROMPT RESPONSIBILITY

## 10.1 System Prompt
```text
You are a friendly legal educator helping a non-lawyer understand an English contract.
Your task is to translate the provided "legalese" into plain, everyday {language}.
CRITICAL RULES:
1. Write in colloquial, everyday {language}. Do NOT use formal, highly-academic legal terminology in {language}. 
2. If necessary, it is okay to keep common English business terms (like 'Tax' or 'Invoice') written in the {language} script if that is how people naturally speak.
3. Use simple analogies if the clause describes a complex process.
4. Do NOT give legal advice. Just explain what the text means mechanics-wise.
```

## 10.2 User Prompt
```text
TEXT TO EXPLAIN:
{text}
```

## 10.4 Prompt Rules
N/A

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

N/A

---

# 12. BACKGROUND PROCESSING

N/A - Synchronous API request.

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data
* None. Stateless service.

## 13.5 Database Rules
N/A

---

# 14. STORAGE REQUIREMENTS

N/A

---

# 15. API CONTRACT

## 15.1 Endpoints Exposed
* `POST /api/v1/clauses/explain-regional`

---

# 16. ERROR HANDLING

## Error Rules
* Handle cases where the LLM might output unsupported character sets by ensuring UTF-8 encoding across the entire stack (FastAPI -> JSON -> UI).

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules
* Standard JWT bearer token authentication.

---

# 18. SOURCE & TRACEABILITY

N/A

---

# 19. LEGAL SAFETY

## 19.1 Legal Disclaimers
* The UI must display: *"यह AI द्वारा तैयार किया गया एक सरल स्पष्टीकरण है। यह कानूनी सलाह नहीं है।" (This is a simplified AI explanation. It is not legal advice.)* in the target language.

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements
* Synchronous API request must complete in `< 5 seconds`. Multilingual generation can sometimes be slightly slower than English generation.

## 20.2 Large Input Handling
* Reject massive text blocks.

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Service Logic  | `backend/app/services/clause_explanation_regional.py` | Prompt orchestration |

---

# 22. SERVICE CONNECTIONS

```text
[FastAPI Route] ──► [Regional Explanation Service] ──► [AIGateway]
```

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging
* `INFO: Explained clause in regional language (Hindi). Tokens: 120 In / 110 Out.`

---

# 25. OBSERVABILITY

## Metrics
* Track `regional_language_requested` to see which languages are most heavily used by the user base.

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing
* Feed the AI a string. Assert the mocked output returns a valid JSON response containing UTF-8 characters (e.g., Devanagari script).

---

# 27. EDGE CASES

| Case     | Expected Behavior |
| -------- | ----------------- |
| `Untranslatable Idioms` | English legal idioms (e.g., "Time is of the essence") don't translate literally well. The AI must explain the *concept* (e.g., "Deadlines are extremely strict and missing them is a breach"), not the literal words. |

---

# 28. VERSIONING

N/A

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `REGIONAL_MODEL` | Which LLM to use | Yes | `gpt-4o` |

---

# 30. DEPLOYMENT REQUIREMENTS

N/A

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] Outputs conversational regional languages in the correct native script (UTF-8).
* [ ] Avoids hyper-formal legal translations in favor of comprehension.
* [ ] Does not offer legal advice on whether to sign.
* [ ] Responds in under 5 seconds.

---

# 32. DEFINITION OF DONE

The Regional Language Explanation service is **DONE** when a non-English speaking business owner can highlight an intimidating 200-word English indemnification clause and instantly read a 2-sentence explanation in colloquial Hindi that makes perfect sense to them.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.**
2. **Unsupported input must fail safely.**
3. **Repeated requests must not create unintended duplicate data.**

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Breaks down the language barrier in Indian legal contracts by translating complex English legalese into simple, conversational regional languages.

## What the user sees
An instant pop-up that translates terrifying English legal jargon into simple concepts in their mother tongue (e.g., Hindi, Marathi, Tamil).

## What happens in the background
The service takes the English text and uses a highly capable multilingual LLM to perform a double-translation: first from Legalese to Simple English, and then from Simple English to Conversational Hindi, ensuring maximum comprehension without dispensing legal advice.

## What it receives
Dense English legal text and a target language code.

## What it produces
Plain-language explanations in native scripts (UTF-8).

## Success means
SMEs and individuals across India are no longer intimidated or disenfranchised by English-only legal systems, fostering trust and faster deal-making.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |

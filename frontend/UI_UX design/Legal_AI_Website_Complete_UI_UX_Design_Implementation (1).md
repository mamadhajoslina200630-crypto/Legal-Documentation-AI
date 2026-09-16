# Legal AI Website — Complete UI/UX Design Specification

## 1. Project Overview

**Product type:** AI-powered multilingual legal document assistant.

**Core promise:** Make complex legal documents easier to understand, analyze, translate, and act on.

**Primary design personality:**
- ⚖️ Professional and trustworthy
- 🤖 Modern and AI-powered
- 😊 Simple and friendly

**Primary audience:** Everyone — normal users, students, businesses, and legal professionals.

**Core user journey:**

`Homepage → Upload Document → AI Detects Document → AI Recommends Services → Services available in Left Menu + Chatbox → User Selects Service → AI Processing → Smart Result Workspace → Ask AI / Download / Share / Change Language / Try Another Service`

---

# 1A. Requested Service-Navigation Change

**Only the service-navigation behavior is changed. All other previously selected UI/UX decisions remain unchanged.**

### Final service-navigation rule

The **left-side menu does not contain the 8 services**.

The left sidebar contains only general navigation such as Home, My Documents, History, Language, Settings, and Profile.

The **8 services are shown together only above the AI chatbox** in the main workspace.

```text
LEFT SIDEBAR                         MAIN WORKSPACE

⚖️ Legal AI                          Document / AI Result
🏠 Home
📄 My Documents                      Choose a service
🕘 History                           [📄 Simplify] [⚠️ Check Risks]
                                     [🌐 Translate] [📝 Summarize]
🌐 Language                           [🔎 Key Info] [💡 Legal Terms]
⚙️ Settings                           [⚖️ Compare] [✅ Actionable Advice]
👤 Profile
                                     ─────────────────────────
                                     AI conversation
                                     Ask anything about this document...
                                     [ Type your question... ] ➤
```

The 8 services are therefore **one compact service selector located directly above the chatbox**.

Selecting a service:
- Highlights that service.
- Updates the AI chat context.
- Keeps the same uploaded document active.
- Does not require another upload.
- Does not open a separate service page.
- Keeps the user inside the same AI workspace.

# 1B. Implementation Specification — New Service Placement

This section is the definitive implementation rule for the requested UI change.

## A. Left Sidebar — General Navigation Only

The left sidebar must **not contain any of the 8 legal AI services**.

It contains only:

```text
⚖️ Legal AI

🏠 Home
📄 My Documents
🕘 History

────────────

🌐 Language
⚙️ Settings
👤 Profile
```

Do not add a `Services` group to this sidebar.

## B. Main Workspace — 8 Services Above the Chatbox

All 8 services must appear **together directly above the AI chatbox**.

Recommended order:

```text
Choose a service

[ 📄 Simplify ]       [ ⚠️ Check Legal Risks ]
[ 🌐 Translate ]      [ 📝 Summarize ]
[ 🔎 Extract Key Information ] [ 💡 Explain Legal Terms ]
[ ⚖️ Compare with Laws ]       [ ✅ Get Actionable Advice ]

────────────────────────────────────────
AI Assistant conversation

AI message / result content

────────────────────────────────────────
Ask anything about this document...
[ Type your question... ]          ➤
────────────────────────────────────────
```

## C. Service Selection Behavior

When a user clicks one of the 8 services:

1. The selected service receives the active/selected visual state.
2. The AI chatbox switches to that service's context.
3. The existing uploaded document remains active.
4. The user stays inside the same workspace.
5. No new service page is required.
6. The document does not need to be uploaded again.
7. The chat input remains available for service-specific questions.
8. The user can switch to another service from the same 8-service picker.

## D. AI Recommendation Behavior

If AI recommends services after document detection, show the recommendations **within the main workspace/chat area**, not in the sidebar.

Example:

```text
⭐ Recommended for your document

[ ⚠️ Check Legal Risks ]
[ 📄 Simplify ]
[ 📝 Summarize ]

You can also choose any service below.

Choose a service
[ 📄 Simplify ] [ ⚠️ Check Legal Risks ]
[ 🌐 Translate ] [ 📝 Summarize ]
[ 🔎 Key Info ] [ 💡 Legal Terms ]
[ ⚖️ Compare ] [ ✅ Actionable Advice ]
```

Recommendations are suggestions only. All 8 services remain available.

## E. Responsive Implementation

### Desktop

- General navigation stays in the left sidebar.
- Document/result content occupies the main workspace.
- AI Assistant appears on the right or within the existing workspace.
- The 8-service picker is directly above the chatbox.

### Tablet

- Keep general navigation compact.
- Keep the 8-service picker above the chatbox.
- Allow the service picker to wrap into additional rows if necessary.

### Mobile

- Hide/collapse the general navigation into the mobile menu.
- Do not move the 8 services into that menu.
- Keep the 8-service picker directly above the chatbox.
- Allow the services to wrap or horizontally scroll if needed.
- Keep the chat input immediately below the service picker.

## F. Visual Relationship

The hierarchy should always be:

```text
Document / AI Result
        ↓
8-Service Picker
        ↓
AI Conversation
        ↓
Chat Input
```

The left sidebar is independent:

```text
General Navigation
        │
        └── Home / Documents / History / Language / Settings / Profile
```

This is the final placement rule and overrides any earlier description that places the 8 services inside the left sidebar.

# 2. Design Goals

The UI/UX should:

1. Make legal information feel less intimidating.
2. Explain every feature in simple language.
3. Make the main action obvious.
4. Avoid overwhelming users with the 8 services.
5. Make AI recommendations useful but never force the user to follow them.
6. Keep the original document accessible while showing the AI result.
7. Make important dates, risks, obligations, and actions easy to find.
8. Work equally well on mobile, tablet, and desktop.
9. Clearly communicate privacy and AI limitations.
10. Support multilingual interaction throughout the experience.

---

# 3. Visual Design Direction

## 3.1 Color Direction

**Primary visual family:** Blue + Purple.

### Suggested palette

- Deep Navy — primary trust color
- Royal/Professional Blue — primary interactive color
- AI Purple — secondary/accent color
- Very Light Blue — page background sections
- Very Light Purple — AI-highlight backgrounds
- White — cards and primary content
- Neutral Gray — secondary text
- Dark Gray — main text
- Green — successful/completed states
- Amber/Yellow — warnings and medium risk
- Red — high-risk or urgent information

Use blue for trust/legal actions and purple for AI-related elements.

Do not overuse gradients. Use subtle blue-purple gradients mainly in hero backgrounds, AI highlights, and selected states.

---

## 3.2 Typography

Use a modern, highly readable sans-serif font.

Recommended:
- Inter
- Plus Jakarta Sans
- Manrope

### Typography hierarchy

- H1: large, confident, clear
- H2: section headings
- H3: card/service headings
- Body: highly readable
- Small text: metadata, disclaimers, privacy notes

Avoid decorative fonts.

---

# 4. Logo

The logo should combine **law + AI + modern technology** without looking like a traditional law firm.

Avoid using only a large scales-of-justice icon.

### Recommended concept

A simple abstract symbol containing:
- subtle legal/document shape
- AI spark/circuit element
- modern geometric form

The wordmark should be clean and technology-oriented.

---

# 5. Global Navigation

## 5.1 Before Login

Top navigation:

`Logo | Home | Services | How It Works | About | Login`

Primary CTA:

`Upload & Understand`

Language selector:

`🌐 English ▼`

---

## 5.2 After Login

Use a dashboard-style layout.

### Desktop sidebar

```text
⚖️ Legal AI

🏠 Home
📄 My Documents
🕘 History

────────────

🌐 Language
⚙️ Settings
👤 Profile
```

The left sidebar is used only for **general website/workspace navigation**. The 8 legal AI services are **not listed in the sidebar**.

All 8 services are presented together **only above the AI chatbox** inside the main workspace.

The top area can contain:
- Search
- Language
- Notifications if needed
- Profile

---

## 5.3 Mobile Navigation

Use a compact header:

`☰ | Logo | 🌐 | Profile`

Use a bottom navigation bar where useful:

`Home | Documents | Services | History`

The full sidebar becomes a slide-out menu.

---

# 6. Homepage

## 6.1 Hero Section

The hero should immediately explain the product.

### Main heading

**Legal Documents, Made Simple.**

### Supporting text

> Understand, translate, analyze, and simplify complex legal documents with AI.

### Main CTA

**[ 📄 Upload & Understand ]**

### Trust/feature indicators

`🔒 Private & Secure`  
`🌐 Multilingual`  
`🤖 AI-Powered`

Add a small reassuring note:

> No account required to get started.

---

## 6.2 Hero Visual

On desktop, place a modern legal-AI workspace preview beside the hero text.

The preview can show:
- a document
- an AI explanation
- a risk indicator
- important dates
- an AI chat box

On mobile, put the visual below the CTA.

---

# 7. Homepage Service Section

Heading:

**What can you do with your document?**

Supporting text:

> Upload one document and use multiple AI-powered services without uploading it again.

The homepage should **not display all 8 services as a large grid of service cards**. The existing homepage visual design remains unchanged, but service navigation is moved into the **left-side menu** after the user enters the main website/workspace.

A small homepage explanation may still say:

> **8 AI services are available from the left menu.**

The 8 services are accessed from the left sidebar and then displayed/interacted with inside the chatbox.

## Service organization in the left menu

The sidebar can visually group the services without changing the rest of the website:

### 📖 Understand
- Simplify
- Summarize
- Explain Legal Terms

### 🌐 Communicate
- Translate

### ⚠️ Protect
- Check Risks
- Get Actionable Advice

### 🧠 Analyze
- Extract Key Information
- Compare with Laws

The exact service names should follow the project's finalized 8-service definitions.

---

# 8. Service Navigation and Chatbox Design

The 8 services are **not displayed as a primary service-card grid and are not listed in the left-side menu**. They are presented together as the selectable service options **only above the AI chatbox/workspace**.

## 8.1 Left-side service menu

The left sidebar contains all 8 services:

```text
SERVICES

📄 Simplify
⚠️ Check Risks
🌐 Translate
📝 Summarize
🔎 Extract Key Information
💡 Explain Legal Terms
⚖️ Compare with Laws
✅ Get Actionable Advice
```

Each service has:
1. Unique icon
2. Simple service name
3. Clear selected/active state

The active service should have:
- A subtle blue/purple background
- Clear icon and text emphasis
- A visible active indicator

## 8.2 Services inside the chatbox

When the user opens the AI chatbox, show all 8 services as a compact service picker at the top of the chat or directly above the input.

Example:

```text
┌─────────────────────────────────────┐
│ 🤖 Legal AI                         │
│                                     │
│ Choose a service                    │
│                                     │
│ [📄 Simplify] [⚠️ Check Risks]     │
│ [🌐 Translate] [📝 Summarize]       │
│ [🔎 Key Info] [💡 Legal Terms]      │
│ [⚖️ Compare] [✅ Actionable Advice] │
│                                     │
│ ─────────────────────────────────── │
│ AI conversation for selected service│
│                                     │
│ Ask anything about this document... │
│ [ Type your question... ]        ➤  │
└─────────────────────────────────────┘
```

The user selects a service **only from the 8-service list above the chatbox**.

The selected service controls the **same service state** throughout the AI workspace.

## 8.3 Service selection behavior

When a service is selected from the left menu:
1. Highlight the service in the sidebar.
2. Highlight the same service in the chatbox service picker.
3. Update the chatbox title/context.
4. Show the service-specific explanation or quick-start prompt.
5. Keep the currently uploaded document active.
6. Do not force the user to upload the document again.

When a service is selected from the chatbox:
1. Highlight the same service in the left sidebar.
2. Load the service-specific chat context.
3. Keep the user in the same workspace.

This creates one consistent navigation system instead of separate service pages.

---

# 9. Upload Screen

## 9.1 Main Upload Area

Heading:

**Upload your legal document**

Subheading:

> Upload a document and let AI prepare it for your selected service.

Main upload card:

```text
              📄

       Drop your document here

                 or

          [ Choose File ]

      PDF • DOCX • JPG • PNG
```

Also support appropriate alternatives where technically available, such as scanning/camera input on mobile.

---

## 9.2 AI Processing Explanation

Below the upload area:

### ✨ What AI will do

- ✓ Detect the document type
- ✓ Read and structure the content
- ✓ Identify important sections
- ✓ Prepare the document for your selected service

---

## 9.3 Privacy

Near the upload button:

> 🔒 **Private & Secure**  
> Your document is processed securely.

Add:

`How we protect your data →`

This opens a dedicated privacy explanation.

Do not make unsupported security promises. Only claim protections that the actual system implements.

---

# 10. Guest User Flow

Users should NOT be forced to register before trying the product.

### Flow

`Open Website → Upload → Process → View Result`

After the result is available, offer:

> **Want to save this result?**
>
> Create an account to keep your documents and results.

Buttons:

`Create Account`  
`Continue as Guest`

---

# 11. Document Detection

After upload, AI automatically detects:

- Document type
- Approximate language
- Page count
- Important structural elements
- Potential service relevance

Example:

```text
📄 Document detected

Legal Notice

Language detected:
English

Pages:
4

✨ AI has prepared this document.
```

The user should be able to correct the detected language/type if necessary.

---

# 12. AI Service Recommendation

After detecting the document, show:

## Recommended for your document

The recommendation appears inside the AI workspace/chatbox:

```text
⭐ Based on your document

I recommend:

[ ⚠️ Check Legal Risks ]
[ 📄 Simplify ]
[ 📝 Summarize ]
```

Explain briefly why:

> We detected a legal notice. These services may help you understand its meaning, important concerns, and key information.

## All 8 Services

The full list of 8 services is shown **only in the compact service picker directly above the chatbox**.

Important:
- AI recommendations are suggestions.
- User can choose any of the 8 services.
- Never hide the other services because of the AI recommendation.
- Selecting a service keeps the user in the same workspace.
- The left sidebar remains unchanged and contains only general navigation.

---

# 13. Service Selection

When a service is selected from the **left-side menu** or the **8-service chatbox list**, open that service inside the existing AI chat/workspace.

Example:

```text
┌─────────────────────────────────────┐
│ 📄 Simplify                         │
│                                     │
│ Understand this document in simple  │
│ language.                           │
│                                     │
│ What you'll get:                    │
│ ✓ Simple explanation                │
│ ✓ Important points                  │
│ ✓ Key obligations                   │
│ ✓ Recommended next steps            │
│                                     │
│ [ Start Analysis ]                  │
└─────────────────────────────────────┘
```

### Selection behavior

- Sidebar service becomes active.
- Same service becomes active in the chatbox picker.
- Chatbox context changes to that service.
- Existing document stays selected.
- User can switch to another service at any time.
- No unnecessary page navigation.
- No repeated upload.

The service therefore behaves as a **chat/workspace mode**, not as a completely separate page.

---

# 14. AI Processing Screen

Use **AI animation + step-by-step progress**.

Example:

```text
          ✨
    Analyzing your document

✓ Reading document
✓ Identifying document type
✓ Understanding legal clauses
● Preparing simple explanation
○ Checking important points
○ Finalizing result
```

### UX requirements

- Never show an unexplained spinner only.
- Show meaningful progress.
- Do not falsely imply exact internal model operations if the system does not actually perform them.
- If processing fails, explain what happened and provide a retry option.

---

# 15. Main Result Workspace

This is the most important screen in the product.

## Desktop

Use an adaptive two/three-panel workspace depending on screen width.

Recommended:

```text
┌──────────────────┬─────────────────────────────┐
│ Original         │ AI Result                  │
│ Document         │                             │
│                  │ Smart Overview              │
│ Page preview     │ Explanation                 │
│                  │ Important Points             │
│                  │ Risks / Dates / Actions     │
└──────────────────┴─────────────────────────────┘

              [📄 Simplify] [⚠️ Check Risks] [🌐 Translate] [📝 Summarize]
[🔎 Key Info] [💡 Legal Terms] [⚖️ Compare] [✅ Actionable Advice]

💬 Ask anything about this document...
```

## Mobile

Use a vertical structure:

`Document → Smart Overview → Detailed Result → Risks → Dates → Actions → Ask AI`

The original document can be opened in a dedicated viewer or expandable section.

---

# 16. Smart Overview

The top of the result should provide the most important information in seconds.

Example:

```text
📄 Legal Notice

🧠 In simple words
This document explains...

⚠️ Risk
Medium

📅 Important date
15 October 2026

✅ Recommended action
Review the notice and respond within the stated period.

[ Read Full Explanation ↓ ]
```

The wording must remain faithful to the document.

Avoid presenting AI assumptions as confirmed facts.

---

# 17. Detailed AI Result

After the overview, show expandable sections.

Recommended sections:

### 1. What is this document?

Plain-language explanation of document type and purpose.

### 2. What does it mean?

Simple explanation of the legal content.

### 3. Important points

Bullet points highlighting important clauses, duties, rights, and information.

### 4. Important dates

Show dates in a clear timeline/card format.

### 5. What may require attention?

Potential concerns or items requiring review.

### 6. Recommended next steps

Practical, non-deceptive actions based on the document.

### 7. Original clause

Where possible, let the user inspect the relevant original text.

---

# 18. Legal Risk Detection UI

Use the smart risk system.

Example:

```text
Overall Risk: Medium 🟡

3 areas need attention

🔴 Deadline
Response may be required by the stated date.

🟡 Penalty clause
Additional charges are mentioned.

🟢 Other clauses
No major concern was detected in this analysis.

[ View Details ]
```

## Risk levels

### 🟢 Low
No major issue detected by the analysis.

### 🟡 Medium
Something may require attention or review.

### 🔴 High
Potentially serious or time-sensitive issue detected.

Important:
- Risk score is an AI assessment, not a legal judgment.
- Always explain the reason.
- Link the risk to the relevant document section when possible.
- Avoid fear-inducing language.

---

# 19. Important Dates UI

Use a visual timeline.

```text
📅 Important Dates

15 Oct
Response deadline
       │
       ▼
20 Oct
Next stated action
```

If the date is explicitly found in the document, show its source/reference.

If no date is found:

> No clear deadline was detected in the document.

Never invent dates.

---

# 20. Recommended Actions UI

Use a checklist:

```text
✅ What you may want to do

□ Review the highlighted clause
□ Check the stated deadline
□ Gather the referenced documents
□ Consider consulting a qualified legal professional
```

Actions must be based on the actual document and should not pretend that AI advice is definitive legal advice.

---

# 21. AI Chat

The selected preference is a **chat box at the bottom**, similar to ChatGPT.

The chatbox area has the **8-service picker directly above the chat input**, so users can select or switch services without leaving the conversation.

```text
────────────────────────────────────
🤖 Legal AI

Choose a service:

[📄 Simplify] [⚠️ Check Risks]
[🌐 Translate] [📝 Summarize]
[🔎 Key Info] [💡 Legal Terms]
[⚖️ Compare] [✅ Actionable Advice]

────────────────────────────────────

AI conversation for the selected service

Ask anything about this document...

[ Type your question... ]       ➤
────────────────────────────────────
```

Suggested prompts can change according to the selected service.

Examples:
- **Simplify:** Explain this in simple words
- **Check Risks:** What are the risky clauses?
- **Translate:** Translate this explanation to Tamil
- **Summarize:** Give me the key points
- **Key Information:** What are the important dates?
- **Legal Terms:** Explain this legal term
- **Compare:** How does this clause compare with the selected law?
- **Actionable Advice:** What actions should I consider?

The AI should answer based primarily on the uploaded document when the question concerns that document.

## Service selection behavior

There is no service list in the left sidebar.

When the user selects **Check Risks**, **Translate**, or any other service from the service picker above the chatbox:
- The selected service becomes active.
- The chatbox changes to that service's context.
- The same document remains active.
- The user stays on the same workspace.
- The user can switch to another service from the same service picker at any time.

This keeps the interface clean and avoids duplicate service navigation.

---

# 22. AI Answer Style

AI answers should follow:

### Direct answer first

Then:

### Explanation

Then:

### Relevant document reference

Then, where appropriate:

### What to consider next

Avoid:
- overly complex legal vocabulary
- excessive paragraphs
- unsupported certainty
- pretending to be a lawyer
- hiding uncertainty

---

# 23. Multilingual UX

The website supports:

- Website/interface language
- AI answer language
- Document language detection

## Top-right language selector

```text
🌐 English ▼
```

## Automatic detection

After upload:

```text
Language detected:
🇬🇧 English

[ Change Language ]
```

The user can override detection.

## Result language

Inside the result:

`🌐 Answer in: English ▼`

Possible supported languages should match the actual implementation.

The original document should remain unchanged unless the user explicitly requests translation.

---

# 24. Translation Service

Translation should preserve meaning and structure.

Result layout:

```text
Original Language
English

Translated Language
Tamil

┌──────────────────┬──────────────────┐
│ Original         │ Translation      │
│                  │                  │
│ Original clause  │ Translated text  │
└──────────────────┴──────────────────┘
```

Actions:

- Change language
- Copy
- Download
- Ask AI

Include a note that legal translation should be professionally verified when official/legal submission requires certified translation.

---

# 25. Download and Share

After results are generated, provide an action bar:

```text
[ 📥 Download ] [ 📤 Share ] [ 🌐 Language ] [ ⋯ More ]
```

More actions:

- Ask AI
- Try another service
- View original
- Save result
- Delete document

Downloads can include:
- PDF
- DOCX
- Other formats actually supported by the system

Do not show unavailable formats.

---

# 26. Document History

Logged-in users get:

```text
My Documents

🔍 Search documents

Recent

📄 Rental Agreement
    Simplification
    12 Sep 2026

📄 Legal Notice
    Risk Detection
    10 Sep 2026

📄 Employment Contract
    Translation
    08 Sep 2026
```

Each document should show:
- Name
- Date
- Last service used
- Language
- Optional status

---

# 27. Document Detail Page

Clicking a document opens its workspace.

Top:

`Document name | Language | Actions`

Then:

`Original | Results | History`

Allow users to run another service without re-uploading the same document.

---

# 28. History

Show previous AI actions:

```text
Document History

12 Sep — Simplification
12 Sep — Risk Detection
11 Sep — Translation
```

This makes the product feel like a continuous workspace rather than separate tools.

---

# 29. Login / Signup

Keep authentication simple.

### Login

- Email
- Password
- Social login only if actually supported
- Continue as Guest where appropriate

### Signup

Explain the benefit:

> Create an account to save documents, results, and history.

Do not make unnecessary fields mandatory.

---

# 30. Privacy and Security UX

Near upload:

> 🔒 Private & Secure

Link:

> How we protect your data →

Privacy page should clearly explain:
- What data is collected
- Why it is collected
- How documents are processed
- How long documents/results are retained
- Whether data is used for model improvement
- How users can delete their data
- Third-party services if applicable

Only state policies that the actual product follows.

---

# 31. AI Disclaimer

Use a small disclaimer near AI-generated results.

Example:

> ⚠️ AI-generated information is for general informational purposes and is not a substitute for advice from a qualified legal professional.

At the bottom of the result, provide:

**AI Information & Limitations**

Explain:
- AI can make mistakes.
- The output should be checked against the original document.
- AI output is not automatically legal advice.
- Important or high-stakes matters may require professional review.

For high-risk results, make the limitation more prominent.

---

# 32. Error States

Every important screen needs a helpful error state.

## Upload error

> **We couldn't process this file.**
>
> Please check the file format and try again.

`[ Try Again ]`

## Processing error

> **Analysis couldn't be completed.**
>
> Your document was not successfully analyzed.

`[ Retry ]`

## Unsupported document

> **This document format isn't supported yet.**

Show supported formats.

## No text detected

> **We couldn't detect readable text.**
>
> Try a clearer scan or upload a text-based document.

---

# 33. Empty States

## No documents

```text
📄

No documents yet

Upload your first legal document to get started.

[ Upload & Understand ]
```

## No history

```text
🕘

No activity yet
```

Keep empty states friendly rather than technical.

---

# 34. Notifications

Use notifications only when useful.

Examples:

- Upload completed
- Analysis completed
- Result saved
- Download ready
- Something failed

Avoid unnecessary notifications.

---

# 35. Accessibility

The product should support:

- High text contrast
- Keyboard navigation
- Visible focus states
- Screen-reader-friendly labels
- Large enough touch targets
- Clear error messages
- Icons accompanied by text when meaning could be unclear
- No information conveyed by color alone

For example, don't use only red/green; include labels such as **High Risk** and **Low Risk**.

---

# 36. Responsive Design

## Desktop

Use:
- Sidebar
- Two/three-panel workspace
- Large document viewer
- AI result panel
- Chat at bottom

## Tablet

Use:
- Compact sidebar/navigation
- Two-panel layout where possible
- Collapsible document panel

## Mobile

Use:
- Vertical content
- Bottom navigation
- Full-screen document viewer when needed
- Bottom chat box
- Large upload button
- Cards stacked vertically

The most important action should remain reachable with one hand where practical.

---

# 37. Mobile Homepage

Recommended order:

```text
Logo + Language + Menu

Legal Documents, Made Simple.

Short description

[ Upload & Understand ]

🔒 Private & Secure
🌐 Multilingual
🤖 AI-Powered

What can you do?

[ Service Card ]
[ Service Card ]
...
```

Avoid putting too much information before the upload CTA.

---

# 38. Mobile Result Page

Recommended order:

```text
Document title

🧠 Smart Overview

⚠️ Risk

📅 Important Dates

✅ Recommended Actions

📖 Detailed Explanation

📄 View Original

💬 Ask anything about this document...
```

Use accordions for long sections.

---

# 39. Micro-interactions

Use subtle animations for:

- Upload success
- Service selection
- AI processing
- Risk card appearance
- Expanding sections
- Copy confirmation
- Download completion

Avoid excessive animations.

The product should feel calm and trustworthy.

---

# 40. Component System

Create reusable components:

### Navigation
- Desktop navbar
- Sidebar
- Mobile header
- Bottom navigation

### Buttons
- Primary
- Secondary
- Ghost
- Danger
- Icon button

### Cards
- Service card
- Recommendation card
- Risk card
- Date card
- Action card
- Document card

### Document
- Document viewer
- Page navigation
- Highlighted clause
- Original text panel

### AI
- AI response
- Chat input
- Suggested prompt
- Processing indicator

### Feedback
- Success
- Warning
- Error
- Information
- Loading

---

# 41. Button Hierarchy

Use one primary action per screen.

Primary:

**Upload & Understand**

Secondary:

**Choose a Service**

Tertiary:

**View Original**

Do not make every button look equally important.

---

# 42. Complete User Flow

## New guest user

```text
Homepage
   ↓
Upload & Understand
   ↓
Document uploaded
   ↓
AI detects document
   ↓
Language detected
   ↓
AI recommends services
   ↓
User chooses service
   ↓
AI processing
   ↓
Smart Result Workspace
   ↓
Read result
   ↓
Ask AI
   ↓
Try another service / Download / Share
   ↓
Optional account creation
```

## Returning user

```text
Login
 ↓
Dashboard
 ↓
My Documents
 ↓
Select document
 ↓
Choose another service
 ↓
New AI result
```

---

# 43. Recommended Homepage Structure

Final homepage order:

```text
1. Navigation

2. Hero
   Legal Documents, Made Simple.
   [Upload & Understand]

3. Trust indicators
   Private • Multilingual • AI-Powered

4. How It Works
   Upload → AI Understands → Choose Service → Get Result

5. Service navigation explanation
   "All 8 AI services are available from the left menu
   and inside the AI chatbox."

6. Smart AI Workspace Preview
   Show the left service menu + chatbox containing the 8 services.

7. Privacy / Security explanation

8. AI limitations / disclaimer

9. FAQ

10. Final CTA
    Upload & Understand

11. Footer
```

The homepage remains visually consistent with the previously selected design. The major change is only the **service-navigation method**: services are accessed through the left-side menu and the chatbox instead of a large standalone service-card grid.

---

# 44. Recommended Result Page Structure

```text
Top navigation

Document title
Language
Actions

────────────────────────

SMART OVERVIEW

Document type
Simple meaning
Risk
Important date
Recommended action

────────────────────────

DETAILED EXPLANATION

What is this document?
What does it mean?
Important points

────────────────────────

RISK ANALYSIS

Overall risk
Risk items
Why each item matters
Relevant document sections

────────────────────────

IMPORTANT DATES

Timeline

────────────────────────

RECOMMENDED ACTIONS

Checklist

────────────────────────

ORIGINAL DOCUMENT

View / highlight relevant sections

────────────────────────

AI CHAT

Ask anything about this document...

────────────────────────

Download | Share | Language | Try Another Service

AI Information & Limitations
```

---

# 45. Recommended UX Principles

### Principle 1 — Simple first

Show the simple explanation before complex details.

### Principle 2 — Explain AI recommendations

Never simply say “Recommended.” Tell the user why.

### Principle 3 — Keep the original document accessible

Users should always be able to verify the AI result.

### Principle 4 — Never hide uncertainty

If AI is unsure, say so.

### Principle 5 — Don't create legal fear

Risk detection should be informative, not alarming.

### Principle 6 — One document, many services

Users should not need to upload the same document repeatedly.

### Principle 7 — Language is a control

Users can change the AI answer language at any time.

### Principle 8 — Guest-first

Let users experience the core value before asking them to create an account.

### Principle 9 — Mobile matters

Every important feature must work comfortably on mobile.

### Principle 10 — Trust is part of the UI

Privacy, source references, AI limitations, and transparent explanations should be visible parts of the experience.

---

# 46. Final Design Identity

The final website should feel like:

> **“A modern AI legal assistant that makes complicated legal documents understandable to everyone.”**

It should NOT feel like:
- an old-fashioned law firm website
- a complicated legal research platform
- a generic chatbot
- an overwhelming AI dashboard
- a colorful entertainment app

### Final visual character

**Professional:** ⚖️  
**Intelligent:** 🤖  
**Friendly:** 😊  
**Modern:** ✨  
**Trustworthy:** 🔒  
**Accessible:** 🌐

### Service-navigation character

The 8 services should feel like **modes of one intelligent legal workspace**, not eight unrelated tools.

The user should always be able to:
- See all 8 services directly above the chatbox.
- Switch services without leaving the document.
- Continue asking questions in the same chat/workspace.
- Keep the same uploaded document active.

---

# 47. Final Design Decision Summary

| Area | Final Choice |
|---|---|
| Overall personality | Professional + Modern AI + Friendly |
| Audience | Everyone |
| Homepage primary flow | Upload + Choose Service |
| Homepage style | Premium combination |
| Service presentation | Smart categories + AI recommendations |
| Service navigation | 8 services listed only above the chatbox; left sidebar has general navigation only |
| Upload UX | Simple upload + AI explanation |
| Post-upload flow | AI recommendation + all services |
| Processing | AI animation + step-by-step progress |
| Result | Report + AI conversation + interactive dashboard |
| Result layout | Responsive adaptive workspace |
| AI chat | Bottom chat box with all 8 services listed directly above it |
| Homepage colors | Blue + Purple |
| Background | White + subtle blue/purple |
| Logo | Modern law + AI symbol |
| Navigation | Simple public nav + dashboard after login |
| Authentication | Guest first + optional account |
| Language | Manual selector + automatic detection |
| Risk UI | Smart risk levels with explanations |
| Privacy | Security message + detailed privacy link |
| Disclaimer | Small result disclaimer + detailed limitations section |
| Actions | Download + Share + Ask AI + Language + Try another service + View Original |
| Responsive design | Desktop + Tablet + Mobile |
| Core CTA | **Upload & Understand** |

---

# 48. One-Line Product Experience

**Upload a legal document → AI understands it → recommends what may help → user chooses a service → AI explains the result clearly → user can ask questions, check risks, translate, download, share, or continue analyzing the same document.**

This should be treated as the foundation for the website's wireframes, high-fidelity UI, frontend component system, and final UX implementation.


---

# 49. Implementation Checklist for the New Service Layout

Before considering the UI implementation complete, verify:

- [ ] Left sidebar contains **no legal AI service names**.
- [ ] Left sidebar contains only general navigation.
- [ ] All 8 services appear together above the chatbox.
- [ ] All 8 services have icons and simple names.
- [ ] Selected service has a clear active state.
- [ ] Clicking a service changes the AI/chat context.
- [ ] The current document remains active when switching services.
- [ ] Re-uploading is not required when switching services.
- [ ] AI recommendations appear in the main workspace, not the sidebar.
- [ ] All 8 services remain available even when AI recommends only some of them.
- [ ] The service picker works on desktop, tablet, and mobile.
- [ ] The chat input remains directly below the service picker.
- [ ] No duplicate service navigation is introduced elsewhere.
- [ ] All other previously selected UI/UX decisions remain unchanged.

## Final implementation rule

> **General navigation belongs in the left sidebar. All 8 legal AI services belong directly above the AI chatbox.**


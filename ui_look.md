Yes — your confusion is actually about product UX, not the AI templates.

The important idea is:

Do NOT make the user “choose a service” before understanding the document.

Let the app understand the uploaded document first, then present the most useful actions for that document. The chat remains the central interface, while service buttons act like shortcuts.

1. The workflow I recommend

Think of your app as:

Upload → Understand → Suggest actions → User chooses → Result appears in chat/workspace → Next actions remain available

Not:

Upload → 8 pages → choose page → result → go back → choose another page

That second design will feel like a normal college project.

2. The actual UI

I would make it look roughly like this:

┌──────────────────────────────────────────────────────────────┐
│  ⚖ LegalAI                                  Profile   ⚙      │
├───────────────┬──────────────────────────────────────────────┤
│               │                                              │
│  + New Chat   │   Commercial Lease Agreement.pdf             │
│               │   ─────────────────────────────────────      │
│  Documents    │                                              │
│  ├─ Lease.pdf │   🤖 LegalAI                                 │
│  ├─ Order.pdf │                                              │
│  └─ Contract  │   I've analyzed your document.               │
│               │   What would you like to know?               │
│               │                                              │
│  History      │   ┌────────────┐ ┌────────────┐              │
│               │   │ Understand │ │ Summarize  │              │
│               │   └────────────┘ └────────────┘              │
│               │                                              │
│               │   ┌────────────┐ ┌────────────┐              │
│               │   │ Key Info   │ │ Detect Risk │              │
│               │   └────────────┘ └────────────┘              │
│               │                                              │
│               │   ┌────────────┐ ┌────────────┐              │
│               │   │ Simplify   │ │ Ask Doc    │              │
│               │   └────────────┘ └────────────┘              │
│               │                                              │
│               │   ┌────────────┐ ┌────────────┐              │
│               │   │ Judgment   │ │ 🎙 Voice   │              │
│               │   └────────────┘ └────────────┘              │
│               │                                              │
│               │                                              │
│               │        Ask anything about this document...   │
│               │                              🎤   ➤          │
└───────────────┴──────────────────────────────────────────────┘

But don't always show all 8 buttons equally.

That's important.

3. After upload — automatically classify the document

Suppose user uploads:

Employment_Agreement.pdf

The system detects:

Document type:
Employment Contract

Pages:
14

Language:
English

Jurisdiction:
India / detected if available

Status:
Ready

Then the AI says:

I've analyzed your Employment Agreement. What would you like to do?

And shows:

⭐ Recommended

[ Summarize ]
[ Key Information ]
[ Detect Risks ]

More actions

[ Understand ]
[ Simplify / Translate ]
[ Ask Document ]
[ Compare ]

For a court judgment:

⭐ Recommended

[ Summarize Judgment ]
[ Understand Decision ]
[ Simplify ]

More actions

[ Key Information ]
[ Ask Document ]
[ Translate ]
[ 🎙 Voice Assistant ]

This makes the system feel intelligent.

The user doesn't need to know:

"Which AI service should I call?"

They simply think:

"I uploaded my document. What can I do with it?"

4. Don't make the 8 services permanent navigation

This is where I would change your current thinking.

Your 8 services are your product capabilities.

They don't have to become:

Home
Service 1
Service 2
Service 3
...
Service 8

Instead:

                 LEGAL AI WORKSPACE
                        │
              ┌─────────┴─────────┐
              │                   │
           DOCUMENT              CHAT
              │                   │
       ┌──────┴──────┐            │
       │             │            │
   Quick Actions     Results ◄────┘

The workspace is the product.

The 8 services are capabilities inside it.

5. What happens when the user clicks "Summarize"?

This is the critical part.

Don't navigate them to another page.

Stay in the same conversation.

Before
AI:

I've analyzed your document.

What would you like to do?

[Summarize]
[Key Information]
[Detect Risks]
...

User clicks:

Summarize

Then:
USER

Summarize this document

Then AI response:

LEGAL DOCUMENT SUMMARY

Document: Employment Agreement

📌 Overview
This agreement establishes the employment relationship
between the employer and employee...

👥 Parties
• Employer: ABC Technologies
• Employee: [Name]
• Position: Software Developer

📅 Important Dates
• Start Date: 1 June 2026
• Agreement Duration: 12 months

⚖ Key Terms
• Probation: 6 months
• Notice Period: 60 days
• Working Hours: ...

────────────────────────

📚 Sources

Page 2 · Section 3
Page 5 · Section 7
Page 8 · Section 12

Then immediately below the answer:

What would you like to do next?

[ Extract Key Information ]
[ Detect Risks ]
[ Simplify in Tamil ]
[ Ask about this document ]

                    Ask anything...
This is the key UX pattern.

The service buttons move with the conversation.

6. So should the options appear again?
YES.

But not as the exact same giant 8-button panel every time.

Use two levels.

Initial document actions

Show the major capabilities:

[ Understand ]
[ Summarize ]
[ Key Information ]
[ Detect Risks ]
[ Simplify / Translate ]
[ Ask Document ]
[ Judgment ]
[ Voice ]
After a result

Show contextual next actions.

For example:

After Summary:

Next:

[ Detect Risks ]
[ Extract Obligations ]
[ Simplify ]
[ Ask a Question ]

After Risk Detection:

Next:

[ Explain this Risk ]
[ Show Source ]
[ Simplify ]
[ Ask Document ]

After Tamil Simplification:

Next:

[ English Version ]
[ Ask Question in Tamil ]
[ Voice ]
[ Show Original Clause ]

This dramatically reduces cognitive load.

7. Your chat should be the "universal interface"

This is where your project can feel much more advanced than a collection of tools.

The user should be able to say:

"Summarize this."

or click:

Summarize

Both should produce the same service.

Likewise:

User types:
"இந்த document-ஐ simple Tamil-ல explain பண்ணுங்க"

             ↓

Multilingual Legal Simplification

or

User clicks:

[ Simplify / Translate ]

             ↓

Multilingual Legal Simplification

Same backend service.

Two ways to access it:

             LEGAL AI
                 │
       ┌─────────┴─────────┐
       │                   │
     BUTTON               CHAT
       │                   │
       └─────────┬─────────┘
                 ↓
          SAME SERVICE API

That is the right architecture.

8. The document viewer should be beside the chat

For your project, I strongly recommend a 3-zone desktop layout during document analysis.

┌─────────────────────────────────────────────────────────────┐
│                         LegalAI                              │
├──────────────┬─────────────────────────┬────────────────────┤
│              │                         │                    │
│ Documents    │      DOCUMENT           │      AI CHAT       │
│              │                         │                    │
│ Lease.pdf    │   ┌─────────────────┐   │ 🤖 Summary...      │
│ Order.pdf    │   │                 │   │                    │
│ Contract.pdf │   │  PDF PAGE       │   │ 📌 Key findings     │
│              │   │                 │   │                    │
│              │   │                 │   │ 📚 Page 4          │
│              │   │                 │   │                    │
│              │   │                 │   │ [Explain]           │
│              │   │                 │   │ [Show source]       │
│              │   └─────────────────┘   │                    │
│              │                         │ Ask anything...    │
└──────────────┴─────────────────────────┴────────────────────┘

But on mobile:

Document
   ↓
Chat
   ↓
Actions

instead of three columns.

9. The most important feature: source clicking

Suppose AI says:

The tenant may terminate the agreement with 60 days' notice.

Show:

The tenant may terminate the agreement
with 60 days' notice.     [📄 Page 7]

When the user clicks:

Page 7

the PDF viewer automatically moves to page 7 and highlights the relevant text.

So:

AI Answer
   │
   │ click citation
   ↓
PDF Page 7
   │
   ↓
Highlighted original clause

This makes the system feel like a real legal document intelligence system, rather than just ChatGPT summarizing text.

10. Your 8 services should actually behave differently

Here's how I would map them into the UX.

Service	User interaction
Document Understanding	Initial automatic analysis + overview
Summarization	Structured result card
Clause & Key Information Extraction	Tables/cards + source links
Risk Detection	Risk cards with severity + explanation
Multilingual Simplification	Language selector + simplified output
Document Q&A	Normal chat conversation
Judgment & Order Understanding	Judgment-specific structured analysis
Voice Assistant	Voice layer over chat/simplification/Q&A

Notice something?

Voice isn't really another "page."

It's an interaction mode.

That's okay. Your SIH service list can still call it a service/capability, while UX treats it as a mode.

11. The best first-time user journey

Imagine a citizen who knows nothing about legal AI.

Step 1

Landing page:

              ⚖ LegalAI

Understand complex legal documents
in simple language.

       ┌─────────────────────┐
       │  📄 Upload Document │
       └─────────────────────┘

   PDF • DOCX • Images

Don't show 8 services here.

Step 2

User uploads:

Rental_Agreement.pdf

Progress:

Uploading...

✓ Document received
✓ Reading document
✓ Identifying structure
✓ Understanding clauses

Ready
Step 3

AI automatically responds:

I've analyzed your Rental Agreement.

Document type:
Residential Lease Agreement

14 pages · English

I can help you with:

⭐ Recommended

[ Summarize ]
[ Key Information ]
[ Detect Risks ]

Other actions

[ Simplify ]
[ Ask Document ]
[ Translate ]
Step 4

User clicks:

Detect Risks

No page change.

Chat response:

🔴 3 potential risks found

1. High
   Early termination penalty

   The agreement may require payment
   if the tenant leaves before...

   📄 Page 9 · Clause 14

   [View clause] [Explain]

2. Medium
   Security deposit conditions

   📄 Page 3 · Clause 5

3. Low
   Notice period ambiguity

   📄 Page 8 · Clause 11

Then:

What would you like to explore?

[ Explain Risk 1 ]
[ Show Key Obligations ]
[ Simplify in Tamil ]
[ Ask a Question ]
12. Then the user asks a completely different question

They type:

"இந்த agreement-ல நான் வீட்டை விட்டுப் போக எவ்வளவு days முன்னாடி சொல்லணும்?"

The app should not force them to select a service.

It understands:

Intent:
Document Q&A

Language:
Tamil

Topic:
Termination / Notice Period

Then:

🤖 இந்த agreement-ன் Clause 11 படி,
வீட்டை காலி செய்வதற்கு முன்பு 60 நாட்களுக்கு
முன்னதாக notice கொடுக்க வேண்டும்.

📄 Page 8 · Clause 11

[View source]

And underneath:

[ Explain this clause ]
[ Translate to English ]
[ Check related risks ]

That's the experience you want.

13. For judgments, make the UI automatically change

Upload:

Supreme_Court_Judgment.pdf

Instead of generic contract buttons:

Supreme Court Judgment

✓ Judgment detected

[ Summarize Judgment ]
[ What did the Court decide? ]
[ Key Issues ]
[ Simplify Judgment ]
[ Ask the Judgment ]
[ Translate ]
[ 🎙 Explain by Voice ]

Then the result could look like:

JUDGMENT UNDERSTANDING

📌 Case
...

⚖ Court
Supreme Court of India

📅 Date
...

👥 Parties
...

━━━━━━━━━━━━━━━━━━

1. Background
...

2. Legal Issues
...

3. Arguments
...

4. Court's Reasoning
...

5. Final Decision
...

6. Practical Meaning
...

📚 Evidence
Page 12
Page 18
Page 24

That directly screams:

"We built this for the SIH problem statement."

14. One thing I would NOT do

Don't make this:

Dashboard

┌─────────┐ ┌─────────┐
│Summary  │ │Clauses  │
└─────────┘ └─────────┘

┌─────────┐ ┌─────────┐
│Risks    │ │Translate│
└─────────┘ └─────────┘

┌─────────┐ ┌─────────┐
│Compare  │ │Draft    │
└─────────┘ └─────────┘

Then clicking Summary takes you to:

Summary Page
Upload document
Generate

Then back.

Then Risk page.

Then back.

That's tool-based software.

You want:

document-centered conversation.

15. Your actual application hierarchy

I would structure it like this:

                         LEGAL AI
                            │
              ┌─────────────┴─────────────┐
              │                           │
        DOCUMENT WORKSPACE             HISTORY
              │
       ┌──────┴──────┐
       │             │
    PDF VIEWER      CHAT
       │             │
       │       ┌─────┴──────┐
       │       │            │
       │    AI ANSWER    USER INPUT
       │       │
       │       ↓
       │  CONTEXTUAL ACTIONS
       │
       └───────────────┐
                       ↓
                EVIDENCE / SOURCE

And the 8 capabilities sit underneath:

                  DOCUMENT WORKSPACE
                         │
       ┌─────────────────┼──────────────────┐
       ↓                 ↓                  ↓
 Understand          Summarize          Extract
       ↓                 ↓                  ↓
 Risk Detection    Simplify/Translate    Q&A
       ↓                 ↓
 Judgment Analysis     Voice
16. The "magic" part: don't ask unnecessary questions

Your app should progressively understand the user's intention.

Instead of:

Select service → select language → select document → select section → enter question

Do:

UPLOAD
  ↓
AUTO-DETECT
  ↓
RECOMMEND
  ↓
ONE CLICK
  ↓
RESULT
  ↓
NEXT RELEVANT ACTION
  ↓
CHAT ANYTIME

This is much simpler.

17. The final UX I would build for your SIH MVP
Screen 1 — Welcome
Upload your legal document

[ Upload ]

"Understand judgments, contracts
and legal documents in simple language."
Screen 2 — Workspace
┌─────────┬───────────────────────┬───────────────┐
│ Files   │ PDF                   │ AI Assistant  │
│         │                       │               │
│         │                       │               │
│         │                       │               │
│         │                       │               │
│         │                       │               │
│         │                       │               │
└─────────┴───────────────────────┴───────────────┘
Screen 3 — AI detects document
✓ Employment Contract detected

Recommended:

[ Summarize ]
[ Key Information ]
[ Detect Risks ]

More:

[ Simplify ]
[ Ask Document ]
[ Translate ]
Screen 4 — Result
USER
Summarize

AI
━━━━━━━━━━━━━━━━
Summary
...
━━━━━━━━━━━━━━━━

📚 Sources
Page 2
Page 5
Page 9

Next:
[ Detect Risks ]
[ Key Information ]
[ Simplify ]
Screen 5 — Continuous conversation
USER
இந்த contract-ல என்ன risk இருக்கு?

AI
🔴 Potential Risks

1. ...
2. ...
3. ...

📄 Page 8

Next:
[ Explain Risk ]
[ Show Clause ]
[ Summarize ]
Screen 6 — Voice

User taps 🎙:

"இந்த judgment-ஐ simple Tamil-ல explain பண்ணுங்க."

AI responds in Tamil and speaks it.

18. The golden rule for your frontend team

Give them this exact principle:

The user should never need to understand our 8 services. They should only need to understand what they want to do with their document.

So the frontend should present:

"What do you want to do?"

not:

"Which AI microservice do you want to invoke?"

And after every action:

"What would you like to do next?"

with 2–4 contextually relevant buttons.

The final product in one sentence

Your app should feel like:

ChatGPT + PDF viewer + legal document actions + evidence citations, where the uploaded document becomes the center of the conversation and the 8 services appear as intelligent contextual actions.

That is the workflow I would lock for your SIH MVP. It keeps your 8-service architecture, but makes the actual user experience one simple conversation instead of eight separate tools.
teams work


Legal AI — 2-Team Service Split
Overall structure

Both teams work on the same Legal AI Workspace.

                    LEGAL AI WORKSPACE
                           │
              ┌────────────┴────────────┐
              │                         │
          TEAM 1 SERVICES           TEAM 2 SERVICES
              │                         │
              └────────────┬────────────┘
                           │
                    Same AI Workspace
                           │
                    Same Document
                           │
                     Same AI Chat

The teams build separate services, but every service sends its result back to the same workspace so everything can be merged cleanly.

👥 TEAM 1 — Core Legal Document Intelligence

Focus: Understand, analyze, review and manage legal documents.

#	Service	What the service does	Required outcome
1	📄 Document Upload & Understanding	Accept legal documents and understand what type of document it is and what information it contains.	Uploaded document becomes usable inside the Legal AI Workspace.
2	🔍 Legal Document Analysis	Analyze the document and identify its important legal information.	Clear overall understanding of the document.
3	📑 Document Summary	Convert a long legal document into its important points.	Short, clear summary of the document.
4	🧩 Clause Extraction	Find important clauses such as termination, payment, liability, indemnity and confidentiality.	Organized list of important clauses with their locations.
5	🏷️ Legal Information Extraction	Extract parties, dates, amounts, contract duration and other important details.	Structured key information from the document.
6	⚠️ Risk Detection	Identify potentially risky, missing, unusual or unfavorable terms.	List of risks with the relevant document sections.
7	📊 Compliance Analysis	Check the document for relevant compliance requirements and potential issues.	Clear compliance findings and areas requiring attention.
8	🔄 Document Comparison	Compare two legal documents or two versions of the same document.	Clear list of additions, removals and changes.
9	🔔 Obligation & Deadline Tracking	Identify responsibilities, renewal dates, termination periods and other deadlines.	Actionable list of obligations and important dates.
10	🔎 Legal Document Search	Find specific information across the user's stored documents.	Relevant documents and exact information quickly found.
11	📚 Legal Knowledge Assistant	Answer questions using the user's available legal documents and stored knowledge.	Answers grounded in the user's legal information.
12	✍️ Legal Document Drafting	Create new legal documents or generate required legal clauses.	Usable first draft of the requested legal document/clause.
13	✏️ Clause Rewriting	Rewrite existing clauses into clearer or requested wording.	Improved/revised clause ready for user review.
14	👥 Document Collaboration	Allow users or teams to review, comment and work on legal documents together.	Shared document review and collaboration.
15	🔐 Audit & Activity History	Keep track of document-related activities and changes.	Clear history of what happened to each document.
👥 TEAM 2 — Accessible & Indian Legal AI

Focus: Make legal information understandable and accessible to ordinary Indian users.

#	Service	What the service does	Required outcome
1	💬 AI Legal Chat	Allow users to discuss legal topics normally or ask questions about uploaded documents.	One conversational interface for legal questions and document questions.
2	🌐 Legal Document Translation	Translate legal documents and their explanations into supported Indian languages.	Understandable regional-language version of the legal content.
3	🔤 Regional Language Output	Display legal information correctly in Tamil, Hindi, Telugu, Kannada and other supported scripts.	Proper readable Indian-language output throughout the workspace.
4	🧑‍⚖️ Plain-Language Explanation	Convert complex legal language into simple language for ordinary users.	User understands what the legal document actually means.
5	⚖️ Judgment Summarization	Summarize Indian court judgments and court orders into important points.	Easy-to-understand summary of the judgment/order.
6	📷 Scanned Legal Document Understanding	Read scanned PDFs, court orders, images and other documents without selectable text.	Scanned legal documents become usable for the other AI services.
7	🔊 Legal Voice / Audio	Read legal answers, summaries, translations and explanations aloud.	Users can listen to legal information instead of only reading it.
8	🛡️ Accuracy & Legal Safeguards	Show supporting sources, indicate uncertainty and clearly communicate that AI output is informational.	More trustworthy and responsible AI answers.
🔗 How the two teams merge

The important part is that Team 1 and Team 2 should not build separate applications.

They both operate on the same document inside the workspace.

Example

User uploads:

Court_Order.pdf

                    USER
                      │
                      ▼
              LEGAL AI WORKSPACE
                      │
                      ▼
                Uploaded File
                      │
          ┌───────────┴───────────┐
          │                       │
       TEAM 1                   TEAM 2
          │                       │
   Document Analysis        Scanned Document
   Information Extraction   Understanding
   Summary                  Judgment Summary
   Search                   Translation
   Risk                     Simple Explanation
   Clauses                  Voice
          │                       │
          └───────────┬───────────┘
                      │
                      ▼
              SAME WORKSPACE
                      │
                      ▼
                 AI CHAT
💬 Example of the final user experience

The user uploads a document and simply says:

"Explain this document to me in Tamil."

The workspace uses:

Team 1
→ Understand document

Team 2
→ Translate + simplify

Then the result appears in the same chat/workspace.

User asks:

"Is there anything risky?"

→ Team 1 Risk Detection.

User asks:

"Which page says this?"

→ Document information + source reference.

User asks:

"Read this explanation."

→ Team 2 Voice service.

So the user experiences one AI assistant, while internally the two teams provide different services.

Final split

TEAM 1 = Legal Intelligence & Document Management

Understand → Extract → Analyze → Review → Compare → Track → Create → Manage

TEAM 2 = Legal Accessibility & Indian Legal Experience

Chat → Translate → Simplify → Regional Language → Court Judgments → Scanned Documents → Voice → Trust/Safety

Outcome: Both teams can develop independently, but their services all return results to the same Legal AI Workspace, making the final application feel like one unified product, not two separate systems.
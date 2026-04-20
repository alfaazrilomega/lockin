# LockIn Dashboard Audit: Master Feature & Workflow Guide

This document serves as the "Master Feature & Workflow Guide" for the LockIn productivity platform. It maps the interconnected modules—including Projects, Notes, Flashcards, and Task management—into a structured guide that explains the synergy, user journeys, and advanced technical capabilities of each feature.

---

## 🏗️ 1. Platform Architecture: The Power-User Hierarchy
LockIn is structured for high-performance scale, using a multi-layered hierarchy that ensures clarity even in the most complex workspaces.

| Level | Component | Purpose |
| :--- | :--- | :--- |
| **0** | **Workspace** | The top-level container for all projects, files, and members. |
| **1** | **Projects** | Primary mission containers (e.g., "Platform Redesign"). |
| **2** | **Epics** | Strategic high-level themes within a project. |
| **3** | **Milestones** | Key progress checkpoints that group specific tasks. |
| **4** | **Tasks** | The atomic unit of work—highly configurable with story points and priorities. |

---

## 🚀 2. Core Feature Deep-Dive

### 📂 Smart Project & Task Management
The project management module is more than a list; it is a **gated quality-control engine**.
- **Jira-Style Kanban**: A high-speed drag-and-drop interface optimized with standard stages: `To-Do`, `In-Progress`, `Review`, `Revision`, and `Done`.
- **Proof-of-Work Gate**: Tasks cannot enter "Review" without a mandatory submission of Proof URLs or Notes, ensuring accountability.
- **Revision Feedback Loop**: If a task is moved to "Revision," the system mandates leader feedback, creating a clear audit trail of requirements.
- **Story Point Velocity**: Tracks effort values to help teams understand their delivery capacity.

### 📝 AI-Powered Notes & Wiki
Notes in LockIn are designed for rapid knowledge capture and long-term retention.
- **Hierarchical Wiki**: Notes support parent-child relationships, allowing you to build complex documentation structures.
- **Groq-Powered Transcription**: Convert voice recordings to text instantly using the **Groq Whisper-large-v3** engine. 
- **Automatic Metadata**: Captures meeting dates and links notes directly to specific Projects or Epics.

### 🧠 Smart Flashcards (SRS System)
LockIn transforms passive reading into active learning.
- **AI Deck Generation**: Uses **OpenRouter (Minimax 2.5)** to analyze your notes or transcripts and instantly generate high-yield study cards.
- **Spaced Repetition (SRS)**: Implements a specialized study algorithm (based on SM-2) that calculates `EaseFactor` and `Intervals`, ensuring you review cards exactly when you're about to forget them.

### 🖼️ Vision-AI File Storage
The Files module isn't just storage—it's an intelligent analyst.
- **Multimodal Vision Analysis**: Upload an image (whiteboard, diagram, or handwritten doc), and **Gemini-2.5-Flash** will perform an OCR extraction and explain the contents.
- **AI Document Summaries**: Every uploaded file is processed to create a professional summary of its purpose and key points.

### 🗓️ Unified workspace scheduling
- **Cross-Module Sync**: The calendar automatically synchronizes **Task Deadlines** and **Note Meeting Dates**.
- **Visual Categorization**: Differentiates between `Meetings` (Notes), `Deadlines` (Tasks), and personal schedules with color-coded high-contrast badges.

---

## ⚡ 3. The "God-Tier" Synergies (Workflows)

The true power of LockIn lies in how these features communicate with each other.

### A. The "Meeting-to-Action" Workflow
1. **Record**: Capture a project meeting audio within a **Note**.
2. **Transcribe**: Trigger the Groq AI to generate a full transcript.
3. **Action**: Convert key transcript points into **Tasks** with story points in the project Kanban.
4. **Schedule**: The meeting date and task deadlines automatically appear on the **Unified Calendar**.

### B. The "Reference-to-Retention" Workflow
1. **Upload**: Drop a textbook diagram or lecture slide into **Files**.
2. **Vision Extraction**: AI extracts the text and concepts into a **Note**.
3. **Generate**: Trigger "Generate Flashcards" from that Note.
4. **Master**: Use the **SRS Review** system to memorize the concepts without manual data entry.

### C. The "Vetted Delivery" Workflow
1. **Development**: Complete a complex task in "In-Progress."
2. **Submission**: Drag the task to "Review" and attach your work via the **Proof-of-Work Gate**.
3. **QA**: The lead reviews, provides feedback, or moves it to "Done" via the project board metrics.

---

## 🛠️ Technical Specs (For Development Reference)
- **Frontend**: Next.js 16 (App Router), Tailwind CSS, Shadcn UI.
- **Backend/ORM**: Prisma with PostgreSQL.
- **Real-time**: Supabase Auth & Storage.
- **AI Engines**: 
  - **Transcription**: Groq (Whisper-v3)
  - **Generation**: OpenRouter (Minimax 2.5)
  - **Vision/OCR**: Google Gemini-2.5-Flash

# RAG-Based AI Resume Analyzer

An advanced, client-side Retrieval-Augmented Generation (RAG) Resume Analyzer web application that evaluates uploaded resumes against ATS standards and target job descriptions to produce detailed mistake detection, actionable bullet point rewrites, keyword gap analysis, and comprehensive ATS scoring.

---

## 🏗️ System Architecture & RAG Workflow

The application operates entirely on the client side with zero latency, utilizing a lightweight TF-IDF and Cosine Similarity vector engine to match parsed resume chunks against an embedded ATS Knowledge Base and target Job Description requirements.

```
                    +--------------------------------+
                    | Upload Resume (PDF / TXT / MD) |
                    +---------------+----------------+
                                    |
                                    v
                     +--------------+---------------+
                     | Text Extractor & PDF Parser  |
                     +--------------+---------------+
                                    |
                                    v
                     +--------------+---------------+
                     | Structural & Bullet Chunker  |
                     +--------------+---------------+
                                    |
                                    v
   +--------------------+  Vector Matching  +---------------------+
   | Target JD / Role   |==================>| RAG Context Engine  |
   | Requirements Vector|   Cosine Sim.     | (Top-K Context)     |
   +--------------------+                   +----------+----------+
                                                       |
                                                       v
                                            +----------+----------+
                                            |  5-Pillar ATS Engine|
                                            +----------+----------+
                                                       |
        +------------------+------------------+--------+---------+------------------+
        |                  |                  |                  |                  |
        v                  v                  v                  v                  v
+---------------+  +---------------+  +---------------+  +---------------+  +---------------+
| ATS Score &   |  | Categorized   |  | Actionable AI |  | Keyword Gap   |  | Interactive   |
| 5-Pillar Gauge|  | ATS Mistakes  |  | Bullet Rewrites| | Analysis      |  | Resume Heatmap|
+---------------+  +---------------+  +---------------+  +---------------+  +---------------+
```

---

## 🌟 Key Features

1. **Client-Side RAG Engine**: Performs semantic section chunking, vector indexing, and context retrieval directly in the browser with 100% data privacy.
2. **Multi-Pillar ATS Score Meter (0-100)**:
   - **Impact & Quantification (30%)**: Calculates metrics density (%, $, user count, performance stats).
   - **Keyword Match & Relevance (25%)**: Matches terms against target role vectors and job posts.
   - **ATS Formatting & Readability (20%)**: Validates standard section names and bullet word counts.
   - **Brevity & Action Verbs (15%)**: Detects weak passive phrases vs. strong lead-in power verbs.
   - **Section Completeness (10%)**: Ensures presence of Email, Phone, LinkedIn/GitHub, Experience, and Education.
3. **Categorized Mistake Inspector**:
   - Classifies issues into **Critical Blockers** (Red), **Warnings** (Amber), and **Improvements** (Blue).
   - Highlights exact resume quotes, explains why it hurts ATS scoring, and offers step-by-step fix recommendations.
4. **Side-by-Side Actionable Bullet Rewrites**:
   - Replaces weak lead-in verbs with high-impact power action verbs (*spearheaded, engineered, optimized*).
   - Injects metrics prompts and provides a 1-click **Copy Rewritten Bullet** button.
5. **Keyword Gap Matrix**:
   - Displays found keywords vs. missing keywords with a 1-click **Copy All Missing Keywords** button.
6. **Interactive Resume Heatmap**:
   - Highlights section strength visually (Green for strong metrics/verbs, Amber/Red for weak lead-ins).
7. **Export & Report Downloads**:
   - Download formatted **PDF Audit Reports** or raw **JSON Data**.
8. **Sample Resumes & Optional Gemini Key Integration**:
   - Includes pre-loaded sample resumes for instant 1-click testing, and an optional Google Gemini API key dialog for live LLM text synthesis.

---

## 📂 Project Structure

```
rag-resume-analyzer/
├── index.html                      # HTML entrypoint with font imports & CSS configuration
├── package.json                    # Project dependencies & script commands
├── vite.config.js                  # Vite bundler configuration
├── src/
│   ├── main.jsx                    # React application root
│   ├── App.jsx                     # Core application layout & state management
│   ├── index.css                   # Custom styling & keyframe animations
│   ├── components/
│   │   ├── Header.jsx              # Top navbar with logo, API key modal trigger, reset/export
│   │   ├── ResumeUploader.jsx      # PDF/TXT drag-and-drop & sample selector
│   │   ├── JobDescriptionInput.jsx # Target role dropdown & JD editor
│   │   ├── ScoreGauge.jsx          # Circular ATS score gauge & 5-pillar progress bars
│   │   ├── MistakesList.jsx        # Filterable categorized ATS blockers
│   │   ├── ImprovementsList.jsx    # Side-by-side Before/After bullet point rewrites
│   │   ├── KeywordAnalysis.jsx     # Keyword match badges & 1-click copy
│   │   ├── ResumeHeatmap.jsx       # Interactive parsed section & bullet quality viewer
│   │   ├── ApiKeyModal.jsx         # Optional Google Gemini API key settings modal
│   │   └── ExportModal.jsx         # PDF and JSON export dialog
│   ├── rag/
│   │   ├── knowledgeBase.js        # ATS standards, power verbs, weak words & role profiles
│   │   ├── parser.js               # Client-side PDF & text parser
│   │   ├── chunker.js              # Section, bullet & job description chunker
│   │   ├── vectorStore.js          # TF-IDF vectorizer & cosine similarity engine
│   │   ├── retriever.js            # RAG top-K context retriever
│   │   └── analyzer.js             # ATS scoring, mistake detector & rewrite engine
│   └── data/
│       └── sampleResumes.js        # Pre-configured sample resumes for 1-click testing
```

---

## ⚙️ Prerequisites & Installation

Ensure you have **Node.js** (v18 or higher) installed on your machine.

### 1. Clone or Navigate to the Project Folder
```bash
cd C:\Users\vdman\.gemini\antigravity\scratch\rag-resume-analyzer
```

### 2. Install Dependencies
```bash
npm install
```

---

## 🚀 Steps to Run the Application

### Development Mode (Local Server)
To start the local development server with hot-reloading:

```bash
npm run dev
```

The application will run live at:
👉 **`http://localhost:3000/`**

---

### Production Build & Preview
To compile the production build:

```bash
npm run build
```

To preview the built production bundle locally:

```bash
npm run preview
```

---

## 💡 How to Use the App

1. **Select or Upload a Resume**:
   - Drag and drop a **PDF** or **TXT** resume file into the upload dropzone.
   - Or click **Try Samples** to load a pre-configured sample resume (e.g., *Junior Software Engineer (Needs Work)* or *Senior Full Stack Engineer*).
2. **Set Target Role & Job Description** *(Optional)*:
   - Select your target industry role (Software Engineer, Data Scientist, Product Manager, etc.).
   - Paste a specific Job Description to customize keyword gap analysis.
3. **Run RAG Analysis**:
   - Click **Analyze Resume & Generate ATS Score**.
   - Review your **Overall ATS Score**, **5-Pillar Breakdown**, **Detected Mistakes**, **Actionable AI Rewrites**, and **Keyword Gap Analysis**.
4. **Export Report**:
   - Click **Export Report** in the header to download a formatted **PDF Audit Report** or **JSON Data**.

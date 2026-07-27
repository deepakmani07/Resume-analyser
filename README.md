🏗️ System Architecture & RAG Workflow
The application operates entirely on the client side with zero latency, utilizing a lightweight TF-IDF and Cosine Similarity vector engine to match parsed resume chunks against an embedded ATS Knowledge Base and target Job Description requirements.



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

⚙️ Steps to Run the Project
1. Navigate to the Project Folder
bash


cd C:\Users\vdman\.gemini\antigravity\scratch\rag-resume-analyzer
2. Install Dependencies
bash


npm install
3. Run Development Mode
To launch the hot-reloading development server:

bash


npm run dev
Open your browser at 👉 http://localhost:3000/

4. Build for Production
To generate an optimized production bundle:

bash


npm run build
📂 Project Structure
src/rag/vectorStore.js: Client-side TF-IDF vectorizer & Cosine Similarity search engine.
src/rag/knowledgeBase.js: Built-in ATS guidelines, action verb dictionary, weak passive phrases, and role keyword profiles.
src/rag/parser.js: Client-side PDF parser built with pdfjs-dist.
src/rag/analyzer.js: 5-pillar ATS scoring algorithm (Impact, Keywords, Formatting, Brevity, Completeness), mistake detector & rewrite engine.
src/components/: Modular UI components for Score Gauge, Mistakes Inspector, Before/After AI Rewrites, Keyword Analysis, and PDF/JSON Export.

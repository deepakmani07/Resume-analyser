// Knowledge Base of ATS Standards, Power Verbs, Weak Verbs, and Role Skill Vectors

export const STANDARD_SECTION_HEADERS = [
  { name: 'Contact Information', keywords: ['contact', 'email', 'phone', 'linkedin', 'github', 'location', 'address'] },
  { name: 'Professional Summary', keywords: ['summary', 'profile', 'objective', 'about me', 'executive summary'] },
  { name: 'Work Experience', keywords: ['experience', 'work experience', 'employment', 'work history', 'professional experience', 'career history'] },
  { name: 'Skills', keywords: ['skills', 'technical skills', 'core competencies', 'technologies', 'proficiencies', 'expertise'] },
  { name: 'Education', keywords: ['education', 'academic history', 'qualifications', 'degrees', 'university', 'college'] },
  { name: 'Projects', keywords: ['projects', 'personal projects', 'key projects', 'open source'] },
  { name: 'Certifications', keywords: ['certifications', 'licenses', 'credentials', 'certificates'] }
];

export const POWER_ACTION_VERBS = {
  leadership: [
    'spearheaded', 'orchestrated', 'directed', 'championed', 'pioneered', 'governed',
    'mobilized', 'steered', 'mentored', 'galvanized', 'overhauled', 'consolidated'
  ],
  engineering: [
    'engineered', 'architected', 'implemented', 'refactored', 'optimized', 'deployed',
    'automated', 'debugged', 'containerized', 'integrated', 'benchmarked', 'provisioned'
  ],
  analytical: [
    'analyzed', 'forecasted', 'evaluated', 'quantified', 'scrutinized', 'isolated',
    'audited', 'synthesized', 'diagnosed', 'modeled', 'extracted', 'validated'
  ],
  impact: [
    'accelerated', 'amplified', 'surpassed', 'minimized', 'maximized', 'eliminated',
    'boosted', 'curtailed', 'elevated', 'expanded', 'generated', 'streamlined'
  ]
};

export const WEAK_PASSIVE_WORDS = [
  { word: 'worked on', alternative: 'engineered / executed / spearheaded', severity: 'warning' },
  { word: 'responsible for', alternative: 'managed / delivered / drove', severity: 'warning' },
  { word: 'helped with', alternative: 'assisted in / collaborated on / facilitated', severity: 'warning' },
  { word: 'handled', alternative: 'resolved / managed / executed', severity: 'warning' },
  { word: 'assisted', alternative: 'contributed to / co-developed', severity: 'warning' },
  { word: 'did', alternative: 'executed / performed / accomplished', severity: 'warning' },
  { word: 'tasked with', alternative: 'assigned to lead / entrusted with', severity: 'warning' },
  { word: 'involved in', alternative: 'contributed to / participated in', severity: 'warning' },
  { word: 'looked after', alternative: 'oversaw / maintained / supervised', severity: 'warning' },
  { word: 'tried to', alternative: 'strove to / initiative aimed at', severity: 'warning' }
];

export const ROLE_KEYWORD_PROFILES = {
  'Software Engineer': {
    technical: ['javascript', 'typescript', 'react', 'node.js', 'python', 'java', 'sql', 'git', 'docker', 'rest api', 'graphql', 'system design', 'ci/cd', 'aws', 'unit testing', 'microservices'],
    soft: ['problem solving', 'code review', 'agile', 'scrum', 'collaboration', 'cross-functional']
  },
  'Frontend Developer': {
    technical: ['javascript', 'typescript', 'react', 'vue', 'next.js', 'css3', 'html5', 'tailwind css', 'redux', 'web performance', 'responsive design', 'webgl', 'jest', 'vite', 'accessibility', 'a11y'],
    soft: ['ui/ux focus', 'cross-browser testing', 'design system architecture', 'teamwork']
  },
  'Data Scientist / AI Engineer': {
    technical: ['python', 'r', 'machine learning', 'deep learning', 'pytorch', 'tensorflow', 'scikit-learn', 'pandas', 'numpy', 'sql', 'data visualization', 'nlp', 'llm', 'rag', 'vector databases', 'feature engineering', 'statistics'],
    soft: ['data storytelling', 'analytical thinking', 'hypothesis testing', 'stakeholder presentation']
  },
  'Product Manager': {
    technical: ['product roadmap', 'agile', 'scrum', 'user research', 'a/b testing', 'kpis', 'okrs', 'wireframing', 'jira', 'mixpanel', 'google analytics', 'market research', 'feature prioritization'],
    soft: ['cross-functional leadership', 'stakeholder management', 'strategic thinking', 'user empathy']
  },
  'DevOps / Cloud Engineer': {
    technical: ['kubernetes', 'docker', 'terraform', 'aws', 'azure', 'gcp', 'ci/cd', 'jenkins', 'github actions', 'prometheus', 'grafana', 'bash', 'python', 'linux', 'infrastructure as code', 'networking'],
    soft: ['incident response', 'reliability engineering', 'continuous improvement', 'collaboration']
  },
  'Data Analyst': {
    technical: ['sql', 'excel', 'tableau', 'power bi', 'python', 'r', 'data cleaning', 'dashboards', 'etl', 'statistical analysis', 'google analytics', 'business intelligence'],
    soft: ['insight generation', 'attention to detail', 'communication', 'business acumen']
  }
};

export const ATS_BEST_PRACTICE_RULES = [
  {
    id: 'QUANTIFIABLE_METRICS',
    category: 'Impact & Quantification',
    name: 'Bullet Point Metrics Density',
    weight: 30,
    description: 'ATS parsers and recruiters prioritize resumes with measurable results (%, $, numerical growth, latency reduction, user count).'
  },
  {
    id: 'ACTION_VERBS',
    category: 'Brevity & Style',
    name: 'Strong Action Verb Lead-in',
    weight: 20,
    description: 'Every work experience bullet point should start with a strong, active verb in past or present tense.'
  },
  {
    id: 'KEYWORD_DENSITY',
    category: 'Keyword Relevance',
    name: 'Job Description Keyword Alignment',
    weight: 25,
    description: 'Resumes must contain exact tech stack and domain skill matches from the target role to pass ATS keyword filters.'
  },
  {
    id: 'SECTION_STRUCTURE',
    category: 'ATS Formatting',
    name: 'Standardized Section Headers',
    weight: 15,
    description: 'Use standard section titles like "Work Experience", "Education", and "Skills" so ATS parsers properly categorize your experience.'
  },
  {
    id: 'CONTACT_COMPLETENESS',
    category: 'Section Completeness',
    name: 'Contact Information Presence',
    weight: 10,
    description: 'Resumes must contain valid contact points: Email, Phone, Location, and professional links (LinkedIn/GitHub).'
  }
];

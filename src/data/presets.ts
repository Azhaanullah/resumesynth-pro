import { PresetData } from '../types';

export const PRESETS: Record<string, PresetData> = {
  backend: {
    id: 'backend',
    label: 'Backend Systems',
    role: 'Senior / Junior Backend Systems Engineer',
    company: 'Stripe',
    category: 'Engineering',
    jd: `Stripe · Junior / Mid Backend Systems Engineer

About the Role:
We are looking for a Systems Engineer to design, build, and maintain high-reliability backend services handling millions of financial events per day.

Key Requirements:
• Strong proficiency in Go, C++, or Java with deep understanding of distributed systems and microservices architecture.
• Extensive experience building and consuming REST APIs, gRPC, and managing Docker containerization.
• Hands-on familiarity with CI/CD automation pipelines, Redis in-memory caching, and Kafka event streaming.
• Solid grasp of ACID database transactions, concurrency, telemetry logging, and PostgreSQL performance tuning.
• Proven track record improving latency, horizontal scalability, and system resilience under peak load.`,
    resume: `## Summary
Backend Engineer with 2+ years of experience building fault-tolerant microservices, optimizing database transactions, and deploying cloud containers.

## Technical Skills
* Languages: Go, Python, C++, SQL
* Systems & Infra: Docker, Redis, PostgreSQL, Kafka, Linux, Git
* Protocols: REST APIs, gRPC, WebSockets

## Experience & Projects
* Developed high-throughput REST backend services in Go for a financial checkout service serving 4,200 active requests/sec.
* Integrated Docker containers to standardize local testing and reduced developer onboarding overhead by 40%.
* Implemented Redis in-memory cache to store session tokens, cutting database read latency by 45%.
* Designed relational schema with PostgreSQL ensuring reliable ACID transactions and indexed queries for 1.5M records.
* Automated CI/CD build verification workflows with GitHub Actions, reducing deployment failure rate from 12% to under 2%.`
  },
  fullstack: {
    id: 'fullstack',
    label: 'Full-Stack React & Node',
    role: 'Full Stack Software Engineer',
    company: 'Vercel / Airbnb',
    category: 'Full Stack',
    jd: `Airbnb · Full Stack Software Engineer (React / TypeScript / Node)

Responsibilities:
• Architect, build, and maintain web applications using React, TypeScript, Next.js, and Node.js.
• Develop responsive, accessible UIs utilizing Tailwind CSS, Component Systems, and GraphQL APIs.
• Implement robust serverless functions, state management (Zustand/Redux), and PostgreSQL / Supabase storage.
• Optimize Core Web Vitals, client-side caching, SEO, and test coverage using Jest and Playwright.
• Collaborate cross-functionally with UX designers, product managers, and backend platform teams.`,
    resume: `## Professional Summary
Full-Stack Developer passionate about crafting blazing-fast web experiences with React, TypeScript, and modern Node.js ecosystems.

## Technical Skills
* Frontend: React, Next.js, TypeScript, Tailwind CSS, Redux, HTML5/CSS3
* Backend: Node.js, Express, GraphQL, PostgreSQL, REST APIs
* Tooling & Testing: Jest, Cypress, Vite, Docker, Git

## Experience & Projects
* Spearheaded full-stack development of an interactive analytics platform using React, TypeScript, and Tailwind CSS, increasing user engagement by 35%.
* Built Node.js and GraphQL API gateway connecting 4 microservices with sub-50ms response times.
* Optimized Next.js page rendering and asset bundles, improving Google Lighthouse performance score from 68 to 96.
* Authored 120+ unit and end-to-end test suites with Jest and Cypress, ensuring 88% overall code coverage across core modules.`
  },
  aiml: {
    id: 'aiml',
    label: 'AI & Machine Learning',
    role: 'AI / Machine Learning Engineer',
    company: 'Anthropic / OpenAI',
    category: 'AI / ML',
    jd: `Anthropic · Machine Learning Engineer (LLMs & RAG)

Requirements:
• Strong programming expertise in Python, PyTorch, Hugging Face Transformers, and LangChain.
• Experience developing Retrieval-Augmented Generation (RAG) pipelines and fine-tuning Open-Source LLMs (Llama, Mistral).
• Hands-on proficiency with Vector Databases (Pinecone, Qdrant, ChromaDB) and semantic embedding indexing.
• Familiarity with MLOps pipelines, MLflow tracking, Docker containerized GPU inference, and vLLM / TensorRT acceleration.
• Solid background in statistical evaluation benchmarks, BLEU/ROUGE metrics, and hallucination reduction.`,
    resume: `## Profile
Machine Learning Engineer specializing in generative AI applications, vector search architectures, and high-throughput LLM serving.

## Core Competencies
* Machine Learning: PyTorch, Hugging Face, LangChain, Transformers, Scikit-Learn
* AI Systems: Vector Databases (Pinecone, ChromaDB), RAG architectures, Prompt Engineering, Fine-tuning
* Languages & Tools: Python, FastAPI, Docker, MLflow, Git, Linux

## Key Projects & Experience
* Built an enterprise semantic RAG assistant in Python using LangChain, ChromaDB, and FastAPI, querying 250k+ technical documents with 92% retrieval precision.
* Fine-tuned Llama-3-8B model on proprietary domain data using LoRA/PEFT, outperforming base model accuracy by 28% on benchmark tests.
* Deployed low-latency LLM inference service using vLLM and Docker on AWS EC2, slashing inference latency by 55% for concurrent requests.
* Implemented automated LLM evaluation pipeline tracking semantic drift, token latency, and hallucination rates via MLflow.`
  },
  devops: {
    id: 'devops',
    label: 'Cloud & DevOps SRE',
    role: 'DevOps / Cloud Platform Engineer',
    company: 'Datadog / AWS',
    category: 'Cloud & Infra',
    jd: `Datadog · Cloud Platform & DevOps Engineer (Kubernetes / AWS / Terraform)

Requirements:
• Deep experience managing cloud infrastructure on AWS, GCP, or Azure using Terraform (Infrastructure as Code).
• Strong expertise in Kubernetes (EKS/GKE), Helm charts, container orchestration, and ingress controllers.
• Proficiency in building automated CI/CD pipelines with GitHub Actions, GitLab CI, or ArgoCD.
• Hands-on monitoring and observability setup using Prometheus, Grafana, OpenTelemetry, and Datadog.
• Knowledge of Linux networking, zero-trust security policies, SSL/TLS, and disaster recovery automations.`,
    resume: `## Summary
Cloud Infrastructure Engineer with deep experience in automated Kubernetes clusters, Terraform IaC, and reliable 99.99% uptime architectures.

## Technical Skills
* Cloud & Infra: AWS (EKS, EC2, S3, RDS), Terraform, Kubernetes, Docker, Helm
* CI/CD & Observability: GitHub Actions, ArgoCD, Prometheus, Grafana, Datadog
* Scripting & OS: Bash, Python, Linux, Networking (TCP/IP, DNS, SSL)

## Experience & Projects
* Provisioned multi-region AWS cloud infrastructure using modular Terraform templates, standardizing 14 environments.
* Managed production Kubernetes (EKS) clusters hosting 60+ microservice deployments with automated horizontal pod autoscaling (HPA).
* Engineered GitOps deployment pipeline using ArgoCD and GitHub Actions, cutting release deployment cycle times from 45 minutes to 6 minutes.
* Configured Prometheus and Grafana dashboards with alert thresholds, resolving 95% of server degradation alerts before client impact.`
  },
  analytics: {
    id: 'analytics',
    label: 'Data Analytics',
    role: 'Associate Data Analyst Intern',
    company: 'Spotify',
    category: 'Data',
    jd: `Spotify · Associate Data Analyst Intern

Requirements:
• Experience with advanced SQL queries, window functions, CTEs, and data warehousing schema design (BigQuery / Snowflake).
• Working knowledge of Python, Pandas, NumPy, and exploratory statistical analysis.
• Proven track record building interactive Tableau or Power BI dashboards for executive stakeholder reporting.
• Familiarity with A/B hypothesis testing, statistical significance (p-values), and cohort user retention analysis.
• Strong written and verbal communication skills to translate complex data findings into actionable product decisions.`,
    resume: `## Academic Projects & Experience
* Built exploratory Python data analysis scripts using Pandas and NumPy over 1.2M public streaming events, uncovering top churn drivers.
* Designed normalized SQL databases with PostgreSQL to model user subscription lifecycles and cohort retention rates.
* Created interactive Tableau dashboards tracking monthly churn and subscriber conversions, reducing manual report compilation by 6 hours/week.
* Formulated A/B hypothesis experiments evaluating CTA button variants, measuring statistically significant 4.2% lift in free-to-paid conversions.`
  },
  pm: {
    id: 'pm',
    label: 'Product Manager',
    role: 'Associate Product Manager',
    company: 'Uber / Notion',
    category: 'Product',
    jd: `Notion · Associate Product Manager

Requirements:
• Demonstrated ability to write crisp Product Requirement Documents (PRDs) and user journey wireframes.
• Strong analytical mindset: experience tracking North Star metrics, Funnel Conversion, DAU/MAU, and NPS.
• Experience partnering with engineering and UX design teams in Agile/Scrum sprints.
• Experience running user discovery interviews, qualitative feedback synthesis, and market competitive analysis.
• Proven ability to prioritize roadmap backlogs using RICE or MoSCoW prioritization frameworks.`,
    resume: `## Product Summary
Product Manager with engineering foundation, passionate about building delightful, data-driven software that solves high-friction user problems.

## Skills & Frameworks
* Product Management: PRD Writing, Roadmap Planning, User Story Mapping, RICE Prioritization, Agile/Scrum
* Analytics: Amplitude, Mixpanel, Google Analytics, SQL, A/B Testing
* Design: Figma, Wireframing, User Journey Mapping

## Experience
* Led discovery and product delivery for a self-service onboarding flow, improving activation rate from 42% to 61% across 18,000 new users.
* Authored 10+ PRDs and aligned cross-functional squad of 6 engineers and 2 UX designers on quarterly roadmap deliverables.
* Conducted 24 in-depth user interviews to map payment checkout friction, reducing checkout drop-off by 14%.
* Set up automated tracking funnels in Mixpanel to measure feature retention and feature adoption metrics weekly.`
  }
};

import {
  Brain,
  Eye,
  Languages,
  ServerCog,
  ShieldCheck,
  Sparkles,
  Building2,
  Factory,
  GraduationCap,
  HeartPulse,
  Landmark,
  LineChart,
  Bot,
  DatabaseZap,
  FileSearch,
  FlaskConical,
  Globe2,
  HeartHandshake,
  Users
} from "lucide-react";
import { CompanyData, CompanyTimelineItem } from "./types";

export const aiCompany: CompanyData = {
    hero: {
        badge: "Artificial Intelligence Center",

        title: "Engineering Artificial Intelligence That Solves Real-World Problems",

        description: "The Evantra AI Center researches, engineers and deploys trustworthy artificial intelligence systems that empower healthcare, education, enterprise, government and scientific discovery. We transform cutting-edge AI research into practical solutions that improve lives while ensuring every AI system is secure, explainable and human-centered.",

        image: "/images/campus/ai-research-center.webp",

        primaryAction: {
            label: "Explore AI Solutions",
            href: "#solutions",
        },

        secondaryAction: {
            label: "View AI Research",
            href: "#research",
        },

        metrics: [
            {
                value: "20+",
                label: "AI Projects",
            },
            {
                value: "10+",
                label: "Research Initiatives",
            },
            {
                value: "6",
                label: "Core AI Domains",
            },
            {
                value: "Responsible",
                label: "AI First",
            },
        ],
    },

    featuredShowcase: {
        badge: "AI Innovation",
        title: "Transforming Healthcare with Intelligent Solutions",
        subtitle: "LabReport AI Platform",
        description: "Our flagship healthcare AI platform that simplifies laboratory report interpretation and connects patients with verified healthcare professionals.",
        image: "/images/products/labreport-ai.webp",
        highlights: [
            {
                title: "Report Interpretation",
                description: "AI-powered analysis of laboratory reports",
                icon: FileSearch,
            },
            {
                title: "Telemedicine Integration",
                description: "Secure communication with healthcare professionals",
                icon: HeartHandshake,
            },
            {
                title: "Multilingual Support",
                description: "Language assistance across multiple regions",
                icon: Languages,
            },
        ],
        primaryAction: {
            label: "Learn About LabReport AI",
            href: "#products",
        },
        metrics: [
            {
                value: "100+",
                label: "Healthcare Partners",
            },
            {
                value: "10K+",
                label: "Reports Analyzed",
            },
        ],
    },

    mission: {
        title: "Engineering Responsible Intelligence",

        description: "The Evantra AI Center researches and develops trustworthy artificial intelligence systems that solve real-world challenges across healthcare, education, enterprise and public services. We combine scientific research with engineering excellence to create secure, explainable and human-centered AI technologies.",
    },

    capabilities: [
        {
            title: "Generative Artificial Intelligence",

            description: "Designing enterprise copilots, intelligent assistants, AI agents and knowledge systems powered by modern large language models that automate workflows and enhance decision-making.",

            icon: Sparkles,

            tags: [
                "LLMs",
                "AI Agents",
                "RAG",
                "Automation",
            ],
        },

        {
            title: "Machine Learning",

            description: "Developing predictive models and intelligent analytics that help organizations uncover insights, optimize operations and make data-driven decisions.",

            icon: Brain,

            tags: [
                "Prediction",
                "Analytics",
                "Forecasting",
                "Optimization",
            ],
        },

        {
            title: "Computer Vision",

            description: "Engineering AI systems capable of understanding images, medical diagnostics, visual inspection, document intelligence and object detection.",

            icon: Eye,

            tags: [
                "Medical Imaging",
                "OCR",
                "Detection",
                "Vision AI",
            ],
        },

        {
            title: "Natural Language Processing",

            description: "Building multilingual conversational AI, intelligent search systems, document understanding and language technologies that improve communication.",

            icon: Languages,

            tags: [
                "NLP",
                "Chatbots",
                "Translation",
                "Search",
            ],
        },

        {
            title: "Enterprise AI Platforms",

            description: "Creating scalable AI infrastructure, private model deployment, vector search and intelligent enterprise systems that integrate seamlessly into business operations.",

            icon: ServerCog,

            tags: [
                "Vector DB",
                "Cloud AI",
                "Inference",
                "Deployment",
            ],
        },

        {
            title: "Responsible AI",

            description: "Embedding explainability, fairness, privacy, governance and human oversight into every artificial intelligence solution we develop.",

            icon: ShieldCheck,

            tags: [
                "Ethics",
                "Security",
                "Governance",
                "Trust",
            ],
        },
    ],

    solutions: [
        {
            title: "Healthcare Artificial Intelligence",

            description: "Intelligent healthcare platforms supporting laboratory diagnostics, telemedicine, patient engagement, clinical decision support and hospital automation.",

            icon: HeartPulse,

            tags: [
                "LabReport AI",
                "Hospitals",
                "Diagnostics",
                "Telemedicine",
            ],
        },

        {
            title: "Enterprise Artificial Intelligence",

            description: "AI-powered enterprise assistants, workflow automation, intelligent search and knowledge management systems that improve productivity across organizations.",

            icon: Building2,

            tags: [
                "Enterprise",
                "Automation",
                "Knowledge AI",
                "Copilots",
            ],
        },

        {
            title: "Education Artificial Intelligence",

            description: "Personalized learning, AI tutors, intelligent assessments and adaptive educational platforms designed to improve learning outcomes.",

            icon: GraduationCap,

            tags: [
                "Learning",
                "AI Tutors",
                "Education",
                "Adaptive Learning",
            ],
        },

        {
            title: "Government Artificial Intelligence",

            description: "AI solutions that modernize public services through intelligent citizen support, document processing and secure digital governance.",

            icon: Landmark,

            tags: [
                "Government",
                "Public Services",
                "Citizen AI",
                "Automation",
            ],
        },

        {
            title: "Financial Artificial Intelligence",

            description: "Fraud detection, intelligent risk assessment, financial forecasting and AI-powered decision support for modern financial institutions.",

            icon: LineChart,

            tags: [
                "FinTech",
                "Fraud Detection",
                "Forecasting",
                "Risk Analysis",
            ],
        },

        {
            title: "Industrial Artificial Intelligence",

            description: "Predictive maintenance, industrial automation, smart manufacturing and intelligent IoT solutions that improve operational efficiency.",

            icon: Factory,

            tags: [
                "Industry 4.0",
                "IoT",
                "Predictive AI",
                "Automation",
            ],
        },
    ],

    technologies: [
        {
            title: "Foundation Models",
            name: "",
            description: "GPT, Claude, Gemini, Llama, Mistral",
            technologies: []
        },

        {
            title: "AI Frameworks",
            name: "",
            technologies: [
                { name: "langchain", title: "LangChain" },
                { name: "llamaindex", title: "LlamaIndex" },
                { name: "crewai", title: "CrewAI" },
                { name: "autogen", title: "AutoGen" },
                { name: "haystack", title: "Haystack" },
            ]
        },

        {
            title: "Machine Learning",
            name: "",
            technologies: [
                { name: "pytorch", title: "PyTorch" },
                { name: "tensorflow", title: "TensorFlow" },
                { name: "scikit-learn", title: "Scikit-Learn" },
                { name: "xgboost", title: "XGBoost" },
            ]
        },

        {
            title: "Data Engineering",
            name: "",
            technologies: [
                { name: "postgresql", title: "PostgreSQL" },
                { name: "mongodb", title: "MongoDB" },
                { name: "redis", title: "Redis" },
                { name: "supabase", title: "Supabase" },
            ]
        },

        {
            title: "Vector Databases",
            name: "",
            technologies: [
                { name: "pinecone", title: "Pinecone" },
                { name: "weaviate", title: "Weaviate" },
                { name: "qdrant", title: "Qdrant" },
                { name: "faiss", title: "FAISS" },
            ]
        },

        {
            title: "Cloud & Deployment",
            name: "",
            technologies: [
                { name: "docker", title: "Docker" },
                { name: "kubernetes", title: "Kubernetes" },
                { name: "azure-ai", title: "Azure AI" },
                { name: "aws-bedrock", title: "AWS Bedrock" },
                { name: "google-vertex-ai", title: "Google Vertex AI" },
            ]
        },
    ],

    products: [
        {
            title: "LabReport AI",

            description: "An enterprise-ready AI-powered digital healthcare platform that simplifies laboratory report interpretation into language anyone can understand. Beyond report analysis, LabReport AI enables secure communication between patients and verified healthcare professionals through messaging, voice and video consultations while supporting multilingual assistance, hospital adoption and intelligent health insights.",

            icon: HeartPulse,

            tags: [
                "Healthcare AI",
                "Telemedicine",
                "Hospital Platform",
                "Medical Intelligence",
                "Multilingual AI",
            ],
            category: ""
        },

        {
            title: "Security-by-Ethics",

            description: "A responsible artificial intelligence governance platform that evaluates AI systems using explainability, transparency, fairness, privacy and security principles to help organizations deploy trustworthy AI responsibly.",

            icon: ShieldCheck,

            tags: [
                "Responsible AI",
                "Governance",
                "Explainability",
                "Ethics",
            ],
            category: ""
        },

        {
            title: "Enterprise AI Assistant",

            description: "A next-generation enterprise knowledge assistant that enables organizations to search internal knowledge, automate workflows, answer questions and enhance productivity through secure generative AI.",

            icon: Bot,

            tags: [
                "Coming Soon",
                "Enterprise AI",
                "Knowledge Assistant",
            ],
            category: ""
        },

        {
            title: "AI Knowledge Platform",

            description: "A secure AI platform designed to transform organizational knowledge into intelligent, searchable and context-aware digital assistants for education, enterprise and government institutions.",

            icon: DatabaseZap,

            tags: [
                "Coming Soon",
                "Knowledge AI",
                "RAG",
            ],
            category: ""
        },

        {
            title: "Document Intelligence",

            description: "AI-powered document processing capable of extracting, classifying, summarizing and understanding structured and unstructured documents at enterprise scale.",

            icon: FileSearch,

            tags: [
                "Coming Soon",
                "OCR",
                "Document AI",
            ],
            category: ""
        },

        {
            title: "African Language AI",

            description: "Research initiative focused on multilingual AI supporting African languages through translation, speech understanding and culturally relevant conversational intelligence.",

            icon: Languages,

            tags: [
                "Research",
                "Multilingual",
                "Africa",
            ],
            category: ""
        },
    ],

    research: [
    {
        year: "2026",
        title: "StudentPreneur Hackathon Winner",
        description:
            "LabReport AI was recognized for its innovative approach to simplifying laboratory report interpretation through responsible artificial intelligence, demonstrating Evantra's commitment to solving healthcare challenges with practical AI.",
        icon: Sparkles,
    },

    {
        year: "2026",
        title: "Security-by-Ethics Framework",
        description:
            "Research began on the Security-by-Ethics framework, a practical AI governance model focused on explainability, fairness, transparency, privacy and security for trustworthy AI deployment.",
        icon: ShieldCheck,
    },

    {
        year: "2027",
        title: "Enterprise AI Research",
        description:
            "Expansion into enterprise artificial intelligence with intelligent assistants, knowledge platforms, workflow automation and organizational decision-support systems.",
        icon: Bot,
    },

    {
        year: "Future",
        title: "African Language AI Initiative",
        description:
            "Research focused on multilingual artificial intelligence supporting African languages, localized knowledge systems and culturally aware conversational AI technologies.",
        icon: Languages,
    },

    {
        year: "Future",
        title: "Evantra AI Laboratory",
        description:
            "Development of an advanced AI research laboratory dedicated to applied machine learning, healthcare intelligence, computer vision and responsible AI innovation.",
        icon: FlaskConical,
    },

    {
        year: "Future",
        title: "Global Research Collaborations",
        description:
            "Building strategic partnerships with universities, research institutions, governments and industry leaders to accelerate responsible artificial intelligence research and innovation.",
        icon: Globe2,
    },
] as CompanyTimelineItem[],

    culture: [
        {
            title: "Research-Driven Innovation",

            description: "Every artificial intelligence solution begins with rigorous research. We encourage experimentation, scientific thinking and evidence-based engineering to solve meaningful challenges.",

            icon: FlaskConical,

            tags: [
                "Research",
                "Innovation",
                "Experimentation",
            ],
        },

        {
            title: "Responsible AI",

            description: "Ethics, transparency, fairness and human oversight are embedded throughout our AI development lifecycle, ensuring technology serves people responsibly.",

            icon: ShieldCheck,

            tags: [
                "Ethics",
                "Governance",
                "Trust",
            ],
        },

        {
            title: "Continuous Learning",

            description: "Artificial intelligence evolves rapidly. Our teams embrace lifelong learning through research, certifications, experimentation and collaboration to remain at the forefront of AI engineering.",

            icon: GraduationCap,

            tags: [
                "Learning",
                "Growth",
                "Knowledge",
            ],
        },

        {
            title: "Collaborative Intelligence",

            description: "Great AI is built by multidisciplinary teams. We bring together software engineers, AI researchers, designers, healthcare professionals and domain experts to create impactful solutions.",

            icon: Users,

            tags: [
                "Teamwork",
                "Collaboration",
                "Diversity",
            ],
        },

        {
            title: "Human-Centered Design",

            description: "We design AI systems that enhance human decision-making, improve accessibility and simplify complex processes without replacing human judgment.",

            icon: HeartHandshake,

            tags: [
                "Accessibility",
                "UX",
                "People First",
            ],
        },

        {
            title: "Global Impact",

            description: "Our ambition extends beyond building intelligent software. We strive to create AI technologies that contribute to healthcare, education, enterprise and sustainable development across Africa and the world.",

            icon: Globe2,

            tags: [
                "Impact",
                "Africa",
                "Global",
            ],
        },
    ],

    careers: {
        title: "Build the Future of Artificial Intelligence",

        description: "Join researchers, engineers, designers and innovators building trustworthy artificial intelligence that transforms healthcare, education, enterprise and public services. At Evantra AI Center, you'll contribute to meaningful technologies, collaborate with multidisciplinary teams and help shape the future of responsible AI across Africa and beyond.",
    },
    slug: "",
    name: ""
}
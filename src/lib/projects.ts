export type ProjectStatus = "planning" | "in-progress" | "completed";

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  tags: string[];
  status: ProjectStatus;
  startDate: string;
  endDate?: string;
  links?: {
    github?: string;
    live?: string;
    demo?: string;
  };
  featured?: boolean;
}

export const projects: Project[] = [
  {
    id: "promptfolio",
    title: "Promptfolio",
    description:
      "เว็บพอร์ตโฟลิโอส่วนตัวที่ใช้ AI ช่วยสร้างและจัดการโปรเจค รองรับการบันทึก prompt ที่ใช้งาน",
    longDescription:
      "ระบบพอร์ตโฟลิโอที่ออกแบบมาเพื่อนักพัฒนาที่ทำงานกับ AI โดยสามารถบันทึก prompt ที่ใช้สร้างงาน แสดงผลลัพธ์ และแบ่งปันกับคนอื่นได้",
    tags: ["Next.js", "Tailwind", "TypeScript", "AI"],
    status: "in-progress",
    startDate: "2025-05-01",
    featured: true,
    links: { github: "#", live: "#" },
  },
  {
    id: "line-admin",
    title: "Line Admin Dashboard",
    description:
      "ระบบจัดการ Line Bot และ Line OA สำหรับธุรกิจ พร้อม analytics และ message management",
    longDescription:
      "แดชบอร์ดสำหรับจัดการ Line Official Account รองรับการส่ง broadcast จัดการ user segments และดู analytics แบบ real-time",
    tags: ["Next.js", "Line API", "TypeScript", "Chart.js"],
    status: "in-progress",
    startDate: "2025-05-01",
    featured: true,
    links: { github: "#" },
  },
  {
    id: "ai-prompt-library",
    title: "AI Prompt Library",
    description:
      "คลังเก็บ prompt สำหรับงานต่างๆ พร้อมระบบค้นหา, tag และ rating จากชุมชน",
    tags: ["React", "Node.js", "PostgreSQL", "AI"],
    status: "planning",
    startDate: "2025-07-01",
    featured: true,
  },
  {
    id: "thai-gpt-wrapper",
    title: "Thai GPT Wrapper",
    description:
      "API wrapper สำหรับ LLM models ที่ optimize สำหรับภาษาไทย พร้อม rate limiting และ caching",
    tags: ["Python", "FastAPI", "Redis", "Docker"],
    status: "planning",
    startDate: "2025-08-01",
  },
  {
    id: "expense-tracker-ai",
    title: "Expense Tracker AI",
    description:
      "ระบบจัดการค่าใช้จ่ายที่ใช้ AI วิเคราะห์พฤติกรรมการใช้เงินและแนะนำการออม",
    tags: ["Flutter", "Firebase", "Claude API", "ML"],
    status: "planning",
    startDate: "2025-09-01",
  },
  {
    id: "code-review-bot",
    title: "Code Review Bot",
    description:
      "GitHub App ที่ใช้ AI ช่วย review code อัตโนมัติ พร้อมแนะนำ best practices และ security issues",
    tags: ["Node.js", "GitHub API", "Claude API", "TypeScript"],
    status: "planning",
    startDate: "2025-10-01",
  },
];

export const getFeaturedProjects = () => projects.filter((p) => p.featured);
export const getProjectById = (id: string) => projects.find((p) => p.id === id);

export const statusConfig: Record<
  ProjectStatus,
  { label: string; color: string; dot: string }
> = {
  planning: {
    label: "วางแผน",
    color: "bg-stone-100 text-stone-600 border border-stone-200",
    dot: "bg-stone-400",
  },
  "in-progress": {
    label: "กำลังพัฒนา",
    color: "bg-stone-900 text-stone-50 border border-stone-900",
    dot: "bg-stone-300",
  },
  completed: {
    label: "เสร็จแล้ว",
    color: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
  },
};

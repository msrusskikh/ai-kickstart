import type { LessonFrontmatter, Module, SearchResult } from './types';

// This would normally load from MDX files
// For now, we'll create sample content structure
export const modules: Module[] = [
  {
    id: 1,
    title: "Introduction",
    description: "Get started with the fundamentals",
    sections: [
      {
        slug: "welcome",
        title: "Welcome",
        summary: "What you'll get and how to use this course.",
        duration: 6,
        objectives: ["Understand course structure", "Know how to navigate and track progress"],
        prerequisites: [],
        module: 1,
        section: 1,
        quiz: [
          {
            type: "mcq",
            question: "Which key opens command menu?",
            choices: ["G", "K", "/", "?"],
            answer: "K"
          },
          {
            type: "reflection",
            prompt: "In 2–3 sentences, note what you want from this course."
          }
        ]
      },
      {
        slug: "how-this-works",
        title: "How This Works",
        summary: "Understanding the learning flow and navigation.",
        duration: 8,
        objectives: ["Learn keyboard shortcuts", "Understand progress tracking"],
        prerequisites: [],
        module: 1,
        section: 2,
        quiz: [
          {
            type: "mcq",
            question: "How do you navigate to the next lesson?",
            choices: ["J key", "L key", "Arrow right", "All of the above"],
            answer: "All of the above"
          }
        ]
      },
      {
        slug: "getting-started",
        title: "Getting Started",
        summary: "Your first steps in the learning journey.",
        duration: 10,
        objectives: ["Complete your first lesson", "Understand the interface"],
        prerequisites: [],
        module: 1,
        section: 3
      }
    ]
  },
  {
    id: 2,
    title: "Core Concepts",
    description: "Master the essential building blocks",
    sections: [
      {
        slug: "fundamentals",
        title: "Fundamentals",
        summary: "The core principles that everything builds upon.",
        duration: 12,
        objectives: ["Understand basic principles", "Apply core concepts"],
        prerequisites: ["Introduction"],
        module: 2,
        section: 1
      },
      {
        slug: "advanced-topics",
        title: "Advanced Topics",
        summary: "Diving deeper into complex subjects.",
        duration: 15,
        objectives: ["Master advanced concepts", "Solve complex problems"],
        prerequisites: ["Fundamentals"],
        module: 2,
        section: 2
      }
    ]
  },
  {
    id: 3,
    title: "Practical Application",
    description: "Put your knowledge to work",
    sections: [
      {
        slug: "real-world-examples",
        title: "Real World Examples",
        summary: "See how concepts apply in practice.",
        duration: 18,
        objectives: ["Apply concepts to real scenarios", "Build practical solutions"],
        prerequisites: ["Core Concepts"],
        module: 3,
        section: 1
      },
      {
        slug: "hands-on-practice",
        title: "Hands-on Practice",
        summary: "Get your hands dirty with practical exercises.",
        duration: 20,
        objectives: ["Complete practical exercises", "Build confidence"],
        prerequisites: ["Real World Examples"],
        module: 3,
        section: 2
      }
    ]
  },
  {
    id: 4,
    title: "Mastery & Beyond",
    description: "Achieve expertise and continue growing",
    sections: [
      {
        slug: "expert-level",
        title: "Expert Level",
        summary: "Reach mastery in your chosen field.",
        duration: 25,
        objectives: ["Achieve expert status", "Mentor others"],
        prerequisites: ["Practical Application"],
        module: 4,
        section: 1
      },
      {
        slug: "continuous-learning",
        title: "Continuous Learning",
        summary: "Never stop growing and improving.",
        duration: 12,
        objectives: ["Establish learning habits", "Plan future growth"],
        prerequisites: ["Expert Level"],
        module: 4,
        section: 2
      }
    ]
  }
];

export function getModule(id: number): Module | undefined {
  return modules.find(m => m.id === id);
}

export function getLesson(moduleId: number, sectionId: number): LessonFrontmatter | undefined {
  const module = getModule(moduleId);
  return module?.sections.find(s => s.section === sectionId);
}

export function getAllLessons(): SearchResult[] {
  return modules.flatMap(module =>
    module.sections.map(section => ({
      module: module.id,
      section: section.section,
      title: section.title,
      summary: section.summary,
      slug: section.slug
    }))
  );
}

export function searchLessons(query: string): SearchResult[] {
  const lessons = getAllLessons();
  const lowerQuery = query.toLowerCase();
  
  return lessons.filter(lesson =>
    lesson.title.toLowerCase().includes(lowerQuery) ||
    lesson.summary.toLowerCase().includes(lowerQuery)
  );
}

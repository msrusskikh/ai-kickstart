# Custom Modules and Lessons Guide

This guide explains how to add custom modules and lessons to your AI Kickstart learning app.

## Overview

Your app has a modular learning system with:
- **Modules**: Top-level learning units (e.g., "Introduction", "Web Development")
- **Sections**: Individual lessons within each module
- **Content**: Rich HTML content for each lesson
- **Quizzes**: Interactive assessments (MCQ and reflection)

## How to Add a New Module

### 1. Update the Modules Array

In `src/lib/content.ts`, add a new module to the `modules` array:

```typescript
{
  id: 6, // Use the next available ID
  title: "Your Module Title",
  description: "Brief description of what this module covers",
  sections: [
    // Individual lessons go here
  ]
}
```

### 2. Add Lesson Sections

Each module contains multiple sections (lessons):

```typescript
{
  slug: "lesson-slug", // URL-friendly identifier
  title: "Lesson Title",
  summary: "Brief lesson description",
  duration: 15, // Estimated time in minutes
  objectives: ["Goal 1", "Goal 2", "Goal 3"],
  prerequisites: ["Previous Lesson"], // Optional
  module: 6, // Must match module ID
  section: 1, // Sequential section number
  quiz: [
    // Optional quiz questions
  ]
}
```

### 3. Quiz Types

#### Multiple Choice (MCQ)
```typescript
{
  type: "mcq",
  question: "Your question here?",
  choices: ["Option A", "Option B", "Option C", "Option D"],
  answer: "Option A" // Must match exactly one of the choices
}
```

#### Reflection
```typescript
{
  type: "reflection",
  prompt: "Think about and describe..."
}
```

## How to Add Custom Lesson Content

### 1. Update the Content Mapping

In `src/lib/content.ts`, add content for your lessons to the `lessonContent` object:

```typescript
export const lessonContent: Record<string, string> = {
  // Format: "module-section" as key
  "6-1": `
    <h2>Your Lesson Title</h2>
    <p>Your lesson content here...</p>
    
    <h3>Subsection</h3>
    <p>More content...</p>
    
    <!-- You can use HTML with Tailwind CSS classes -->
    <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
      <p class="text-blue-800 dark:text-blue-200">
        <strong>Pro Tip:</strong> Your tip here
      </p>
    </div>
  `,
  
  "6-2": `
    <!-- Content for second lesson -->
  `
};
```

### 2. Content Formatting

You can use:
- **HTML tags**: `<h2>`, `<p>`, `<ul>`, `<li>`, `<div>`, etc.
- **Tailwind CSS classes**: For styling and responsive design
- **Code blocks**: Use `<pre><code>` for syntax highlighting
- **Interactive elements**: Cards, grids, and other UI components

## Example: Adding a "Data Science" Module

Here's a complete example of adding a new module:

### 1. Add to Modules Array

```typescript
{
  id: 6,
  title: "Data Science",
  description: "Learn data analysis, visualization, and machine learning",
  sections: [
    {
      slug: "python-basics",
      title: "Python Fundamentals",
      summary: "Learn Python programming for data science",
      duration: 25,
      objectives: ["Write Python code", "Use data structures", "Work with libraries"],
      prerequisites: [],
      module: 6,
      section: 1,
      quiz: [
        {
          type: "mcq",
          question: "What is Python?",
          choices: ["A snake", "A programming language", "A database", "An operating system"],
          answer: "A programming language"
        }
      ]
    },
    {
      slug: "pandas-intro",
      title: "Introduction to Pandas",
      summary: "Data manipulation with pandas library",
      duration: 30,
      objectives: ["Load data", "Clean data", "Analyze data"],
      prerequisites: ["Python Fundamentals"],
      module: 6,
      section: 2
    }
  ]
}
```

### 2. Add Content

```typescript
"6-1": `
  <h2>Python Fundamentals</h2>
  <p>Python is a powerful programming language widely used in data science...</p>
  
  <h3>Basic Syntax</h3>
  <div class="bg-gray-900 text-green-400 p-4 rounded-lg">
    <pre><code># Variables
name = "Data Scientist"
age = 25

# Functions
def greet(person):
    return f"Hello, {person}!"

print(greet(name))</code></pre>
  </div>
  
  <h3>Data Structures</h3>
  <ul>
    <li><strong>Lists:</strong> Ordered, mutable collections</li>
    <li><strong>Dictionaries:</strong> Key-value pairs</li>
    <li><strong>Tuples:</strong> Immutable sequences</li>
  </ul>
`,

"6-2": `
  <h2>Introduction to Pandas</h2>
  <p>Pandas is the go-to library for data manipulation in Python...</p>
  
  <h3>Loading Data</h3>
  <div class="bg-gray-900 text-green-400 p-4 rounded-lg">
    <pre><code>import pandas as pd

# Read CSV file
df = pd.read_csv('data.csv')

# Display first few rows
print(df.head())</code></pre>
  </div>
`
```

## Best Practices

### 1. Content Organization
- Use clear headings and subheadings
- Break content into digestible sections
- Include practical examples and code snippets
- Add visual elements like cards and grids

### 2. Quiz Design
- Make questions relevant to the lesson content
- Include a mix of MCQ and reflection questions
- Ensure MCQ answers are unambiguous
- Use reflection prompts to encourage critical thinking

### 3. Prerequisites
- Set logical learning paths
- Don't create circular dependencies
- Consider skill levels when setting prerequisites

### 4. Content Length
- Keep lessons focused and manageable
- Aim for 15-30 minutes per lesson
- Break complex topics into multiple lessons

## Navigation and URLs

Your lessons will be accessible at:
```
/learn/{module-id}/{section-id}
```

For example:
- `/learn/6/1` - Data Science module, lesson 1
- `/learn/6/2` - Data Science module, lesson 2

## Testing Your Changes

1. **Add the module** to the `modules` array
2. **Add content** to the `lessonContent` object
3. **Restart your development server** if needed
4. **Navigate** to `/learn/{module-id}/{section-id}` to test
5. **Check navigation** between lessons
6. **Verify quizzes** work correctly

## Advanced Features

### Custom Components
You can extend the lesson player to support custom React components for more interactive content.

### MDX Integration
For even more powerful content, consider integrating MDX to write content in Markdown with React components.

### Dynamic Content
You could load content from external sources (APIs, databases) instead of hardcoding it.

## Troubleshooting

### Common Issues
1. **Lesson not found**: Check that module and section IDs match
2. **Content not displaying**: Verify the content key format (`"module-section"`)
3. **Navigation broken**: Ensure prerequisites don't create circular references
4. **Quiz not working**: Check quiz object structure and types

### Debug Tips
- Use browser console to check for errors
- Verify all required fields are present
- Check that IDs are unique across modules
- Ensure content keys match lesson identifiers

## Need Help?

If you run into issues:
1. Check the existing examples in the code
2. Verify your syntax matches the TypeScript interfaces
3. Look at the browser console for error messages
4. Compare your structure with working modules

Happy learning and building! 🚀

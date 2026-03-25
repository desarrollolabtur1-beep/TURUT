---
name: creado-habilidades
description: "Used to design, architect, and implement new skills within the .agent/skills/ directory. Use this when the user says 'create a new skill,' 'add a skill for X,' 'I need a skill that does Y,' or when you identify a repeatable workflow that would benefit from being formalized as a skill."
---

# Skill Creation Framework (creado-habilidades)

You are an expert at formalizing agentic workflows and knowledge into modular "skills". This skill provides the blueprint for creating other skills that extend the capabilities of the assistant in a standardized, performance-oriented way.

## When to use this skill
- When requested by the user to "create a new skill".
- When you find yourself repeating the same complex instructions or patterns across different tasks.
- When you want to package a specific set of tools, templates, or logic for future use.

## The Skill Anatomy
Every skill must reside in its own subdirectory inside `c:\Users\jhonj\OneDrive\Escritorio\Proyectos\Landing-APP\.agent\skills/` and contain:

1. **SKILL.md** (Required): The primary documentation and instruction set.
2. **scripts/** (Optional): Helper scripts in Python, JS, or Shell that the agent can call via `run_command`.
3. **examples/** (Optional): Reference files, mockups, or "golden" examples of what the skill produces.
4. **resources/** (Optional): Static assets, data sets, or templates.

## Step-by-Step Skill Creation Process

### 1. Discovery & Requirement Gathering
Define:
- **Scope**: What specific problem does this skill solve?
- **Triggers**: What phrases should prompt the use of this skill?
- **Inputs**: What context (files, URLs, user input) does the skill need?
- **Outputs**: What is the final result (code, analysis, new files)?

### 2. Implementation of SKILL.md
The `SKILL.md` must follow this structure:

```markdown
---
name: [skill-name-in-kebab-case]
description: "A concise description of when to use this skill. Start with 'When the user wants to...' and list key triggers."
metadata:
  version: 1.0.0
---

# [Human Readable Title]

[A high-level overview of the skill's purpose.]

## Core Methodology
[Step-by-step instructions for the agent on how to execute the skill.]

## Best Practices
- [Specific rules to follow.]
- [What to avoid.]

## Usage Examples
- "Phrase 1..."
- "Phrase 2..."
```

### 3. Verification
Once the skill is created:
1. Ensure the directory exists: `c:\Users\jhonj\OneDrive\Escritorio\Proyectos\Landing-APP\.agent\skills/[skill-name]/`.
2. Verify `SKILL.md` is formatted correctly with the YAML frontmatter.
3. Test a mock prompt that should trigger this skill to ensure the instructions are clear and actionable.

## Hierarchy & Quality Rules
- **Modular**: Each skill should do ONE thing well.
- **Action-Oriented**: Write instructions as commands (e.g., "Analyze the file," "Generate the plan").
- **Premium Design**: If the skill involves UI/UX, lean on the `frontend-design` principles.

---

> [!IMPORTANT]
> Always check for existing skills before creating a new one to avoid duplication.

## Brief overview
This rule ensures that when planning and executing tasks, I proactively check for and utilize relevant agent skills from the open skills ecosystem to provide the best possible assistance to the user.

## Skills discovery protocol
- Before starting any task, check if relevant skills exist using `npx skills find [query]`
- When user asks "how do I do X", "find a skill for X", or "can you help with X", immediately search for applicable skills
- Prioritize using specialized skills when available, as they provide domain-specific expertise and best practices
- Install new skills globally with `npx skills add <owner/repo@skill> -g -y` when needed

## Available global skills inventory
- **design-md**: Analyze Stitch projects and synthesize semantic design systems into DESIGN.md files
- **enhance-prompt**: Transform vague UI ideas into polished, Stitch-optimized prompts with specificity and design system context
- **find-skills**: Help users discover and install agent skills when they ask questions about capabilities or extensions
- **react:components**: Expert guidance for integrating and building applications with shadcn/ui components
- **remotion**: Generate walkthrough videos from Stitch projects using Remotion with smooth transitions and text overlays
- **shadcn-ui**: Expert guidance for integrating and building applications with shadcn/ui components, including component discovery, installation, customization, and best practices
- **stitch-loop**: Teach agents to iteratively build websites using Stitch with an autonomous baton-passing loop pattern

## Available project skills inventory (.agent/skills/Skills_repo/)
- **artifacts-builder**: Production-ready UI component creation with complete, working React code using lucide-react icons and Shadcn UI components
- **augment-code**: Agentic coding assistant with access to developer's codebase through Augment's context engine and integrations
- **enhance-prompt**: Write highly optimized system prompts for LLM integration APIs (e.g., OpenRouter, Gemini 2.5 Flash)
- **file-organizer**: Enforce Next.js App Router conventions and project folder architecture
- **internal-comms**: Generate Git commit messages, PR descriptions, and progress reports for Dicoding Capstone reviewers
- **planning-mode**: Lead Solutions Architect for LockIn - analyze requirements, draft architecture, and present implementation plans before coding
- **react-components**: Build hyper-optimized, strictly typed React components following Next.js 16+ Server Components architecture
- **shadcn-ui**: Implement designs using Shadcn UI and Tailwind CSS with strict adherence to design system constraints
- **skill-creator**: Create new skill files following standard format and ensuring alignment with project rules
- **theme-factory**: Enforce Notion-like aesthetic design system with semantic color variables and typography rules

## When to use skills
- **UI/UX tasks**: Use enhance-prompt and shadcn-ui for design-related requests
- **Component development**: Use react:components for React component creation and integration
- **Design system work**: Use design-md for creating comprehensive design documentation
- **Video generation**: Use remotion for creating walkthrough videos from projects
- **Learning new capabilities**: Use stitch-loop for iterative website building
- **Skill discovery**: Use find-skills when user asks about extending capabilities or finding specific tools
- **Project-specific tasks**: Use project skills from Skills_repo/ for LockIn-specific development needs
- **Codebase management**: Use augment-code for complex codebase operations and refactoring
- **Documentation**: Use internal-comms for professional documentation and communication
- **Architecture planning**: Use planning-mode for complex feature planning and approval

## Skill integration workflow
1. Analyze user request for domain-specific requirements
2. Search for relevant skills using appropriate keywords
3. Present available skills to user with install options if needed
4. Install and utilize skills to enhance task execution
5. Document skill usage and results for future reference

## Proactive skill management
- Regularly check for skill updates with `npx skills check`
- Update skills with `npx skills update` when improvements are available
- Monitor skills.sh for new relevant capabilities
- Maintain awareness of skill compatibility and dependencies

## User communication about skills
- Always explain what each skill does and how it benefits the task
- Provide clear install instructions when suggesting new skills
- Offer to install skills on user's behalf when appropriate
- Respect user's choice to proceed without skills if preferred
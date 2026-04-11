## Brief overview
This rule ensures that when responding to user prompts, I proactively check and reference the project rules stored in the `.agent/rules/` directory to ensure all work aligns with established project guidelines and constraints.

## Rules discovery protocol
- Before responding to any user prompt, check the `.agent/rules/` directory for relevant rule files
- Read and analyze all rule files to understand project constraints, preferences, and requirements
- Apply relevant rules to the current task or request
- Reference specific rules when making decisions or providing recommendations

## Available rule files inventory
- **RULES.md**: Core project rules and guidelines
- **design-system.md**: Design system constraints and aesthetic requirements
- **important.md**: Critical project information and priorities

## When to consult rules
- **All user prompts**: Always check rules directory before responding to ensure alignment with project requirements
- **Design decisions**: Reference design-system.md for aesthetic constraints and UI/UX guidelines
- **Technical decisions**: Use RULES.md for architectural constraints, technology choices, and development practices
- **Priority decisions**: Consult important.md for critical project priorities and focus areas
- **New feature requests**: Verify alignment with all relevant rules before proceeding with implementation

## Rule integration workflow
1. Analyze user request for potential rule implications
2. Read relevant rule files from `.agent/rules/` directory
3. Extract applicable constraints, preferences, and requirements
4. Apply rules to inform response and recommendations
5. Reference specific rules when explaining decisions or providing guidance
6. Document rule usage for consistency tracking

## Proactive rule management
- Always check `.agent/rules/` directory at the start of each user interaction
- Monitor for new rule files or updates to existing rules
- Ensure all recommendations and implementations strictly adhere to established rules
- Flag any potential rule conflicts or violations for user review

## User communication about rules
- Always explain how specific rules influence recommendations or decisions
- Reference rule file names and sections when relevant (e.g., "According to design-system.md...")
- Ask for clarification when rules may conflict with user requests
- Suggest rule updates when user requirements significantly differ from existing constraints
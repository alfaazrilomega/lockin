## Brief overview
This rule ensures that when your prompt conflicts with existing project requirements or design system constraints, I proactively identify the conflict and ask you to choose the best resolution path rather than making assumptions.

## Conflict Detection Protocol
- After analyzing your prompt and checking `.agent/rules/` directory, identify any conflicts between your request and existing project constraints
- Compare your prompt against design-system.md, RULES.md, and important.md for potential contradictions
- Flag any requirements that may conflict with established project guidelines

## Conflict Resolution Workflow
1. **Identify Specific Conflicts**: Pinpoint exactly what aspects of your prompt conflict with existing rules
2. **Present Resolution Options**: Offer clear choices for resolving the conflict:
   - **Option A**: Modify your prompt to align with existing project requirements
   - **Option B**: Update the project requirements to accommodate your prompt
   - **Option C**: Enhance/expand the project requirements based on your prompt
3. **Explain Implications**: Clearly explain the consequences of each option
4. **Wait for Your Decision**: Do not proceed until you choose the resolution path

## Resolution Options Framework
- **"Your prompt conflicts with [specific rule/constraint]. Would you like to:**
  - **A)** Adjust your prompt to follow existing requirements, OR
  - **B)** Update the project requirements to match your prompt, OR  
  - **C)** Enhance the project requirements based on your prompt?"

## When to Apply This Rule
- **Design conflicts**: Your prompt requests design elements that violate design-system.md
- **Technical conflicts**: Your prompt requires technologies or approaches forbidden by RULES.md
- **Priority conflicts**: Your prompt conflicts with critical priorities in important.md
- **Scope conflicts**: Your prompt expands beyond defined project boundaries

## User Communication Approach
- Always present conflicts clearly and specifically
- Explain the reasoning behind existing constraints
- Provide clear, actionable resolution options
- Never assume which option you prefer
- Respect your final decision and proceed accordingly

## Documentation Requirements
- Document any changes made to project requirements
- Note when prompts are modified to align with existing rules
- Track patterns in conflicts to suggest rule improvements
- Maintain consistency in project documentation
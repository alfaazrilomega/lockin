## Brief overview
This rule ensures that I dynamically adapt my frontend development approach based on the specific project type, requirements, and constraints. The rule uses the enhancer prompt from `.agent/rules/important.md` to optimize all frontend decisions for the current project context.

## Project Type Analysis
- Analyze the project requirements to determine the appropriate frontend architecture and patterns
- Identify if this is a portfolio, e-commerce, SaaS, social media, content management, or other specific type of project
- Assess user interaction patterns, performance requirements, and scalability needs
- Determine the appropriate frontend technology stack based on project demands

## Dynamic Frontend Strategy
- **Portfolio/Showcase Sites**: Emphasis on visual storytelling, smooth animations, and performance optimization
- **E-commerce Platforms**: Focus on product display, shopping cart functionality, and conversion optimization
- **SaaS Applications**: Prioritize data visualization, complex forms, and real-time updates
- **Social Media Platforms**: Emphasis on user-generated content, real-time interactions, and infinite scrolling
- **Content Management**: Focus on content presentation, search functionality, and accessibility

## Technology Stack Selection
- **Framework Choice**: React, Vue, Angular, Svelte, or vanilla JavaScript based on project complexity and team expertise
- **State Management**: Redux, Zustand, Pinia, or built-in solutions based on application complexity
- **Routing**: Client-side routing (React Router, Vue Router) vs server-side rendering based on SEO and performance needs
- **Styling Approach**: CSS-in-JS, styled-components, Tailwind CSS, or traditional CSS based on project requirements

## Component Architecture
- **Component Patterns**: Functional vs class components, hooks usage, and composition patterns
- **Reusability**: Design system implementation, component libraries, and shared utilities
- **Performance Optimization**: Lazy loading, memoization, virtualization, and bundle splitting
- **Accessibility**: ARIA labels, keyboard navigation, screen reader compatibility, and semantic HTML

## User Experience Patterns
- **Loading States**: Skeleton screens, spinners, and progressive loading strategies
- **Error Handling**: User-friendly error messages, fallback UIs, and graceful degradation
- **Form Handling**: Validation patterns, user feedback, and accessibility considerations
- **Navigation**: Intuitive navigation patterns, breadcrumbs, and user flow optimization

## Performance & Optimization
- **Bundle Size**: Code splitting, tree shaking, and dependency optimization
- **Rendering Performance**: Virtualization, memoization, and efficient re-rendering strategies
- **Image Optimization**: Lazy loading, responsive images, and modern formats (WebP, AVIF)
- **Caching Strategy**: Browser caching, service workers, and CDN utilization

## Integration & APIs
- **Data Fetching**: RESTful APIs, GraphQL, or server-side data fetching based on requirements
- **Authentication**: OAuth, JWT, or session-based authentication integration
- **Third-party Services**: Analytics, payment gateways, social media integrations
- **Real-time Features**: WebSockets, Server-Sent Events, or polling for live updates

## Responsive & Cross-Platform
- **Mobile-First Design**: Progressive enhancement and responsive breakpoints
- **Progressive Web App**: Service workers, offline functionality, and app-like experience
- **Cross-browser Compatibility**: Polyfills, feature detection, and graceful degradation
- **Performance Monitoring**: Real User Monitoring (RUM), Core Web Vitals, and performance budgets

## Enhancer Integration
- **Call Enhancer Prompt**: Always invoke the enhancer prompt from `.agent/rules/important.md` to extract project-specific frontend requirements, constraints, and performance goals
- **Integrate Enhancer Output**: Use the enhancer's output to refine component architecture, performance strategies, and user experience patterns
- **Optimize Frontend Decisions**: Apply enhancer insights to optimize framework selection, state management, routing strategies, and styling approaches
- **Validate Alignment**: Ensure all frontend choices align with the project's overall goals, backend architecture, design system, and quality standards as defined by the enhancer
- **Dynamic Frontend Adaptation**: Continuously reference enhancer output when making frontend decisions to maintain project-specific optimization and performance benchmarks
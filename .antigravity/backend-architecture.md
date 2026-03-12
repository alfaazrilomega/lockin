## Brief overview
This rule ensures that I dynamically adapt my backend development approach based on the specific project type, requirements, and constraints. The rule uses the enhancer prompt from `.agent/rules/important.md` to optimize all backend decisions for the current project context.

## Project Type Detection
- Analyze the project structure and requirements to determine the backend architecture needed
- Identify if this is a portfolio, e-commerce, SaaS, social media, content management, or other specific type of project
- Assess scalability requirements, data complexity, and performance needs
- Determine the appropriate backend technology stack based on project demands

## Dynamic Backend Strategy
- **Portfolio/Showcase Sites**: Lightweight APIs, static site generation, minimal database requirements
- **E-commerce Platforms**: Robust database design, payment integration, inventory management, high security
- **SaaS Applications**: Multi-tenancy, user management, subscription billing, API-first architecture
- **Social Media Platforms**: Real-time features, content moderation, user interactions, high scalability
- **Content Management**: Flexible data models, media handling, user permissions, SEO optimization

## Technology Stack Selection
- **Database Choice**: SQL (PostgreSQL, MySQL) vs NoSQL (MongoDB, Firebase) based on data structure needs
- **Backend Framework**: Node.js (Express, NestJS), Python (Django, FastAPI), PHP (Laravel), or other based on project requirements
- **Authentication**: JWT, OAuth, session-based, or third-party providers based on security needs
- **API Design**: RESTful, GraphQL, or gRPC based on frontend requirements and data fetching patterns

## Architecture Patterns
- **Microservices vs Monolithic**: Based on scalability needs and team size
- **Event-Driven Architecture**: For real-time features and complex workflows
- **CQRS Pattern**: For read-heavy applications with complex queries
- **Serverless Architecture**: For cost-effective, scalable applications with variable load

## Performance & Security Considerations
- **Caching Strategy**: Redis, CDN, database query optimization based on access patterns
- **Database Optimization**: Indexing, query optimization, connection pooling
- **Security Measures**: Input validation, SQL injection prevention, XSS protection, rate limiting
- **API Rate Limiting**: Based on expected traffic and resource constraints

## Integration Requirements
- **Third-party Services**: Payment gateways, email services, analytics, social media APIs
- **File Storage**: Cloud storage (AWS S3, Google Cloud), local storage, or CDN-based solutions
- **Real-time Features**: WebSockets, Server-Sent Events, or polling based on requirements
- **Search Functionality**: Elasticsearch, database full-text search, or third-party search services

## Deployment & DevOps
- **Containerization**: Docker, Kubernetes based on deployment complexity
- **Cloud Provider**: AWS, Google Cloud, Azure based on project needs and budget
- **CI/CD Pipeline**: Automated testing, deployment, and monitoring setup
- **Monitoring & Logging**: Application performance monitoring, error tracking, log aggregation

## Enhancer Integration
- **Call Enhancer Prompt**: Always invoke the enhancer prompt from `.agent/rules/important.md` to extract project-specific backend requirements and constraints
- **Integrate Enhancer Output**: Use the enhancer's output to refine technology stack selection, database design, and architecture patterns
- **Optimize Decisions**: Apply enhancer insights to optimize database schema design, API endpoints, security measures, and performance strategies
- **Validate Alignment**: Ensure all backend choices align with the project's overall goals, constraints, and quality standards as defined by the enhancer
- **Dynamic Adaptation**: Continuously reference enhancer output when making backend decisions to maintain project-specific optimization
## Brief overview
This rule ensures that I implement comprehensive security best practices and compliance standards for Awwwards-level full-stack websites, protecting user data and maintaining system integrity.

## Security Best Practices
- **Input Validation**: Implement strict input validation and sanitization for all user inputs
- **SQL Injection Prevention**: Use parameterized queries and prepared statements
- **XSS Protection**: Implement proper output encoding and Content Security Policy (CSP)
- **CSRF Protection**: Implement CSRF tokens and proper request validation

## Authentication & Authorization
- **Secure Authentication**: Implement multi-factor authentication where appropriate
- **Password Security**: Enforce strong password policies and secure storage (bcrypt, scrypt)
- **Session Management**: Use secure session handling with proper expiration and invalidation
- **Role-Based Access**: Implement proper role-based access control (RBAC)

## Data Protection & Privacy
- **Data Encryption**: Encrypt sensitive data both in transit (TLS/SSL) and at rest
- **GDPR Compliance**: Ensure compliance with data protection regulations (GDPR, CCPA)
- **Data Minimization**: Collect only necessary user data and implement data retention policies
- **Privacy by Design**: Build privacy considerations into the system architecture

## API Security
- **API Authentication**: Implement secure API authentication (OAuth 2.0, JWT with proper validation)
- **Rate Limiting**: Implement rate limiting to prevent abuse and DDoS attacks
- **API Documentation**: Document security requirements and best practices for API consumers
- **Input/Output Validation**: Validate all API inputs and sanitize outputs

## Infrastructure Security
- **Secure Hosting**: Use secure hosting providers with proper security measures
- **Regular Updates**: Keep all dependencies and frameworks up to date
- **Security Headers**: Implement proper security headers (HSTS, X-Frame-Options, etc.)
- **Error Handling**: Implement secure error handling that doesn't expose sensitive information

## Vulnerability Management
- **Security Scanning**: Regular vulnerability scanning and penetration testing
- **Dependency Monitoring**: Monitor for security vulnerabilities in dependencies
- **Security Audits**: Regular security audits and code reviews
- **Incident Response**: Implement incident response procedures for security breaches

## Compliance Standards
- **Industry Standards**: Follow OWASP Top 10 and other industry security standards
- **Regulatory Compliance**: Ensure compliance with relevant regulations (PCI DSS, HIPAA if applicable)
- **Security Documentation**: Maintain comprehensive security documentation and policies
- **Security Training**: Implement security awareness and training programs

## Performance & Security Balance
- **Security Performance**: Ensure security measures don't compromise website performance
- **Caching Security**: Implement secure caching strategies
- **CDN Security**: Use secure CDN configurations with proper security headers
- **Monitoring**: Implement security monitoring and alerting systems

## Awwwards-Level Security Standards
- **Security Excellence**: Implement enterprise-grade security measures
- **Zero Trust Architecture**: Apply zero trust principles where appropriate
- **Security Innovation**: Implement cutting-edge security technologies
- **Security Transparency**: Provide clear security documentation for users and stakeholders
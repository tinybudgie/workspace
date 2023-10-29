# Workspace boilerplate

![image](/.github/images//logo.png)

Workspace is a boilerplate and my work experience of making backend applications. Its contains best-practices of writing code 
I try to make conventions of code, to prevent your project being difficult to read and support
This is a customized workspace using [NestJS](https://docs.nestjs.com/), orchestrator [Nx](https://nx.dev) with ready solutions like

- Standards and conventions for NestJS modules. Create new modules using built-in schematics
- Ready and configured commands for Prisma. Generate types, run migrations and other for particular library using built-in Prisma executors
- Containerize your application in Docker using one command
- Gateway application for your GraphQL services
- Own NestJS library for communication between applications using [NATS](https://nats.io) (full nats support)
- ESLint rules and Prettier configured
- Example for Gitlab CI/CD (coming soon)
- Store your DevOps code with the entire code of application and manage it easily with Ansible and Terraform (terraform coming soon)
- Configured metrics with Grafana and Prometheus (coming soon)

## Documentation

Checkout documentation: https://temarusanov.github.io/dev-notes/workspace/getting-started

## Installation

```bash
npx @tinybudgie/create-workspace my-project
```

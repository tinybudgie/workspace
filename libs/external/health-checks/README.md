# Health Checks

Imagine a huge application with a bunch of internal services, you are tasked with changing the pipe in one of the controllers. Pipe has nothing to do with the database or Kafka. In order to run the application and test the pipe, you will need to bring up the database and all external services. Not very convenient, huh?

How to run an application that does not depend on a database, kafka or any other internal services? How to get service connection status from an application?

```bash
npm i --save @tematools/health-checks   
```

[Documentation](https://temarusanov.github.io/dev-notes/workspace/techniques/health-checks)


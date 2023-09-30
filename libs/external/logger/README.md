# Logger

Imagine a large application in which there is active development and something constantly needs to be debugged. The developers cover everything with debug logs and all this deploys to the server. Due to the huge number of logs, it is impossible to find the log you need. Developers remove all debug logs. After a lot of logs have been removed, a bug appears in production, but now there are no logs.

How to find a balance between logs, and turn on only necessary logs?

```bash
npm i --save @tematools/logger
```

[Documentation](https://temarusanov.github.io/dev-notes/workspace/techniques/logging)


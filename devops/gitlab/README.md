# Gitlab CI/CD Configuration

> Make sure that you change default `.gitlab-ci.yml` path. Jump in **Settings** -> **CI/CD** -> **General Pipelines** -> **CI/CD configuration file** and change path to `devops/gitlab/.gitlab-ci.yml`

Checkout [documentation](https://temarusanov.github.io/dev-notes/workspace/techniques/git-tag-flow)

Don't forget to add variables to CI/CD. Example for `api` application. `API_ENV` file variable:

```bash
PORT=3000
LOGGING_JSON=true
NATS_URL=nats://nats:4222
SAMPLE_DATABASE_URL=postgres://postgres:postgres@postgres:5432/postgres?schema=public
SAMPLE_MIGRATION_DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres?schema=public
```
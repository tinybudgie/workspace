# Install dependencies only when needed
FROM docker.io/node:lts-alpine as deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine 
# to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /usr/src/app
COPY ./node_modules ./node_modules

# Production image, copy all the files and run nest

FROM docker.io/node:lts-alpine as runner
RUN apk add --no-cache dumb-init
ENV PORT 3000
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY dist/apps/gateway .
EXPOSE 3000
CMD ["dumb-init", "node", "main.js"]

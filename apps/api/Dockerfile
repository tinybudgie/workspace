FROM docker.io/node:20.9.0-alpine
RUN apk add --no-cache libc6-compat
RUN apk add --no-cache dumb-init
ENV NODE_ENV production
ENV PORT 3000
WORKDIR /usr/src/app
COPY ./node_modules ./node_modules
COPY dist/apps/api .
EXPOSE 3000
CMD ["dumb-init", "node", "main.js"]

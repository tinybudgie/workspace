# Install dependencies only when needed
FROM docker.io/node:16-alpine as deps
RUN apk add --no-cache libc6-compat
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production --ignore-scripts

FROM docker.io/node:lts-alpine as runner
RUN apk add --no-cache dumb-init
ENV NODE_ENV production
ENV PORT 3000
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY ./node_modules/@prisma ./node_modules/@prisma
COPY dist/apps/api .
RUN chown -R node:node .
EXPOSE 3000
CMD ["dumb-init", "node", "main.js"]
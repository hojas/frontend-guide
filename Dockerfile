FROM --platform=linux/amd64 node:18.11.0-alpine AS builder

ENV NODE_ENV=production
WORKDIR /opt/app
COPY .npmrc package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm i


FROM --platform=linux/amd64 node:18.11.0-alpine

RUN apk add --no-cache git

ENV NODE_ENV=production
WORKDIR /opt/app
COPY . .
COPY --from=builder /opt/app/node_modules ./node_modules
RUN corepack enable && pnpm run build

CMD pnpm run serve

FROM --platform=linux/amd64 node:16.17.1-alpine AS builder

WORKDIR /opt/app
COPY .npmrc package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm i


FROM --platform=linux/amd64 node:16.17.1-alpine

RUN apk add --no-cache git

WORKDIR /opt/app
COPY . .
COPY --from=builder /opt/app/node_modules ./node_modules
RUN corepack enable && pnpm run docs:build

CMD pnpm run docs:serve

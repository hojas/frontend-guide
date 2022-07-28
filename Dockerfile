FROM node:16.16.0-alpine AS builder

RUN apk update && apk add --no-cache git

WORKDIR /opt/app

COPY . .
RUN corepack enable && pnpm i && pnpm run docs:build


FROM node:16.16.0-alpine

ENV PORT=3000
WORKDIR /opt/app

RUN mkdir -p /opt/app/fe-stack
COPY --from=builder /opt/app/docs/.vitepress/dist ./fe-stack
RUN npm i -g serve

CMD serve -p $PORT .

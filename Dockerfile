FROM node:16.15.1 AS builder

WORKDIR /opt/app
COPY package.json .
copy yarn.lock .
RUN yarn


FROM node:16.15.1

WORKDIR /opt/app
COPY . .
COPY --from=builder /opt/app/node_modules ./node_modules
RUN yarn docs:build

EXPOSE 3000
CMD yarn docs:serve

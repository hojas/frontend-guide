FROM --platform=linux/amd64 node:16.17.0-alpine

ENV PORT=3000

WORKDIR /opt/app
RUN npm i -g serve && mkdir ./fe-stack
COPY ./docs/.vitepress/dist ./fe-stack

CMD serve -p $PORT .

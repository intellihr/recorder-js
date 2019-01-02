FROM node:11-alpine

RUN apk upgrade &&\
    apk --update add git openssh-client

ENV GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no"

WORKDIR /code

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

ENTRYPOINT [ "./.docker/scripts/entrypoint" ]

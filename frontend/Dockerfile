FROM node:21-alpine3.17

# Dependencies
COPY ./package* /frontend/
WORKDIR /frontend

RUN npm ci --unsafe-perm=true
RUN npm i -g serve

WORKDIR /
COPY . /frontend
WORKDIR /frontend

RUN chmod u+x ./start.sh

CMD ./start.sh

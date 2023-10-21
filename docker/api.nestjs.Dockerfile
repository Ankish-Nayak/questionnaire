FROM node:20.5.0

# installing sudo
# RUN apt-get update
# RUN apt-get install sudo
# install npm-version 9.8.0
RUN npm install -g npm@9.8.0
# install node - v20.5.0
# RUN npm install -g n
# RUN n v20.5.0
WORKDIR /usr/src/app

# copying root jsons
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./tsconfig.json ./tsconfig.json

# copying api and packages jsons
COPY ./apps/api/package.json ./apps/api/package.json
COPY ./apps/api/tsconfig.json ./apps/api/tsconfig.json
COPY ./apps/api/tsconfig.build.json ./apps/api/tsconfig.build.json
COPY ./packages/types/package.json ./packages/types/package.json
COPY ./packages/types/tsconfig.json ./packages/types/tsconfig.json
COPY ./packages/prisma ./packages/prisma
COPY ./.env ./.env
# installing dependencies 
RUN npm install

# generating prisma client
WORKDIR  /usr/src/app/packages/prisma/
RUN npx prisma generate

WORKDIR /usr/src/app

COPY ./apps/api ./apps/api
COPY ./packages/types/ ./packages/types/
COPY ./packages/tsconfig  ./packages/tsconfig

EXPOSE 3000 9229
WORKDIR /usr/src/app/apps/api

CMD ["npm","run","start:dev"]

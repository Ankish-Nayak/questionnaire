FROM node:16

WORKDIR /usr/src/app
# installing sudo
RUN apt-get update
RUN apt-get install sudo
# install npm-version 9.8.0
RUN npm install -g npm@9.8.0
# install node - v20.5.0
RUN npm install -g n
RUN n v20.5.0

# copying root json files 
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./tsconfig.json ./tsconfig.json


# copying server jsons and prisma migrations files
COPY ./apps/server/package.json ./apps/server/package.json
COPY ./apps/server/tsconfig.json ./apps/server/tsconfig.json
COPY ./packages/prisma ./packages/prisma
COPY ./packages/types/package.json ./packages/types/package.json
COPY ./packages/types/tsconfig.json ./packages/types/tsconfig.json 

# installing dependencies
RUN npm install

# COPY ./.env ./packages/prisma/
WORKDIR  /usr/src/app/packages/prisma/
# generating prisma client 
RUN npx prisma generate

WORKDIR /usr/src/app

COPY ./apps/server/ ./apps/server
COPY ./packages/types/  ./packages/types
COPY ./packages/tsconfig  ./packages/tsconfig

EXPOSE 3000

CMD [ "npm", "run", "dev:server:docker" ]
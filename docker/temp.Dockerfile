FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./
COPY ./packages/prisma ./packages/prisma

COPY ./apps/student/package.json ./apps/student/package.json
COPY  ./apps/teacher/package.json ./apps/teacher/package.json
COPY ./apps/server/package.json  ./apps/server/package.json

# installing dependencies
RUN npm install


COPY ./.env /usr/src/app/packages/prisma/
WORKDIR /usr/src/app/packages/prisma
# generating prisma client
RUN npx prisma generate
WORKDIR /usr/src/app

COPY . .
RUN rm -r .env
EXPOSE 3000 5173 5174

CMD ["npm", "run", "dev:prod"]
FROM node:16

WORKDIR /usr/src/app

# copying root jsons file
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./tsconfig.json ./tsconfig.json

# copying student and teacher jsons files
COPY ./apps/student/package.json ./apps/student/package.json
COPY  ./apps/teacher/package.json ./apps/teacher/package.json
COPY ./packages/ui/package.json ./packages/ui/package.json
COPY ./packages/ui/tsconfig.json ./packages/ui/tsconfig.json

# installing dependencies
RUN npm install

# copying application logic
COPY ./apps/student ./apps/student
COPY ./apps/teacher ./apps/teacher

COPY ./packages/types ./packages/types
COPY ./packages/ui   ./packages/ui 
COPY ./bash_scripts/startFrontend.sh  ./bash_scripts/startFrontend.sh
COPY ./packages/tsconfig ./packages/tsconfig

# defining base url for student and teacher frontend
ARG SERVER_HOST 
ARG SERVER_PORT
RUN echo > ./apps/student/src/config.ts
RUN echo "export const BASE_URL = 'http://$SERVER_HOST:$SERVER_PORT';" > ./apps/student/src/config.ts
RUN echo > ./apps/teacher/src/config.ts
RUN echo "export const BASE_URL = 'http://$SERVER_HOST:$SERVER_PORT';" > ./apps/teacher/src/config.ts


EXPOSE 5173 5174

CMD ["sh","./bash_scripts/startFrontend.sh"]
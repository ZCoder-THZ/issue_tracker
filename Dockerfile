FROM node:lts-alpine3.20

WORKDIR /app

COPY . .

EXPOSE 3000

RUN npm install

RUN npx prisma migrate dev

CMD ["npm", "run","dev"]
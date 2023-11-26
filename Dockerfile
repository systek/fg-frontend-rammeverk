FROM oven/bun:latest

WORKDIR /app

COPY /bun.lockb /app
COPY /package.json /app
COPY /src /app
COPY /src/db /app/db

RUN bun install --production

ENV NODE_ENV=production

EXPOSE 6969

CMD ["./server.ts"]
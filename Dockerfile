FROM mhart/alpine-node:16
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install pnpm -g
RUN pnpm install

FROM mhart/alpine-node:slim-16
WORKDIR /app
COPY --from=0 /app .
COPY . .
ENV NODE_ENV=production
ENV TZ=UTC
EXPOSE 3002
EXPOSE 4001

CMD ["node", "src/index.js"]

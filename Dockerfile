FROM mhart/alpine-node:16
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --prod

FROM mhart/alpine-node:slim-16
WORKDIR /app
COPY --from=0 /app .
COPY . .
ENV NODE_ENV=production
ENV TZ=UTC
EXPOSE 3002
EXPOSE 4001

CMD ["node", "src/index.js"]

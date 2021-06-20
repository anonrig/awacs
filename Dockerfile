FROM mhart/alpine-node:16

ENV NODE_ENV=production
ENV PORT=3002
ENV TZ=UTC

COPY package*.json ./
RUN npm ci --prefer-offline --no-audit --progress=false

COPY . .
EXPOSE 3002
EXPOSE 4001

CMD ["npm", "start"]

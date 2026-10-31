FROM node:24-alpine

# The alpine image ships without timezone data, so TZ would be ignored without tzdata.
RUN apk add --no-cache tzdata \
  && npm install -g pnpm@11

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY server.js headlines.js parse-cards.js dates.js ./

USER node
EXPOSE 3333
CMD ["node", "server.js"]

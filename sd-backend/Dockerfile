FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -g dotenv-cli
COPY . .
RUN npx prisma generate
RUN npm run build
RUN apt-get update && apt-get install -y wget gnupg ca-certificates procps libxss1 \
      libasound2 libatk1.0-0 libcups2 libdbus-1-3 libgdk-pixbuf2.0-0 libnspr4 \
      libnss3 libx11-xcb1 libxcomposite1 libxdamage1 libxrandr2 libgbm1 \
      libpango-1.0-0 libcairo2 libatspi2.0-0 libatk-bridge2.0-0 libgtk-3-0
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN dpkg -i google-chrome-stable_current_amd64.deb; apt-get -fy install
CMD npm run migrate && npm run seed:prod && dotenv -e .production.env node dist/src/main

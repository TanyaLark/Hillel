FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm install
COPY . /app/
RUN  chmod +x /app/entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]

FROM node:9.11.1-jessie as builder

WORKDIR /app
COPY package.json /www
COPY package-lock.json /www
RUN npm install

COPY . /app
RUN npm run build


FROM nginx:latest
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/config/default.conf /etc/nginx/conf.d/default.conf

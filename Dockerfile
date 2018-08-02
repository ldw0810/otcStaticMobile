FROM node:latest as builder
WORKDIR /app
ADD . /app
RUN npm install && npm run build

FROM nginx:latest
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/config/default.conf /etc/nginx/conf.d/default.conf

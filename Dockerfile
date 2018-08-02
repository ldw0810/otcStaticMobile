FROM node:latest as builder
WORKDIR /app
ADD . /app
RUN npm install && npm run build

FROM nginx:latest
COPY --from=builder /app/dist /usr/share/nginx/html

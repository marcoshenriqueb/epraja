FROM nginx:stable-alpine

RUN apk add --update nodejs

RUN mkdir /var/www
RUN mkdir /var/www/html
RUN mkdir /var/www/html/web

COPY . /var/www/html/web
WORKDIR /var/www/html/web

RUN npm run build

COPY nginx.conf /etc/nginx/nginx.conf

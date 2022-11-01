FROM node:14.19.2 as builder

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY ./ ./

ARG API_URL
ARG OAUTH2_REDIRECT_URL

RUN REACT_APP_OAUTH2_REDIRECT_URL=${OAUTH2_REDIRECT_URL} REACT_APP_API_URL=${API_URL} npm run build 

FROM nginx

EXPOSE 3000

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/build /usr/share/nginx/html

CMD ["nginx","-g","daemon off;"]



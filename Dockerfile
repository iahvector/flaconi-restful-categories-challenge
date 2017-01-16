FROM node:6

MAINTAINER iahvector

ADD ./ /app
WORKDIR /app
RUN npm install
EXPOSE 3000
ENV PORT 3000
CMD npm start

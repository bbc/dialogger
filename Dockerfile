FROM node:boron

RUN mkdir -p /usr/src/dialogger
WORKDIR /usr/src/dialogger

RUN apt-get update
RUN apt-get install -y mediainfo
RUN npm install -g gulp bower bunyan

COPY package.json semantic.json /usr/src/dialogger/
RUN npm install

COPY bower.json /usr/src/dialogger/
RUN mkdir -p /usr/src/dialogger/public/js/html5-video-compositor
COPY public/js/html5-video-compositor/. /usr/src/dialogger/public/js/html5-video-compositor/
RUN npm run build

COPY . /usr/src/dialogger

EXPOSE 8080
CMD ["npm", "start"]

FROM mongo:latest

COPY . /usr/src/dialogger/data/
RUN mongoimport --db dialogger --collection users --file users.json
RUN mongoimport --db dialogger --collection assets --file assets.json

EXPOSE 27017
CMD ["mongod"]

# KenHQ API

## Setup & Running
##### Prerequisites
 - Redis
 - CouchDB
 - Node.JS & NPM

##### Install Steps
 - `npm install`
 - `make install-dev` (while redis & couchdb are running)

##### Running
 - `redis-server`
 - `couchdb`
 - `make start-dev`

## APIs

### Auth

- [http://127.0.0.1:3000/auth/github](http://127.0.0.1:3000/auth/github)
- [http://127.0.0.1:3000/auth/logout](http://127.0.0.1:3000/auth/logout)

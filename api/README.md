# KenHQ API

## Setup & Running

### Prerequisites
- Redis
- CouchDB
- Node.js & NPM

### Install Steps
- `npm install`
- `make install-dev` (while redis & couchdb are running)

### Running
- `redis-server`
- `couchdb`
- `make start-dev`

### Deployment for Staging
- Example Nginx config, assuming root is at `[Project root]/client/dist`:
    ```
    server {
        listen ...;
        server_name kenhq-staging.wiredcraft.net;

        # SSL configs

        root .../client/dist;

        index index.html;

        location ~* ^(/api|/auth|/proxy)(.*) {
            proxy_pass http://127.0.0.1:3000;
        }

        location ~* (.*) {
            try_files $uri $uri/ /index.html;
        }
    }
    ```
- `make start-staging`

## APIs

### Auth

- [http://127.0.0.1:3000/auth/github](http://127.0.0.1:3000/auth/github)
- [http://127.0.0.1:3000/auth/logout](http://127.0.0.1:3000/auth/logout)

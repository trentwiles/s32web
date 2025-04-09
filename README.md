# S3 2 Web

A stupid simple S3 bucket browser, built in React + Vite.

## Setup

### API

```
cd api

# populate the .env
cp .env.example .env

# run the server
gunicorn -c gunicorn.conf.py wsgi:app
```

### React Client

```
cd client
npm run build

# or use a proper webserver
serve dist
```
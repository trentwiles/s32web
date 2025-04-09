# S3 2 Web

A stupid simple S3 bucket browser, built in React + Vite.

![demo](https://github.com/user-attachments/assets/35e86ecb-4097-4f51-8021-4d28fe570831)


## Setup

### API

```
cd api

# install required packages
pip3 install -r requirements.txt

# populate the .env
cp .env.example .env
nano .env

# run the server
gunicorn -c gunicorn.conf.py wsgi:app
```

### React Client

```
cd client
npm i

# populate the .env
cp .env.example .env
nano .env

npm run build

# or use a proper webserver
serve dist
```

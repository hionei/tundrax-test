## Description

TundraX Nest.js Test Task

## Installation

Node Version 20.x.x

1. Install Dependencies by following:

```bash
$ npm install
```

2. Install PostreSQL on your local machine

- [Download](https://www.postgresql.org/download/windows/)
- [Install Guide](https://www.postgresqltutorial.com/postgresql-getting-started/install-postgresql/)

3. Make the .env file

```bash
NODE_ENV=dev

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=root
DB_NAME=test

# Server Port
PORT=5000

# SecretKey must have at least 32 characters and contains uppercase characters, lowercase characters, and digits.
JWT_ACCESS_TOKEN_SECRET_KEY=YOUR_SECRET_KEY
JWT_REFRESH_TOKEN_SECRET_KEY=YOUR_SECRET_KEY

# Tokens LifeTime
ACCESS_TOKEN_LIFE_TIME=3600 #Seconds -- 1 hr
REFRESH_TOKEN_LIFE_TIME=604800 #Seconds -- 7 days
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

# Data Gratification api

API implementation of automated data gratification received from safaricom hook. 
The api checks the amount the client has used and if its above a certain amount a standardised data bundle size is forwarded for gratification.

## Getting started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

There are 2 ways you can set up 

1. docker
2. local set up 

### - Docker

#### Prerequisites
```
Before we get started, we need to make sure we have a few things installed and available on our machine.
```
- Docker Engine [link](https://www.docker.com/get-started/)


### - Local setUp

#### Prerequistes

#### Node >= 18

##### MacOS

```bash
curl "https://nodejs.org/dist/latest/node-${VERSION:-$(wget -qO- https://nodejs.org/dist/latest/ | sed -nE 's|.*>node-(.*)\.pkg</a>.*|\1|p')}.pkg" > "$HOME/Downloads/node-latest.pkg" && sudo installer -store -pkg "$HOME/Downloads/node-latest.pkg" -target "/"
```

##### Other

See the installation guides available @ nodejs.org:

https://nodejs.org/en/download/package-manager/

#### Yarn

```bash
npm i -g yarn
```

### `Installing`

Below is a series of step by step instructions that tell you how to get a development env running.

Create a local clone of the repository

```
git clone git@github.com:frankip/musren-data-gratification.git
```

Change directory to the cloned repositories' directory

```
cd musren-data-gratification
```


### To run with docker

```
docker compose up
```

The project should now be available at http://localhost:1337 

#### To set up localy

Install the projects dependencies

```
yarn
```

### `start`

Start the projects development server

```
yarn develop
# or
yarn start
```

The project should now be available at http://localhost:1337 


### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-build)

```
npm run build
# or
yarn build
```


## Environment Variables

These are the environment variables required to successfully deploy the application.                            |

Each of the below keys need to be applied to each deployment (dev, uat, prod) and their values will be dependant on the environment.

| key               | description                                       |
| ----------------  | ------------------------------------------------- |
| HOST              | Deployed Strapi instance host|
| PORT              | The port number to be used
| DATABASE_CLIENT   | DAtabase client to be used
| DATABASE_HOST     | Database host address
| DATABASE_PORT     | Database port specicific to the database
| DATABASE_NAME     | Name of env specific db
| DATABASE_USERNAME | Database username
| DATABASE_PASSWORD | Database password
| NODE_ENV          | Node env to use in deployment
|

## Built With

Details of the tech stack that has been used.

- [Strapi](https://strapi.io/) - Server Framework

## Authors

- **Francis Kipchumba** <gwadafrank@gmail.com>

## Licenses

Place the result of `npx license-checker --summary` here

```
├─ MIT: 1201
├─ ISC: 95
├─ BSD-3-Clause: 49
├─ Apache-2.0: 30
├─ BSD-2-Clause: 21
├─ (CC-BY-4.0 AND MIT): 3
├─ BSD*: 2
├─ MIT*: 2
├─ (CC-BY-4.0 AND OFL-1.1 AND MIT): 1
├─ (MIT OR Apache-2.0): 1
├─ CC-BY-4.0: 1
├─ Apache*: 1
├─ (MIT OR WTFPL): 1
├─ (OFL-1.1 AND MIT): 1
├─ UNLICENSED: 1
├─ Apache 2.0: 1
├─ AFLv2.1,BSD: 1
├─ (BSD-3-Clause OR GPL-2.0): 1
├─ (MIT AND Zlib): 1
├─ (WTFPL OR MIT): 1
├─ (BSD-2-Clause OR MIT OR Apache-2.0): 1
├─ CC0-1.0: 1
├─ (MIT AND BSD-3-Clause): 1
├─ 0BSD: 1
├─ Unlicense: 1
└─ (MIT OR CC0-1.0): 1
```

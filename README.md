# ZHAW Issue Tracker UI

## Build with Docker
You can build this project by executing the following command without the need to install NPM:
````
docker build -t zhaw-issue-tracker-ui .
````
## Run with Docker

You can run the Docker image by executing the following command:
```
docker run -d -p 80:80 --name zhaw-issue-tracker-server-ui --restart always zhaw-issue-tracker-ui
```

## Project URL:
The project can be tested with the following URL:

http://zhaw-issue-tracker.mpbauer.com
## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Run your unit tests
```
npm run test:unit
```

### Run your end-to-end tests
```
npm run test:e2e
```

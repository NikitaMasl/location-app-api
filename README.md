# location-app-api

## local deployment
make sure that port 27027 is free
run next command to up mongoDB container from root directory
```
docker-compose -p location-app-api -f deploy/docker-compose.local.yml up --force-recreate --build -d
```

next, navigate to core dir and run
```
npm run start:dev
```

in core/.env you can specify other environment vars. By default core-srvice runs on 8000 port

You can study API documentation on
```
${BASE_URL}/api/docs
```

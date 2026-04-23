# ReTab
Vue/Express.js web application for encoding early music tablature. FOR LOCAL USE ONLY

## Installing
First, run `npm install` in both `./retab-client` and `./retab-server` using
```
cd ./retab-client
npm install
cd ../retab-server
npm install
```
Then, instantiate Docker database using
```
sudo docker run --name retab-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=retab_db -p 3307:3306 -d mysql:latest
```

## Running
After install, run
```
cd ./retab-server
npm run dev
```
to launch the app. The client should be running on `localhost:8080`.

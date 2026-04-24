# ReTab
Vue/Express.js web application for encoding early music tablature. FOR LOCAL USE ONLY

## Quick start: Windows
If you are running on Windows, navigate to the following file : `retab-server/package.json` and remove `sudo` from the following line (line 8):
```
    ...
    7 "test": "echo \"Error: no test specified\" && exit 1",
    8 "start:db": "sudo docker start retab-mysql",  # <---- REMOVE [sudo]
    9 "start:server": "nodemon index.ts",
    ...
```
Line 8 should look like this :
```
"start:db": "docker start retab-mysql"
```
Then, double click on `Launch-ReTab.bat` to automatically setup and run the app :)
Once ReTab is running, you can access it through your browser with URL`localhost:8080`

## Installing

### Instructions
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

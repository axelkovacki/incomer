# WHAT DOES IT DO

## Delivers and monitors commands for queues

### 1 - Accept command
### 2 - Init timer
### 3 - Init a log
### 4 - Send command to cannon/message broker (Save Log)
### 5 - Watch the process (Save Log)
### 6 - Get te result of process (Save Log)
### 7 - Sendo result to endpoint (Save Log)
### 8 - Expose Log in REST API

## How to run project

### `npm i`

Install all dependencies.

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

If error:
 - "System limit for number of file watchers reached, watch"

Run:
 - echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
 - sudo sysctl -p
 
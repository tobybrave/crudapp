# CRUD APP
## Description
a node/express application that creates, retrieves, update and delete data from a database

hosted at `https://zuricrudapp.herokuapp.com/`

## Endpoints
`GET /` => homepage
`GET /data` => gets all data in database
`POST /data` => creates a new datum
`GET /data/:id` => gets a datum with the specified id from the database
`PUT /data/:id` => modifies datum with the specified id
`DELETE /data/:id` => removes a datum with the specified id from the database

## Development prerequisite
install nodejs v14  
clone repo  

### commands  
start by running `npm install` inside the project folder    
`npm run lint` to run eslint   
`npm start` to start project
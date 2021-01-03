require('dotenv').config();
module.exports = {
  "development": {
    "username": "postgres",
    "password": "postgres",
    "database": "web",
    "host": "34.121.215.177",
    "dialect": "postgres",
    "logging": false
  },
  "test": {
    "username": "admin",
    "password": "admin",
    "database": "web",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.SOCKET_PATH,
    "dialect": "postgres",
    "dialectOptions":{
    "socketPath": process.env.SOCKET_PATH
  }
  }
}

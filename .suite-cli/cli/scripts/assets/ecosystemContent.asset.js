module.exports = () => `
module.exports = {
    apps : [{
      name   : "upload_service",
      autorestart: true,
      watch: true,
      time: true,
      script : "./index.js",
      instances:4,
      env_production: {
        NODE_ENV: "prod",
        DATABASE_URL:"mongodb://mongodb:27017/supplier_service_db_dev",
        PORT:9001
     },
     env_development: {
      NODE_ENV: "dev",
      DATABASE_URL:"mongodb://mongodb:27017/supplier_service_db_dev",
      PORT:9001
   }
    }]
  }

`;
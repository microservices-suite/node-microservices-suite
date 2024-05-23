module.exports = ({ answers }) => `
module.exports = {
    apps : [{
      name   : ${answers.service_name},
      autorestart: true,
      watch: true,
      time: true,
      script : "./index.js",
      instances:4,
      env_production: {
        NODE_ENV: "prod",
        DATABASE_URL:"mongodb://mongodb:27017/${answers.service_name}",
        PORT:${answers.port}
     },
     env_development: {
      NODE_ENV: "dev",
      DATABASE_URL:"mongodb://mongodb:27017/${answers.service_name}",
      PORT:${answers.port}
   }
    }]
  }

`;
module.exports = {
    apps : [{
      name   : "user_service",
      // autorestart: true,
      watch: true,
      time: true,
      script : "./index.js",
      instances:4,
      env_production: {
        NODE_ENV: "prod",
        DATABASE_URL:"mongodb://localhost:27017/user_service_db_dev",
        PORT:"9003"
     },
     env_development: {
      NODE_ENV: "devb",
      DATABASE_URL:"mongodb://localhost:27017/user_service_db_dev",
      PORT:"9003"
   }
    }]
  }
  // pm2 start ecosystem.config.js --env production
  // pm2 restart ecosystem.config.js --env development
    
  // # Start all applications
  // pm2 start ecosystem.config.js
  
  // # Stop all
  // pm2 stop ecosystem.config.js
  
  // # Restart all
  // pm2 restart ecosystem.config.js
  
  // # Reload all
  // pm2 reload ecosystem.config.js
  
  // # Delete all
  // pm2 delete ecosystem.config.js
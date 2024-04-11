const express = require('express')
const app = express()
const routes = require('./routes')

app.use(express.json())
app.use('/',routes)

app.listen(9002, ()=>{ 
    console.log(`Server listen to port : 9002`)
})

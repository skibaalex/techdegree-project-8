const express = require('express');
const path = require('path')
const {sequelize} = require('./models');
const logger = require('morgan');
/**
 * test db connection
 */
(async () =>{
    await sequelize.authenticate()
    console.log('connected to DB!')
    await sequelize.sync()
    console.log('Synced with the DB!');
})()



/**
 * Express app configurations
 */
const app = express()
const PORT = process.env.PORT || 3000
app.set('view engine', 'pug')
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(logger())
app.use(express.json());

/**
 * Homepage Route
 */
app.get('/', (req,res) => {
    //Pull all the books.
    //render if books.length else error
    res.send('Hello world!')
})

app.listen(PORT, () => {
    console.log('App is Running on port', PORT)
})
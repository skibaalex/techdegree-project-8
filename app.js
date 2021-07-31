const express = require('express');
const path = require('path')
const bodyParser = require('body-parser')
const {sequelize} = require('./models');
const booksRouter = require('./routes/books')
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
app.use(express.urlencoded({extended: true}));
app.use('/books', booksRouter)

/**
 * Homepage Route
 */
app.get('/', (req,res) => {
    res.redirect('/books')
})

app.use((req,res,next) => {
    const err = new Error('Not Found');
    err.status = 404
    err.message = 'Opps the page was not found'
    res.status(err.status).render('not-found', {err})
})

app.use((err,req,res,next) => {
    console.error(err)
    err.status = err.status || 500
    res.status(err.status).render('error', {err})
})


app.listen(PORT, () => {
    console.log('App is Running on port', PORT)
})
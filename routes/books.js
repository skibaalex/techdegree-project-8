const router = require('express').Router();
const Book = require('../models').Book;
const { Op } = require('sequelize');
/** ======================
 * Reusable async handler
==========================*/

function asyncHandler(cb){
    return async(req, res, next) => {
      try {
        await cb(req, res, next)
      } catch(error){
        console.log('Error: ', error);
        next(error)
      }
    }
  }


/** ====================
 * Books Serch
========================*/
router.get('/search', asyncHandler(async (req,res) => {
    try{
        const term = req.query.searchTerm && req.query.searchTerm.toLowerCase() || ''
        const page = req.query.page
        const { books, pages } = await getBooks(term, page)
        res.render('index', {books, pages, page})
    } catch(err){
        throw new Error(err)
    }
    
}))


/** ====================
 * Books CRUD
========================*/

//render new book route
router.get('/new', (req,res) => {
    res.render('new')
})

//create a new book
router.post('/new', asyncHandler(async (req,res) => {
    const { body } = req;
    try{
        const book = await Book.create(body)
        res.redirect(`/books/`)
    } catch(err) {
        throw new Error(err)
    }
}))

//read book based on id
router.get('/:id', asyncHandler(async (req,res) => {
    const {id} = req.params
    const book = await Book.findByPk(id)
    res.render('update', {book})
}))



//update a book
router.post('/:id', asyncHandler(async (req,res) => {
    const {id} = req.params
    try {
        await Book.update({...req.body}, {where: {id}})
        res.redirect('/')
    } catch(err){
        throw new Error(err)
    }
}))

//delete a book
router.post('/:id/delete', asyncHandler(async(req,res) => {
    const {id} = req.params
    try {
        await Book.destroy({where: {id}})
        res.redirect('/')
    } catch(err){
        throw new Error(err)
    }
}))


async function getBooks(term = '', page = 1){
    const {rows, count} = await Book.findAndCountAll({
                    where: {
                        [Op.or]: {
                            title: {[Op.like]: `%${term}%`},
                            author: {[Op.like]: `%${term}%`},
                            genre: {[Op.like]: `%${term}%`},
                            year: {[Op.like]: `%${term}%`},
                        },
                    },
                    limit: 10,
                    offset: 10 * (page - 1)
                })
    
    const pages = Math.ceil(rows.length / count)
    console.log(pages, rows.length)
    return {pages, books: rows}
}



/** ====================
 * Books Display
========================*/
router.get('/', asyncHandler(async (req,res) => {
    const {books, pages} = await getBooks()
    res.render('index', {books, page: 1, pages})
}))



module.exports = router
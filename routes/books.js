const router = express.Router();
const Book = require('../models').Book;

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

router.get('/', (req,res) => {
    console.log(asyncHandler(() => {
        Book.findAll()
    }))
    res.send('books')
})

module.exports = router
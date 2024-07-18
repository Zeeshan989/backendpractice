const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
      cb(file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })
  module.export=upload
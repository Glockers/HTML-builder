const fs = require('fs')

let readableStream = fs.createReadStream(
    __dirname + '\\text.txt',
  'utf8'
)

let str= "";
readableStream.on("data", chunk=>{
    console.log(str+=chunk)
})




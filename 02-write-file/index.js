let process = require("process");
let fs = require("fs");
let path = require("path")

const readableStream = fs.createWriteStream(__dirname+"\\text.txt", 'utf-8')



process.stdout.write("Hello! Write text pls: ");

process.stdin.on("data", (data)=>{
    data = data.toString().toLowerCase();
    if(data === "exit"){
        process.exit(0)
    }else{
        readableStream.write(data);
    }
})


process.on("SIGINT", ()=>process.exit(0));

process.on("exit", (code) => {
  console.log("Process exit event with code: ", code);
});

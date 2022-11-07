const { stat } = require('fs');
const {readdir} = require('fs/promises');
const path = require('path');

const url = path.join(__dirname, "secret-folder")
readdir(url, {withFileTypes: true}).then(data=>{
    let files = data.filter(el=>!el.isDirectory());
    files.forEach(el=>{
        const urlFile = path.join(url, el.name)
        stat(urlFile, (err, stats) => {
            if(err) return console.log(err.message);
            const ext = path.extname(urlFile).slice(1);
            const name = el.name.replace(path.extname(urlFile), "")
            const sizeFile = (stats.size / 1024).toFixed(3);
            return console.log(`${name}-${ext}-${sizeFile}kb`);
        });
    })
})
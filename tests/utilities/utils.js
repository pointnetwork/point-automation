const fs = require('fs');
const path = require('path');

module.exports = {
  getRandomString() {
    return Math.random().toString(36).slice(4);
  },
  getRandomNumber() {
    return (Math.floor(Math.random() * 9999) + 1)-1
  },
  rmdir(dir) {
    try {
      const list = fs.readdirSync(dir);
      for (let i = 0; i < list.length; i++) {
        const filename = path.join(dir, list[i]);
        const stat = fs.statSync(filename);

        if (filename === '.' || filename === '..') {
          // pass these files
        } else if (stat.isDirectory()) {
          // rmdir recursively
          this.rmdir(filename);
        } else {
          // rm fiilename
          fs.unlinkSync(filename);
        }
      }
      fs.rmdirSync(dir);
    } catch(exception) {
      console.log("It was not possible to remove directory. Exception : " + exception)
    }
  },
  rmDirIfExists(dir) {
    if (fs.existsSync(dir)) {
      this.rmdir(dir);
    }
  }
};

const fs = require('fs');
const path = require('path');
const BashProcesses = require("./bash.processes");

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
      fs.rmdirSync(dir,  { recursive: true, force: true });
    } catch(exception) {
      console.log("It was not possible to remove directory. Exception : " + exception)
    }
  },
  rmDirIfExists(dir) {
    if (fs.existsSync(dir)) {
      fs.rmdirSync(dir,  { recursive: true, force: true });
    }
  },
  async rmFile(pathFile) {
    await fs.unlink(pathFile, (err) => {
      if (err) {
        console.error(err)
      }
    })
  },
  async reloadSessionLinux() {
    if(process.platform === "linux") {
      //await browser.pause(60000);
      //await console.log("Reloading Session in Linux...")
      //await BashProcesses.killAllPointProcesses();
      //await console.log("Removing Point lock file")
      //this.rmdir(require('os').homedir() + "/.point/point_dashboard.lock")
      //await console.log("Point lockfile was removed")
      await browser.pause(5000);
      await browser.reloadSession();
      await browser.pause(5000);
      await console.log("Session reloaded!")
    }
  },
  async getPointFolderPath() {
    if(browser.config.pipeline) {
      if(browser.config.pipelineType === "macOs"){
        return "/Users/runner/.point"
      }else{
        return require('os').homedir() + "/.point"
      }
    }else{
      if(process.platform === "darwin") {
        return require('os').homedir() + "/.point"
      }
    }
  },
  async reloadSessionMac() {
    if(process.platform === "darwin") {
      await browser.reloadSession();
      await browser.pause(5000);
      await console.log("Session reloaded!")
    }
  },
};

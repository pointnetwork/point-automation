const childProcess = require('child_process')

module.exports = {
    async getFirefoxProcess() {
        let found = false;
        let timeout = 15;

        while(!found && timeout > 0) {
            if(await this.isProcessRunning("[f]irefox", "firefox")){
                found = true;
            }else {
                timeout -= 1;
                browser.pause(2000);
            }
        }
        return await this.isProcessRunning("[f]irefox", "firefox")
    },
    async getCommandToRun(processName) {
        switch (process.platform) {
            case 'win32': return `tasklist`
            case 'darwin': return `ps -ax | grep '${processName}' | sort -r`
            case 'linux': return `ps -A`
            default: return false
        }
    },
    async killFirefox() {
        const processId = await this.getProcessId("[f]irefox")
        return new Promise((resolve) => {
            childProcess.exec("kill -9 " + processId, (err, stdout, stderr) => {
                resolve(stdout)
            })
        })
    },
    async isProcessRunning(processName, processRealName) {
        const cmd = await this.getCommandToRun(processName);

        return new Promise((resolve) => {
            childProcess.exec(cmd, (err, stdout, stderr) => {
                resolve(stdout.toLowerCase().indexOf(processRealName.toLowerCase()) > -1)
            })
        })
    },
    async getProcessId(processName){
        const cmd = await this.getCommandToRun(processName);
        return new Promise((resolve) => {
            childProcess.exec(cmd, (err, stdout, stderr) => {
                let idProcess = stdout.toLowerCase().split("??")[0]
                idProcess = idProcess.replace(/\s+/g, "");
                resolve(idProcess);
            })
        })
    }
};
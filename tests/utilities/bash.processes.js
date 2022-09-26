const childProcess = require('child_process')

module.exports = {
    async getFirefoxProcess() {
        let found = false;
        let timeout = 15;
        await console.log("Getting firefox process");

        while(!found && timeout > 0) {
            if(await this.isProcessRunning(await this.getFirefoxProcessName(), "firefox")){
                found = true;
                await console.log("Firefox is running");
            }else {
                timeout -= 1;
                await browser.pause(2000);
            }
        }
        return await this.isProcessRunning(await this.getFirefoxProcessName(), "firefox")
    },
    async getCommandToRun(processName) {
        switch (process.platform) {
            case 'win32': return `tasklist`
            case 'darwin': return `ps -ax | grep '${processName}' | sort -r`
            case 'linux': return `ps aux | grep '${processName}' | sort -r`
            default: return false
        }
    },
    async killFirefox() {
        await console.log("Killing Firefox process...");
        const processId = await this.getProcessId(await this.getFirefoxProcessName())
        return new Promise((resolve) => {
            childProcess.exec("kill -9 " + processId, (err, stdout, stderr) => {
                console.log("Firefox was killed");
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
                resolve(this.getProcessIdFromCommandLine(stdout))
            })
        })
    },
    async getPointProcessClosed() {
        let found = false;
        let timeout = 15;

        while(!found && timeout > 0) {
            if(await this.isProcessRunning("[p]oint.app/Contents", "point.app/Contents")){
                timeout -= 1;
                await browser.pause(2000);
            }else {
                found = true;
            }
        }
        return found;
    },
    async killPoint() {
        switch(process.platform) {
            case "darwin":
                await this.killPointMacOS()
                break;
            case "linux":
                await this.killPointLinux()
                break;
            default:
                return ""
        }
    },
    async killPointMacOS() {
        await console.log("Killing point in MacOS")
        const processId = await this.getProcessId(await this.getProcessToKillPoint())
        return new Promise((resolve) => {
            childProcess.exec("kill -9 " + processId, (err, stdout, stderr) => {
                console.log("Point killed in MacOS")
                resolve(stdout)
            })
        })
    },
    async killPointLinux() {
        let finished = false

        while(!finished) {
            await console.log("Killing point in Linux")
            const size = await this.getPointLinuxProcessesSize()
            if(size > 2) {
                await this.killPointMacOS()
            }else {
                finished = true
                console.log("Point killed in Linux")
            }
        }
    },
    async getPointLinuxProcessesSize() {
        const cmd = await this.getCommandToRun(await this.getProcessToKillPoint());
        return new Promise((resolve) => {
            childProcess.exec(cmd, (err, stdout, stderr) => {
                return resolve(stdout.toLowerCase().split("\n").length-1)
            })
        })
    },
    async getProcessToKillPoint() {
        switch(process.platform) {
            case "darwin":
                return "[A]pplications/point.app/Contents/MacOS/point";
            case "linux":
                return "/usr/lib/point/point --allow-pre-commit-input";
            default:
                return ""

        }
    },
    async getFirefoxProcessName() {
        switch(process.platform) {
            case "darwin":
                return "[f]irefox";
            case "linux":
                return "/.point/src/point-browser/firefox/firefox --first-startup";
            default:
                return ""

        }
    },
    async getProcessIdFromCommandLine(stdout) {
        let idProcess;
        switch(process.platform) {
            case "darwin":
                idProcess = stdout.toLowerCase().split("??")[0]
                return idProcess.replace(/\s+/g, "");
            case "linux":
                idProcess = stdout.toLowerCase().split("\n")[2]
                idProcess = idProcess.split("   ")
                idProcess = idProcess[1]
                let splitNumber = idProcess.split("  ")
                splitNumber = splitNumber[0]
                const splitNumberToReturn = splitNumber.split(" ")
                return splitNumberToReturn[1]
            default:
                return ""
        }
    },
    async killAllPointMacOS() {
        await console.log("Killing all point processes in MacOS")
        return new Promise((resolve) => {
            childProcess.exec("pkill -a point" , (err, stdout, stderr) => {
                console.log("Point definitely killed in MacOS")
                resolve(stdout)
            })
        })
    },
    async killSeleniumMacOs() {
        await console.log("Killing Selenium in MacOS")
        return new Promise((resolve) => {
            childProcess.exec("pkill -a selenium-standalone" , (err, stdout, stderr) => {
                console.log("Selenium definitely killed in MacOS")
                resolve(stdout)
            })
        })
    },
    async killAllFirefoxProcesses() {
        await console.log("Killing all Firefox Processes...")
        let commandToRun = "pkill"

        if(process.platform === "darwin") {
            commandToRun = commandToRun + " -a"
        }

        return new Promise((resolve) => {
            childProcess.exec(commandToRun + " firefox" , (err, stdout, stderr) => {
                console.log("Firefox definitely killed in MacOS")
                resolve(stdout)
            })
        })
    },
};
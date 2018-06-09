const fs = require('fs');

const rl = require('readline');
const ask = rl.createInterface(process.stdin, process.stdout);

function prompt(question){
    this.close = ask.close;
    return new Promise(resolve => {
        ask.question(question, (answer)=>{            
            resolve(answer);
        })
    })
}

class Settings{
    constructor(){
        this.setActiveHours = async () => {
            let start = await prompt(`
                DAY START (hh:mm):
            `)
            let end = await prompt(`
                DAY END (hh:mm):
            `)
            this.activeHours = [start, end];
        }
        this.setMaxWorkPeriod = async () => {
            this.maxWorkPeriod = await prompt(`
                MAX WORK PERIOD (hh:mm):
            `)        
        }
        this.init();
    }
    async init(){
        await this.setActiveHours();
        await this.setMaxWorkPeriod();
        this.verify();
    }
    
    async verify(){
        ask.close();
        let settings = JSON.stringify(this);
        fs.writeFile("settings.json", settings, (err) => {
            console.log(err);
        })
    }
}


const modifySettings = async () => {
    
    

    let settings = `{
        "activeHours" : ${activeHours},
        "maxWorkPeriod" : ${maxWorkPeriod}
    }`

    settings = JSON.stringify(settings);
    fs.writeFile('settings.json', settings, (err) => {
        if(err) console.log(err);
    })
}

new Settings();
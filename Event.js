const rl = require('readline');
const prompt = rl.createInterface(process.stdin, process.stdout);

function input(question){
    return new Promise(resolve => {
        prompt.question(question, (answer)=>{            
            resolve(answer);
        })
    })
}

class Event{
    constructor(){
        this.type = 'event';
        this.setTitle();
    }

    async setTitle(){
        this.title = await input("What would you like to call this Event?\n*\n")
        // prompt.close();
        this.setDate();
    }
    
    async setDate(){
        this.date = await input("*\nWhat day is this event?\n*\n");
        this.setStartTime();
    }

    async setStartTime(){ 
        let startTime = await input("When does it begin?\n*\n") + " " + this.date;
        this.startTime = new Date(startTime);
        this.setEndTime()
    }

    async setEndTime(){
        let endTime = await input("When does it end?\n*\n") + " " + this.date
        this.endTime = new Date(endTime);
        this.duration = (this.endTime - this.startTime)/60000
        this.setLocation();
    }

    async setLocation(){
        this.location = await input("Where is this event \n*\n")
        prompt.close();
        console.log(this)
        this.format();
    }

    format(){
        // formatDate(this.date);
        // formateTime(this.startTime);
    }
}

// console.log("What would you like to call this event?")
let testEvent = new Event();
// console.log(testEvent.duration)
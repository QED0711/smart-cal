const rl = require('readline');


// function prompt(question){
//     return new Promise(resolve => {
//         ask.question(question, (answer)=>{            
//             resolve(answer);
//         })
//     })
// }

function generateID(){
    const characters = '0123456789abcdefghijklmnopqrstuvwxyz';
    let id = [];
    for(let i = 0; i<=20; i++){
        let randCharacter = Math.floor(Math.random() * characters.length);
        id.push(characters[randCharacter]);
    }
    return id.join('');
}

const thinObj = (obj) => {
    for(key in obj){
        // console.log(typeof obj[key])
        // console.log(typeof obj[key] === "function")
        if(typeof obj[key] === "function"){
            delete obj[key];
        }
    }
}

class Block{
    constructor(){
        this.ask = rl.createInterface(process.stdin, process.stdout);
        this.prompt = (question) => {
            return new Promise(resolve => {
                this.ask.question(question, (answer)=>{            
                    resolve(answer);
                })
            })
        }
        this.id = generateID();
        //setup functions
        this.setTitle = async () => {
            this.title = await this.prompt(`
            TITLE:
            `)
        }
        this.setEventTime = async () => {
            this.date = await this.prompt(`
            DATE (mm/dd/yy):
            `);
            let expandedDate = this.date.split('/');
            if(expandedDate[2].length === 2){
                expandedDate[2] = "20" + expandedDate[2];
            }
            this.date = expandedDate.join("/");
            this.startTime = await this.prompt(`
            START TIME (hh:mm):
            `);
            this.endTime = await this.prompt(`
            END TIME (hh:mm):
            `);            
            // this.startTime = new Date(`${this.date} ${startTime}`);            
            // this.endTime = new Date(`${this.date} ${endTime}`);
        }
        this.setEventRepeat = async () => {
            let repeats = await this.prompt(`
            DOES THIS EVENT REPEAT? (Y/N)
            `);
            if(repeats === "Y"){
                this.repeats = true;
                this.repeatPeriod = await this.prompt(`
                HOW OFTEN DOES IT REPEAT? (daily, weekly, monthly, yearly)
                `)
                this.repeatTimeOut = await this.prompt(`
                HOW MANY TIMES DOES THIS EVENT REPEAT? (1, 2, 3, etc... or press 'enter/return' if this event has no repeat end)
                `)
                if(this.repeatTimeOut.length === 0){
                    this.repeatTimeOut = null;
                }
            } else {
                this.repeats = false;
                this.repeatPeriod = null;
            }            
        }
        this.setDueDate = async () => {
            this.dueDate = await this.prompt(`
            DUE DATE (mm/dd/yy):
            `);
            let expandedDate = this.dueDate.split('/');
            if(expandedDate[2].length === 2){
                expandedDate[2] = "20" + expandedDate[2];
            }
            this.dueDate = expandedDate.join("/");       
        }
        this.setRequiredTime = async () => {
            this.requiredTime = await this.prompt(`
            ESTIMATED TIME TO COMPLETE (hh:mm)
            `);            
        }
        this.setBlockTimeBounds = async () => {
            this.sessionTime = [];
            this.sessionTime[0] = await this.prompt(`
            MINIMUM BLOCK TIME (hh:mm)
            `);            
            this.sessionTime[1] = await this.prompt(`
            MAXIMUM BLOCK TIME (hh:mm)
            `);            
        }
        this.setPriority = async () => {
            this.priority = await this.prompt(`
            HOW IMPORTANT IS THIS BLOCK (1-10)
            `);            
        }
        this.setRepeatType = async () => {
            this.repeatType = await this.prompt(`
            WHAT IS THE REPEAT PATTERN TYPE
                1. Daily (block always occurs on specified days of the week)
                2. Monthly (Block always occurs on specified days of the month)
                3. Periodic (block occurs every specified number of days)
            `);            
            switch(this.repeatType){
                case("1"):
                this.repeatInterval = await this.prompt(`
                WHAT DAYS DOES THIS BLOCK OCCUR? (M T W TH F)
                `)
                break;
                case("2"):
                this.repeatInterval = await this.prompt(`
                WHAT DAY OF THE MONTH DOES THIS BLOCK OCCUR? (1 2 3 ... 31)
                `)
                break;
                case("3"):
                this.repeatInterval = await this.prompt(`
                HOW MANY DAYS BETWEEN OCCURANCES OF THIS BLOCK?
                `)     
            }
        }
        this.setSpecialCases = async () => {
            this.specialCaseType = await this.prompt(`
                ARE THERE ANY SPECIAL SCHEDULING CONSIDERATIONS:
                    1. Must happen before specified time
                    2. Must happen after specified time
            `);
            
            if(!this.scheduleBefore){
                this.scheduleBefore = null;
            }
            if(!this.scheduleAfter){
                this.scheduleAfter = null;
            }
            
            switch(this.specialCaseType){
                case("1"):
                    this.scheduleBefore = await this.prompt(`
                        THIS BLOCK CANNOT BE SCHEDULED AFTER _______ (hh:mm)
                    `)
                    break;
                case("2"):
                    this.scheduleAfter = await this.prompt(`
                        THIS BLOCK CANNOT BE SCHEDULED BEFORE _______ (hh:mm)
                    `)
                break;
            }
        }
        
    }

    async init(logBool){
        this.log = logBool || false;
        let blockIndex = ['Event', 'Task', 'Recurring', 'Travel']
        let typeIndex = await this.prompt(`
            What type of schedule block would you like to create?\n
              1. EVENT (a fixed, time specific block)
              2. TASK (a block that must be completed by a specified date)
              3. RECURRING (a block that occurs on a regular schedule)
              4. TRAVEL (a block to reserve for travel time)\n
        `)
        this.type = blockIndex[typeIndex-1];
        
        switch(this.type){
            case('Event'):
                console.log(`       Setting up a new EVENT`)
                await this.createEvent();
                break;
            case('Task'):
                console.log(`       Setting up a new TASK`)    
                await this.createTask();
                break;  
            case('Recurring'):
                console.log(`       Setting up new RECURRING`)
                await this.createRecurring();
                break;      
            case('Travel'):
                await this.createTravel(); 
        }
    }

    async verify(){
        console.log(`\nPLEASE VERIFY YOUR SCHEDULE BLOCK SETTINGS\nSCHEDULE BLOCK:`)
        
        switch(this.type){
            case("Event"):
                this.printEvent();
                break;
            case("Task"):
                this.printTask();
                break;
            case("Recurring"):
                this.printRecurring();
                break;
        }

        let param = await this.prompt(`(press 'enter/return' to submit, or type to property name of the entry you would like to adjust)\n`);

        switch(true){
            
            case(param === 'title'):
                await this.setTitle();
                await this.verify();
                break;
            case(param.match(/(dueDate)/i) !== null):
                await this.setDueDate();
                await this.verify();
                break;
            case(param.match(/(date)|(startTime)|(endTime)/i) !== null):
                await this.setEventTime();
                await this.verify();
                break;
            case(param.match(/requiredTime/i) !== null):
                await this.setRequiredTime();
                await this.verify();
                break;
            case(param.match(/session/gi) !== null):
                await this.setBlockTimeBounds();
                await this.verify();
                break;
            case(param.match(/priority/i) !== null):
                await this.setPriority();
                await this.verify();
                break;
            case(param.match(/repeat/gi) !== null):
                await this.setRepeatType();
                await this.verify();
                break;
            case(param.match(/schedule/gi) !== null):
                await this.setSpecialCases();
                await this.verify();
                break;
            default:
                if(param.length === 0){
                    console.log(`BLOCK CREATED`);
                    this.ask.close();
                    delete this.ask;
                    thinObj(this); // removes functions from the block object before returning it
                    if(this.log){
                        delete this.log;
                        console.log(this);
                    }
                } else {
                    console.log(`Your answer did not match any of the property names. Please re-submit`);
                    await this.verify();
                }            
        }        
    }

    async createEvent(){
        await this.setTitle();
        await this.setEventTime();
        await this.setEventRepeat();
        this.open = true
        this.fixed = true;
        this.priority = null;
        this.concurrent = false;              
        // verify settings
        await this.verify();
    }

    printEvent(){
        for(let key in this){
            if(key.match(/(title)|(date)|(startTime)|(endTime)|(repeats)|(repeatPeriod)|(repeatTimeOut)/) !== null){
                console.log(`${key} : ${this[key]}`);
            }
        }
    }

    async createTask(){
        await this.setTitle();
        await this.setDueDate();
        await this.setRequiredTime();
        await this.setBlockTimeBounds();
        await this.setPriority();
        await this.setSpecialCases();
        //Hidden properties
        this.open = true;
        this.fixed = false;
        this.concurrent = false;
        this.remainingTime = this.requiredTime;
        // verify settings
        await this.verify();
    }

    printTask(){
        for(let key in this){
            if(key.match(/(title)|(dueDate)|(requiredTime)|(sessionTime)|(priority)/) !== null){
                console.log(`${key} : ${this[key]}`);
            }
        }
    }

    async createRecurring(){
        await this.setTitle();
        await this.setRequiredTime();
        await this.setPriority();
        await this.setRepeatType();
        await this.setSpecialCases();
        // Hidden properties
        this.open = true;
        this.fixed = false;
        this.concurrent = false;
        // verify settings
        await this.verify();
    }

    printRecurring(){
        for(let key in this){
            if(key.match(/(title)|(requiredTime)|(priority)|(repeatType)|(repeatInterval)|(scheduleBefore)|(scheduleAfter)/) !== null){
                console.log(`${key} : ${this[key]}`);
            }
        }
    }

    async createTravel(){
        await this.setTitle();
        await this.setDate();
        await this.verify();
    }
}

async function returnBlock(){
    let myBlock = new Block();
    await myBlock.init();
    // while(!myBlock.completed){}
    // delete myBlock.completed;
    console.log(myBlock);
    return myBlock;
}

// returnBlock();

// let myBlock = new Block();
// myBlock.init("log");
// console.log(myBlock);
// // console.log(generateID());
module.exports = returnBlock;



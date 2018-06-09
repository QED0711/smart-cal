const fs = require('fs');
const returnBlock = require("./Block");
let testBlocks = require("./testDB");


const minutes = () => {
    let dailyMinutes = []; // return an array because it is easy to iterate over a specified range
    for(let h = 0; h <= 23; h++){
        for(let m = 0; m<60; m++){
            switch(true){
                case(h<10 && m<10):
                    var [time, minObj] = [`0${h}:0${m}`, {}] // use of var allows time variable to be reassigned without error
                    minObj.time = time;
                    minObj.block = null;
                    dailyMinutes.push(minObj)
                    break;
                case(m<10):
                    var [time, minObj] = [`${h}:0${m}`, {}]
                    minObj.time = time;
                    minObj.block = null;
                    dailyMinutes.push(minObj)
                    break;
                case(h<10):
                    var [time, minObj] = [`0${h}:${m}`, {}]
                    minObj.time = time;
                    minObj.block = null;
                    dailyMinutes.push(minObj)
                    break;
                default:
                    var [time, minObj] = [`${h}:${m}`, {}]
                    minObj.time = time;
                    minObj.block = null;
                    dailyMinutes.push(minObj)
            }
            
        }
    }
    return dailyMinutes;
}

const timeToIndex = (time) => {
    time = time.split(":").map(x => parseInt(x));
    return (60*time[0]) + time[1];
}




const getDaySettings = () => {
    return new Promise((resolve) => {
        fs.readFile("./settings.json", (err,data) => {
            if(err) console.log(err);
            resolve(JSON.parse(data));
        })
    })
}

function timeToFloat(time){
    time = time.split(":").map(x => parseFloat(x));
    return time[0] + (time[1]/60.0);
}

// const returnSettings = async () => {
//     let settings = await getDaySettings();
//     console.log(settings);
//     return settings;
// }
// let settings = returnSettings();

// console.log(settings);

class Day {
    constructor(validBlocks){
        this.validBlocks = validBlocks
        this.minutes  = minutes();
        let date = new Date();
        let days = ['M', 'T','W','Th','F','Sa','Su']
        this.day = days[date.getDay()];
        this.date = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
    }

    currentTime(){
        return `${date.getHours()}:${date.getMinutes()}`;
    }

    filterBlocks(blockType){
        switch(blockType){
            case("Event"):
                return this.validBlocks.filter(block => block.type === "Event");                
                break;
            case("Task"):
                return this.validBlocks.filter(block => block.type === "Task");          
                break;
            case("Recurring"):
                return this.validBlocks.filter(block => block.type === "Recurring");
                break;
        }
    }

    remainingDays(task){
        let dueDate = new Date(task.dueDate);
        let currentDate = new Date(this.date);
        return Math.round((dueDate - currentDate)/(1000*60*60*24));
    }

    remainingTime(task){
        return timeToFloat(task.remainingTime);
    }

    adjustTaskPriority(task){
        let remainingDays = this.remainingDays(task);
        let remainingTime = this.remainingTime(task);
        
        // console.log(remainingDays)
    }

    prioritizeBlocks(){
        let variableBlocks = [...this.filterBlocks("Task"), ...this.filterBlocks("Recurring")]
        let taskAdjustedPriority =
        variableBlocks.sort((a,b) => b.priority-a.priority); // descending priority
        
    }

    isOpen(start, stop){
        for(let i = timeToIndex(start); i < timeToIndex(stop); i++){
            if(this.minutes[i].status !== "open"){
                return false;
            }
        }
        return true;
    }

    scheduleEvents(){
        let eventBlocks = this.filterBlocks("Event");
        for(let currentBlock of eventBlocks){
            for(let i = timeToIndex(currentBlock.startTime); i < timeToIndex(currentBlock.endTime); i++){
                this.minutes[i].block = currentBlock;
            }
        }
        for(let i = 0; i < this.minutes.length; i++){
            console.log(this.minutes[i])
        }
    }

}


// wrapped all tests in the asynch test function to handle async nature of 
// async function test(){
//     let myBlock = await returnBlock();
//     // testBlocks
//     let testDay = new Day();
//     console.log(testDay);
//     // testDay.scheduleEvent(myBlock);
//     // console.log(testDay.isOpen("09:30", "10:45"));
// }

// test();

// console.log(minutes());

let currentDay = new Day(testBlocks);
// currentDay.scheduleEvents();
currentDay.adjustTaskPriority(testBlocks[2])
// currentDay.prioritizeBlocks();
// console.log(currentDay.filterBlocks("Recurring"));


// TO DO:
// Prioritize Task and Recurring Blocks
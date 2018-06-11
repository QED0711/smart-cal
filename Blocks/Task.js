const df = require("../DateFormat");


const timeToFloat = (time) => {
    if(typeof time === "number") return time;
    time = time.split(":").map(x => parseInt(x));
    return time[0] + (time[1]/60.0);
}


class Task{
    constructor(params){
        this.type = "Task";
        // this.id = generateID();
        // required 
        this.title = params.title;
        this.dueDate = df.mdy(params.dueDate);
        this.requiredTime = parseInt(params.requiredTime);
        this.sessionTime = params.sessionTime;
        
        this.priority = parseInt(params.priority) || 5;
        // this.remainingTime = parseInt(params.remainingTime) || this.requiredTime;
        this.sessionsCompleted = params.sessionsCompleted || 0;
        this.timeWorked = params.timeWorked || 0;

        this.override = false;
        this.open = true;
        this.fixed = false;
        this.concurrent = false;
    }

    remainingDays(){
        let dueDate = new Date(`${this.dueDate} 00:00:00`);
        let currentDate = new Date();
        currentDate.setHours(0)
        currentDate.setMinutes(0);
        currentDate.setSeconds(0);
        return Math.round((dueDate - currentDate)/(1000*60*60*24));
    }

    adjustRequiredTime(time){
        this.requiredTime += time;
    }

    adjustTimeWorked(time){
        this.timeWorked += time;
        // this.remainingTime -= time;
    }

    remainingTime(){
        return this.requiredTime - this.timeWorked;
    }

    adjustPriority(){
        let remainingTime = this.remainingTime();
        // the minimum number of days it would take to complete this task if scheduled once a day for the maximum session time
        let minimumDays = timeToFloat(remainingTime)/timeToFloat(this.sessionTime[1]);
        // if there are fewer days left than it would take to complete this task, set priority to 10
        if(minimumDays >= this.remainingDays()){
            this.priority = 10;
            this.override = true;
            // return;
        } 
       
        // the maximum number of days it would take to complete this task if scheduled once a day for the minimum session time
        let maximumDays = timeToFloat(remainingTime)/timeToFloat(this.sessionTime[0]);
        // if there are more days left than it would take to complete this task, do nothing
        if(maximumDays < this.remainingDays()){
            this.override = false;
            // return;
        }
        // if there are fewer days than it would take to complete this task at the minimum time each day, increase priority by 2
        if(maximumDays >= this.remainingDays()){
            switch(true){
                case(this.priority <= 8):
                    this.override = false;
                    this.priority += 2;
                    break;
                case(this.priority == 9):
                    this.override = false;
                    this.priority += 1;
                    break;
            }
        }
    }
 
}

// let myTask = new Task({
//     title: 'This is some task',
//     dueDate: '6/10/2018',
//     requiredTime: 5,
//     sessionTime: [ 1, 2.5 ],
//     priority: '4',
//     sessionsCompleted : 5,
//     timeWorked : 8,
//     open: true,
//     fixed: false,
//     concurrent: false,
// });

// myTask.adjustRequiredTime(7.5);
// myTask.adjustPriority();
// console.log(`remainingTime: ${myTask.remainingTime()}`);
// console.log(`remainingDays: ${myTask.remainingDays()}`)
// console.log(myTask);

module.exports = Task;
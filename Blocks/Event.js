const df = require("../DateFormat");

class Event {
    constructor(params){
       this.type = "Event";
       this.title = params.title;
       this.date = df.mdy(params.date);
       this.startTime = params.startTime;
       this.endTime = params.endTime;
       this.repeats = params.repeats === "Does Not Repeat" ?  false : true;
       
       this.repeatChain = this.repeats ? true : false;
       this.repeatType = this.repeats ? params.repeatType : null;
       this.repeatPeriod = this.repeatType ? parseInt(params.repeatPeriod) : null; 
       
       this.open = true;
       this.fixed = true;
       this.concurrent = false; 

    }

    duplicate(){
        let duplicateEvent = {...this}
        switch(this.repeatType){
            case("Daily"):
                duplicateEvent.date = df.nextDay(duplicateEvent.date);
                break;
            case("Monthly"):
                duplicateEvent.date = df.nextMonth(duplicateEvent.date);
                break;
            case("Yearly"):
                duplicateEvent.date = df.nextYear(duplicateEvent.date);
                break;
        }
        return new Event(duplicateEvent);
    }
}


// let testEvent = {
//     "type": "Event",
//     "title": "Birthday",
//     "date": "2018-08-09",
//     "startTime": "10:00",
//     "endTime": "21:00",
//     "repeats": true,
//     "repeatType": "Yearly",
//     "repeatPeriod": 5,
//     "open": true,
//     "fixed": true,
//     "concurrent": false
// }

// let myEvent = new Event(testEvent);

// for(let i = 0; i < myEvent.repeatPeriod; i++){
//     console.log(myEvent)
//     myEvent = myEvent.duplicate();
// } 


module.exports = Event;
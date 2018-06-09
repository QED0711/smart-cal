

class Recurring {
    constructor(params){
        this.type = "Recurring";
        // required
        this.title = params.title;
        this.requiredTime = params.requiredTime;
        this.priority = parseInt(params.priority);
        this.repeatType = params.repeatType;
        this.repeatValue = params.repeatValue;
        this.scheduleAfter = params.scheduleAfter;
        this.scheduleBefore = params.scheduleBefore;

        this.open = true;
        this.fixed = false;
        this.concurrent = false;

        this.minimumPriority = params.minimumPriority || this.priority
        this.completed = params.completed || 0;
        this.deficit = params.deficit || 0;
        

    }
    
    adjustPriority(value){
        if(this.priority + value <= 10 && this.priority + value >= 1){
            this.priority += value;
            return;
        }
        value < 0 ? this.priority = 1 : this.priority = 10;
    }

    wasCompleted(bool){
        if(bool){
            this.completed += 1;
            if(this.priority > this.minimumPriority){
                this.adjustPriority(-1);
            }
        } else {
            this.adjustPriority(1);
        }
    }
}



let params = {
    "title": "Recurring Block",
    "requiredTime": "0:45",
    "priority": "7",
    "repeatType": "Daily",
    "repeatValue": "M W F",
    "scheduleAfter": "00:00",
    "scheduleBefore": "10:00",
    "type": "Recurring",
    "open": true,
    "fixed": false,
    "concurrent": false
}

let myRecurring = new Recurring(params);

// setTimeout(() => {
    console.log(myRecurring)    
// }, 1000);

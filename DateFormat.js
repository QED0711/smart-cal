
df = {
    mdy(date){
        if(!/\d{1,2}-\d{1,2}-\d\d\d\d/.test(date)){
            date = date.split("-");
            return `${date[1]}-${date[2]}-${date[0]}`
        }
        return date;
    },
    
    isLeapYear(date){
        date = !/\d{1,2}-\d{1,2}-\d\d\d\d/.test(date) ? this.mdy(date) : date;
        let year = parseInt(date.split("-")[2]);
        return ((year % 4 === 0) && (year % 100 !== 0) || (year % 400 === 0))
    },

    nextDay(date){
        date = !/\d{1,2}-\d{1,2}-\d\d\d\d/.test(date) ? df.mdy(date) : date;

        let splitDate = date.split("-");
        let month = parseInt(splitDate[0]);
        let day = parseInt(splitDate[1]);
        let year = parseInt(splitDate[2]);

        switch(true){
            case(/12-31/.test(date)):
                month = 1;
                day = 1;
                year += 1;
                break;
            case([1, 3, 5, 7, 8, 10, 12].includes(month)): // 31 day month
                if(day === 31){
                    day = 1;
                    month += 1;
                    if(month === 13){
                        month = 1;
                    }
                } else {
                    day += 1;
                }

                break;
            case([4, 6, 9, 11].includes(month)): // 30 day month
                if(day === 30){
                    day = 1;
                    month += 1
                } else {
                    day += 1;
                }
            break;
            case(month === 2): // February
                if(day < 28){
                    day += 1
                    break;
                } else {
                    if(df.isLeapYear(date) && day === 28){
                        day += 1;
                        break;
                    }
                    if((!df.isLeapYear(date) && day === 28) || (df.isLeapYear(date) && day === 29)){
                        day = 1;
                        month = 3;
                        break;
                    }
                }
                
        }
        return `${month}-${day}-${year}`
    },

    nextMonth(date, num){
        date = !/\d{1,2}-\d{1,2}-\d\d\d\d/.test(date) ? df.mdy(date) : date;
        let splitDate = date.split("-");
        let month = parseInt(splitDate[0])
        let year = parseInt(splitDate[2])
        return month < 12 ?  `${++month}-${splitDate[1]}-${year}` : `01-${splitDate[1]}-${++year}` 
    },
    
    nextYear(date, num){
        date = !/\d{1,2}-\d{1,2}-\d\d\d\d/.test(date) ? df.mdy(date) : date;
        let splitDate = date.split("-");
        splitDate[2] = parseInt(splitDate[2]);
        splitDate[2]++;
        return splitDate.join("-");
    },

    
}


// let date = "12-25-2017"


// // console.log(df.mdy("2018-10-11"));
// // console.log(df.isLeapYear("08-09-2018"))

// for(let i = 0; i < 36; i++){
//     console.log(date);
//     date = df.nextDay(date);
// }

module.exports = df;
const express = require('express');
const bodyParser = require("body-parser");
const app = express();
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
const MongoClient = require("mongodb").MongoClient;
MongoClient.connect.useNewUrlParser =  true;

const Event = require("./Blocks/Event");
const Task = require("./Blocks/Task");
const Recurring = require("./Blocks/Recurring");
const Schedule = require("./js/Schedule")

const port = process.env.PORT || 3000;

MongoClient.connect("mongodb://qdizon:calendar1@ds245240.mlab.com:45240/smart-cal", (err, client) => {
    if(err) return console.log(err)
    db = client.db("smart-cal")
    console.log("connected to database");

    app.listen(port, function(){
        console.log(`The server is running`);
        console.log(`http://localhost:${port}/block-creator`)
    })

})



// app.get('/', (req, res) => {
//     res.send('goodebye World!');
// })



app.get("/block-creator", (request, response) => {
    response.render("block-creator.ejs", ({title: "Hello There!", subtitle: "This is the add page"}));
})

app.get("/schedule", async (request, response) => {
    db.collection("blocks").find({}).toArray((err, results) => {
       console.log(results[0]);
        response.render("schedule.ejs", ({blocks : results}));
    });
    
    
})

app.post("/event-blocks", async (request, response) => {

    let submittedEvent = new Event(request.body);
    let repeatPeriod = submittedEvent.repeatPeriod;
    for(let i = 0; i < repeatPeriod; i++){
        await db.collection('blocks').save(submittedEvent, (err, results) => {
            if(err) return console.log(err);
        })
        submittedEvent = submittedEvent.duplicate();
    }
    
    
    
    response.redirect("/block-creator");
});

app.post("/task-blocks", (request, response) => {
    
    let submittedTask = new Task(request.body);

    db.collection("blocks").save(submittedTask, (err, results) => {
        if(err) return console.log(err);
        response.redirect("/block-creator");
    })
})

app.post("/recurring-blocks", (request, response) => {
        
    let submittedRecurring = new Recurring(request.body);

    db.collection("blocks").save(submittedRecurring, (err, results) => {
        if(err) return console.log(err);  
        response.redirect("/block-creator");
    })
})

app.get("/block-editor", (request, response) => {
    response.render("block-editor.ejs")
    let event = db.collection("events").find();
    console.log(event)
})

app.get("/retrieve-blocks", async (request, response) => {
    
    let currentDate = new Date();
    let days = ['Su', 'M', 'T', 'W', 'Th', 'F', 'Sa']
    let day = days[currentDate.getDay()];
    currentDate = `${currentDate.getMonth()+1}-${currentDate.getDate()}-${currentDate.getFullYear()}`;

    let validEvents = await db.collection("blocks").find({type : "Event", date : currentDate}).toArray();
    let validTasks = await db.collection("blocks").find({type : "Task"}).toArray();
    let validRecurring = await db.collection("blocks").find({type:"Recurring", repeatValue : day}).toArray();
    
    let blocks = new Schedule([...validEvents, ...validTasks, ...validRecurring]);

    sortedBlocks = blocks.sortedBlocks
    console.log(sortedBlocks)
    response.redirect("/block-creator")
})

// what do to next:
// adjust repeatValue entry for recurring blocks to be easily searchable in the database based on the repeatType 

const floatToHours = (float) => {
    let hour = (Math.floor(float)).toString();
    let minutes = (Math.floor((float % 1)*60)).toString();
    if(minutes.length === 1){
        minutes = "0" + minutes;
    }
    return `${hour}:${minutes}`;
    return `${Math.floor(float)}:${Math.floor((float%1)*60)}`
}
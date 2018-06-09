const express = require('express');
const bodyParser = require("body-parser");
const app = express();
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
const MongoClient = require("mongodb").MongoClient;
MongoClient.connect.useNewUrlParser =  true;

const Task = require("./Task");
const Recurring = require("./Recurring");

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



app.post("/event-blocks", (request, response) => {
    // sone new comment to test nodemon
    request.body.type = 'Event';
    request.body.open = true;
    request.body.fixed = true;
    request.body.priority = null;
    request.body.concurrent = false;

    db.collection('blocks').save(request.body, (err, results) => {
        if(err) return console.log(err);
        // console.log('saved to database');
        response.redirect("/block-creator");
    })
});

app.post("/task-blocks", (request, response) => {
    request.body.type = "Task";
    request.body.requiredTime = floatToHours(request.body.requiredTime);
    request.body.open = true;
    request.body.fixed = false;
    request.body.concurrent = false;
    request.body.remainingTime = request.body.requiredTime;

    let submittedTask = new Task(request.body);

    db.collection("blocks").save(submittedTask, (err, results) => {
        if(err) return console.log(err);
        response.redirect("/block-creator");
    })
})

app.post("/recurring-blocks", (request, response) => {
    request.body.type = "Recurring";
    request.body.requiredTime = floatToHours(request.body.requiredTime);
    request.body.open = true;
    request.body.fixed = false;
    request.body.concurrent = false;
    
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
    
    let validEvents = await db.collection("blocks").find({type : "Event", date : "2018-10-10"}).toArray();
    let validTasks = await db.collection("blocks").find({type : "Task"}).toArray();
    let validRecurring = await db.collection("blocks").find({type:"Recurring"}).toArray();

    let dynamicBlocks = [...validTasks, ...validRecurring].sort((a,b) => {
        return b.priority - a.priority;
    })
    console.log(dynamicBlocks);
    
    response.redirect("/block-creator")
})



const floatToHours = (float) => {
    let hour = (Math.floor(float)).toString();
    let minutes = (Math.floor((float % 1)*60)).toString();
    if(minutes.length === 1){
        minutes = "0" + minutes;
    }
    return `${hour}:${minutes}`;
    return `${Math.floor(float)}:${Math.floor((float%1)*60)}`
}
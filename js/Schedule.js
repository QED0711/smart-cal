
const Event = require("../Blocks/Event");
const Task = require("../Blocks/Task");
const Recurring = require("../Blocks/Recurring");


class Schedule {
    constructor(blocksArr){
        this.blocks = this.modifyBlocks(blocksArr);
        this.sortedBlocks = this.sortPriority();
    }

    modifyBlocks(blocks){
        let modifiedBlocks = [];
        for(let i = 0; i < blocks.length; i++){
            switch(blocks[i].type){
                case("Event"):
                    modifiedBlocks.push(new Event(blocks[i]));
                    break;
                case("Task"):
                    modifiedBlocks.push(new Task(blocks[i]));
                    break;
                case("Recurring"):
                    modifiedBlocks.push(new Recurring(blocks[i]));
                    break;
            }
        }
        return modifiedBlocks;
    }

    sortPriority(){
        //  srot event blocks based on start time
        let eventBlocks = [];
        for(let block of this.blocks){
            if(block.type === "Event"){
                eventBlocks.push(block);
            }
        }
        eventBlocks = eventBlocks.sort((a, b) => {
            return a.startTimeToMinute() - b.startTimeToMinute();
        })

        // sort Task and recurring blocks based on priority
        let dynamicBlocks = [];
        for(let block of this.blocks){
            if(block.type === "Task"){
                block.adjustPriority();
            }
            if(block.type !== "Event"){
                dynamicBlocks.push(block)
            }
        }
        dynamicBlocks = dynamicBlocks.sort((a,b) => {
            return b.priority - a.priority
        })

        // Add all blacks back together
        return [...eventBlocks, ...dynamicBlocks];

    }

}






module.exports = Schedule;

// step 1: get all valid blocks and place them into an array
// step 2: add class functions to all blocks
// step 3: Create a new array and place any event blocks at the front
// step 4: run adjustPriority method on Task and Recurring Blocks
// step 5: sort task and recurring blocks according to their priority (highest first)
// step 6: concat Event blocks with Task/Recurring blocks 
// step 7: return this sorted array
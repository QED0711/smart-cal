let testBlocks = require("./testDB");

function blockFilter(blocksArr, typeFilter){
    return blocksArr.filter((block) => {
        return block.type === typeFilter;
    })
}

console.log(blockFilter(testBlocks, "Event"));
console.log(blockFilter(testBlocks, "Task"));
console.log(blockFilter(testBlocks, "Recurring"));
const mongoose = require("mongoose");
const Polls  = require("../models/polls")
require("./mongoose");

const poll = {
    _id: new mongoose.Types.ObjectId(),
    question: "Which frontend technology do you like the most?",
    option1: "React",
    option2: "Angular",
    option3: "Vue",
    option4: "Next"
};


const setUpDatabase = async ()=>{
    await Polls.deleteMany();
    await new Polls(poll).save();
    await mongoose.disconnect();
}

setUpDatabase();
const Polls = require("../../mongoose/models/polls");
const mongoose = require("mongoose");

const poll = {
    _id: new mongoose.Types.ObjectId(),
    question: "Which front-end technology do you prefer the most?",
    option1: "React",
    option2: "Angular",
    option3: "Vue",
    option4: "Next",

};

const setUpDatabase = async () => {
    await Polls.deleteMany();
    await new Polls(poll).save();

};

module.exports = {
    setUpDatabase,
    poll,

};
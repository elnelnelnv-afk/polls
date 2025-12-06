const express = require("express");
const Polls = require("../mongoose/models/polls")
const pollsRouter = new express.Router();

pollsRouter.put("/polls/create", async (req, res) => {
    const data = req.body;

    const { question, option1, option2, option3, option4 } = data;
    const normalizedFields = [question, option1, option2, option3, option4]
        .map(f => (f ?? "").toString().trim().toLowerCase());
    const hasEmpty = normalizedFields.some(f => f.length === 0);
    const options = normalizedFields.slice(1);
    const hasDuplicateOptions = new Set(options).size !== 4;


    if (hasEmpty || hasDuplicateOptions) {
        return res.status(400).json({ error: "All options must be unique and inputs should not be empty" })
    }
    try {
        const newPoll = await Polls.findOneAndUpdate(
            { question: question },
            { question, option1, option2, option3, option4 },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        res.status(200).json({ message: "Poll created successfully.", newPoll })
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
})

pollsRouter.get("/polls/fetch", async (req, res) => {
    try {
        const polls = await Polls.find({});
        if (!polls)
            res.status(400).json({ "error": "Poll not found. Please create a poll" })
        res.status(200).json(polls)

    } catch (error) {
        res.status(400).json(error.message)
    }
});

module.exports = pollsRouter
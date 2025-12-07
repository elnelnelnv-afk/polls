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
        const poll = await Polls.findOne({});
        if (!poll)
            res.status(400).json({ "error": "Poll not found. Please create a poll" })
        res.status(200).json(poll)

    } catch (error) {
        res.status(400).json(error.message)
    }
});

/**
 * Route 3
 * PATCH /polls/updateVotes
 *
 * Purpose:
 *  - Increment the vote count for the option specified in the request body (`selectedOption`).
 *  - Recalculate the vote percentages for all poll options based on updated vote counts.
 *  - Update the poll document with both new counts and new percentages.
 *
 * Request Body:
 *  {
 *    "selectedOption": "option1" | "option2" | "option3" | "option4"
 *  }
 *
 * Behavior:
 *  - Validates that `selectedOption` is provided and matches one of the allowed option keys.
 *  - Increments the vote count for the chosen option.
 *  - Computes updated percentages for all options using:
 *        percentage = (votes_of_option / total_votes) * 100
 *  - Saves updated vote counts and percentages back to the database.
 *
 * Success Response:
 *  Status: 200
 *  Body: { "message": "Vote registered successfully." }
 *
 * Error Response:
 *  Status: 400
 *  Body: { "error": "<Respective error message>" }
 */

pollsRouter.patch("/polls/updateVotes", async (req, res) => {
    const body = req.body;

    if (!body?.selectedOption || !(["option1", "option2", "option3", "option4"].includes(body.selectedOption))) {
        return res.status(400).json({ error: "Invalid option selected." });
    }
    const { selectedOption } = body
    try {
        const poll = await Polls.findOne({})

        poll[`${selectedOption}Votes`] += 1;

        const totalVotes = poll.option1Votes + poll.option2Votes + poll.option3Votes + poll.option4Votes;

        for (let i = 1; i <= 4; i++) {
            poll[`option${i}Percentage`] = (poll[`option${i}Votes`] / totalVotes) * 100;
        }

        await poll.save();

        res.status(200).json({ message: "Vote registered successfully." })

    } catch (error) {
        res.status(400).json({ error: error.message })
    }

})


module.exports = pollsRouter
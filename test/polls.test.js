const app = require("../app");
const request = require("supertest");
const { setUpDatabase, poll } = require("./utils/testDb");
const Polls = require("../mongoose/models/polls");

beforeEach(setUpDatabase);

//adding new question to poll
test("#CreateRecord - Adding new question to poll", async () => {
    await request(app).put("/polls/create").send({
        question: "Which front-end technology do you prefer the most?",
        option1: "Nodejs",
        option2: "Springboot",
        option3: "Django",
        option4: "Ruby on Rials"
    }).expect(201);
    const questions = await Polls.find();
    expect(questions.length).toBe(1);
    expect(questions[0].question).toBe("Which front-end technology do you prefer the most?");
    expect(questions[0].option1).toBe("Nodejs");
    expect(questions[0].option4).toBe("Ruby on Rials");
    expect(questions[0].option1Votes).toBe(0);
    expect(questions[0].option3Votes).toBe(0);
    expect(questions[0].option2Percentage).toBe(0);
    expect(questions[0].option4Percentage).toBe(0);

});

//throws error when request body has invalid attributes
test("#SchemaValidation - Throws error on adding new question with invalid fields", async () => {
    const response = await request(app).put("/polls/create").send({
        question: "Which front-end technology do you prefer the most?",
        option0: "Nodejs",
        option1: "Springboot",
        option2: "Django",
        option3: "Ruby on Rials"
    }).expect(400);

});

//throws error when request body has duplicate values
test("#BusinessValidation - Throws error on duplicate options and values with blank spaces", async () => {
    const response = await request(app).put("/polls/create").send({
        question: "Which front-end technology do you prefer the most?",
        option1: " ",
        option2: "Springboot",
        option3: "Django",
        option4: "Django"
    }).expect(400);
    expect(response.body.error).toContain("All options must be unique and inputs should not be empty");
});

//getting the poll from db
test("#GetRecord - Getting poll from DB", async () => {
    const response = await request(app).get("/polls/fetch").expect(200);
    expect(response.body.question).toBe(poll.question);
    expect(response.body.option1).toBe(poll.option1);
    expect(response.body.option2).toBe(poll.option2);
    expect(response.body.option3).toBe(poll.option3);
    expect(response.body.option4).toBe(poll.option4);

});

//throws error when no poll is found
test("#ErrorHandling - Throws error when no poll found in DB", async () => {
    await Polls.deleteMany();
    const response = await request(app).get("/polls/fetch").expect(400);
    expect(response.body.error).toContain("Poll not found. Please create a poll");
});

//updating votes
test("#UpdateRecord - Updating votes in poll casel", async () => {
    await request(app).patch("/polls/updateVotes").send({
        selectedOption: 'option1'
    }).expect(200);
    const question = await Polls.findById(poll._id);
    expect(question.option1Votes).toBe(1);
    expect(question.option2Votes).toBe(0);
    expect(question.option3Votes).toBe(0);
    expect(question.option4Votes).toBe(0);
    expect(question.option1Percentage).toBe(100);
    expect(question.option2Percentage).toBe(0);
    expect(question.option3Percentage).toBe(0);
    expect(question.option4Percentage).toBe(0);
});

//updating votes
test("#UpdateRecord - Updating votes in poll case2", async () => {
    await request(app).patch("/polls/updateVotes").send({
        selectedOption: 'option1'
    }).expect(200);
    await request(app).patch("/polls/updateVotes").send({
        selectedOption: 'option3'
    }).expect(200);
    const question = await Polls.findById(poll._id);
    expect(question.option1Votes).toBe(1);
    expect(question.option2Votes).toBe(0);
    expect(question.option3Votes).toBe(1);
    expect(question.option4Votes).toBe(0);
    expect(question.option1Percentage).toBe(50);
    expect(question.option2Percentage).toBe(0);
    expect(question.option3Percentage).toBe(50);
    expect(question.option4Percentage).toBe(0);
});

//updating votes
test("#UpdateRecord - Updating votes in poll case3", async () => {
    await request(app).patch("/polls/updateVotes").send({
        selectedOption: 'option1'
    }).expect(200);
    await request(app).patch("/polls/updateVotes").send({
        selectedOption: 'option2'
    }).expect(200);
    await request(app).patch("/polls/updateVotes").send({
        selectedOption: 'option1'
    }).expect(200);
    const question = await Polls.findById(poll._id);
    expect(question.option1Votes).toBe(2);
    expect(question.option2Votes).toBe(1);
    expect(question.option3Votes).toBe(0);
    expect(question.option4Votes).toBe(0);
    expect(question.option1Percentage).toBe(66.67);
    expect(question.option2Percentage).toBe(33.33);
    expect(question.option3Percentage).toBe(0);
    expect(question.option4Percentage).toBe(0);
});
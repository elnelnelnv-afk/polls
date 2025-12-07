````md
# Polling Application – MERN Stack

A full-stack polling application that allows users to **create polls**, **register votes**, and **view poll results**.  
The project includes a **ReactJS front-end** and a **NodeJS + MongoDB back-end**.  
Front-end test cases are written in **Jest + React Testing Library**, and the goal is to ensure all tests pass without compilation errors.

---

## Front-End (ReactJS)

### Project Structure
- Main folder: `ReactJS/src/`
- Components folder: `ReactJS/src/components/`

---

## App Component (`src/App.js`)
- Serves as the main/root component.
- Displays a header with navigation links:
  - Create Poll
  - Register Vote
  - View Results
- Defines the following routes:

| Route Path        | Component      |
|------------------|----------------|
| `/`              | CreatePoll     |
| `/register-vote` | RegisterVote   |
| `/view-result`   | ViewResult     |

---

## Create Poll Component (`src/components/CreatePoll.js`)
Used for creating a new poll.

### Requirements
- Displays a form with:
  - Question
  - Option 1
  - Option 2
  - Option 3
  - Option 4
- On form submission:
  - If any field is empty, display  
    **`alert("Please fill in all the fields")`**
  - If valid, send:

    ```
    PUT http://localhost:8001/polls/create
    ```

### Sample Request Body
```json
{
  "question": "Which is the best front-end technology?",
  "option1": "React",
  "option2": "Angular",
  "option3": "Vue",
  "option4": "Next"
}
````

### Response Handling

* On success: show an alert with the backend success message.
* On error: show an alert with the backend error message.

---

## Register Vote Component (`src/components/RegisterVote.js`)

Used for registering a vote for an existing poll.

### Requirements

* Fetch poll details on component load:

  ```
  GET http://localhost:8001/polls/fetch
  ```

* Display:

  * The poll question in an `<h3>`
  * Each option as a clickable button

* When an option is clicked, send:

  ```
  PATCH http://localhost:8001/polls/updateVotes
  ```

### Sample Request Body

```json
{
  "selectedOption": "option1"
}
```

### Response Handling

* On success: show an alert with the backend success message.
* On error: show an alert with the backend error message.

---

## View Result Component (`src/components/ViewResult.js`)

Displays voting results with counts, percentages, and progress bars.

### Requirements

* Fetch poll details on component load:

  ```
  GET http://localhost:8001/polls/fetch
  ```

* Display:

  * Poll question
  * For each option:

    * Option name
    * Vote count
    * Vote percentage
    * Progress bar (inside a div with class: `option`)

---

# Back-End (NodeJS + MongoDB)

### Database

* **Database:** `polling-app`
* **Collection:** `polls`
* Only **one** document exists at any time; every update modifies this single document.

---

## MongoDB Schema (`polls.js`)

| Field             | Type     |
| ----------------- | -------- |
| _id               | ObjectId |
| question          | String   |
| option1           | String   |
| option2           | String   |
| option3           | String   |
| option4           | String   |
| option1Votes      | Number   |
| option2Votes      | Number   |
| option3Votes      | Number   |
| option4Votes      | Number   |
| option1Percentage | Number   |
| option2Percentage | Number   |
| option3Percentage | Number   |
| option4Percentage | Number   |
| __v               | Number   |

---

# API Routes (`src/routers/polls.js`)

## 1. **PUT `/polls/create`**

Deletes the existing poll and creates a new one.

### Validation Rules

* Question and all options must not be empty.
* All options must be unique.

### Error Response (400)

```json
{ "error": "All options must be unique and inputs should not be empty" }
```

### Success Response (201)

```json
{ "message": "Poll created successfully." }
```

### On server/db error

* Return error message with status **400**.

---

## 2. **GET `/polls/fetch`**

Fetches the existing poll.

### Success Response (200)

Returns the poll document.

### If collection is empty (400)

```json
{ "error": "Poll not found. Please create a poll" }
```

### On server/db error

* Return error message with status **400**.

---

## 3. **PATCH `/polls/updateVotes`**

Registers a vote and updates vote counts + percentage.

### Request Body Example

```json
{ "selectedOption": "option1" }
```

### Vote Update Behavior

* Increment the selected option’s vote count by 1.
* Recalculate percentages:

```
percentage = 100 * (optionVotes / totalVotes)
rounded to 2 decimal places
```

### Example Result

```
option1Votes = 1
option2Votes = 0
option3Votes = 0
option4Votes = 0

option1Percentage = 100
option2Percentage = 0
option3Percentage = 0
option4Percentage = 0
```

### Success Response (200)

```json
{ "message": "Vote registered successfully." }
```

### On error

* Return error message with status **400**.

---

## MongoDB Commands

View current poll document:

```
db.polls.find()
```

```
```

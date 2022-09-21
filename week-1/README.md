# Week 1

This week is an introduction to Node.js, Express, and unit testing with Jest. The focus of this week will be on getting comfortable with the development environment, tools, and best practices in back-end development.

## Learning Objectives

At the end of this week, a student should:
- be able to navigate an Express API and understand what it does
- know how to run a local Express server and test its endpoints manually
- be comfortable reading and working with unit tests
- be able to build a simple in-memory REST API

## The assignment

The assignment this week is designed to get you comfortable working in an Express server. It is meant to get you aquainted with a project of the type we will be working in during this course. It contains a simple set of REST endpoints for a generic data type (`items`). You will complete the code for this REST API to meet the requirements as defined in the test suite.

### Getting started

1. Make sure you have a recent version of [Node.js](https://nodejs.org/en/download/) installed on your computer. I am using Node v16.15, but anything above 14 will be fine.
2. Ensure you have git and github set up on your computer. If you do not, please follow this guide: https://help.github.com/en/github/getting-started-with-github.
3. Fork this repository and clone it locally. 
4. In your terminal, from inside this project directory, run `npm install` to install the project dependencies.
5. Run `npm start` to start your local server. You should see a logged statement telling you `Server is listening on http://localhost:5000`.
6. Use curl or API client of your choice to browse the various endpoints (8 in total) contained in this project. Practice calling all of them and getting 200 HTTP responses.
7. Run the unit tests of this project: `npm test`. Your test output should end in something like this:
```
Test Suites: 1 failed, 1 total
Tests:       7 failed, 2 passed, 9 total
```

This API has five routes:
```
GET /items
GET /items/:id
POST /items
PUT /items/:id
DELTE /items/:id
```

Express documentation: http://expressjs.com
Curl documentation: https://curl.se/docs/manpage.html
Jest documentation: https://jestjs.io/

*** Remember that changes to route handlers will not be reflected in responses until the server is restarted ***

### Your task

As you can see, there is a simple set of unit tests (routes/items.test.js) for this project's routes. However, the routes have not been fully implemented yet. Your task is to implement the route definitions (in routes/items.js) and data interface functions (in dataInterface/items.js) necessary to get all the tests to pass.  The tests define the requirements, read the test file thoroughly. To get full credit for this assignment, all the tests must pass without any changes to routes/items.test.js.

### Grading

Rubric:

Component | Points
--------- | --------
All tests, as originally written, are passing | 50
Newly written code is valid javascript that runs without errors | 35
Newly written code is sensible | 15

Extra credit:

For 10 extra points, add a new test to items.test.js. It may be for an existing piece of API functionality or something that requires additional code in the data interface or routes files. Ideas: What happens when a delete request is made with an invalid id parameter? What happens when a post or put request is made with no data in the "field" parameter?

### Submission

- Create a pull request (PR) from your repository to the main branch of this repository with a title of your name.
- Continuous Integration is handled using Github Actions. This will automatically run your tests and show the results on your PR. If you see a red X and a message saying `All checks have failed` then you will not receive full credit. Ensure all tests are passing in order to receive full marks.


# Week 2

### API Documentation

### Basics

This documentation is written to describe access methods for the API endpoint available at http://localhost:5000/movies, which is the base url for access to the API once the express server is running. 

The server may be initialized via the `npm start` command, run from the directory containing the server files.

### Creating an item

To create a new entry in the movies database, a POST command may be used in conjunction with the information, in key-value format, that will be part of the new entry. Separate fields using commas.

**Example:**  
**Input:**  
`curl -X POST -H "Content-Type: application/json" -d '{"title":"NEW TITLE", "year": 2022}' http://localhost:5000/movies`  
**Possible Outputs & interpretation:**  
- "Item created! ID: <24-character ID here>" - Item created successfully.
- "Error" - Item was not created successfully; check the syntax of the creation command.
- "Internal server error, please try again later." - The server is experiencing an issue and a re-attempt should be made at a later time.

### Reading an item

The API supports GET requests, returning an array containing an object for each entry containing the title and year of the first ten entries of the collection.

**Example:**  
**Input:**  
`curl http://localhost:5000/movies`  
**Output:**  
[
  {"_id":"573a13f8f29313caabde8d7a","title":"The Treasure","year":2015},
  {"_id":"573a13d6f29313caabda10e6","year":2015,"title":"Knight of Cups"},
  ...,
  {"_id":"573a13f2f29313caabddd3b6","title":"Bang Gang (A Modern Love Story)",
"year":2015}
]

An entry ID (`_id` parameter, see "Reading an item") may be used to return the full entry of a single item. IDs will typically be alphanumeric strings 24 characters in length. You may expect a return object containing the item's data.

**Example:**  
**Input:**  
`curl http://localhost:5000/movies/573a13f2f29313caabddd3b6`  
**Successful Output:**  
{"_id":"573a13f2f29313caabddd3b6",..."countries":["France"],"type":"movie"}

The API supports limited title search functionality. The `/search/` path and full title of the movie must be appended to the base URL. This returns an array of objects with each item's data.  
**Unsuccessful Output & interpretation:**  
"That id doesn't exist" - check the input ID

A movie title may be used to return the full entry of a single item. The title should be correctly spelled; "close enough" spellings will result in an error. You may expect a return object containing the item's data.

**Example:**  
**Input:**  
`curl http://localhost:5000/movies/search/Titanic`  
**Output & interpretation:**  
- [
  {"_id":"573a1394f29313caabcdf639",..."production":"20th Century Fox","fresh":8}},
  {"_id":"573a139af29313caabcefb1d",..."num_mflix_comments":0},
  {"_id":"573a139af29313caabcf0d74",..."directors":["James Cameron"],"runtime":194}
]  
- "That title wasn't found." - Check the input movie title for errors.

### Updating an item

The API supports updating items with new fields, allowing a single, or multiple, fields to be inserted.

**Example:**  
**Input:**  
`curl -X PUT -H "Content-Type: application/json" -d '{"field3":"updated value 1", "NewField":"NewValue1"}' http://localhost:5000/movies/62d4c19202454278a89b13ec`  
**Possible Outputs & Interpretation:**  
- "That id doesn't exist" - Check the input ID.
- "# items updated - Update successful.

If updating an existing field is necessary, the existing field name(s) may be passed in with the new value, and the values will be updated.

### Deleting an item

The API supports deleting entries via the `_id` parameter of the entry item. 

**Example:**  
**Input:**  
`curl -X DELETE http://localhost:5000/movies/573a13f2f29313caabddd3b6`  
**Possible Outputs & Interpretation:**  
- "Movie Id length incorrect." - Check the length of the input ID.
- "Error occured while attempting to delete." - ID may not exist in the database.
- "573a13f2f29313caabddd3b6 deleted." - Deletion successful.
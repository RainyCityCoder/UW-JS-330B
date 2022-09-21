# ADVANCED MONGO

This is a starter codebase to implement more advanced techniques with MongoDB.

## Developing This API

To get started in development:

1. Make sure you have version 14 or 16 of [Node.js](https://nodejs.org/en/download/) installed on your computer.
2. In your terminal, from inside this project directory, run `npm install` to install the project dependencies.
3. Run `npm start` to start the local server. You should see a logged statement telling you `Server is listening on http://localhost:5000`.
4. Use curl or API client of your choice to browse the various endpoints (8 in total) contained in this project. Practice calling all of them and getting 200 HTTP responses.

This codebase includes Nodemon (https://nodemon.io/); the server will update to reflect code changes within 2 seconds, no need to manually restart it.

### Testing

This codebase uses Jest (https://jestjs.io/) and Supertest (https://github.com/visionmedia/supertest). As you develop, ensure existing tests continue passing, and write new tests for each function added. Tests should cover positive and negative cases. All test files should have names that end in `.test.js` so Jest picks them up.

Run unit tests: `npm test`.


## Using This API

There are five routes available:
```
GET /movies
GET /movies/:id
POST /movies
PUT /movies/:id
DELETE /movies/:id
```

### Get All Movies

Example good request: `curl http://localhost:5000/movies`

Example response: `[{"_id":"843902", "title":"Jurassic Park"}, {"_id":"0109890", "title":"Taken"}]`

### Get One Movie

Path id parameter can be either an id or URL encoded title (must be capitalized correctly). Responses for failures will include a field of `error`.

Example good requests:
`curl http://localhost:5000/movies/Band%20of%20Brothers`,
`curl http://localhost:5000/movies/573a1`

Example response:
```
{
  "_id":"573a1",
  "plot":"The story of ...",
  "genres":["Action","Drama","History"],
  "runtime":705,
  "cast":["Scott Grimes","Matthew Leitch"],
  "num_mflix_comments":0,
  "poster":"https://m.media-amazon.com/images/M/M.jpg",
  "title":"Band of Brothers",
  "fullplot":"This is the story of...",
  "languages":["English","Lithuanian"],
  "released":"2001-09-09T00:00:00.000Z",
  "rated":"TV-MA",
  "awards": {
    "wins":34,
    "nominations":24,
    "text":"Won 1 Golden Globe. Another 33 wins & 24 nominations."
  },
  "lastupdated":"2015-08-31 00:04:34.187000000",
  "year":2001,
  "imdb": {
    "rating":9.6,
    "votes":183802,
    "id":185906
  },
  "countries":["UK","USA"],
  "type":"series",
  "tomatoes": {
    "viewer":{
      "rating":2,
      "numReviews":15
    },
    "dvd":"2009-03-17T00:00:00.000Z",
    "lastUpdated":"2015-09-12T17:15:33.000Z"
  }
}
```

Example response if movie cannot be found: `{"error":"No item found with identifier 673a1."}`

### Create a Movie

The body must include a `title` field. Responses for failures will include a field of `error`.

Example good request: `curl -X POST -H "Content-Type: application/json" -d '{"title":"Llamas From Space", "plot":"Aliens..."}' http://localhost:5000/movies`

Example response: `{"newObjectId":"62d63","message":"Item created! ID: 62d63"}`

Example bad request: `curl -X POST -H "Content-Type: application/json" -d '{"plot":"Aliens..."}' http://localhost:5000/movies`

Example response: `{"error":"Movies must have a title."}`

Example response if create fails for other reason: `{"error":"Something went wrong. 0 movies were updated. Please try again."}`

### Update a Movie

Only the `title` and `plot` fields will be updated. Any other fields sent in the body will be ignored. Responses for failures will include a field of `error`.

Example good request: `curl -X PUT -H "Content-Type: application/json" -d '{"plot":"Sharks!"}' http://localhost:5000/movies/573a1`

Example response:
```
{
  "_id":"573a1",
  "plot":"Sharks!",
  "genres":["Action","Drama","History"],
  "runtime":705,
  "cast":["Scott Grimes","Matthew Leitch"],
  "num_mflix_comments":0,
  "poster":"https://m.media-amazon.com/images/M/M.jpg",
  "title":"Band of Brothers",
  "fullplot":"This is the story of...",
  "languages":["English","Lithuanian"],
  "released":"2001-09-09T00:00:00.000Z",
  "rated":"TV-MA",
  "awards": {
    "wins":34,
    "nominations":24,
    "text":"Won 1 Golden Globe. Another 33 wins & 24 nominations."
  },
  "lastupdated":"2015-08-31 00:04:34.187000000",
  "year":2001,
  "imdb": {
    "rating":9.6,
    "votes":183802,
    "id":185906
  },
  "countries":["UK","USA"],
  "type":"series",
  "tomatoes": {
    "viewer":{
      "rating":2,
      "numReviews":15
    },
    "dvd":"2009-03-17T00:00:00.000Z",
    "lastUpdated":"2015-09-12T17:15:33.000Z"
  }
}
```

Example response if update fails: `{"error":"Something went wrong. 0 movies were updated. Please try again."}`

### Delete a Movie

Responses for successes will include a field of `message`. Responses for failures will include a field of `error`.

Example good request: `curl -X DELETE http://localhost:5000/movies/573a1`

Example response: `{"message":"Deleted 1 movie"}`

Example failure response: `{"error":"Something went wrong. 0 movies were deleted. Please try again."}`
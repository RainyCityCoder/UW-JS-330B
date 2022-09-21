const { Router } = require("express");
const router = Router();
// "protecting" a route with the auth code:
const auth = require('../auth');

const movieData = require('../dataInterface/movies');

// curl http://localhost:5000/movies
router.get("/", async (req, res, next) => {
  let movieList = await movieData.getAll()

  if(movieList){
    res.status(200).send(movieList)
  } else {
    // If movieList is empty/null, something serious is wrong with the MongoDB connection.
    res.status(500).send({error: "Something went wrong. Please try again."})
  }
});

// This route handles either id or title as an identifier.
// curl http://localhost:5000/movies/573a1390f29313caabcd4135
// curl http://localhost:5000/movies/Jurassic%20Park
router.get("/:id", async (req, res, next) => {
  const result = await movieData.getByIdOrTitle(req.params.id)

  if(result.error){
    resultStatus = 404;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);

});

// Protecting this route with auth code with 'auth.verifyToken' (module.method):
//Token-less curl for testing: curl -X POST -H "Content-Type: application/json" -d '{"title":"Llamas From Space", "plot":"Aliens..."}' http://localhost:5000/movies
// curl with token for testing: curl -X POST -H "Content-Type: application/json" -H "x-access-token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidGVzdDNAdGVzdC5jb20iLCJpYXQiOjE2NjEyMDk2MzV9.j1XUZoUVzoD6UwQS9FZgqladOoIDzSeZZOMS6mRovrs" -d  '{"title":"Llamas From Space 2", "plot":"Aliens..."}' http://localhost:5000/movies
router.post("/", auth.verifyToken, async (req, res, next) => {
  let resultStatus;
  let result = await movieData.create(req.body);

  if(result.error){
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});

// curl -X PUT -H "Content-Type: application/json" -d '{"plot":"Sharks..."}' http://localhost:5000/movies/573a13a3f29313caabd0e77b
router.put("/:id", async (req, res, next) => {
  let resultStatus;
  const result = await movieData.updateById(req.params.id, req.body)

  if(result.error){
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});

// curl -X DELETE http://localhost:5000/movies/573a1390f29313caabcd4135
router.delete("/:id", async (req, res, next) => {
  const result = await movieData.deleteById(req.params.id);

  if(result.error){
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});

// Comments for a Movie

// curl http://localhost:5000/movies/573a1390f29313caabcd4323/comments
router.get("/:movieId/comments", async (req, res) => {
  if (req.params.movieId.length != 24) {
    res.status(404).send("Please check the movie ID number.");
  } else {
    const result = await movieData.getAllComments(req.params.movieId);
    res.status(200).send(result);
  }
});

// curl http://localhost:5000/movies/573a1390f29313caabcd4323/comments/5a9427648b0beebeb69579e7
router.get("/:movieId/comments/:commentId", async (req, res) => {
  if (req.params.movieId.length != 24) {
    res.status(404).send("Please check the movie ID number.");
  } else if (req.params.commentId.length != 24) {
    res.status(404).send("Please check the comment ID number.");
  } else {
    const result = await movieData.getSingleComment(req.params.movieId, req.params.commentId);
    res.status(200).send(result);
  }
});

// curl -X POST -H "Content-Type: application/json" -d '{"name":"Username", "email":"user@host.com", "text":"Comment Text here" }' http://localhost:5000/movies/573a1390f29313caabcd4323/comments
router.post("/:movieId/comments", async (req, res) => {
  if (req.params.movieId.length != 24) {
    res.status(404).send("Please check the movie ID number.");
  } else {
    const result = await movieData.createComment(req.params.movieId, req.body);
    res.status(200).send(result)
  }
});

// curl -X PUT -H "Content-Type: application/json" -d '{"text":"This is replacement text"}' http://localhost:5000/movies/573a1391f29313caabcd80db/comments/5a9427648b0beebeb6957b6e
router.put("/:movieId/comments/:commentId", async (req, res) => {
  if (req.params.movieId.length != 24) {
    res.status(404).send("Please check the movie ID number.");
  } else if (req.params.commentId.length != 24) {
    res.status(404).send("Please check the comment ID number.");
  } else {
    const result = await movieData.updateById(req.params.commentId, req.body);
    res.status(200).send(`${result} comment(s) updated.`)
  }  
});

// curl -X DELETE http://localhost:5000/movies/573a1397f29313caabce75fe/comments/62d741e1022012d6f654f851
router.delete("/:movieId/comments/:commentId", async (req, res) => {
  if (req.params.movieId.length != 24) {
    res.status(404).send("Please check the movie ID number.");
  } else if (req.params.commentId.length != 24) {
    res.status(404).send("Please check the comment ID number.");
  } else {
    const result = await movieData.deleteCommentById(req.params.commentId);
    res.status(200).send(`${result} comment(s) deleted.`)
  }
});

module.exports = router;
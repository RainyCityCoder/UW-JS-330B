// In-class & homework exercises.

const { Router } = require("express");
const router = Router();

const movieData = require('../dataInterface/movies');

router.get("/", async (req, res, next) => {
  let movieList = await movieData.getAll();
  res.status(200).send(movieList);
});

// curl http://localhost:5000/movies/id#
router.get("/:id", async (req, res, next) => {
  let answer = await movieData.getById(req.params.id);
  if (answer) {
    res.status(200).send(answer);
  } else {
    res.status(404).send({ error: `That id doesn't exist.` });
  }
});

// curl http://localhost:5000/movies/search/
router.get("/search/:title", async (req, res, next) => {
// To Do
  const movieByTitle = await movieData.getByTitle(req.params.title); //path param (/path/path)
  //req.query.title to access query parameters (?title=) & a const bodyParser = require("body-parser") statement @ top of code
  if (movieByTitle.length == 0) {
    res.status(404).send({ error: "That title wasn't found." })
  } else {
    res.status(200).send(movieByTitle);
  }
});

// curl -X POST -H "Content-Type: application/json" -d '{"title":"NEW TITLE"}' http://localhost:5000/movies
router.post("/", async (req, res, next) => {
  let result = await movieData.create(req.body);
  if (!result) {
    res.status(500).send({ error: "Internal server error, please try again later." })
  } else {
  res.status(200).send(result);
  }
});

// curl -X PUT -H "Content-Type: application/json" -d '{"field":"updated value"}' http://localhost:5000/movies/7
router.put("/:id", async (req, res, next) => {
  let answerTwo = await movieData.updateById(req.params.id, req.body);
  if (answerTwo == -1) {
    res.status(404).send({ error: `That id doesn't exist.` })
  } else {
    res.status(200).send(`${answerTwo} items updated.`);
  }
});

// curl -X DELETE http://localhost:5000/movies/7
router.delete("/:id", async (req, res, next) => {
  let deletedCount = await movieData.deleteById(req.params.id);
  if (deletedCount == -1) {
    res.status(404).send( {error: "Movie Id length incorrect."} )
  } else if (deletedCount == 0) {
    res.status(400).send( {error: "Error occured while attempting to delete."} )
  } else {
    res.status(200).send(`${req.params.id} deleted.`);
  }
});

module.exports = router;

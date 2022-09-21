const { Router } = require("express");
const router = Router();

const itemData = require('../dataInterface/items');

router.get("/", (req, res, next) => {
  res.status(200).send(itemData.getAll())
});

// curl http://localhost:5000/items/id#
router.get("/:id", (req, res, next) => {
  let answer = itemData.getById(req.params.id);
  if (answer) {
    res.send(answer);
  } else {
    res.status(404).send({ error: `That id doesn't exist.` });
  }
});

router.post("/", (req, res, next) => {
  itemData.create(req.body);
  res.sendStatus(200);
});

// curl -X PUT -H "Content-Type: application/json" -d '{"field":"example 4"}' http://localhost:5000/items/7
router.put("/:id", (req, res, next) => {
  let bodyOfReq = req.body;
  console.log(`bodyOfReq: ${bodyOfReq}`);
  let answerTwo = itemData.updateById(req.params.id, bodyOfReq);
  console.log(`answerTwo: ${answerTwo}`);
  if (answerTwo) {
    res.status(200).send(answerTwo);
  } else {
    res.status(200).send({ error: `That id doesn't exist.` })
  }
});

// curl -X DELETE http://localhost:5000/items/7
router.delete("/:id", (req, res, next) => {
  let answerThree = itemData.deleteById(req.params.id);
  if (answerThree) {
    res.status(200).send({ msg: 'great success' });
  }
});

module.exports = router;

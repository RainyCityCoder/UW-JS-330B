const { Router } = require("express");
const router = Router();

const userData = require('../dataInterface/users');

// curl -X POST -H "Content-Type: application/json" -d '{"email":"test3@test.com", "password":"password", "name":"Test3"}' http://localhost:5000/users/login
router.post("/login", async (req, res, next) => {
  let resultStatus;

  let result = await userData.findByCredentials(req.body);
  // console.log(`/routes/users/login req.body:`); //for testing purposes
  // console.log("RESULT: ", result); //for testing purposes

  if(result.error){
    resultStatus = 404;
  } else {
    resultStatus = 200;
  }
  //Note: 'next' isn't necessary as argument as handler will finish request/response cycle by send(result)
  res.status(resultStatus).send(result);
});

// curl -X POST -H "Content-Type: application/json" -d '{"email":"test3@test.com", "password":"password"}' http://localhost:5000/register
router.post("/register", async (req, res, next) => {
  let resultStatus;
  let result = await userData.create(req.body);
  if(result.error){
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }
  res.status(resultStatus).send(result);  
});

module.exports = router;
const request = require("supertest");
const server = require("../server");

//Define mock before require statement
jest.mock("../dataInterface/movies")
const movieData = require("../dataInterface/movies");

describe("/movies routes", () => {

  beforeEach(() => {
    
  });

  describe("GET /", () =>{
    it("should return an array on success", async () => {
      // {title: "One"} is the (mocked) value we want the getAll method to return, to test behavior of our router code
      movieData.getAll.mockResolvedValue([{title: "Placeholder"}]);
      // This [call to the route handler] syntax is from supertest library, which allows us to make requests to server endpoints from test file(s): send request to server using .get method & /movies endpoint
      const res = await request(server).get('/movies');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.error).not.toBeDefined();
    });

    it("should return an error message on error", async () => {
      movieData.getAll.mockResolvedValue(null);
      const res = await request(server).get('/movies');
      expect(res.statusCode).toEqual(500);
      expect(res.body.error).toBeDefined();
    })

  });

  describe("GET /:movieId/comments", () =>{
    it("should return an array on success", async () => {
      movieData.getAllComments.mockResolvedValue([{title: "Placeholder"}]);
      const res = await request(server).get('/movies/573a1390f29313caabcd4323/comments');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return an error code on error", async () => {
      movieData.getAllComments.mockResolvedValue(null);
      const res = await request(server).get('/movies/573a1390f29313caabcd432/comments');
      expect(res.statusCode).toEqual(404);
    });
  });

  describe("POST /:movieId/comments", () =>{
    it("should return a message on success", async () => {
      movieData.createComment.mockResolvedValue({title: "Placeholder"});
      const res = await request(server).get('/movies/573a1390f29313caabcd4323/comments');
      expect(res.statusCode).toEqual(200);
      expect(Object.entries(res.body)).toBeDefined();
    });
    it("should return an error code on error", async () => {
      movieData.createComment.mockResolvedValue(null);
      const res = await request(server).get('/movies/573a1390f29313caabcd432/comments');
      expect(res.statusCode).toEqual(404);
      expect(Object.entries(res.body)).toBeDefined();
    });
  });

  describe("PUT /:id", () =>{
    it("should return a message on success", async () => {
      movieData.updateById.mockResolvedValue("Placeholder text");
      const res = await request(server).get('/movies/573a1391f29313caabcd80db/comments/5a9427648b0beebeb6957b6e');
      expect(res.statusCode).toEqual(200);
      expect(Object.entries(res.body)).toBeDefined();
    });
    it("should return an error code on movieId error", async () => {
      movieData.updateById.mockResolvedValue("Placeholder text");
      const res = await request(server).get('/movies/573a1391f29313caabcd80d/comments/5a9427648b0beebeb6957b6e');
      expect(res.statusCode).toEqual(404);
      expect(Object.entries(res.body)).toBeDefined();
    });
    it("should return an error code on commentId error", async () => {
      movieData.updateById.mockResolvedValue("Placeholder text");
      const res = await request(server).get('/movies/573a1391f29313caabcd80db/comments/5a9427648b0beebeb6957b6');
      expect(res.statusCode).toEqual(404);
      expect(Object.entries(res.body)).toBeDefined();
    });
  });

  describe("DELETE /:id", () =>{
    it("should return a message on success", async () => {
      movieData.deleteCommentById.mockResolvedValue("Placeholder text");
      const res = await request(server).get('/movies/573a1391f29313caabcd80db/comments/5a9427648b0beebeb6957b6e');
      expect(res.statusCode).toEqual(200);
      expect(Object.entries(res.body)).toBeDefined();
    });
    it("should return an error code on movieId error", async () => {
      movieData.deleteCommentById.mockResolvedValue("Placeholder text");
      const res = await request(server).get('/movies/573a1391f29313caabcd80d/comments/5a9427648b0beebeb6957b6e');
      expect(res.statusCode).toEqual(404);
      expect(Object.entries(res.body)).toBeDefined();
    });
    it("should return an error code on commentId error", async () => {
      movieData.deleteCommentById.mockResolvedValue("Placeholder text");
      const res = await request(server).get('/movies/573a1391f29313caabcd80db/comments/5a9427648b0beebeb6957b6');
      expect(res.statusCode).toEqual(404);
      expect(Object.entries(res.body)).toBeDefined();
    });
  });
});
const request = require("supertest");
const server = require("../server");

//Define mock before require statement
jest.mock("../dataInterface/weather")
const weatherData = require("../dataInterface/weather");

describe("/weather routes", () => {

  beforeEach(() => {    
  });

  describe("GET /:callLetter", () =>{
    it("should return an array on success", async () => {
      // {weather: "Placeholder"} is the (mocked) value we want the getAll method to return, to test behavior of our router code
      weatherData.getAllByCallLetter.mockResolvedValue([{weather: "Placeholder"}]);
      // This [call to the route handler] syntax is from supertest library, which allows us to make requests to server endpoints from test file(s): send request to server using .get method & /weather/<a specific callLetter> endpoint
      const res = await request(server).get('/weather/VCSZ');
      expect(res.statusCode).toEqual(200); 
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.error).not.toBeDefined();
    });

    it("should return an error message on error", async () => {
      weatherData.getAllByCallLetter.mockResolvedValue(null);
      const res = await request(server).get('/weather/VCSZ');
      expect(res.statusCode).toEqual(500);
      expect(res.body.error).toBeDefined();
    })
  });

  describe("GET /", () =>{
    it("should return an array on success", async () => {
      weatherData.getByParameter.mockResolvedValue([{weather: "Placeholder"}]);
      const res = await request(server).get('/weather');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.error).not.toBeDefined();
    });

    it("should return an error message on error", async () => {
      weatherData.getByParameter.mockResolvedValue(null);
      const res = await request(server).get('/weather');
      expect(res.statusCode).toEqual(500);
      expect(res.body.error).toBeDefined();
    })
  });

  describe("POST /", () =>{
    it("should return an object on success", async () => {
      weatherData.createWeatherDocument.mockResolvedValue({weather: "Placeholder"});
      const res = await request(server).post('/weather');
      expect(res.statusCode).toEqual(200);
      expect(Object.entries(res.body)).toBeDefined();
    });
    it("should return an error code and message on error", async () => {
      weatherData.createWeatherDocument.mockResolvedValue(null);
      const res = await request(server).post('/weather');
      expect(res.statusCode).toEqual(500);
      expect(Object.entries(res.body)).toBeDefined();
    });
  });
});

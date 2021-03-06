import getUser from "../controllers/user";

const mockRequest = () => {
  return {};
};

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe.skip("this is a user test", () => {
  test("getUser() returns status and user details", () => {
    const req: any = mockRequest();
    const res = mockResponse();

    getUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      firstName: "Jane",
      lastName: "Doe",
      email: "janedoe@email.com",
      id: 1,
    });
  });
});

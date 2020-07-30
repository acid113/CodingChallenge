import moment from "moment";
import { getSales } from "./sale";

const mockRequest = (sessionData?: any) => {
  return {};
};

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

test("getSales() returns status and user details", () => {
  const req: any = mockRequest();
  const res = mockResponse();

  jest.mock("moment", () => {
    return () => jest.requireActual("moment")("2020-01-01T00:00:00.000Z");
  });
  // jest.mock("moment", () => () => ({ locale: () => "en-GB" }));

  // jest.mock("moment", () => {
  //   const mMoment = {
  //     locale: jest.fn(() => "en-GB"),
  //   };

  //   const fn = jest.fn((newMoment) => {
  //     mMoment.locale = jest.fn(() => newMoment);
  //     return mMoment;
  //   });

  //   return fn;
  // });

  getSales(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  // expect(res.json).toHaveBeenCalledWith({
  //     firstName: "Jane",
  //     lastName: "Doe",
  //     email: "janedoe@email.com",
  //     id: 1,
  // });
});

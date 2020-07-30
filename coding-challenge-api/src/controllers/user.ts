import { Request, Response } from "express";

export function getUser(req: Request, res: Response) {
  // console.log("controller -> getUser()");
  return res.status(200).json({
    // return res.json({
    firstName: "Jane",
    lastName: "Doe",
    email: "janedoe@email.com",
    id: 1,
  });
}

export default getUser;

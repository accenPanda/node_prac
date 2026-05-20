import { Request, Response } from "express";
import { loginPageDetails } from "../data/loginPageDetails";

export const getLoginPageDetails = (_req: Request, res: Response): void => {
  res.status(200).json(loginPageDetails);
};

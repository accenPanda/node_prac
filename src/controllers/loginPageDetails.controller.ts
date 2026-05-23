import { Request, Response } from "express";
import { loginPageDetails } from "../data/loginPageDetails";

export const getLoginPageDetails = (_req: Request, res: Response): void => {
  res.status(200).json(loginPageDetails);
};

export const errorTest = (_req: Request, res: Response): void => {
  throw new Error("Application Insights test error");
};

export const slowAPI = async (_req: Request, res: Response): Promise<void> => {
    await new Promise(r => setTimeout(r, 3000));
  res.json({ ok: true });
};

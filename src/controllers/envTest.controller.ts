import { Request, Response } from "express";

export const checkEnv = (req: Request, res: Response): void => {
  const name = process.env.RANDOM || "Environment variable 'RANDOM' is not set";
  console.log("Env API- ",process.env.RANDOM);
  res.status(200).json({
    success: true,
    message: `Hello, ${name}!`
  });
};

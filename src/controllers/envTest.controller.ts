import { Request, Response } from "express";

export const checkEnv = (req: Request, res: Response): void => {
  const name =  process.env.RANDOM ||
  process.env.APPSETTING_RANDOM;
  console.log("Env API- ",name);
  
  res.status(200).json({
    success: true,
    message: `Hello, ${name}!`
  });
};

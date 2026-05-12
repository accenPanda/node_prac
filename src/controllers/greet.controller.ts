import { Request, Response } from "express";

export const getGreeting = (req: Request, res: Response): void => {
  const name = typeof req.query.name === "string" ? req.query.name : "World";

  res.status(200).json({
    success: true,
    message: `Hello, ${name}!`
  });
};

import { Request, Response } from "express";
import appInsights from "../telemetry";

export const getHealth = (_req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: "API is healthy"
  });
};

export const checkAppInsights = (_req: Request, res: Response): void => {
  appInsights.defaultClient.trackTrace({
    message: "Manual route hit"
  });

  res.send("ok");
};

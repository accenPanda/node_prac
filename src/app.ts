import express from "express";
import cors from "cors";
import apiRouter from "./routes";
import * as appInsights from "applicationinsights";

const connectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING || process.env.APPSETTING_APPLICATIONINSIGHTS_CONNECTION_STRING || "";
// appInsights.setup(connectionString).setInternalLogging(true, true) // Enable both debug and warning logging
//     .setAutoCollectConsole(true, true) // Generate Trace telemetry for winston/bunyan and console logs
//     .start();


console.log("AI Connection:", connectionString);

appInsights.setup(connectionString)
 .setAutoCollectRequests(true)
  .setAutoCollectPerformance(true,true)
  .setAutoCollectExceptions(true)
  .setAutoCollectDependencies(true)
  .setAutoDependencyCorrelation(true)
  .setDistributedTracingMode(
    appInsights.DistributedTracingModes.AI
  )
  .start();

console.log("AI Configured");

// appInsights.start();

// console.log("AI Started");

// App Insights code end here

const defaultAllowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
];

const envAllowedOrigins = (process.env.CORS_ORIGINS || process.env.APPSETTING_CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const allowedOrigins = Array.from(
    new Set([...envAllowedOrigins])
);

const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }
        
        callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api", apiRouter);

export default app;

import * as appInsights from "applicationinsights";

const connectionString =
  process.env.APPLICATIONINSIGHTS_CONNECTION_STRING ||
  process.env.APPSETTING_APPLICATIONINSIGHTS_CONNECTION_STRING || "";

console.log("AI Connection:", connectionString);

if (connectionString) {
  appInsights
    .setup(connectionString)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true, true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoDependencyCorrelation(true)
    .start();

  appInsights.defaultClient?.trackTrace({
    message: "Telemetry initialized"
  });
} else {
  console.warn("Application Insights not initialized: connection string is missing.");
}

export default appInsights;
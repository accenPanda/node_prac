import dotenv from "dotenv";
dotenv.config();

import "./telemetry";

import app from "./app";

const PORT = Number(process.env.PORT) || 4000;

console.log("Env - ",process.env.RANDOM || process.env.APPSETTING_RANDOM);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

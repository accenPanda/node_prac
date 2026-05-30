import dotenv from "dotenv";
dotenv.config();

import "./telemetry";

import app from "./app";
import client from "./db/cosmos_config";

const PORT = Number(process.env.PORT) || 4000;

const db = client.database("pandaDB");
export const DBContainer = db.container("users");

console.log("Env - ",process.env.RANDOM || process.env.APPSETTING_RANDOM);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import app from "./app";

// Enable CORS middleware
app.use(cors());

const PORT = Number(process.env.PORT) || 4000;

console.log("Env - ",process.env.RANDOM || process.env.APPSETTING_RANDOM);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

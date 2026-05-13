import dotenv from "dotenv";
dotenv.config();

import app from "./app";


const PORT = Number(process.env.PORT) || 4000;

console.log("Env - ",process.env.RANDOM);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

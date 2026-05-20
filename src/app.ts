import express from "express";
import cors from "cors";
import apiRouter from "./routes";

const app = express();

const defaultAllowedOrigins = [
	"http://localhost:5173",
	"http://127.0.0.1:5173"
];

const envAllowedOrigins = (process.env.CORS_ORIGINS || "")
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

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api", apiRouter);

export default app;

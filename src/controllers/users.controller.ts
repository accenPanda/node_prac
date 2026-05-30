import { Request, Response } from "express";
import client from "../db/cosmos_config";

const db = client.database("pandaDB");
const usersContainer = db.container("users");

type InsertUserBody = {
	userType?: string;
	name?: string;
	email?: string;
};

type LoginUserBody = {
	email?: string;
};

export const insertUser = async (req: Request, res: Response): Promise<void> => {
	const { userType, name, email } = req.body as InsertUserBody;

	if (!userType || !name || !email) {
		res.status(400).json({
			success: false,
			message: "userType, name and email are required"
		});
		return;
	}

	try {
		const { resource } = await usersContainer.items.create({ userType, name, email });

		res.status(201).json({
			success: true,
			message: "User inserted successfully",
			data: resource
		});
	} catch (error) {
		console.error("Insert user error:", error);

		res.status(500).json({
			success: false,
			message: "Failed to insert user"
		});
	}
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
	const { email } = req.body as LoginUserBody;

	if (!email) {
		res.status(400).json({
			success: false,
			message: "email is required"
		});
		return;
	}

	try {
		const { resources } = await usersContainer.items
			.query({
				query: "SELECT TOP 1 * FROM c WHERE c.email = @email",
				parameters: [{ name: "@email", value: email }]
			})
			.fetchAll();

		const [user] = resources;

		if (!user) {
			res.status(401).json({
				success: false,
				message: "Invalid login credentials"
			});
			return;
		}

		res.status(200).json({
			success: true,
			message: "Login successful",
			data: user
		});
	} catch (error) {
		console.error("Login user error:", error);

		res.status(500).json({
			success: false,
			message: "Failed to login user"
		});
	}
};

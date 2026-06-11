import { Request, Response } from "express";
import client from "../db/cosmos_config";
import { buildReadBlobUrl } from "../services/blob.service";

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

type UpdateProfilePictureBody = {
	containerName?: string;
	blobName?: string;
	duration?: number;
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

export const updateUserProfilePicture = async (req: Request, res: Response): Promise<void> => {
	const userId = String(req.params.id || "").trim();
	const { containerName, blobName, duration } = req.body as UpdateProfilePictureBody;

	if (!userId) {
		res.status(400).json({
			success: false,
			message: "id path param is required"
		});
		return;
	}

	if (!containerName || !blobName) {
		res.status(400).json({
			success: false,
			message: "containerName and blobName are required"
		});
		return;
	}

	const expiresInMinutes = duration === undefined ? 60 : Number(duration);
	if (!Number.isFinite(expiresInMinutes) || expiresInMinutes <= 0) {
		res.status(400).json({
			success: false,
			message: "duration must be a positive number"
		});
		return;
	}

	try {
		const { resources } = await usersContainer.items
			.query({
				query: "SELECT TOP 1 * FROM c WHERE c.id = @id",
				parameters: [{ name: "@id", value: userId }]
			})
			.fetchAll();

		const [user] = resources;
		if (!user) {
			res.status(404).json({
				success: false,
				message: "User not found"
			});
			return;
		}

		const accessUrl = buildReadBlobUrl({
			containerName,
			blobName,
			expiresInMinutes
		});

		const updatedUser = {
			...user,
			profilePicture: {
				containerName,
				blobName,
				expiresInMinutes,
				updatedAt: new Date().toISOString()
			}
		};

		const { resource } = await usersContainer.items.upsert(updatedUser);

		res.status(200).json({
			success: true,
			message: "Profile picture updated successfully",
			data: {
				id: resource?.id || userId,
				profilePicture: resource?.profilePicture || updatedUser.profilePicture,
				accessUrl,
				url: accessUrl
			}
		});
	} catch (error) {
		console.error("Update profile picture error:", error);

		res.status(500).json({
			success: false,
			message: "Failed to update profile picture"
		});
	}
};

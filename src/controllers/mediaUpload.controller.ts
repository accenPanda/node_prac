import { Request, Response } from "express";
import { buildReadBlobUrl, uploadMediaFile } from "../services/blob.service";

const isAllowedMediaType = (mimeType: string): boolean => {
    return mimeType.startsWith("image/") || mimeType.startsWith("video/") || mimeType === "application/pdf";
};

export const uploadMedia = async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
        res.status(400).json({
            success: false,
            message: "A file is required in the 'file' field"
        });
        return;
    }

    if (!isAllowedMediaType(req.file.mimetype)) {
        res.status(400).json({
            success: false,
            message: "Only image, video, and PDF files are allowed"
        });
        return;
    }

    try {
        const uploadResult = await uploadMediaFile({
            buffer: req.file.buffer,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype
        });

        res.status(201).json({
            success: true,
            message: "File uploaded successfully",
            data: {
                originalName: req.file.originalname,
                mimeType: req.file.mimetype,
                size: req.file.size,
                ...uploadResult
            }
        });
    } catch (error) {
        console.error("Media upload error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to upload file"
        });
    }
};

export const getMediaAccessUrl = async (req: Request, res: Response): Promise<void> => {
    const containerName = String(req.query.containerName || "").trim();
    const blobName = String(req.query.blobName || "").trim();
    const expiresInMinutesRaw = req.query.expiresInMinutes;

    if (!containerName || !blobName) {
        res.status(400).json({
            success: false,
            message: "'containerName' and 'blobName' query params are required"
        });
        return;
    }

    let expiresInMinutes: number | undefined;
    if (expiresInMinutesRaw !== undefined) {
        const parsed = Number(expiresInMinutesRaw);
        if (!Number.isFinite(parsed) || parsed <= 0) {
            res.status(400).json({
                success: false,
                message: "'expiresInMinutes' must be a positive number"
            });
            return;
        }
        expiresInMinutes = parsed;
    }

    try {
        const accessUrl = buildReadBlobUrl({
            containerName,
            blobName,
            expiresInMinutes
        });

        res.status(200).json({
            success: true,
            message: "Media access URL generated",
            data: {
                containerName,
                blobName,
                accessUrl,
                url: accessUrl,
                expiresInMinutes: expiresInMinutes || undefined
            }
        });
    } catch (error) {
        console.error("Generate media access URL error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to generate media access URL"
        });
    }
};
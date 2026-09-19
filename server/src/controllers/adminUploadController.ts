import { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.js";
import { SUPABASE_STORAGE_BUCKET, supabaseStorage } from "../lib/supabaseStorage.js";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_FILE_BYTES = 5 * 1024 * 1024;

export async function uploadImage(req: AuthenticatedRequest, res: Response) {
  if (!supabaseStorage) {
    return res.status(500).json({
      message: "Image upload is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    });
  }

  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "No file was uploaded." });
  }

  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    return res.status(400).json({ message: "Only JPEG, PNG, WEBP, or GIF images are allowed." });
  }

  if (file.size > MAX_FILE_BYTES) {
    return res.status(400).json({ message: "Image must be smaller than 5MB." });
  }

  try {
    const ext = file.originalname.split(".").pop() || "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabaseStorage.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .upload(path, file.buffer, { contentType: file.mimetype });

    if (uploadError) {
      console.error("Error uploading image to Supabase Storage:", uploadError);
      return res.status(500).json({ message: "Failed to upload image." });
    }

    const { data } = supabaseStorage.storage.from(SUPABASE_STORAGE_BUCKET).getPublicUrl(path);

    return res.status(201).json({ url: data.publicUrl });
  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

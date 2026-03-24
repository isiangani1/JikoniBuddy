import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 1. Validate File Type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed." }, { status: 400 });
    }

    // 2. Validate File Size (e.g., 5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large. Max size is 5MB." }, { status: 400 });
    }

    // 3. Generate Secure Filename
    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);
    
    const extension = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${extension}`;
    
    // 4. Save to Local public/uploads (Infrastructure mock for Cloudinary/S3)
    const path = join(process.cwd(), "apps/web/public/uploads", fileName);
    await writeFile(path, buffer);

    const publicUrl = `/uploads/${fileName}`;

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export const uploadFile = async (file, fileName, folderPath) => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    // Generate a unique file name using the current timestamp
    const filePath = path.join(folderPath, fileName);

    // Ensure the directory exists
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Move the file to the specified folder
    await new Promise((resolve, reject) => {
      file.mv(filePath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    return fileName;
  } catch (error) {
    throw new Error(`File upload failed: ${error.message}`);
  }
};

export const compressImage = async (originalFilePath, compressedFilePath, quality) => {
  try {
    // Read the original image
    const imageBuffer = fs.readFileSync(originalFilePath);

    // Compress the image
    const compressedBuffer = await sharp(imageBuffer)
      .webp({ quality })
      .toBuffer();

    // Save the compressed image
    fs.writeFileSync(compressedFilePath, compressedBuffer);

    // Delete the original image
    fs.unlinkSync(originalFilePath);
  } catch (error) {
    throw new Error(`Image compression failed: ${error.message}`);
  }
}

export const renameFile = async (oldFilePath, newFilePath) => {
  fs.renameSync(oldFilePath, newFilePath);
}

export const deleteFile = async (filePath) => {
  fs.unlinkSync(filePath);
}
import fs from 'fs';
import path from 'path';

export const uploadFile = async (file, folderPath) => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    // Extract the file extension
    const fileExtension = path.extname(file.name);
    
    // Generate a unique file name using the current timestamp
    const fileName = `${Date.now()}${fileExtension}`;
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

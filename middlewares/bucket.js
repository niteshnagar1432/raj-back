import AWS from "aws-sdk";
import multer from "multer";

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: "ap-south-1",
});

export const s3 = new AWS.S3();

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 30mb
  },
});

// Utility function for uploading files to S3
export const uploadFileToS3 = async (file) => {
  const params = {
    Bucket: "hariom-bucket/tourTravel",
    Key: file.originalname,
    Body: file.buffer,
  };

  try {
    const data = await s3.upload(params).promise();
    return data;
  } catch (error) {
    throw error;
  }
};

// Utility function for deleting an image from S3
export const deleteImageFromS3 = async (imageUrl) => {
  const fileName = imageUrl.split("/").pop();
  const params = {
    Bucket: "hariom-bucket/tourTravel",
    Key: fileName,
  };

  try {
    const data = await s3.deleteObject(params).promise();
    return data;
  } catch (error) {
    throw error;
  }
};

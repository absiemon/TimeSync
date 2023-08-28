import {PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import connectToS3 from '../config/S3Config.js'

export const uplaodToS3 = async (buffer, originalname, mimetype)=> {
    const newFilename = originalname + "-" +Date.now();
    await connectToS3.send(new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Body: buffer,
        Key: newFilename,
        ContentType: mimetype,
    }))
    return newFilename;
}

export const deleteFromS3 = async (filename)=> {
    try {
        await connectToS3.send(new DeleteObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: filename,
        }));

        return `File ${filename} deleted successfully from S3`;
    } catch (error) {
        console.error('Error deleting file from S3:', error);
        throw error;
    }
}
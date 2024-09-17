import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';

export const uploadToS3 = async (path, originalFilename, mimetype) => {
    const client = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,

        }
    });

    const bucket = process.env.BUCKET_NAME;

    const parts = originalFilename.split('.');
    const ext = parts[parts.length - 1];
    const newFilename = Date.now() + '.' + ext;
    await client.send(new PutObjectCommand({
        Bucket: bucket,
        Body: fs.readFileSync(path),
        Key: newFilename,
        ContentType: mimetype,
        ACL: 'public-read',
    }));
    return `https://${bucket}.s3.amazonaws.com/${newFilename}`;
}
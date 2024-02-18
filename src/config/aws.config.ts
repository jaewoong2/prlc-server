import { registerAs } from '@nestjs/config';

// src/config/aws.config.ts
export default registerAs('aws', () => ({
  aws: {
    s3: {
      bucketName: process.env.AWS_S3_BUCKET_NAME,
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    congnito: {
      UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
      ClientId: process.env.AWS_COGNITO_CLIENT_ID,
      ClientSecretKey: process.env.AWS_CLIENT_SECRET_KEY,
    },
  },
}));

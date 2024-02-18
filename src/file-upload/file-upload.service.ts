import { Inject, Injectable } from '@nestjs/common';
import { S3 } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { ConfigType } from '@nestjs/config';
import awsConfig from 'src/config/aws.config';

@Injectable()
export class FileUploadService {
  private s3: S3;
  constructor(
    @Inject(awsConfig.KEY)
    private config: ConfigType<typeof awsConfig>,
  ) {
    this.s3 = new S3({
      region: this.config.aws.s3.region,
      credentials: {
        accessKeyId: this.config.aws.s3.accessKeyId,
        secretAccessKey: this.config.aws.s3.secretAccessKey,
      },
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    bucketPath: string,
  ): Promise<string> {
    const { originalname, buffer } = file;

    const optimizedImageBuffer = await sharp(buffer)
      .resize({ height: 220, fit: 'contain' })
      .withMetadata() // 원본 이미지의 메타데이터 포함
      .toFormat('jpeg', { quality: 80 })
      .toBuffer();

    const key = `${bucketPath}/${Date.now()}-${originalname}`;

    await this.s3.putObject({
      Bucket: this.config.aws.s3.bucketName,
      Key: key,
      Body: optimizedImageBuffer,
    });

    return `https://${this.config.aws.s3.bucketName}.s3.${this.config.aws.s3.region}.amazonaws.com/${key}`;
  }
}

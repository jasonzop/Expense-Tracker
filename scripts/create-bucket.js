import {
  S3Client,
  CreateBucketCommand,
  PutBucketCorsCommand,
  HeadBucketCommand,
} from '@aws-sdk/client-s3';

const s3 = new S3Client({
  endpoint: 'http://localhost:4566',
  region: 'us-east-1',
  credentials: { accessKeyId: 'test', secretAccessKey: 'test' },
  forcePathStyle: true,
});

const BUCKET = 'expense-receipts';

try {
  // If this fails, the bucket doesn't exist yet
  await s3.send(new HeadBucketCommand({ Bucket: BUCKET }));
  console.log('Bucket already exists');
} catch {
  await s3.send(new CreateBucketCommand({ Bucket: BUCKET }));
  console.log('Bucket created');
}

await s3.send(new PutBucketCorsCommand({
  Bucket: BUCKET,
  CORSConfiguration: {
    CORSRules: [{
      AllowedOrigins: ['*'],
      AllowedMethods: ['GET','HEAD'],
      AllowedHeaders: ['*'],
      MaxAgeSeconds: 3000,
    }],
  },
}));
console.log('CORS set');

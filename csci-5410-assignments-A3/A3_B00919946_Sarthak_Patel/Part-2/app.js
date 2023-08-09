const AWS = require('aws-sdk');
const fs = require('fs');

// AWS credentials and region
const AWS_ACCESS_KEY_ID = 'ASIAUL2C7S77WMY7KM6C';
const AWS_SECRET_ACCESS_KEY = 'DCAhcXPRCEvIkSwsvhW01u2b9LzoFzl41kYXyK5j';
const AWS_REGION = 'us-east-1';
const AWS_SESSION_TOKEN = 'FwoGZXIvYXdzEOL//////////wEaDDz5TWQW1JVY6WrN+yLAAc8f23hXgV/OZLNd0hUeeA5QzFoL55ADf4DxvRVSdKFi4lopnMHKtDP3hNugE1Qcz2d+1/spm0L5SJ6tV5rGINCE2o5mJDfhfC6d+Cj2BMujYIuC1Ve+FuagzTlnLY1kyYDWM8E1fQxCVUtcqbifgjWvr/n5Y89RHHjzVlKpsgLVU/prkeCod0PlXVT6FNiiqxGqSW/YIKtcEcp81DNtVQCbjR4MKJMCt9vWOy5LSJ6mp7y83693KOAUV9BSTQnKtij9oYymBjItJDzTX8vt8XafjdfujrrZWEmn6wcEhi7KAWZ4VjYS++EAtw51yw1ORR/PBewK'

// Bucket and folder names
const BUCKET_NAME = 'sampledatab00919946';
const SOURCE_FOLDER = 'Tech'; 

// Configure AWS credentials and region
AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
  sessionToken: AWS_SESSION_TOKEN
});

async function uploadToS3(bucket, filePath, key) {
  const s3 = new AWS.S3();
  const fileStream = fs.createReadStream(filePath);

  const params = {
    Bucket: bucket,
    Key: key,
    Body: fileStream
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, function(err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

async function uploadFilesWithDelay() {
  const files = fs.readdirSync(SOURCE_FOLDER);

  for (const file of files) {
    const filePath = `${SOURCE_FOLDER}/${file}`;
    const key = file;

    try {
      await uploadToS3(BUCKET_NAME, filePath, key);
      console.log(`Uploaded ${file} to S3 bucket`);
    } catch (error) {
      console.error(`Error uploading ${file} to S3 bucket: ${error.message}`);
    }

    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

uploadFilesWithDelay()
  .then(() => console.log('All files uploaded successfully!'))
  .catch(error => console.error('Error during file upload:', error));





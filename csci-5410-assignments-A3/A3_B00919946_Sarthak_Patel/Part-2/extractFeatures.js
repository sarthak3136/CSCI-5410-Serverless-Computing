const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
  try {
    const { bucket, object } = event.Records[0].s3;
    const fileContent = await getFileContent(bucket.name, object.key);
    const namedEntities = performNER(fileContent);
    const jsonResult = createJSONObject(namedEntities, object.key.split('.')[0]);

    await saveJSONObjectToBucket('tagsb00919946', object.key + '.json', jsonResult);

    return {
      statusCode: 200,
      body: 'Named entity extraction and saving to new bucket completed successfully.'
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: 'Error processing the file and saving to the new bucket.'
    };
  }
};

function getFileContent(bucket, key) {
  const params = { Bucket: bucket, Key: key };
  return new Promise((resolve, reject) => {
    s3.getObject(params, (err, data) => {
      if (err) reject(err);
      else resolve(data.Body.toString());
    });
  });
}

function performNER(fileContent) {
  const namedEntityPattern = /(\b[A-Z][a-zA-Z]+\b)/g;
  const matches = fileContent.match(namedEntityPattern);
  const namedEntities = {};

  if (matches) {
    matches.forEach(entity => {
      namedEntities[entity] = namedEntities[entity] ? namedEntities[entity] + 1 : 1;
    });
  }

  return namedEntities;
}

function createJSONObject(namedEntities, fileKey) {
  const jsonResult = {};
  jsonResult[fileKey + 'ne'] = namedEntities;
  return jsonResult;
}

function saveJSONObjectToBucket(bucket, key, json) {
  const params = { Bucket: bucket, Key: key, Body: JSON.stringify(json) };
  return new Promise((resolve, reject) => {
    s3.putObject(params, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}


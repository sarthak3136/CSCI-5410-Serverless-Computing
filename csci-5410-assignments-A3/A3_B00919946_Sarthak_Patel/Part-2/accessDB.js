const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    for (const record of event.Records) {
      const { bucket, object } = record.s3;
      const fileContent = await getFileContent(bucket.name, object.key);
      const jsonResult = JSON.parse(fileContent);
      
      console.log(jsonResult)
      
      console.log((object.key).substring(0,3)+"ne");
      const entities = jsonResult[(object.key).substring(0,3)+"ne"]; 
      console.log(object.key);
      console.log(object);
      console.log(entities)
      await updateDynamoDB(entities);
    }

    return {
      statusCode: 200,
      body: 'DynamoDB table updated successfully.'
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: 'Error updating the DynamoDB table.'
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

async function updateDynamoDB(entities) {
  const tableName = 'nameJSON'; 

  for (const entityName in entities) {
    const entityCount = entities[entityName];
    const params = {
      TableName: tableName,
      Item: {
        entity: entityName,
        count: Number(entityCount)
      }
    };

    await dynamoDB.put(params).promise();
  }

  console.log('DynamoDB table updated.');
}

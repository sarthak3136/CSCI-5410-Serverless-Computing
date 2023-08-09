const AWS = require("aws-sdk");
const sqs = new AWS.SQS();
const sns = new AWS.SNS();

exports.handler = async (event, context) => {
  try {
    const queueUrls = [
      "https://sqs.us-east-1.amazonaws.com/300251322367/Car",
      "https://sqs.us-east-1.amazonaws.com/300251322367/addon",
      "https://sqs.us-east-1.amazonaws.com/300251322367/client",
    ];
    const messages = await Promise.all(
      queueUrls.map(async (queueUrl) => {
        const params = {
          QueueUrl: queueUrl,
          MaxNumberOfMessages: 10, 
          WaitTimeSeconds: 20, 
        };

        const response = await sqs.receiveMessage(params).promise();

        if (!response.Messages || response.Messages.length === 0) {
          return [];
        }

        const messageBodies = response.Messages.map((message) => message.Body);

        return messageBodies;
      })
    );

    console.log("Messages from Car Queue:", messages[0]);
    console.log("Messages from Addon Queue:", messages[1]);
    console.log("Messages from Client Queue:", messages[2]);

    const emailContent = `
      Messages from Car Queue: ${messages[0].join(", ")}
      Messages from Addon Queue: ${messages[1].join(", ")}
      Messages from Client Queue: ${messages[2].join(", ")}
    `;

    const snsTopicArn = "arn:aws:sns:us-east-1:300251322367:SendEmail"; 
    const subject = "Combined Messages from SQS Queues";
    
    const params = {
      Message: emailContent,
      Subject: subject,
      TopicArn: snsTopicArn,
    };

    await sns.publish(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch messages" }),
    };
  }
};

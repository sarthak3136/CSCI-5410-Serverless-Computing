var AWS = require("aws-sdk");

exports.handler = async (event, context, callback) => {
  const randomCar = await snsCar();
  const randomAddon = await snsAddoon();
  const randomClient = await snsClient();
  
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      randomCar,
      randomAddon,
      randomClient
    }),
  };
  callback(null, response);
};

function snsCar() {
  return new Promise((resolve, reject) => {
    const car = ["Compact", "mid-size", "Sedan", "SUV", "Luxury"];
    const randomCar = car[Math.floor(Math.random() * car.length)];
    var sns = new AWS.SNS();
    
    var params = {
      Message: randomCar, 
      Subject: "Random Car type from Lambda",
      TopicArn: "arn:aws:sns:us-east-1:300251322367:Car"
    };
    sns.publish(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(randomCar);
      }
    });
  });
}


function snsAddoon(){
  return new Promise((resolve, reject) => {
    const addoon = ["GPS", "Camera"];
    const randomAddon = addoon[Math.floor(Math.random() * addoon.length)];
    var sns = new AWS.SNS();
    
    var params = {
      Message: randomAddon, 
      Subject: "Random Addon from Lambda",
      TopicArn: "arn:aws:sns:us-east-1:300251322367:addon"
    };
    sns.publish(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(randomAddon);
        }
      });
    })
}

function snsClient(){
  return new Promise((resolve, reject) => {
    const client = ["6050 University Avenue", "6967 Bayers Road", "2327 Brunswick Street"];
    const randomClient = client[Math.floor(Math.random() * client.length)];
    var sns = new AWS.SNS();
    
    var params = {
      Message: randomClient, 
      Subject: "Random Client from Lambda",
      TopicArn: "arn:aws:sns:us-east-1:300251322367:client"
    };
   sns.publish(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(randomClient);
        }
      });
  })
}
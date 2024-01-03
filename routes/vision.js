var express = require('express');
var router = express.Router();
// Load the SDK
var AWS = require('aws-sdk');
const dotenv = require("dotenv");
dotenv.config();

router.post('/classify', async function (req, res, next) {
  // DON'T return the hardcoded response after implementing the backend
  let labelResponse = [];
  
  // Your code starts here //

  try {
    const filePath = req.files;
    console.log('the file is ', filePath);

    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_REGION,
    });

    const client = new AWS.Rekognition();
    const params = {
      Image: {
        Bytes: filePath.file.data
      },
      MaxLabels: 10
    };

    const response = await client.detectLabels(params).promise();

    console.log(`Detected labels for: ${filePath.file.name}`);
    response.Labels.forEach((label) => {
      labelResponse.push(label.Name);
    });

    console.log('the label names are ', labelResponse);

    if (labelResponse.length < 1) {
      labelResponse.push('No labels detected.');
    }

    res.json({
      "labels": labelResponse
    });

  } catch (error) {
    console.error('Error processing the request:', error);
    res.status(500).json({
      "error": "Unable to process the request"
    });
  }

  // Your code ends here //

});

module.exports = router;

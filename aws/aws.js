'use strict';

// const AWSXRay = require('aws-xray-sdk-core');
let AWS = require('aws-sdk');

// Returns the AWS client in the correct region with the correct API versions of services that
// bodenstein uses.
//
// If the NODE_ENV is production, then also adds AWS X-Ray annotations for tracing formulas and
// returns a wrapped version of the AWS SDK.
// Using this wrapped SDK will allow usage of AWS services (s3, sqs, etc.) to be traced.

// aws-sdk-wrapper :: () -> AWS
module.exports = () => {

	// AWS.config.apiVersions = {
	// 	cloudwatchlogs: '2014-03-28',
	// 	dynamodb: '2012-08-10',
	// 	s3: '2006-03-01',
	// 	sqs: '2012-11-05'
	// };

	
	// AWS.config.update({
	// 	region: 'us-east-1',
	// 	accessKeyId: 'S3ERV3R',
	// 	secretAccessKey: 'S3ERV3R',
	// 	endpoint: 'http://localhost:4566',
	// 	s3ForcePathStyle: true
	// });

	// return AWS;

	var credentials = new AWS.SharedIniFileCredentials({ profile: 'default' });
	AWS.config.credentials = credentials;
	AWS.config.update({ region: 'us-west-2' });
	AWS.config.apiVersions = {
		cloudwatchlogs: '2014-03-28',
		dynamodb: '2012-08-10',
		s3: '2006-03-01',
		sqs: '2012-11-05'
	};
	// AWS.config.update({
	// 	accessKeyId: 'S3ERV3R',
	// 	secretAccessKey: 'S3ERV3R',
	// 	endpoint: 'http://localhost:4569',
	// 	s3ForcePathStyle: true
	// });

	return AWS;


	// /* istanbul ignore if */
	// if (process.env.STAGE !== 'test') {
	// 	AWS = AWSXRay.captureAWS(AWS);
	// }

	// AWS.config.update({region: process.env.BODENSTEIN_AWS_REGION});
	// AWS.config.apiVersions = {
	// 	cloudwatchlogs: '2014-03-28',
	// 	dynamodb: '2012-08-10',
	// 	s3: '2006-03-01',
	// 	sqs: '2012-11-05'
	// };

	// /* istanbul ignore if */
	// if (process.env.SERVICE_TEST === 'true') {
	// 	AWS.config.update({
	// 		accessKeyId: 'S3ERV3R',
	// 		secretAccessKey: 'S3ERV3R',
	// 		endpoint: 'http://localstack:4572',
	// 		s3ForcePathStyle: true
	// 	});
	// }

	// return AWS;
};

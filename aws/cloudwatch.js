'use strict';

const AWS = require('./aws')();

const getLogs = async (group, stream, requestId) => {
	const cloudWatchLogs = new AWS.CloudWatchLogs();

	// download log stream
	const params = {
		filterPattern: `"${requestId}"`,
		logGroupName: group,
		// logStreamNames: [stream]
	};
	console.log('GROUP: ' + group);
	const data = await cloudWatchLogs.filterLogEvents(params).promise();
	console.log('Filtered log events: ' + JSON.stringify(data));

	return data.events;
};

module.exports = {
	getLogs
};

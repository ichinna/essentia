const cloudwatch = require('./cloudwatch');
const AWS = require('./aws')();
const {gt} = require('ramda');
const printLogs = async () => {
    let group = '/aws/lambda/bodenstein-stg-execute-async';
    let stream = '2020/05/27/[$LATEST]5f2cc7e7888d4b04b5d5d1d1055f8a8f';
    let requestId = '167127480';
    const logs = await cloudwatch.getLogs(group, stream, requestId);
}

// printLogs();

// Get DynamoDB record
const buildExec = resp => ({
    id: Number(resp.Item.id.N),
    status: String(resp.Item.status.S),
    expires: Number(resp.Item.expires.N)
});

const getRecord = async (formulaInstanceId, formulaInstanceExecutionId, status) => {
    const dynamodb = new AWS.DynamoDB();

    const scanParams = {
        TableName: 'bodenstein-fie-stg-us-west-2',
        FilterExpression: '#key1 = :formulaInstanceId and #key2 = :status',
        ExpressionAttributeNames: {
            '#key1': 'formulaInstanceId',
            '#key2': 'status'
        },
        ExpressionAttributeValues: {
            ':formulaInstanceId': {
                N: String(formulaInstanceId)
            },
            ':status': {
                S: String(status)
            }
        },
        Select: 'COUNT'
    };

    const queryParams = {
        TableName: 'bodenstein-fie-stg-us-west-2',
        IndexName: 'FORMULA_INSTANCE_ID_INDEX',
        FilterExpression: '#key2 = :val2',
        KeyConditionExpression: '#key1 = :val1',
        ExpressionAttributeNames: {
            '#key1': 'formulaInstanceId',
            '#key2': 'status'
        },
        ExpressionAttributeValues: {
            ':val1': {
                N: String(formulaInstanceId)
            },
            ':val2': {
                S: String(status)
            }
        },
        Select: 'COUNT'
    };

    const queryParams2 = {
        TableName: 'bodenstein-fie-stg-us-west-2',

        // FilterExpression: '#key2 = :val2',
        KeyConditionExpression: '#key1 = :val1',
        ExpressionAttributeNames: {
            '#key1': 'id',
            // '#key2': 'userId'
        },
        ExpressionAttributeValues: {
            ':val1': {
                N: String(formulaInstanceId)
            },
            // ':val2': {
            //     S: String(status)
            // }
        },
        Select: 'COUNT'
    };

    const qp4 = {
        TableName: 'bodenstein-fie-active-dev-us-west-2',
        KeyConditionExpression: '#key1 = :value1',
        FilterExpression: 'NOT #key2 = :value2',
        ExpressionAttributeNames: {
            '#key1': 'formulaInstanceId',
            '#key2': 'formulaInstanceExecutionId'
        },
        ExpressionAttributeValues: {
            ':value1': {
                N: String(formulaInstanceId)
            },
            ':value2': {
                N: String(formulaInstanceExecutionId)
            }
        },
        Select: 'COUNT'
    };

    try {
        const resp = await dynamodb.query(qp4).promise();
        // const val = buildExec(resp);
        console.log(JSON.stringify(resp));
        console.log(Number(resp.Count));
    } catch (error) {
        console.log(error);
    }

}

const retrieveActiveExecutionCount = async formulaInstanceId => {
    const dynamodb = new AWS.DynamoDB();


    var params = {
        TableName: "bodenstein-fie-active-dev-us-west-2",
        KeyConditionExpression: "#key = :value",
        ExpressionAttributeNames: {
            "#key": "formulaInstanceId"
        },
        ExpressionAttributeValues: {
            ":value": {
                N: String(formulaInstanceId)
            }
        },
        Select: 'COUNT'
    };

    try {
        const resp = await dynamodb.query(params).promise();
        const val = Number(resp.Count) || 0;
        console.log(val);
    } catch (error) {
        /* istanbul ignore next */
        console.log("ERROR: " + error);
    }
};

const deleteActiveExecution = async formulaInstanceId => {
    const dynamodb = new AWS.DynamoDB();
    const params = {
        TableName: "bodenstein-fie-active-dev-us-west-2",
        Key: {
            formulaInstanceId: {
                N: String(formulaInstanceId)
            }
        }
    };

    try {
        await dynamodb.deleteItem(params).promise();
    } catch (error) {
        /* istanbul ignore next */
        console.log("ERROR: " + error);
    }
};

const getRecord2 = async (formulaInstanceId, formulaInstanceExecutionId, status) => {
    const dynamodb = new AWS.DynamoDB();

    const qp4 = {
        TableName: 'bodenstein-fie-active-dev-us-west-2',
        KeyConditionExpression: '#key1 = :value1',
        FilterExpression: 'NOT #key2 = :value2',
        ExpressionAttributeNames: {
            '#key1': 'formulaInstanceId',
            '#key2': 'formulaInstanceExecutionId'
        },
        ExpressionAttributeValues: {
            ':value1': {
                N: String(formulaInstanceId)
            },
            ':value2': {
                N: String(formulaInstanceExecutionId)
            }
        },
        Select: 'COUNT'
    };

    try {
        const resp = await dynamodb.query(qp4).promise();
        // const val = buildExec(resp);
        console.log(JSON.stringify(resp));
        console.log(Number(resp.Count));
    } catch (error) {
        console.log(error);
    }

}

// console.log(upsertActiveExecution(1234, 5628));


// console.log(getRecord(216, 'success'));
// console.log(getRecord(167379745, 'success'));

const upsertItem = async id => {
    
    const dynamodb = new AWS.DynamoDB();
    const params = {
        TableName: 'bodenstein-fie-test-us-east-1',
        Item: {
            id: {
                N: String(id)
            },
            status: {
                S: String('successsss')
            },
            formulaInstanceId: {
                N: String(47)
            },
            expires: {
                N: String(Math.floor(Date.now() / 1000) + (192 * 60 * 60))
            }
        },
        // ConditionExpression: 'attribute_not_exists(id)'
    }
    try {
        return await dynamodb.putItem(params).promise();
    } catch (error) {
        console.log(error.code === 'ConditionalCheckFailedException');
        console.log('fie', error);
    }
}

const buildActiveExec = resp => ({
	formulaInstanceId: Number(resp.formulaInstanceId.N),
	formulaInstanceExecutionId: Number(resp.formulaInstanceExecutionId.N)
});


const upsertActiveExecution = async (formulaInstanceId, formulaInstanceExecutionId) => {
	const dynamodb = new AWS.DynamoDB();
	const params = {
		TableName: 'bodenstein-fie-active-dev-us-west-2',
		Item: {
			formulaInstanceId: {
				N: String(formulaInstanceId)
			},
			formulaInstanceExecutionId: {
				N: String(formulaInstanceExecutionId)
			},
			expires: {
				N: String(Math.floor(Date.now() / 1000) + (5 * 60 * 60))
			}
		},
		ExpressionAttributeValues: {
			':formulaInstanceExecutionId': {
				N: String(formulaInstanceExecutionId)
			}
		},
		ConditionExpression: 'attribute_not_exists(formulaInstanceId) OR formulaInstanceExecutionId = :formulaInstanceExecutionId'
	};
	try {
		await dynamodb.putItem(params).promise();
        console.log(true);
		return true;
	} catch (error) {
		/* istanbul ignore next */
		debug('bodenstein:fie:active:upsert:error')('%j', {formulaInstanceExecutionId, formulaInstanceId, error});
		return !equals(error.code, 'ConditionalCheckFailedException');
	}
};

const retrieveActiveExecution = async (formulaInstanceId, formulaInstanceExecutionId) => {
	const dynamodb = new AWS.DynamoDB();
	const params = {
		TableName: 'bodenstein-fie-active-dev-us-west-2',
		KeyConditionExpression: '#key1 = :value1',
		FilterExpression: 'NOT #key2 = :value2',
		ExpressionAttributeNames: {
			'#key1': 'formulaInstanceId',
			'#key2': 'formulaInstanceExecutionId'
		},
		ExpressionAttributeValues: {
			':value1': {
				N: String(formulaInstanceId)
			},
			':value2': {
				N: String(formulaInstanceExecutionId)
			}
		}
	};

	const resp = await dynamodb.query(params).promise();
	const val = gt(resp.Count, 0) ? buildActiveExec(resp.Items[0]) : undefined;
    console.log(val);
};


const val = retrieveActiveExecution(251, 1);
// console.log(val);
// upsertActiveExecution(251, 123);

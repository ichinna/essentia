'use strict';

const { EventEmitter } = require('events');
const R = require('ramda');
const { type, isNil, equals } = require('ramda');
const assocOver = require('./assocOver');
const rp = require('request-promise');
const authorization = 'User D5eYMqQ4D54kKbu27jzwvv3LSulAr2aZb42Hn9L0VAE=, Organization b68741724197dcd9a78f26ac52e4382e';

const buildOptions = () => {
  return {
    uri: `https://snapshot.cloud-elements.com/elements/api-v2/formulas`,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authorization
    },
    json: true,
    resolveWithFullResponse: true,
  };
}

const getData = async () => {
  await rp(buildOptions())
    .then(r => {
      console.log(r.statusCode);
      return r.statusCode;
    })
    .catch(e => console.log(e));
};

const run = async () => {
  const flag = true;
  if (flag) {
    await getData();
  }
  R.when(R.equals(true), () => getData())(flag);
  getData();
  console.log('done');
}


let value = {
  a: 1,
  b: 2,
  c: undefined,
  d: 3
};

const createFISEV = d => {
  console.log('shit');
  return rp({
    uri: 'https://bodenstein.free.beeceptor.com',
    method: 'POST',
    body: d,
    resolveWithFullResponse: true,
    json: true
  }).then(r => console.log(r.statusCode))
    .catch(e => console.log(e));
}
const storeKeysInMap2 = async (value) => !isNil(value) && Object.entries(value).forEach(([k, v]) => {
  let val;
  if (equals(type(v), 'String')) {
    val = v;
  } else if (equals(type(v), 'Object') || equals(type(v), 'Array')) {
    val = JSON.stringify(v);
  } else {
    val = String(v);
  }

  return createFISEV({ k, v });
}) && console.log("done");

const storeKeysInMap = async (value) => !isNil(value) && await Promise.all(
  Object.entries(value).map(async item => {

    const v = item[1];
    let val;
    if (v === undefined) {
      return;
    }


    if (equals(type(v), 'String')) {
      val = v;
    } else if (equals(type(v), 'Object') || equals(type(v), 'Array')) {
      val = JSON.stringify(v);
    } else {
      val = String(v);
    }

    return createFISEV({ k: item[0], val });
  })
) && console.log("done");


const test = async () => {


  const a = 1;

  const flag = (a === 1 || (await getData()) === 200);
  console.log(flag);

}

let data = {
  context: {
    "a": 123
  },
  // step: {
  //   "name": "test",
  //   "type": "JSScript"
  // }
};

const AWS = require('aws-sdk');


const getClient = () => {

  AWS.config.update({ region: 'us-east-1' });
  AWS.config.apiVersions = {
    cloudwatchlogs: '2014-03-28',
    dynamodb: '2012-08-10',
    s3: '2006-03-01',
    sqs: '2012-11-05'
  };

  /* istanbul ignore if */
  AWS.config.update({
    accessKeyId: 'S3ERV3R',
    secretAccessKey: 'S3ERV3R',
    endpoint: 'http://localhost:4566',
    s3ForcePathStyle: true
  });

  return AWS;
};

// AWS.config.update({
//   region: 'us-east-1',
//   endpoint: 'http://localhost:4569'
// });

const awsSdk = getClient();

const getDDB = () => new awsSdk.DynamoDB();

const params = {
  TableName: 'bodenstein-fie-test-us-east-1',
  // KeyConditionExpression: "#id = :id",
  // ExpressionAttributeNames: {
  //   "#id": "id"
  // },
  // ExpressionAttributeValues: {
  //   ":id": 1
  // }
};

const putParams = {
  TableName: 'bodenstein-fie-test-us-east-1',
  Item: {
    id: {
      N: String(47)
    },
    formulaInstanceId: {
      N: String(47)
    },
    expires: {
      N: String(Math.floor(Date.now() / 1000) + (92 * 60 * 60))
    }
  }

}
const put = async () => {
  try {
    await getDDB().putItem(putParams).promise();
  } catch (err) {
    console.log(err);
  }
}

const scan = async () => {
  try {
    const res = getDDB().scan({ TableName: 'bodenstein-fie-test-us-east-1' })
      .promise()
      .then(r => console.log(JSON.stringify(r)));
  } catch (err) {
    console.log(err);
  }
}

// put();
// scan();
// docClient.scan(params, console.log);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



const testSleep = async () => {
  console.log("Hello");
  // await sleep(2000).then(() => { console.log("World!"); });
  // await Promise.resolve(setTimeout(() => console.log('shit'), 10000));
  // await new Promise(() => setTimeout(() => console.log('shit'), 10000));
  // await Promise.all([new Promise(() => setTimeout(() => console.log('shit'), 2000))]);

  // const fn = () => { console.log('done'); };
  // await new Promise(resolve => setTimeout(fn, 2000)).promise();

  await new Promise(resolve => setTimeout(resolve, 2000));//.then(() => console.log('sss'));
  
  console.log('final');
  console.log('final');
  console.log('final');
  return 'a';
}

testSleep();
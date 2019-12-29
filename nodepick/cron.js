const parser = require('cron-parser');
var interval = parser.parseExpression("*/2 * * * *");
console.log(interval.next().toString());
console.log(interval.next().toString());
console.log(interval.next().toString());
console.log(interval.next().toString());

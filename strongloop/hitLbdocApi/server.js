var express = require('express');
app = express();
port = process.env.PORT || 3000;

var routes = require('./api/routes/hitLbdocRoutes');
routes(app);


app.listen(port);

console.log('TODO: LbDoc RESTful API server started on: ' + port);
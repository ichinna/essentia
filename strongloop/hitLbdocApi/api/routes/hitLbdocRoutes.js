'use strict';

module.exports = function (app) {
    var hitDocs = require('../controllers/hitLbdocController');

    app.route('/hitDocs_l/:elementId')
        .get(hitDocs.read_lbdoc);

    app.route('/hitDocs_s/:elementId')
    .get(hitDocs.read_swagDocs);
};
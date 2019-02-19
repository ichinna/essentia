
const request = require('./util/request');
const helper = require('./util/helper');
const _ = require('lodash');

exports.read_lbdoc = function (req, res, retrunLbdoc) {

    try {
        let siteAddress = helper.getCEUrl('l');
        let query = { force: true };
        let headers = helper.getCEHeaders(siteAddress);
        let elementId = req.params.elementId;

        console.log(req.headers['x-forwarded-for'] + ' is making call to fetch lbdocs for elementID ' + elementId);
        let requestUrl = `${siteAddress}/elements/api-v2/elements/${elementId}/lbdocs`;
        request.get(requestUrl, query, headers, (error, response) => {
            if (error === null) {
                res.json(response);
            } else {
                throw new Error(error);
            }
        });
    } catch (error) {
        throw new Error(error);
    }

};


exports.read_swagDocs = function (req, res, returnSwagDocs) {

    try {
        let siteAddress = helper.getCEUrl('l');
    let query = {};
    let headers = helper.getCEHeaders(siteAddress);
    let elementId = req.params.elementId;

    let requestUrl = `${siteAddress}/elements/api-v2/elements/${elementId}/docs`;
    request.get(requestUrl, query, headers, (error, response) => {
        if (error === null) {
            res.json(response);
        } else {
            throw new Error(error);
        }
    });   
    } catch (error) {
        throw new Error(error);
    }
};
const rp = reuire('request-promise');
const { read, write } = require('./util/file-utils');
const R = require('ramda');

const company = process.env.company || 'google';

const downloadCompanyList = async company => {

    let options = {
        uri: `https://leetcode.com/problems/api/frequency/${company}`,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cookie': process.env.Cookie || null
        },
        json: true,
        resolveWithFullResponse: true,
    };

    await rp(options)
        .then(r => {
            write(`./data/download/company/${company}-all.json`, JSON.stringify(r.body));
            console.log(`Done writing all ${company} question`);
        })
        .catch(err => console.log(`--- Failed to retrive the ${company} questions --- \n ${err} `));
};

const pullSlugsForCompany = () => {
    const companyQuestion = read(`./data/download/company/${company}-all.json`);
    const allQuestions = read('./data/all-questions.json');

    if (companyQuestion || allQuestions) {
        console.error("Something worng.  Either company or LC quertions list not found");
        return;
    }

    const companyIds = Object.keys(R.pathOr({}, ['freq_map'], companyQuestion));
    const 




}


module.exports = {
    downloadCompanyList
};



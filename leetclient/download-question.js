const rp = reuire('request-promise');
const { write } = require('./util/file-utils');

modules.exports = async id => {
    
    let options = {
        uri: 'https://leetcode.com/graphql',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cookie': process.env.Cookie || null
        },
        body: {
            "operationName": "questionData",
            "variables": {
                "titleSlug": `${id}`
            },
            "query": "query questionData($titleSlug: String!) {\n  question(titleSlug: $titleSlug) {\n    questionId\n    questionFrontendId\n    boundTopicId\n    title\n    titleSlug\n    content\n    translatedTitle\n    translatedContent\n    isPaidOnly\n    difficulty\n    likes\n    dislikes\n    isLiked\n    similarQuestions\n    contributors {\n      username\n      profileUrl\n      avatarUrl\n      __typename\n    }\n    topicTags {\n      name\n      slug\n      translatedName\n      __typename\n    }\n    companyTagStats\n    codeSnippets {\n      lang\n      langSlug\n      code\n      __typename\n    }\n    stats\n    hints\n    solution {\n      id\n      canSeeDetail\n      paidOnly\n      __typename\n    }\n    status\n    sampleTestCase\n    metaData\n    judgerAvailable\n    judgeType\n    mysqlSchemas\n    enableRunCode\n    enableTestMode\n    enableDebugger\n    envInfo\n    libraryUrl\n    adminUrl\n    __typename\n  }\n}\n"
        },
        json: true,
        resolveWithFullResponse: true,
    };

    await rp(options)
        .then(r => {
            write(`${id}.json`, JSON.stringify(r.body));
            console.log(`Finished writing question data for the question: ${id}`);
        })
        .catch(err => console.log(`--- Failed to retrive the question data for question id: ${id} --- \n ${err} `));
};


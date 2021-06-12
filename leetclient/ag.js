const { isNil } = require('ramda');
const { read } = require('./util/file-utils');


const TIME_LINE = {
    '6M': 1,
    '1Y': 2,
    '2Y': 3,
    'ALL': 4
}

const getByTimeline = (timeLine, questions) => {
    if (isNil(TIME_LINE[timeLine]))
        throw Error('No Timeline');

    return questions.filter(q => q.frequencyTimePeriod === 1);
};

const getQuestionIds = questions => isNil(questions) ? [] : questions.map(q => q.questionId);

const getDisjoint = (setA, setB) => {
    const setAIds = new Set(getQuestionIds(setA));
    const setBIds = new Set(getQuestionIds(setB));
    return [...setAIds].filter(i => !setBIds.has(i));
};

const getUnion = (setA, setB) => {
    const setAIDs = new Set(getQuestionIds(setA));
    const setBIDs = new Set(getQuestionIds(setB));

    return [...setAIDs].filter(i => setBIDs.has(i));
}

const getOnlySetA = (setA, setB) => {
    const setAIds = new Set(getQuestionIds(setA));
    const setBIds = new Set(getQuestionIds(setB));

    return [...setAIds].filter(i => !setBIds.has(i));
};

const getGoogleTodoInAmazon = (amazon, google) => {
    const googleLeft = google.filter(q => isNil(q.status) || q.status === 'notac');
    const googleLeftIds = new Set(getQuestionIds(googleLeft));
    const amazonIds = new Set(getQuestionIds(amazon));

    const doesnt = [...googleLeftIds].filter(i => !amazonIds.has(i));

    console.log('Google but not Amazon: ', doesnt.length);   // 1st
    console.log('Google Left: ', googleLeft.length);
    
};

const mergeBoth = (amazon, google) => {
    console.log('shit: ', amazon.length);
    const setAIds = new Set(getQuestionIds(amazon));
    const setBIds = new Set(getQuestionIds(google));
    const mergedIds = [...new Set([...setAIds, ...setBIds])];
    console.log('All together: ', mergedIds.length);


    const combinedList = mergedIds.map(i => amazon.find(q => q.questionId === i) || google.find(q => q.questionId === i));

    console.log(combinedList.length);
    const notDone = combinedList.filter(q => isNil(q.status) || q.status === 'notac');
    console.log('Not Done: ', notDone.length);


};

const countUnique = async () => {
    const amazon = JSON.parse(read('./data/download/company/amazon.json'));
    const google = JSON.parse(read('./data/download/company/google.json'));

    const amazon6Months = getByTimeline('6M', amazon.data.companyTag.questions);
    const google6Months = getByTimeline('6M', google.data.companyTag.questions);

    console.log('6M Amazon: ', amazon6Months.length); // 2nd
    console.log('6M Google: ', google6Months.length);

    const totalDisjointQuestions = getDisjoint(amazon6Months, google6Months);
    const totalUnionQuestion = getUnion(amazon6Months, google6Months);
    const onlyAmazon = getOnlySetA(amazon6Months, google6Months);
    const onlyGoogle = getOnlySetA(google6Months, amazon6Months);

    console.log('Total Disjoint: ', totalDisjointQuestions.length);
    console.log('Total Union: ', totalUnionQuestion.length);
    console.log('Only Amazon: ', onlyAmazon.length);
    console.log('Only Google: ', onlyGoogle.length);

    getGoogleTodoInAmazon(amazon6Months, google6Months);
    mergeBoth(amazon6Months, google6Months);


    // console.log(console.log(onlyGoogle));

    // const googleTodo = onlyGoogle.map(i => google6Months.find(q => q.questionId === i && (isNil(q.status) || q.status === 'notac' )));

    const googleTodo = google6Months.filter(q => onlyGoogle.includes(q.questionId) && (isNil(q.status) || q.status === 'notac')).map(({questionId, title}) => ({questionId, title}));
    console.log(JSON.stringify(googleTodo));
};

const getTopicWise = async () => {
    const google = JSON.parse(read('./data/download/company/google.json'));
    const google6Months = getByTimeline('6M', google.data.companyTag.questions);
    
    let topicWise = {};
    google6Months.forEach(q => {
        q.topicTags.forEach(t => {
            let list = topicWise[t.slug] || [];
            list.push(q.title);
            topicWise[t.slug] = list;
        });
    });

    console.log(JSON.stringify(topicWise));
};

// countUnique();
getTopicWise();





/**
 * Conclusion 
 * 1. Do google notac, also not in amazon
 * 2  Do all amazon
 * 3. Do left in Google
 * 
 * All problems leads to 600+
 */

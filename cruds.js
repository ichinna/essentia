const rp = require('request-promise');
const chalk = require('chalk');


const args = require('minimist')(process.argv.slice(2));

if (!(args && args.a && args.e && args.o)) {
    console.warn(chalk.red("Yoo boy.... put some data in there with command line arg '-a' for authHeader, -e for environment and -o for object name"));
    console.warn('\x1b[32m%s\x1b[0m', "For example: node cruds.js -a \"User xxxx Organization xxxx Elemetn xxxx\" -e s -o accounts");
    console.warn('\x1b[32m%s\x1b[0m', "p => prod");
    console.warn('\x1b[32m%s\x1b[0m', "s => staging");
    console.warn('\x1b[32m%s\x1b[0m', "sp => snapshot");
    console.warn('\x1b[32m%s\x1b[0m', "l => local");
    process.exit(-1);
}


const authHeader = args.a;
const environment = args.e.toLowerCase();
const objectName = args.o;
var nextPage = null;
var start = null;

getBaseUrl = () => {
    return environment === 's' ?
        'https://staging.cloud-elements.com/elements/api-v2'
        : environment === 'sp' ?
            'https://snapshot.cloud-elements.com/elements/api-v2'
            : environment === 'p' ?
                'https://console.cloud-elements.com/elements/api-v2'
                : environment === 'l' ?
                    'http://localhost:8080/elements/api-v2'
                    : (() => {
                        console.error("fucking bitch");
                        process.exit(-1);
                    })();
}


const buildOptions = (method, nextPage, id) => {
    return {
        method,
        uri: id ? `${getBaseUrl()}/${objectName}/${id}` : `${getBaseUrl()}/${objectName}`,
        qs: nextPage ? {
            nextPage
        } : {},
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': authHeader
        },
        json: true,
        resolveWithFullResponse: true,
    };
}

var count = 0, failCount = 0;

const delteObject = async (id) => {
    await rp(buildOptions('DELETE', null, id))
        .then(r => {
            if (r.statusCode >= 200 || r.statusCode < 300) {
                count++;
                console.log(chalk.green(`Successfully deleted record: ${id}`));
            } else {
                failCount++;
                console.log(chalk.red(`Failed to delete: ${id}`));
            }
        }).catch(err => {
            failCount++;
            console.log(chalk.red(`Failed to delete id: ${id}`));
        });
}

const run = async () => {
    await rp(buildOptions('GET', nextPage))
        .then(async (r) => {
            if (r.headers && r.headers['elements-next-page-token']) {
                nextPage = r.headers['elements-next-page-token'];
            }
            let recordSize = r.body.length;
            let convertedString = Buffer.from(nextPage, 'base64').toString('binary');
            let outboundPageSize = 0;
            if (convertedString) {
                outboundPageSize = JSON.parse(convertedString).pageSize;
            }

            // r.body.forEach(async obj => await delteObject(obj.id)); //Something wrong with this shit like Chello


            let objs = r.body;
            for (var i = 0; i < objs.length; i++) {
                await delteObject(objs[i].id);
            }
            
            if (recordSize === 200 || outboundPageSize === recordSize) {
                run();
            } else {
                console.log(chalk.yellow('\n\n Time taken to Delte objects: ', (new Date().getTime() - start)));
                console.log(`     Total deleted: ${count} \n     Total failed to delete: ${failCount}`)
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

start = new Date().getTime();
run();
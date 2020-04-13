const rp = require('request-promise');
const chalk = require('chalk');
const args = require('minimist')(process.argv.slice(2));
if (!args || !args.accounts) {
    throw "pass accounts as argument";
}
let accounts = JSON.parse(args.accounts);

const deleteAccount = async id => {
    let options = {
        method: 'DELETE',
        uri: `http://localhost:8080/elements/api-v2/accounts/${id}`,
        headers: {
            'Accept': 'application/json',
            'Authorization': 'User xL7mHku1w7M0o3D9MK3iCPFbQVkMsiGB077/qMmdzEY=, Organization 031726ba894910bb8f7758e4852475ca'
        },
        resolveWithFullResponse: true,
    };

    await rp(options)
        .then(r => {
            if (r.statusCode >= 200 || r.statusCode < 300) {
                console.log(chalk.green(`Successfully deleted record: ${id}`));
            } else {
                console.log(chalk.red(`Failed to delete: ${id}`));
            }
        })
        .catch(err => console.log(err));
}

accounts.forEach(a => deleteAccount(a.id));
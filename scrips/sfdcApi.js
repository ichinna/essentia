const rp = require("request-promise");

let doGetOptions = resource => ({
    uri: `https://staging.cloud-elements.com/elements/api-v2/${resource}`,
    method: 'GET',
    headers: {
        Authorization: 'User J8jFFOCYFzbTXB/NAaEWdvSvsNksxVUqOQ//bAh4QKw=, Organization e5d3ca499a9473d7d72034da912cc625, Element tmsvrt6V6+p7gjb4LGrWaup7gNQOhn17l0FtllYQCD4='
    },
    json: true
});


const doRequest = async options => {
    // console.log(options);
    return await rp(options)
        .then(data => {
            return data;
        })
        .catch(err => console.log("error occurred: ", err));
}

//case 1: Make /Product2
const doGetProducts = () => {
    return doRequest(doGetOptions('Product2'))
}


//case 2: /PriceBookEntry?where=ProductCode='code''
let finalList = [];
const doHydrateProducts = async () => {

    let products = await doGetProducts();
    for (let i in products) {
        let product = products[i];
        if (product && product.ProductCode) {
            let val = await doRequest(doGetOptions(`PricebookEntry?where=ProductCode='${product.ProductCode}'`));
            if (val && Array.isArray(val))
                finalList.push(val[0]);
        }
    }

    console.log(JSON.stringify(finalList));
}


doHydrateProducts();


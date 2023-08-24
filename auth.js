const router = require('express').Router();


const msal = require('@azure/msal-node')


const config = {
    auth: {
        clientId: '',
        authority: ''
    }
};

const pca = new msal.PublicClientApplication(config);
pca.getAllAccounts().then((ac) => {
    console.log(ac);
});
console.log("MSAL Successfully authentified")


module.exports = router;
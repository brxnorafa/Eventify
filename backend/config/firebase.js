const admin = require('firebase-admin');
const serviceAccount = require('./eventify-6fca1-firebase-adminsdk-kxnxl-1efca4b867.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
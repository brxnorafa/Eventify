const admin = require('firebase-admin');
const serviceAccount = require('./eventify-6fca1-firebase-adminsdk-kxnxl-913c149b3e.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');


const app = express();

// tell express server to look for a folder which is called "public" and expose it to oustside world.
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    // keys use to encrypt cookie, can put random string totally up to you.
    keys: ['thisKeyStringYouCanPustAnythingYouWant']
}));
app.use(authRouter);



app.listen(3000, () => {
    console.log('Listening');
});

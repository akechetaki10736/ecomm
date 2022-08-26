const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const usersRepo = require('./repositories/users');


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    // keys use to encrypt cookie, can put random string totally up to you.
    keys: ['thisKeyStringYouCanPustAnythingYouWant']
}));

app.get('/signup', (req, res) => {
   res.send(`
    <div>
        Your id is: ${ req.session.userId }
        <form method="POST">
            <input name="email" placeholder="email" />
            <input name="password" placeholder="password" />
            <input name="passwordConfirmation" placeholder="password confirmation" />
            <button>Sign Up</button>
        </form>
    </div>
   `);
});

//bodyParser has many function in it, urlencoded is specific for html form
app.post('/signup', async (req, res) => {
    const { email, password, passwordConfirmation } = req.body;
    const existingUser = await usersRepo.getOneBy({ email });
    if (existingUser) {
        return res.send('Email is in use');
    }

    if (password !== passwordConfirmation) {
        return res.send('Passwords must be matched');
    }

    // Create a user in our user repo to represent this person
    const { id } = await usersRepo.create({ email, password });

    // store the id of that user inside the users cookie
    req.session.userId = id;

    res.send('Account created');
});

app.get('/signout', (req, res) => {
    //tell cookie-session to forget all info store in cookie
    req.session = null;
    res.send('You are loged out');
});

app.get('/signin', (req, res) => {
    res.send(`
    <div>
        <form method="POST">
            <input name="email" placeholder="email" />
            <input name="password" placeholder="password" />
            <button>Sign In</button>
        </form>
    </div>
   `);
});

app.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    const user = await usersRepo.getOneBy({ email });
    if (!user) {
        return res.send('Email not found');
    }

    const validPassword = await usersRepo.comparePasswords(user.password, password);

    if (!validPassword) {
        return res.send('Invalid password');
    }
    // user valid, add user id into cookie
    req.session.userId = user.id;
    res.send('You are sign in.')
});

app.listen(3000, () => {
    console.log('Listening');
});

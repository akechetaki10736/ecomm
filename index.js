const express = require('express');
const bodyParser = require('body-parser');
const usersRepo = require('./repositories/users');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
   res.send(`
    <div>
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
app.post('/', async (req, res) => {
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

    res.send('Account created');
});

app.listen(3000, () => {
    console.log('Listening');
});

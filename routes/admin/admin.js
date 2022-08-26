const express = require('express');
const usersRepo = require('../../repositories/users');
const sigupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
//router could see as app which is like what we use in index.js
//but actually it is a sub app, to give us more flexibility to write
const router = express.Router();

router.get('/signup', (req, res) => {
    res.send(sigupTemplate({ req }));
 });
 
 //bodyParser has many function in it, urlencoded is specific for html form
 router.post('/signup', async (req, res) => {
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
 
 router.get('/signout', (req, res) => {
     //tell cookie-session to forget all info store in cookie
     req.session = null;
     res.send('You are loged out');
 });
 
 router.get('/signin', (req, res) => {
     res.send(signinTemplate());
 });
 
 router.post('/signin', async (req, res) => {
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

 module.exports = router;
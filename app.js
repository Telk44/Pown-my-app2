const express = require('express');
const http = require('http');
const bcrypt = require('bcrypt');
const path = require('path');
const bodyParser = require('body-parser');
const users = require('./data').userDB;
const randtoken = require('rand-token');
const fs = require('fs');
const tokens = require('./token').tokenDB;

const app = express();
const server = http.createServer(app);

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'./front')));

app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'./front/index.html'));
});



app.get ('/cookie', function (req, res) {
    try {
        let accessToken =  randtoken.generate(16)
        tokens.push(accessToken)
        console.log(tokens)
        res.send(accessToken)
    }
    catch {
        res.send("Internal server error");
    }
})

app.post('/signup', async (req, res) => {
    try{
        let foundUser = users.find((data) => req.body.email === data.email);
        if (!foundUser) {
    
            let hashPassword = await bcrypt.hash(req.body.password, 10);
    
            let newUser = {
                id: Date.now(),
                username: req.body.username,
                email: req.body.email,
                password: hashPassword,
            };
            users.push(newUser);
            console.log('User list', users);
    
            res.send("<div align ='center'><h2>Inscription réussie !</h2></div><br><br><div align='center'><a href='./login.html'>Connexion</a></div><br><br>");
        } else {
            res.send("<div align ='center'><h2>Email déjà utilisé</h2></div><br><br><div align='center'><a href='./signup.html'>Inscrivez-vous à nouveau</a></div>");
        }
    } catch{
        res.send("Internal server error");
    }
});

app.post('/login', async (req, res) => {
    try{
        let foundUser = users.find((data) => req.body.email === data.email);
        if (foundUser) {
    
            let submittedPass = req.body.password; 
            let storedPass = foundUser.password; 
    
            const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
            if (passwordMatch) {
                let usrname = foundUser.username;
                res.send(`<div align ='center'><h3>Welcome ${usrname} ! </h3></div>`);
            } else {
                res.send("<div align ='center'><h2>Données invalides</h2></div><br><br><div align ='center'><a href='./login.html'>Connectez-vous à nouveau</a></div>");
            }
        }
        else {
            res.send("<div align ='center'><h2>Données invalides</h2></div><br><br><div align='center'><a href='./login.html'>Connectez-vous à nouveau<a><div>");
        }
    } catch{
        res.send("Internal server error");
    }
});


server.listen(3000, function(){
    console.log("server is listening on port: 3000");
});
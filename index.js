    const express = require('express');
    const axios = require('axios');
    const path = require("path");
    const app = express();
    var bodyParser = require('body-parser');

    const base_url = "http://localhost:3000";

    app.set("views",path.join(__dirname,"/public/views"));
    app.set('view engine','ejs');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false}));

    app.use(express.static(__dirname + '/public'));

    app.get("/",async(req, res) => {
            const response = await axios.get(base_url + '/Products');
            res.render("shop", {Products : response.data});
    });

    app.get("/adidas",async(req, res) => {
        const response = await axios.get(base_url + '/adidas');
        res.render("adidas", {adidas : response.data});
    });

    app.get("/nike",async(req, res) => {
        const response = await axios.get(base_url + '/nikes');
        res.render("nike", {nikes : response.data});
    });

    app.get("/converse",async(req, res) => {
        const response = await axios.get(base_url + '/converses');
        res.render("converse", {converses : response.data});
    });

    app.get("/login",async(req, res) => {
        const response = await axios.get(base_url + '/users');
        res.render("login", {users : response.data});
    });

    app.get("/Register",async(req, res) => {
        res.render("Register");
    });

    app.post("/Register",async(req, res) => {
        const data = {
            username:req.body.username, 
            email:req.body.email,              
            password:req.body.password,     
            phone:req.body.phone,         
            userAdress:req.body.userAdress 
        }
        await axios.post(base_url + '/users',data)
        return res.redirect("/");   
    });




    app.listen(5500, () => {
        console.log('Sever started on post 5500');
    });

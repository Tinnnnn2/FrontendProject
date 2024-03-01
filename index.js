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

    app.get("/login",async(req, res) => {
        const response = await axios.get(base_url + '/users');
        res.render("login", {users : response.data});
    });

    app.get("/Register",async(req, res) => {
        const response = await axios.get(base_url + '/users');
        res.render("Reigister", {users : response.data});
    });


    app.listen(5500, () => {
        console.log('Sever started on post 5500');
    });

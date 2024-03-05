const express = require('express');
const axios = require('axios');
const path = require("path");
const app = express();
var bodyParser = require('body-parser');
const multer  = require('multer');
const { render } = require('ejs');

const base_url = "http://localhost:3000";

app.set("views",path.join(__dirname,"/public/views"));
app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use(express.static(__dirname + '/public'));

// auto img 
// const putguitar = multer.diskStorage({
// destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, './public/pictures/Guitar'));
// },
// filename: function (req, file, cb) {
//     cb(null, file.originalname);
// }
// });

// const guitar = multer({ storage: putguitar });

app.get("/",async(req, res) => {
    const response = await axios.get(base_url + "/Products");
    const response2 = await axios.get(base_url + "/Types");
    console.log(response.data)
    console.log(response2.data)
    res.render("shop", {product: response.data, type: response2.data});
});


app.get("/nike/:id",async (req, res) => {
    const response = await axios.get(base_url + "/Products");
    const product = response.data;

    let dt = [];
    for (let pro of product) {
        if (pro.Typeid == req.params.id) {
            const response = await axios.get(base_url + "/Products/" + pro.Productid);
            const data = response.data;
            dt.push(data);
        }   
    }
    const response2 = await axios.get(base_url + "/Types");
    res.render("nike", {dt: dt, type: response2.data});
});
//-----------------------------------------------
app.get("/adidas/:id",async (req, res) => {
    const response = await axios.get(base_url + "/Products");
    const product = response.data;

    let ad = [];
    for (let pro of product) {
        if (pro.Typeid == req.params.id) {
            const response = await axios.get(base_url + "/Products/" + pro.Productid);
            const data = response.data;
            ad.push(data);
        }   
    }
    const response2 = await axios.get(base_url + "/Types");
    res.render("adidas", {ad: ad, type: response2.data});
});
//----------------------------------------------------------------------
app.get("/converse/:id",async (req, res) => {
    const response = await axios.get(base_url + "/Products");
    const product = response.data;

    let cv = [];
    for (let pro of product) {
        if (pro.Typeid == req.params.id) {
            const response = await axios.get(base_url + "/Products/" + pro.Productid);
            const data = response.data;
            cv.push(data);
        }   
    }
    const response2 = await axios.get(base_url + "/Types");
    res.render("converse", {cv: cv, type: response2.data});
});

app.get("/DataE/:id",async (req,res) =>{
    const response = await axios.get(base_url + "/Products/" + req.params.id);
    const response2 = await axios.get(base_url + "/Types");
    try{
        res.render("DataE",{product: response.data, type: response2.data})
    }catch{
        console.error(err);
        res.status(500).send('Error list ')
        
    }
});



app.get("/login",async(req, res) => {
    const response = await axios.get(base_url + '/users');
    res.render("login", {users : response.data});
});

app.post("/login",async(req, res) => {
    try{
    const data = {
        name:req.body.username,
        password:req.body.password
    }
    const response = await axios.post(base_url + '/login',data)
    if(response.data.message == "user not found"){
        const wrong = {
            message:"wrong"
        }
        res.redirect("/login")
    }
    else if(response.data.message == "wrong password"){
        const wrong = {
            message:"wrong"
        }
        res.redirect("/login")
    }
    else{
        res.redirect("/");
    }
}catch(err){
    console.log(err);
    res.status(500).send("error");
}
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

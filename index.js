const express = require('express');
const axios = require('axios');
const path = require("path");
const app = express();
var bodyParser = require('body-parser');
const multer  = require('multer');
const { render } = require('ejs');
const session = require('express-session')

const base_url = "http://node60262-env-3349855.proen.app.ruk-com.cloud";

app.set("views",path.join(__dirname,"/public/views"));
app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use(express.static(__dirname + '/public'));

app.use(
    session({
      secret: "I don't know either",
      resave: false,
      saveUninitialized: false,
    })
  );

const putimg = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, './public/img/products'));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const img = multer({ storage: putimg });

const onlyAdmin = (req,res,next) => {
    if(req.session.logindata.level == "admin"){
        next();
    } else {
        res.redirect("/");
    }
}

const onlyUser = (req,res,next) => {
    if(req.session.logindata.level == "user"){
        next();
    } else {
        res.redirect("/");
    }
}

//--------------------------------------------------------------

app.get("/",async(req, res) => {
    const response = await axios.get(base_url + "/Products");
    const response2 = await axios.get(base_url + "/Types");
    // console.log(response.data)
    // console.log(response2.data)
    console.log(req.session.logindata)
    if(!req.session.logindata){
        req.session.logindata = {
        username: ""
        }
    }
    res.render("shop", {
        product: response.data, 
        type: response2.data,
        usedata:req.session.logindata});
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
    res.render("nike", {dt: dt, type: response2.data,product: response.data, usedata:req.session.logindata});
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
    res.render("adidas", {ad: ad, type: response2.data,product: response.data, usedata:req.session.logindata});
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
    res.render("converse", {cv: cv, type: response2.data,product: response.data, usedata:req.session.logindata});
});

//---------------------------------------------------------------------------






app.get("/DataE/:id",async (req,res) =>{
    const response = await axios.get(base_url + "/Products/" + req.params.id);
    const response1 = await axios.get(base_url + "/users/");
    const response2 = await axios.get(base_url + "/Types");
    try{
        console.log(req.session.logindata)
        res.render("DataE",{product: response.data, user:response1.data,  type: response2.data, usedata:req.session.logindata})
    }catch{
        console.error(err);
        res.status(500).send('Error list ')
        
    }
}); 

app.post("/DataE/:id",async(req, res) => {
    const response = await axios.get(base_url + "/Products/" + req.params.id);
    const response1 = await axios.get(base_url + "/users/");
    const response2 = await axios.get(base_url + "/Types");
    try{const data = {
        Productid:req.body.Productid, 
        userid:req.session.logindata.userid    
    }   
        console.log(data,{product: response.data, user:response1.data,  type: response2.data, usedata:req.session.logindata});
        await axios.post(base_url + '/orders/' + req.params.id ,data);
        res.redirect("/");   
    } 
    catch(err){
        console.error(err);
        res.status(500).send('Error orders ')
        
    }
    
});



//-------------------------------------------------------

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
        console.log("user wrong");
        res.redirect("/login")
    }
    else if(response.data.message == "wrong password"){
        console.log("password wrong");
        res.redirect("/login")
    }
    else{
        req.session.logindata = {
            username: response.data.checkN.username,
            level: response.data.checkN.level,
            userid:response.data.checkN.userid
        }
        console.log(req.session.logindata)
        res.redirect("/");
    }
}catch(err){
    console.log(err);
    res.status(500).send("error");
}
});
app.get("/logout",(req, res) =>{
    try{
        req.session.logindata = null
        res.redirect("/")
    }
    catch(err){
        console.log(err);
        res.status(500).send("error");
        res.redirect("/")
    }
});


app.get("/Register",async(req, res) => {
    res.render("Register",{usedata:req.session.logindata}); 
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
    if (req.session.logindata.level == "admin"){
        return res.redirect("/Accouts");
    }else{
    return res.redirect("/");   
    }
});

//-------------------------------------------------------------

app.get("/addproduct",onlyAdmin,async(req, res) => {
    const response = await axios.get(base_url + "/Products");
    const response2 = await axios.get(base_url + "/Types");
    res.render("addproduct", {product: response.data, type: response2.data,usedata:req.session.logindata});
});

app.post("/addproduct",onlyAdmin,img.single('img_product'),async(req, res) =>{
    try{
        const data = {
            size: req.body.size, 
            price: req.body.price,
            Typeid: req.body.Typeid,
            Name_product: req.body.Name_product,
            img_product: req.file.filename
         };
        await axios.post(base_url + '/Products',data);
        res.redirect("/");
    } catch (err){
        console.error(err);
        res.status(500).send('Error');
    }
});

//-------------------------------------------------------------

app.get("/order",onlyAdmin, async(req, res) => {

    try {
            const response = await axios.get(base_url + "/orders");
            const response2 = await axios.get(base_url + "/Types");
            const response3 = await axios.get(base_url + "/Products/");
            const response4 = await axios.get(base_url + "/users");
            res.render("order", {  order: response.data,
                                    usedata:req.session.logindata,
                                    type: response2.data,
                                    product: response3.data,
                                    user: response4.data
                                    });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error orders')
    }
})

app.get("/deleteorder/:id", async (req, res) => {
    try{
        await axios.delete(base_url + '/orders/'+ req.params.id);
        res.redirect("/order");
    } catch (err){
        console.error(err);
        res.status(500).send('Error');
    }
});

//---------------------------------------------------------

app.get("/update/:id",onlyAdmin, async (req, res) => {
    try{
        const response = await axios.get(base_url + "/Products/" + req.params.id);
        const response2 = await axios.get(base_url + "/Types");
        res.render("update", {product: response.data, type: response2.data,usedata:req.session.logindata});
    } catch (err){
        console.error(err);
        res.status(500).send('Error');
    }
});

app.post("/update/:id",img.single('img_product'), async (req, res) => {
    try{
        const data = {
            size: req.body.size, 
            price: req.body.price,
            Typeid: req.body.Typeid,    
            Name_product: req.body.Name_product,
            img_product: req.file.filename
         };
         
        await axios.put(base_url + '/Products/'+ req.params.id,data);
        res.redirect("/");
    } catch (err){
        console.error(err);
        res.status(500).send('Error');
    }
});

app.get("/delete/:id",onlyAdmin,async (req, res) => {
    try {
      await axios.delete(base_url + "/Products/" + req.params.id);
      res.redirect("/");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error");
    }
  });

  //-------------------------------------------------------------------------------
app.get("/Accouts",onlyAdmin, async (req, res) => {
    try{
        const response = await axios.get(base_url + "/Products/");
        const response2 = await axios.get(base_url + "/Types");
        const response3 = await axios.get(base_url + "/users");
        res.render("Accouts", {
                            product: response.data, 
                            type: response2.data,
                            user: response3.data,
                            usedata:req.session.logindata});
    } catch (err){
        console.error(err);
        res.status(500).send('Error');
    }
});

//-----------------------------------------------------------------------


app.get("/Uaccout/:id",onlyAdmin, async (req, res) => {
    try{
        const response1 = await axios.get(base_url + "/users/" + req.params.id);
        const response2 = await axios.get(base_url + "/Types");
        
        res.render("Uaccout", {
                            user: response1.data,
                            type: response2.data,
                            usedata:req.session.logindata});
    } catch (err){
        console.error(err);
        res.status(500).send('Error');
    }
});

app.post("/Uaccout/:id", async (req, res) => {
    try{
        const datauser = {
            username: req.body.username, 
            email: req.body.email,              
            password: req.body.password,     
            phone: req.body.phone,         
            userAdress: req.body.userAdress,
            level: req.body.level 
         };
        await axios.put(base_url + '/users/'+ req.params.id,datauser);
        console.log(datauser)
        res.redirect("/Accouts");
    } catch (err){
        console.error(err);
        res.status(500).send('Error');
    }
});

app.get("/Accoutdelete/:id",onlyAdmin,async (req, res) => {
    try {
      await axios.delete(base_url + "/users/" + req.params.id);
      res.redirect("/Accouts");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error");
    }
  });

app.listen(5500, () => {
    console.log('Sever started on post 5500');
});

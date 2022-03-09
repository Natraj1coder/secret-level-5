require('dotenv').config();
const express=require("express");
const BodyParser=require("body-parser");
const ejs=require("ejs");
const bodyParser = require("body-parser");
// const md5=require("md5");
const mongoose=require("mongoose");
const bcyrt=require("bcrypt");
const { hash } = require('bcrypt');
const salt_round=10;
const app=express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://127.0.0.1/userDB");

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});
//encrypt
// userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User=new mongoose.model("User",userSchema);


app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});
app.post("/register",function(req,res){
    bcyrt.hash(req.body.username,salt_round,function(err,hash){

        const newUser=new User({
            email:req.body.username,
            password:hash
        });
        newUser.save(function(err){
            if(err){
                console.log(err);
            }
            res.render("secrets");
        });
    });
});
app.post("/login",function(req,res){
const username=req.body.username;
const password=req.body.password;
User.findOne({email:username},function(err,fondUser){
    if(err){
        console.log(err);
    }
    if(fondUser){
        bcyrt.compare(password,fondUser.password,function(err,result){
            console.log(fondUser.password);
            console.log(password);
              if(result=== true){
                res.render("secrets");//$2b$10$mY7i1HWgXNQevLCS/BlWsu7pFxRXCTxB7rXfExfWb5XEedVIxL7ry
              }  
            else{
                console.log(result);
            }

        });


            
        
    }
})
});
    







app.listen(3000,function(){
    console.log("Server started on port 3000");
})
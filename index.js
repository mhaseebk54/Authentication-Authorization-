const express = require ('express');
const User = require ('./models/user');

const path = require ('path');
const app = express();
const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,'public')));




app.get('/',(req,res)=>{
res.render('index')
});

app.post('/create', (req,res) =>{

 let{name,email,password}= req.body; 
 
bcrypt.genSalt(10,(err,salt) =>{
  bcrypt.hash(password,salt,async (err,hash)=>{
    const userCreated =await  User.create({
      name,
      email,
      password: hash,
    });
  let token =  jwt.sign({email},"hahaha");
  res.cookie("token",token);
    res.send(userCreated);
  });
});
});

app.get('/login', (req,res)=>{
res.render('login');
});

app.post('/login',async (req,res)=>{
  let loginUser = await User.findOne({email:req.body.email})
  if (!loginUser ) return res.send("Something Went Wrong")
    
   bcrypt.compare(req.body.password,loginUser.password,(err,result)=>{
   if (result) {
    let token =  jwt.sign({email: loginUser.email},"hahaha");
    res.cookie("token",token);
    res.send("Yes You can login");
  }
   else res.send("Sorry you can't login");
   }) 

});
app.get('/logout',(req,res)=>{
  res.cookie("token","");
  res.redirect("/login");
  });

app.listen(3000)
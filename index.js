const express=require('express')
const bodyparser=require('body-parser')
const app=express()
var mysql=require('mysql')

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database:"mydb"
});

con.connect(function(err) {
  if (!err)
    console.log("Connected!");
  else
    console.log(JSON.stringify(err))
});

app.use(bodyparser.urlencoded({extended:true}))
//setting pug
app.set('view engine','pug')
app.set('views','./views')

 app.get('/',function(req,res){
     res.render('first')
     con.query('Select * from login',function(err,result,fields){
       if (err) throw err
       console.log(result)
     })
})

 app.get('/register',function(req,res){
    res.render('index')
 })

 /*app.get('/login',function(req,res){

     var t=JSON.parse(JSON.stringify(req.query))
     //JSON.stringify =converts data query into string
     //JSON.parse= converts string in object type
    res.render('login',{
        "data":t
        "data":{
            "name":req.query.username,
            "email":req.query.mail,
            "password":req.query.password,
            "gender":req.query.gender
        }
    })
 })*/

 app.post('/login',function(req,res){
     //req.body=JSON Format
    //console.log(req.body)    

    const email=req.body.mail
    const pass=req.body.password
    
    if(email===''||pass==='')
    {
      res.send('<script>alert("Fill Required")</script>')
    }
    else
    {
      con.query('Select * From login where email=? or password=?',[email,pass],(err,result,fields)=>{
        if(result.length>0)
        {
          res.send('<h1 align="center">Users Exists</h1><a align="center" style="font-size:1.3rem" href="/register">Back</a>')
          
        }
        else
        {
          const sql=[
            req.body.username,req.body.mail,req.body.password,req.body.gender
          ]
          var w="Insert Into login (name,email,password,gender) Values (?)"
          con.query(w,[sql],function (err, result) {
          if (!err) 
              console.log("Inserted!");
          else
            console.log(JSON.stringify(err.sql)) 
          });

            res.render('login',{
              data : req.body
          })
        }
      })
    }
 })

 app.get('/show',(req,res)=>{
    res.render('show')
 })

 app.post('/signin',(req,res)=>{
    const name=req.body.username
    const password=req.body.password
    
    console.log(name,password)
    con.query('Select * From login where name=? and password=?',[name,password],(err,result,fields)=>{
      if(result.length>0)
      {
        res.render('signin',{
          data : req.body
        })
        //res.send('<script>alert("Congrats")</script>')
      }
      else{
        res.send('<h1 align="center">Users Does Not Exists</h1><a align="center" style="font-size:1.5rem; text-align:center;" href="/show">Back</a>')
      }
    })
 })
 app.get('/up',(req,res)=>{
    res.render('up')
 })

 app.post('/update',(req,res)=>{
    con.query('Select * from login where password=?',[req.body.newpassword],(err,result)=>{
      if(result.length>0)
      {
        con.query('Select * from login where password=?',[req.body.password],(err,result)=>{
          if(result.length>0)
          {
            console.log('Password exists')
            res.send('<h1 align="center">Password Exists</h1><a align="center" style="font-size:1.5rem;text-align:center;" href="/up">Back</a>')
          }
          else 
          {
            con.query('Update login set password=? where password=?',[req.body.password,req.body.newpassword],(err,result)=>{
              console.log('Updated!')
              res.render('update')
            })
          }
        })
      }
      else{
        res.send("<h1 align='center'>Users Doesn't Exists</h1><a align='center' style='font-size:1.5rem; text-align:center;' href='/up'>Back</a>")
        //res.render('up')
      }
    })
 })
 app.get('/del',(req,res)=>{
   res.render('del')
 })
 app.post('/delete',(req,res)=>{
    con.query('Select * from login where password=?',[req.body.password],(_err,result)=>{
      if(result.length>0)
      {
        con.query('Delete from login where password=?',[req.body.password],function(err,result){
          if(err) throw err
          console.log('Deleted!')
          res.render('delete')
        })
      }
      else
      {
       res.send("<h1 align='center'>User Doesn't Exists</h1><a align='center' style='font-size:1.5rem; text-align:center;' href='/del'>Back</a>")
      }
    })
 })
 
 app.get('*',function(req,res){
    res.render('error')
 })

 app.listen(3000,()=>{
     console.log('Server Running...')
 })
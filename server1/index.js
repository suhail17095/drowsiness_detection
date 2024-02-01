const express=require("express")
const app=express();
const cors=require("cors")
const {Users} =require("./models/UserSchema")

require("./db/conn");
app.use(express.json())
app.use(cors())

async function check(email)
{
    try {
        const res = await Users.findOne({ email: email });
        if (res == null) {
          return false;
        } else {
          return true;
        }
      } catch (err) {
        console.log(err);
        return false;
      }
}

app.post("/login",async(req,res)=>
{
    const email=req.body.email;
    const password=req.body.password;

    console.log(email+" "+password);
    const temp=await check(email);
    if(temp == false)
    {
        res.status(200).send({flag:"false",msg:"Invalid Credentials"});
    }
    
    const user=await Users.findOne({email:email});
    console.log(user);
    if(user.password == password)
    {
        res.status(200).send({flag:"true",msg:"Successfully log in"});
    }
    else{
        res.status(200).send({flag:"false",msg:"Invalid credentials"});
    }

})

app.post("/registeration",async(req,res)=>
{
    
    const password=req.body.password;
    const cpassword=req.body.cpassword;
    const name=req.body.name;
    const phone=req.body.phone;
    const email=req.body.email;
    const email1=req.body.email1;
    const email2=req.body.email2;
    
    console.log("name: "+name+" email: "+email+" email1: "+email1+"phone "+phone+"email2 "+email2);
    const temp=await check(email);
    if(cpassword!=password)
    {
        res.status(200).send({flag:"false",msg:"password doesnot match"});
    }
    else if(temp)
    {
        res.status(200).send({flag:"false",msg:"user already exits"});
    }
    else{
        
        const user=new Users({email:email,password:password,name:name,phone:phone,email1:email1,email2:email2});
        try{
            await user.save();
            res.status(200).send({flag:"true",msg:"Registration succesfull"});
        }
        catch(err)
        {
            console.log(err);
            res.status(200).send({flag:"false",msg:"Registration Failed"});
        }
        

        
    }

})

app.listen(3002,()=>
{
    console.log("app is listening at port 3002");
})
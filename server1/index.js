const fetch= require("node-fetch")
const express = require("express")
const app = express();
const cors = require("cors")
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser")
const { Users } = require("./models/UserSchema")


require("./db/conn");
app.use(express.json())
app.use(cors())
app.use(bodyParser.json())

async function check(email) {
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

app.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    console.log(email + " " + password);
    const temp = await check(email);
    if (temp == false) {
        res.status(200).send({ flag: "false", msg: "Invalid Credentials" });
    }

    const user = await Users.findOne({ email: email });
    console.log(user);
    if (user.password == password) {
        res.status(200).send({ flag: "true", msg: "Successfully log in" });
    }
    else {
        res.status(200).send({ flag: "false", msg: "Invalid credentials" });
    }

})

app.post("/registeration", async (req, res) => {

    const password = req.body.password;
    const cpassword = req.body.cpassword;
    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;
    const email1 = req.body.email1;
    const email2 = req.body.email2;

    console.log("name: " + name + " email: " + email + " email1: " + email1 + "phone " + phone + "email2 " + email2);
    const temp = await check(email);
    if (cpassword != password) {
        res.status(200).send({ flag: "false", msg: "password doesnot match" });
    }
    else if (temp) {
        res.status(200).send({ flag: "false", msg: "user already exits" });
    }
    else {

        const user = new Users({ email: email, password: password, name: name, phone: phone, email1: email1, email2: email2});
        try {
            await user.save();
            res.status(200).send({ flag: "true", msg: "Registration succesfull" });
        }
        catch (err) {
            console.log(err);
            res.status(200).send({ flag: "false", msg: "Registration Failed" });
        }



    }

})

app.post("/get_details",async(req,res)=>
{
    const email = req.body.email;
    const temp = await check(email);
    const user = await Users.findOne({ email: email });
    if(!user)
    {
        res.status(200).send({ flag: "false", msg: "User Not found" });
    }
    res.status(200).send({flag:"true",name:user.name,email1:user.email1,email2:user.email2,phone:user.phone})
})
app.post("/send_email", (req, res) => {

    const name = req.body.name;
    const email1 = req.body.email1;
    const email2 = req.body.email2;
    const status=req.body.status;
    
    let subject="";
    console.log(req.body);
    let text="";
    let flag=true;
    if(status == "Alert")
    {
        const latitude=req.body.latitude;
        const longitude=req.body.longitude;
        const phone=req.body.phone;
        const location=`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
        subject = `Emergency!! your family member ${name} is in trouble`
        text = `Dear Family Member,
        I am writing to inform you that your family member has been detected as drowsy while driving and is currently unresponsive. We have sent this email to you as an emergency measure to ensure that you are aware of the situation and can take appropriate action.
        The location of the vehicle has been tracked and is currently at given below location. We urge you to immediately come to the location or try contacting ${name} on their phone number ${phone} to ensure their safety.
        Please treat this as an urgent matter and take immediate action.
        location: ${location}
        Sincerely,
        [Drowsiness detection team]`
    }
    else if(status == "Telegram")
    {
        const link="https://t.me/drowsey_detection"
        subject=`Get Updated about your family members safety`
        text=`Join this telgram channel to get updated about your family member ${name} 
        Joining Link: ${link}`;
        flag=false;
    }
    else{
        subject = `Relax!! your family member ${name} is now safe`
        text=`
            Dear Family Member,
            It seems like we have made a false Alert. Glad to tell you that your family member ${name} is safe.
        `
    }

    console.log("Inside send mail");
    console.log(email1+" "+email2);
    console.log("Helloworld")

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "2020.suraj.patel@ves.ac.in",
            pass: "llikuaxlecvzlrlu",
        },
    });
    
    const mailOptions = {
        from: "2020.suraj.patel@ves.ac.in",
        to: ` ${email1},${email2}`,
        subject:subject, // Subject line
        text: text, // plain text body
    };
    if(flag == true){
    sendTelegramMessage(`This is a message for ${email1} and ${email2}\n`+text)
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.status(200).send({ msg: "Error sending email", status: "false" });
        } else {
            console.log("Email sent: " + info.response);
            res.status(200).send({ msg: "Email sent successfully", status: "false" });
        }
    });

    res.status(200).send({ msg: "Email is sent succesfully ", status: "true" })
});



async function sendTelegramMessage(message) {
    try {
        const token="7137092591:AAHJx53K_VlMM1BONRiHZv6FqT_8_-Ginz0";
        const channel="-1002059374534"
        const request = await fetch(
        `https://api.telegram.org/bot${token}/sendMessage?chat_id=${channel}&text=${message}`,
        {
          method: "GET",
          redirect: "follow",
        }
      );
  
    
      const response = await request.json();
      console.log(response);
   
      return response;
    } catch (error) {
      console.error("Error:", error);
    }
  }
async function sendMail(){
    sendTelegramMessage(
        "Hey! my name is suraj patel. How can i help you sir !!"
      );
}
app.listen(3002, () => {
    console.log("app is listening at port 3002");
})
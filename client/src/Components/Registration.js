import React, { useState } from 'react'
import img1 from "../Images/man_with_computer.png"
import axios from "axios"
import { Link ,useNavigate} from "react-router-dom"

function Registration() {
    const [user,setUser]=useState({
        name:"",email:"",phone:"",email1:"",email2:"",password:"",cpassword:""
    })
    const Navigate=useNavigate()
    const handleChange=(e)=>
    {
        const name=e.target.name
        const value=e.target.value
        setUser({
            ...user,
            [name]:value
        })
    }   
    const submit=()=>
    {
        const {name,email,phone,email1,email2,password,cpassword}=user;
        axios.post("http://localhost:3002/registeration",{name,email,phone,email1,email2,password,cpassword}).then((res)=>
        {
           
            if(res.data.flag == "false")
            {
                alert(res.data.msg);
            }
            else{

           alert(res.data.msg);
           sendMail("Telegram")
           Navigate("/");
            }
            
        })
    }
 
    async function sendMail(status) {
        const name=user.name;
        const email1=user.email1;
        const email2=user.email2;
        console.log("name "+name+" email1 "+email1+" email2 "+email2);
        try{
            const res1 = await axios.post("http://localhost:3002/send_email", { name: name, email1: email1, email2: email2,status: status });
            
        }
        catch(err){
            console.log(err);
        }

    }
    return (            
            <div className="container register-container shadow bg-white-rounded">
                <h1 className='mb-3'>Sign up</h1>
                <div className="row register-row">
                    
                        <div className='col-md-6 col-sm-12 register-form '>
                            <div className="form-group">
                                <div className="input-group input-group-sm mb-3">
                                    <div className="input-group-prepend">

                                        <i className="fa-solid fa-user-tie input-group-text register-icon" id="inputGroup-sizing-sm"></i> 
                                    </div>
                                    <input type="text" className="form-control register-input " aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder='Your Name' name='name' value={user.name}  onChange={handleChange}/>
                                </div>
                                <div className="input-group input-group-sm mb-3">
                                    <div className="input-group-prepend">
        
                                        <i class="fa-solid fa-envelope input-group-text register-icon" id="inputGroup-sizing-sm"></i>
                                    </div>
                                    <input type="email" className="form-control register-input" aria-label="Small" aria-describedby="inputGroup-sizing-sm " placeholder='Email' name='email' value={user.email} onChange={handleChange}/>
                                </div>
                                <div className="input-group input-group-sm mb-3">
                                    <div className="input-group-prepend">
        
                                        <i className="fa-solid fa-phone input-group-text register-icon" id="inputGroup-sizing-sm" ></i> 
                                    </div>
                                    <input type="phone" className="form-control register-input" aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder='Mobile phone ' name='phone' value={user.phone} onChange={handleChange}/>
                                </div>
                                <div className="input-group input-group-sm mb-3">
                                    <div className="input-group-prepend">
        
                                        <i className="fa-solid fa-briefcase input-group-text register-icon" id="inputGroup-sizing-sm" ></i> 
                                    </div>
                                    <input type="text" className="form-control register-input" aria-label="Small" aria-describedby="inputGroup-sizing-sm " placeholder='Family Email-1' name='email1' value={user.email1} onChange={handleChange}/>
                                </div>
                                <div className="input-group input-group-sm mb-3">
                                    <div className="input-group-prepend">
        
                                        <i className="fa-solid fa-briefcase input-group-text register-icon" id="inputGroup-sizing-sm" ></i> 
                                    </div>
                                    <input type="text" className="form-control register-input" aria-label="Small" aria-describedby="inputGroup-sizing-sm " placeholder='Family Email-2' name='email2' value={user.email2} onChange={handleChange}/>
                                </div>
                              
                               
                                <div className="input-group input-group-sm mb-3">
                                    <div className="input-group-prepend">
        
                                        <i className="fa-solid fa-lock input-group-text register-icon" id="inputGroup-sizing-sm" ></i> 
                                    </div>
                                    <input type="password" className="form-control register-input" aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder="Password" name='password' value={user.password} onChange={handleChange}/>
                                </div>
                                <div className="input-group input-group-sm mb-3">
                                    <div className="input-group-prepend">
        
                                        <i className="fa-solid fa-unlock input-group-text register-icon" id="inputGroup-sizing-sm" ></i> 
                                    </div>
                                    <input type="password" className="form-control register-input" aria-label="Small" aria-describedby="inputGroup-sizing-sm " placeholder='Confirm your password' name='cpassword' value={user.cpassword} onChange={handleChange}/>
                                </div>
                                <div className="button">
                                    <button className='btn btn-primary mt-3' onClick={submit}>Register</button>
                                </div>
                            </div>
                        </div>
                    
                    <div className="col-md-6 computer col-sm-12 register-div ">
                        <img src={img1} alt="" />
                        <div>
                        <Link to="/" className='ml-3' style={{color:"black"}}> I am already registered</Link>
                        </div>
                    </div>
                </div>
            </div>
      
    )
}

export default Registration
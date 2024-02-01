import React, { useState } from 'react'
import { Link ,useNavigate} from "react-router-dom"
import img1 from "../Images/man_with_computer2.jpg"
import axios from "axios"

function Login(props) {
    const [user,setUser]=useState({email:"",password:""})

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
    const submit=(e)=>
    {
        e.preventDefault()
 
        const {email,password}=user
        const user_id=email
        axios.post("http://localhost:3002/login",{email,password}).then((res)=>
        {
            if(res.data.flag == "false")
            {
                alert(res.data.msg);
            }
            else{
                
                props.setCurUser(email);
                Navigate("/webcam");
        }
        })
    }
 
  return (

    <div className="container register-container shadow bg-white-rounded">
    <h1 className='mb-3'>Sign In</h1>
    <div className="row register-row">
        
    <div className="col-md-6 computer col-sm-12 register-div login-div">
            <img src={img1} alt="" />
            <div>
            <Link to="/registration" className='ml-3' style={{color:"black"}}> Create an Account</Link>
            </div>
        </div>
            <div  className='col-md-6 col-sm-12 register-form login-form'>
                <div className="form-group">
                    
                    <div className="input-group input-group-sm mb-3">
                        <div className="input-group-prepend">

                            <i class="fa-solid fa-envelope input-group-text register-icon" id="inputGroup-sizing-sm"></i>
                        </div>
                        <input type="email" className="form-control register-input" aria-label="Small" aria-describedby="inputGroup-sizing-sm " placeholder='User Id' name='email' value={user.email} onChange={handleChange}/>
                    </div>
                   
                    
                    <div className="input-group input-group-sm mb-3">
                        <div className="input-group-prepend">

                            <i className="fa-solid fa-lock input-group-text register-icon" id="inputGroup-sizing-sm" ></i> 
                        </div>
                        <input type="password" className="form-control register-input" aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder="Password" name='password' value={user.password} onChange={handleChange}/>
                    </div>
                    
                    <div className="button">
                        <button className='btn btn-primary mt-3' onClick={submit}>Register</button>
                    </div>
                </div>
            </div>
    </div>
</div>
  )
}

export default Login
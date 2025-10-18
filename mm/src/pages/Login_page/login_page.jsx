import React from 'react'
import './login_page.css'
import email_icon from '../../assets/email_icon.png'
import password_icon from '../../assets/password_icon.png'


const Login_page = () => {
    return (
        <div className='container-log'>
        <div className='header-log'>
        <div className="text-log">Info Login</div>
        <div className="underline-log">  </div>
        </div>
        <div className="inputs-log">
        
        <div className="input-log">
            <img src= {email_icon} alt="" className="email-icon" />
            <input types = "Email" placeholder="Enter email"/>
        </div>
          <div className="input-log">
            <img src= {password_icon} alt="" className="password-icon" />
            <input types = "password" placeholder="Enter password"/>
        </div>   
        </div>
        <div className="submit-container-log">
            <button className="submit-log">Submit</button>
        </div>
        </div>
    )
}
export default Login_page
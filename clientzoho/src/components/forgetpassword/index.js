import { Component } from "react";
import { FaLock } from 'react-icons/fa';
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import './index.css'

class Forgetpassword extends Component{
    state={email:'',secretcode:'',errorMsg:'',suggest:''}

    changeEmail=(event)=>{
        this.setState({email:event.target.value,errorMsg:'',suggest:''})
    }

    changeSecret=(event)=>{
        this.setState({secretcode:event.target.value,errorMsg:'',suggest:''})
    }

    onSubmitSuccess = data => {
        const jwtToken=data.jwtToken
         Cookies.set('jwt_token', jwtToken, {
         expires: 30,
         path: '/',
         })
        this.setState({suggest:data.password})
     }
     
     onSubmitFailure = data => {
         this.setState({errorMsg:data.message})
     }
     onSubmitFailedSuggest = data =>{
        this.setState({suggest:data.message})
     }


    submitDetails=async (event)=>{
        event.preventDefault();
        const {email,secretcode}=this.state
        if(email==='' || secretcode ===''){
            this.setState({errorMsg:"*Please fill all the details"})
        }
        else{
            const userDetails = {email,secretcode}
            const url = 'http://localhost:5000/forgetpassword'
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                  },
                body:JSON.stringify(userDetails),
            }
            const response = await fetch(url, options)
            const data     = await (response.json())
           if (response.status === 201) {
                this.onSubmitSuccess(data)
            } 
            else if (response.status === 401)
            {
                this.onSubmitFailedSuggest(data)
            }
            else {
                this.onSubmitFailure(data)
            }
        }
    }


    render(){
        const {email,secretcode,errorMsg,suggest}=this.state
        return(
            <div className='forget-bg-container'>
                 <div className='forget-container'>
                    <h1 className='forget-heading'>Forget Password</h1>
                    <div className='forget-data-container'>
                    <form className='forget-form-style' onSubmit={this.submitDetails}>
                        <div className='forget-label-input'>
                            <label htmlFor='email' className='forget-label-style'>Email</label>
                            <input id="email" value={email} type="email" className='forget-input-style' placeholder='sajid.m2.edu@gmail.com' onChange={this.changeEmail}/>
                        </div>
                        <div className='forget-label-input'>
                            <label htmlFor='secret' className='forget-label-style'>Secret</label>
                            <input id="secret" value={secretcode} type="password" className='forget-input-style' onChange={this.changeSecret}/>
                        </div>
                        <button type="submit" className='forget-button-style'><FaLock className='forget-fav-lock' />
                        <p className='forget-para'>Sign In</p>
                        </button>
                        <p className="signup-account-para">Got your password? <span className='signup-between'><Link className="sign-in-between" to='/'> Sign In</Link></span></p>
                        {errorMsg===''?'':<p className='error-message'>{errorMsg}</p>}
                        {suggest===''?'':<p className='suggest-message'>{suggest}</p>}
                    </form>
                    </div>
                </div>
            </div>
        )
    }

}

export default Forgetpassword
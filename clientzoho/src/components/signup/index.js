import { Component } from "react";
import Cookies from 'js-cookie'
import { FaLock } from 'react-icons/fa';
import {Link} from 'react-router-dom'
import './index.css'

class Signup extends Component{
    state={email:'',password:'',secretcode:'',errorMsg:'',suggest:''}

    changeEmail=(event)=>{
        this.setState({email:event.target.value,errorMsg:'',suggest:''})
    }

    changePassword=(event)=>{
        this.setState({password:event.target.value,errorMsg:'',suggest:''})
    }

    changeSecret=(event)=>{
        this.setState({secretcode:event.target.value,errorMsg:'',suggest:''})
    }

    onSubmitSuccess = data => {
        const {history} = this.props
        const jwtToken=data.jwtToken
         Cookies.set('jwt_token', jwtToken, {
         expires: 30,
         path: '/',
         })
         history.replace('/comment')
         this.props.history.push({
            pathname: '/comment',
            state: { email: this.state.email}
              })
     }
     
     onSubmitFailure = data => {
         this.setState({error:data.message})
     }
     onSubmitFailedSuggest = data =>{
        const jwtToken=data.jwtToken
         Cookies.set('jwt_token', jwtToken, {
         expires: 30,
         path: '/',
         })
         this.setState({suggest:data.message})
     }

    submitDetails=async (event)=>{
        event.preventDefault();
        const {email,password,secretcode}=this.state
        if(email==='' ||password === '' ||secretcode ===''){
            this.setState({errorMsg:"*Please fill all the details"})
        }
        else{
            const userDetails = {email, password,secretcode}
            const url = 'http://localhost:5000/signup'
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
            else if (response.status === 422)
            {
                this.onSubmitFailedSuggest(data)
            }
            else {
                this.onSubmitFailure(data)
            }
        }
    }


    render(){
        const {email,password,secretcode,errorMsg,suggest}=this.state
        return(
            <div className='signup-bg-container'>
                 <div className='signup-container'>
                    <h1 className='signup-heading'>Sign Up</h1>
                    <div className='signup-data-container'>
                    <p className="signup-account-para">Already have an account? <span className='signup-between'><Link className="sign-in-between" to='/'> Sign In</Link></span></p>
                    <form className='signup-form-style'onSubmit={this.submitDetails}>
                        <div className='signup-label-input'>
                            <label htmlFor='email' className='signup-label-style'>Email</label>
                            <input id="email" value={email} type="email" className='signup-input-style' onChange={this.changeEmail} placeholder='sajid.m2.edu@gmail.com'/>
                        </div>
                        <div className='signup-label-input'>
                            <label htmlFor='password' className='signup-label-style'>Password</label>
                            <input id="password" value={password} type="password" className='signup-input-style' onChange={this.changePassword}/>
                        </div>
                        <div className='signup-label-input'>
                            <label htmlFor='secret' className='signup-label-style'>Secret</label>
                            <input id="secret" value={secretcode} type="text" className='signup-input-style' onChange={this.changeSecret}/>
                        </div>
                        <button type="submit" className='signup-button-style'><FaLock className='signup-fav-lock' />
                        <p className='signup-para'>Sign Up</p>
                        </button>
                        <p className="signup-terms">By clicking the "Sign Up" button you are creating an account, and you agree to the Terms of Use</p>
                        {errorMsg===''?'':<p className='error-message'>{errorMsg}</p>}
                        {suggest===''?'':<p className='suggest-message'>{suggest}</p>}
                    </form>
                    </div>
                </div>
            </div>
        )
    }

}

export default Signup
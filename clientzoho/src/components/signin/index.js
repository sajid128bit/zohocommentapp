import {Component} from 'react';
import Cookies from 'js-cookie'
import { FaLock } from 'react-icons/fa';
import {Link} from 'react-router-dom'
import './index.css'

class Login extends Component{
    state={email:'',password:'',error:'',suggest:''}

    changeEmail=(event)=>{
        this.setState({email:event.target.value,error:'',suggest:''})
    }

    changePassword=(event)=>{
        this.setState({password:event.target.value,error:'',suggest:''})

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
        this.setState({suggest:data.message})
    }
    onSubmitFailedSuggest = data =>{
        this.setState({suggest:data.message})
    }

    submitDetails= async (event)=>{
        event.preventDefault()
        const {email,password}=this.state
            const userDetails = {email, password}
            const url = 'http://localhost:5000/'
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
            else if (response.status === 404)
            {
                this.onSubmitFailedSuggest(data)
            }
            else {
                this.onSubmitFailure(data)
            }
        
    }

    render(){
        const {email,password,error,suggest}=this.state
       /* const jwtToken = Cookies.get('jwt_token')
        if (jwtToken !== undefined) {
            return <Redirect to="/" />
        }*/
        return(
            <div className='bg-container'>
                <div className='signin-container'>
                    <h1 className='signin-heading'>Sign In</h1>
                    <div className='data-container'>
                    <p className="account-para">Don't have an account? <span className='sign-up-between'><Link className="sign-up-between" to="/signup">Sign Up</Link></span></p>
                    <form className='form-style' onSubmit={this.submitDetails}>
                        <div className='label-input'>
                            <label htmlFor='email' className='label-style'>Email</label>
                            <input id="email" value={email} type="email" className='input-style' onChange={this.changeEmail} placeholder='sajid.m2.edu@gmail.com'/>
                            <p className='error-message'>{error}</p>
                        </div>
                        <div className='label-input'>
                            <label htmlFor='password' className='label-style'>Password</label>
                            <input id="password" value={password} type="password" className='input-style' onChange={this.changePassword}/>
                        </div>
                        <p className='forget-password'><Link className='forget-password' to="/forgetpassword">Forget your password?</Link></p>
                        <button type="submit" className='button-style'><FaLock className='fav-lock' />
                        <p className='signin-para'>Sign In</p>
                        </button>
                        <p className='error-message'>{suggest}</p>
                    </form>
                    </div>

                </div>

            </div>
        )
    }

}
export default Login
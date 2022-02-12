import { Component } from "react";
import Cookies from 'js-cookie'
import {Redirect,withRouter} from 'react-router-dom'
import EachComment from '../commentlist/index'
import { v4 as uuid } from 'uuid';
import './index.css'

class Comment extends Component{

    state={textContent:'',errorMsg:'',suggest:'',allcomments:[],errorAll:'',filterOn:false}

    handleChange=(event)=>{
        this.setState({textContent:event.target.value,errorMsg:'',suggest:''})
    }

    onSubmitSuccess = data => {
        this.setState({suggest:'Comment added successfully',errorMsg:''},this.getAllComments)

     }
     
     onSubmitFailure = data => {
         this.setState({errorMsg:"Error in adding comment If error persist Re-Login again",suggest:''})
     }

    submitComment=async ()=>{
        const {textContent}=this.state
        const token=Cookies.get('jwt_token')
        if(textContent==='' || token=== ''){
            this.setState({errorMsg:"*Please enter some message to post"})
        }
        else{
            const comment=textContent
            const userDetails = {comment,token}
            const url = 'http://localhost:5000/comment'
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                  },
                body:JSON.stringify(userDetails),
            }
            const response = await fetch(url, options)
            const data     = await (response.json())
             if (response.status === 201) {
                this.onSubmitSuccess(data)
            } 
            else
            {
                this.onSubmitFail(data)
            }
        }
    }

    onSubmitSuccessComments=(data)=>{
        this.setState({allcomments:data.users})
    }

    onSubmitFailComments=(data)=>{
        this.setState({errorAll:"Unable to get all comments"})
    }

    getAllComments=async ()=>{
        const url = 'http://localhost:5000/allcomment'
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                  },
            }
            const response = await fetch(url, options)
            const data     = await (response.json())
            if (response.status === 201) {
                this.onSubmitSuccessComments(data)
            } 
            else
            {
                this.onSubmitFailComments(data)
            }



    }

    componentDidMount(){
        this.getAllComments()
    }

    ListAllComments=()=>{
        const {allcomments}=this.state
        allcomments.map((eachUser)=>{
            const email=eachUser.email
            const comment=eachUser.comment
        return(
            comment.map((eachComment)=>{
              return  <li key={eachComment}>${email} ${eachComment}</li>
            })
        )
        })

    }
    logOut=()=>{
        const {history} =this.props
        Cookies.remove('jwt_token')
        history.replace('/')

    }
    filterEmail=()=>{
        const {filterOn}=this.state
        console.log(filterOn)
        if(filterOn===false){
        console.log(this.props)
        const email=this.props.location.state.email
        console.log(email)
        const {allcomments}=this.state
        const newAllComments=allcomments.filter((eachComment)=>( 
             eachComment.email===email
        ))
        this.setState((prev)=>{
            return {allcomments:newAllComments,filterOn:!prev.filterOn}
        })
        }
        else{
            this.setState({filterOn:false})
            this.getAllComments()
        }
        
    }

    render(){
        const {textContent,suggest,errorMsg,allcomments,filterOn}=this.state
        const jwtToken = Cookies.get('jwt_token')
        if (jwtToken === undefined) {
            return <Redirect to="/" />
        }
        let commentbutton1;
        if(filterOn){
            commentbutton1="filterOnButton"
        }
        else{
            commentbutton1="filterOffButton"
        }
        return(
            <div className="comment-container">
                <p>What would you like to share with world?</p>
                <button onClick={this.logOut} className="logout">Logout</button>
                <div className="comment-button-container">
                <textarea value={textContent} rows="5" cols="50" className="comment-text" onChange={this.handleChange}></textarea>
                <button className="comment-button" onClick={this.submitComment}>Submit</button>
                </div>
                {errorMsg===''?'':<p className='error-message'>{errorMsg}</p>}
                {suggest===''?'':<p className='suggest-message'>{suggest}</p>}
                <div className="display-comments">
                    <div className="comment-filter-container">
                    <h1 className="comments-heading">Comments</h1>
                    <button className={commentbutton1}  onClick={this.filterEmail}>Filter</button>
                    </div>
                    <ul className="unorder-list">
                        {allcomments.map((eachUser)=>(
                            <EachComment key={uuid()} user={eachUser}/>
                        ))}
                    </ul>
                    
                </div>
            </div>
        )
    }

}

export default withRouter(Comment)
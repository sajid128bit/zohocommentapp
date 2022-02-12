import {Component} from 'react'
import './index.css'

class  EachComment extends Component{
    render(){
        const {user}=this.props
        const {email,comment}=user
        return(
            <li>
                <div className='table'>
                    {
                        comment.map((eachcomment)=>(
                            <div className='table-comment-eachrow' key={eachcomment}>
                                <p className='table-comment-email-style'>{email}</p>
                                <p className='table-comment-style'>{eachcomment}</p>
                            </div>
                        ))
                    }
                </div>
            </li>
        )
    }

}

export default EachComment
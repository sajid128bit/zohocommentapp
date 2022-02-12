import Login from './components/signin';
import {Route, Switch,BrowserRouter} from 'react-router-dom'
import Signup from './components/signup';
import Forgetpassword from './components/forgetpassword';
import Comment from './components/comment'
import './App.css';

function App() {
  return (
    <BrowserRouter>
    <Switch>
       <Route exact path="/" component={Login}/>
       <Route exact path="/signup" component={Signup} />
       <Route exact path="/forgetpassword" component={Forgetpassword} />
       <Route exact path="/comment" component={Comment} />
    </Switch>
    </BrowserRouter>
   );
  }
export default App;

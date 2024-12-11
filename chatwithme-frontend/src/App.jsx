import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
  useHistory,
} from "react-router-dom";
import axios from 'axios'
import { Login } from "./Layout/Login";
import { ChatPage2 } from "./Layout/ChatPage2";
axios.defaults.baseURL = import.meta.env.VITE_API_PREFIX || 'http://localhost:8080'
axios.defaults.withCredentials = true
function App() {
  const history = useHistory();

  if (localStorage.getItem("chat-username")) {
    history.push("/chat");
  } else history.push("/login");

  return (
    <Router>
      <Switch>
        <Route exact path={"/"}>
          <Redirect to={"/login"}></Redirect>
        </Route>
        <Route path={"/login"}>
          <Login></Login>
        </Route>

        <Route path={"/chat"}>
          <ChatPage2></ChatPage2>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

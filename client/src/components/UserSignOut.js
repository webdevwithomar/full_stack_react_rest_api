import { withRouter } from 'react-router-dom'

const UserSignOut = props => {
  //Removes stored data and redirects to course list
  props.signOut();
  props.history.push("/");
  //To get rid of error that was showing up-- said I had to return null. This fixed the problem
  return null;
}

export default withRouter(UserSignOut);
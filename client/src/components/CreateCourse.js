import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";

class CreateCourse extends Component {
  static propTypes = {
    user: PropTypes.object
  };
  state = {
    validTitle: 'Please provide a value for "Title" - min 5 characters',
    validDescrip: 'Please provide a value for "Description" - min 5 characters',
    title: "",
    description: "",
    estimatedTime: "",
    materialsNeeded: ""
  }
  //check validation Title
  validTitle = (event) => {
    this.setState({ valueTitle: event.target.value });
  }
  //check validation Description
  validDescrip = (event) => {
    this.setState({ valueDescrip: event.target.value });
  }
  // add or remove error messages validation
  removeElement() {
    const validWrap = document.querySelector(".validation-wrapper");
    if (validWrap) {
      if (this.state.title.length > 5 && this.state.description.length > 5) {
        validWrap.style.display = "none"
      } else {
        validWrap.style.display = "block"
      }
    }
  }
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }
  //create course by using POST request
  onSubmit = event => {
    event.preventDefault();
    if (this.props.user.idUserLogin) {
      const {
        title,
        description,
        estimatedTime,
        materialsNeeded
      } = this.state;

      const user = this.props.user.idUserLogin;

      axios.post("http://localhost:5000/api/courses", {}, {
        // auth: {
        //   username: 'pasha@gmail.com',
        //   password: '12345'
        // },
        data: {
          title: title,
          description: description,
          estimatedTime: estimatedTime,
          materialsNeeded: materialsNeeded,
          user: user
        }
      })
        .then(res => {
          if (res.status === 201) {
            this.props.history.push('/');
          }
          if (res.status === 500) this.props.history.push('/error');
        })
        .catch(error => console.log(error));
    } else console.log('error')
  }
  componentWillMount() {
    if (!this.props.user.idUserLogin) {
      this.props.history.push('/signin')
      return <div>Loading...</div>;
    }
  }

  render() {

    const {
      title,
      description,
      estimatedTime,
      materialsNeeded
    } = this.state;
    this.removeElement();

    return (
      <div className="bounds course--detail">
        <h1>Create Course</h1>
        <div>
          <div className="validation-wrapper">
            <h2 className="validation--errors--label">Validation errors</h2>
            <div className="validation-errors">
              <ul>
                <li className="validTitle">{this.state.title.length > 4 ? "" : this.state.validTitle}</li>
                <li className="validDescrip">{this.state.description.length > 4 ? "" : this.state.validDescrip}</li>
              </ul>
            </div>
          </div>
        </div>
        <form onSubmit={this.onSubmit}>
          <div className="grid-66">
            <div className="course--header">
              <h4 className="course--label">Course</h4>
              <div>
                <input id="title" onChange={this.onChange} value={title} name="title" type="text" className="input-title course--title--input" placeholder="Course title..." />
              </div>
              <p>By {this.props.user.firstName + " " + this.props.user.lastName}</p>
            </div>
            <div className="course--description">
              <div><textarea id="description" onChange={this.onChange} value={description} name="description" className="" placeholder="Course description..."></textarea></div>
            </div>
          </div>
          <div className="grid-25 grid-right">
            <div className="course--stats">
              <ul className="course--stats--list">
                <li className="course--stats--list--item">
                  <h4>Estimated Time</h4>
                  <div><input id="estimatedTime" onChange={this.onChange} value={estimatedTime} name="estimatedTime" type="text" className="course--time--input"
                    placeholder="Hours" /></div>
                </li>
                <li className="course--stats--list--item">
                  <h4>Materials Needed</h4>
                  <div><textarea id="materialsNeeded" onChange={this.onChange} name="materialsNeeded" value={materialsNeeded} className="" placeholder="List materials..."></textarea></div>
                </li>
              </ul>
            </div>
          </div>
          <div className="grid-100 pad-bottom">
            <button className="button" type="submit">Create Course</button>
            <button className="button button-secondary" onClick={() => this.props.history.push("/")} >Cancel</button>
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(CreateCourse);
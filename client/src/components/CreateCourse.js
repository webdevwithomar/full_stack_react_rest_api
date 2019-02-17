import React, { Component } from 'react';
import axios from "axios";
import { Link, withRouter } from "react-router-dom";


class CreateCourse extends Component {

  state = {
    userName: "",
    userId: "",
    courseId: "",
    title: "",
    description: "",
    estimatedTime: "",
    materialsNeeded: "",
    validationError: false,
    validationMessage: "",
    titleError: "",
    descriptionError: ""
  }

  //Sets userName so that current user's name is listed as the course creator
  componentDidMount() {
    this.setState({
      userName: `${this.props.user.firstName} ${this.props.user.lastName}`,
    })
  }

  //When form is submitted, below functions set states for title, description, time and materials. Looked at my project 7
  titleEntered = e => {
    this.setState({ title: e.target.value });
  }

  descriptionEntered = e => {
    this.setState({ description: e.target.value });
  }

  timeEntered = e => {
    this.setState({ estimatedTime: e.target.value });
  }

  materialsEntered = e => {
    this.setState({ materialsNeeded: e.target.value });
  }

  //When form is submitted, sends post request to add course with provided details to course list.
  uponSubmit = e => {
    e.preventDefault();
    this.createCourse(this.state.title, this.state.description, this.state.estimatedTime, this.state.materialsNeeded);
  }

  //Sends user info along to authorize course creation
  createCourse = (title, description, estimatedTime, materialsNeeded) => {
    axios.post('http://localhost:5000/api/courses', {
      title: title,
      description: description,
      estimatedTime: estimatedTime,
      materialsNeeded: materialsNeeded
    }, {
        headers: {
          'Authorization': JSON.parse(window.localStorage.getItem('auth'))
        }
      })
      //Takes user to course list
      .then(response => {
        this.props.history.push(`/courses`);
      })
      //If title or description is missing, displays corresponding validation error. If other error, displays Unhandled Error component
      .catch(error => {
        if (error.response.status === 400) {
          this.setState({ validationError: true, validationMessage: "Validation Error" });
          if (error.response.data.message === "Please enter a title") {
            this.setState({ titleError: "Please enter a title" })
          }
          if (error.response.data.message === "Please enter a description") {
            this.setState({ descriptionError: "Please enter a description" })
          }
        } else if (error.response.status === 500) {
          this.props.history.push('/error');
        }
      });
  };

  render() {
    return (
      <div className="bounds course--detail">
        <h1>Create Course</h1>
        <div>
          <div>
            <h2 className="validation--errors--label">{this.state.validationMessage}</h2>
            <div className="validation-errors">
              <ul>
                <li>{this.state.titleError}</li>
                <li>{this.state.descriptionError}</li>
              </ul>
            </div>
          </div>
          <form onSubmit={this.uponSubmit}>
            <div className="grid-66">
              <div className="course--header">
                <h4 className="course--label">Course</h4>
                <div><input onChange={this.titleEntered} id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..." /></div>
                <p>By {this.state.userName}</p>
              </div>
              <div className="course--description">
                <div><textarea onChange={this.descriptionEntered} id="description" name="description" className="" placeholder="Course description..."></textarea></div>
              </div>
            </div>
            <div className="grid-25 grid-right">
              <div className="course--stats">
                <ul className="course--stats--list">
                  <li className="course--stats--list--item">
                    <h4>Estimated Time</h4>
                    <div><input onChange={this.timeEntered} id="estimatedTime" name="estimatedTime" type="text" className="course--time--input" placeholder="Hours" /></div>
                  </li>
                  <li className="course--stats--list--item">
                    <h4>Materials Needed</h4>
                    <div><textarea onChange={this.materialsEntered} id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials..."></textarea></div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="grid-100 pad-bottom">
              <button className="button" type="submit">Create Course</button>
              <Link to={"/"}><button className="button button-secondary">Cancel</button></Link>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default withRouter(CreateCourse);
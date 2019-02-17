import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";
import axios from 'axios';

class UpdateCourse extends Component {
  state = {
    courses: [],
    userName: "",
    userId: "",
    courseId: "",
    title: "",
    description: "",
    estimatedTime: "",
    materialsNeeded: "",
    validationError: false,
    titleError: "",
    descriptionError: ""
  }

  componentDidMount() {
    axios.get(`http://localhost:5000/api/courses/${this.props.match.params.id}`)
      .then(response => {
        this.setState({
          courses: response.data,
          userName: (`${response.data.user[0].firstName} ${response.data.user[0].lastName}`),
          userId: response.data.user[0]._id,
          courseId: response.data._id,
          title: response.data.title,
          description: response.data.description,
          estimatedTime: response.data.estimatedTime,
          materialsNeeded: response.data.materialsNeeded
        })
      })
      .catch(error => {
        if (error.response.status === 404) {
          this.props.history.push('/notfound');
        } else if (error.response.status === 403) {
          this.props.history.push('/forbidden');
        } else if (error.response.status === 500) {
          this.props.history.push('/error');
        }
      })
  }

  titleChanged = e => {
    this.setState({ title: e.target.value });
  }

  descriptionChanged = e => {
    this.setState({ description: e.target.value });
  }

  timeChanged = e => {
    this.setState({ estimatedTime: e.target.value });
  }

  materialsChanged = e => {
    this.setState({ materialsNeeded: e.target.value });
  }

  updateCourse = (courseId, title, description, estimatedTime, materialsNeeded) => {
    axios.put(`http://localhost:5000/api/courses/${courseId}`, {
      title: title,
      description: description,
      estimatedTime: estimatedTime,
      materialsNeeded: materialsNeeded
    }, {
        headers: { 'Authorization': JSON.parse(window.localStorage.getItem('auth')) }
      })
      .then(response => {
        this.props.history.push(`/courses/${courseId}`)
      })
      .catch(error => {
        if (error.response.status === 400) {
          this.setState({ validationError: true, validationMessage: "Validation Error" });
          if (error.response.data.message === "Please enter a title") {
            this.setState({ titleError: "Please enter a title" })
          }
          if (error.response.data.message === "Please enter a description") {
            this.setState({ descriptionError: "Please enter a description" })
          }
        } else if (error.response.status === 404) {
          this.props.history.push('/notfound');
        } else if (error.response.status === 403) {
          this.props.history.push('/forbidden');
        } else if (error.response.status === 500) {
          this.props.history.push('/error');
        }
      });
  }

  uponSubmit = e => {
    e.preventDefault();
    this.updateCourse(this.state.courseId, this.state.title, this.state.description, this.state.estimatedTime, this.state.materialsNeeded);
  }

  render() {
    return (
      <div className="bounds course--detail">
        <h1>Update Course</h1>
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
                <div className="course--title"><input onChange={this.titleChanged} id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..." value={this.state.title} /></div>
                <p>By {this.state.userName}</p>
              </div>
              <div className="course--description">
                <div><textarea onChange={this.descriptionChanged} id="description" name="description" className="" placeholder="Course description..." value={this.state.description}></textarea></div>
              </div>
            </div>
            <div className="grid-25 grid-right">
              <div className="course--stats">
                <ul className="course--stats--list">
                  <li className="course--stats--list--item">
                    <h4>Estimated Time</h4>
                    <div><input onChange={this.timeChanged} id="estimatedTime" name="estimatedTime" type="text" className="course--time--input" placeholder="Hours" value={this.state.estimatedTime} /></div>
                  </li>
                  <li className="course--stats--list--item">
                    <h4>Materials Needed</h4>
                    <div><textarea onChange={this.materialsChanged} id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials..." value={this.state.materialsNeeded}></textarea></div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="grid-100 pad-bottom">
              <button className="button" type="submit">Update Course</button>
              <Link to={`/courses/${this.props.match.params.id}`}><button className="button button-secondary">Cancel</button></Link>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default withRouter(UpdateCourse);
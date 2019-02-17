import React, { Component } from 'react';
import axios from "axios";
import { Link } from "react-router-dom";
import { Consumer } from "./Context";
import ReactMarkdown from 'react-markdown';

class CourseDetail extends Component {
  state = {
    courseId: "",
    userName: "",
    userId: "",
    title: "",
    description: "",
    estimatedTime: "",
    materialsNeeded: "",
  }

  componentDidMount() {
    axios.get(`http://localhost:5000/api/courses/${this.props.match.params.id}`)
      .then(res => {
        this.setState({
          courseId: res.data._id,
          userName: `${res.data.user[0].firstName} ${res.data.user[0].lastName}`,
          userId: res.data.user[0]._id,
          title: res.data.title,
          description: res.data.description,
          estimatedTime: res.data.estimatedTime,
          materialsNeeded: res.data.materialsNeeded
        });
      })
      .catch(error => {
        if (error.res.status === 404) {
          this.props.history.push('/notfound');
        } else if (error.res.status === 500) {
          this.props.history.push('/error');
        }
      });
  }

  // If the user owns the course, then the user can delete it
  deleteCourse = () => {
    axios.delete(`http://localhost:5000/api/courses/${this.state.courseId}`, {
      headers: {
        'Authorization': JSON.parse(window.localStorage.getItem('auth'))
      }
    })
      .then(res => {
        this.props.history.push(`/courses`);
        window.location.reload();
      })
      .catch(error => {
        if (error.res.status === 404) {
          this.props.history.push('/notfound');
        } else if (error.res.status === 403) {
          this.props.history.push('forbidden')
        } else if (error.res.status === 500) {
          this.props.history.push('/error');
        }
      })
  }

  render() {
    return (
      <Consumer>
        {/* Edit and Delete button render on condition */}
        {context => {
          let updateButton;
          let deleteButton;
          if (context.user._id === this.state.userId) {
            updateButton = <Link className="button" to={`/courses/${this.state.courseId}/update`}>Update Course</Link>;
            deleteButton = <Link className="button" to={"/courses"} onClick={this.deleteCourse}>Delete Course</Link>;
          }
          return (
            <div>
              <div className="actions--bar">
                <div className="bounds">
                  <div className="grid-100">
                    <span>
                      {updateButton}
                      {deleteButton}
                    </span>
                    <Link className="button button-secondary" to={"/"}>Return to List</Link>
                  </div>
                </div>
              </div>
              <div className="bounds course--detail">
                <div className="grid-66">
                  <div className="course--header">
                    <h4 className="course--label">Course</h4>
                    <h3 className="course--title">{this.state.title}</h3>
                    <p>By {this.state.userName}</p>
                  </div>
                  <div className="course--description">
                    <ReactMarkdown source={this.state.description} />
                  </div>
                </div>
                <div className="grid-25 grid-right">
                  <div className="course--stats">
                    <ul className="course--stats--list">
                      <li className="course--stats--list--item">
                        <h4>Estimated Time</h4>
                        <h3>{this.state.estimatedTime}</h3>
                      </li>
                      <li className="course--stats--list--item">
                        <h4>Materials Needed</h4>
                        <ul>
                          <ReactMarkdown source={this.state.materialsNeeded} />
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )
        }}
      </Consumer>
    )
  }
}

export default CourseDetail;
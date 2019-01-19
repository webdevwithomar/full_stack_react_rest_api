import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import axios from "axios";
import PropTypes from 'prop-types';
const ReactMarkdown = require('react-markdown');

class CourseDetail extends Component {

  static propTypes = {
    user: PropTypes.object,
    id: PropTypes.string
  };

  //get info about course
  componentDidMount() {
    fetch(`http://localhost:5000/api/courses/${this.props.id}`)
      .then(res => {
        if (res.ok) {
          this.setState({ isLoding: false })
          return res.json()
        } else {
          this.props.history.push('/notfound');
        }
      })
      .then(res => {
        this.setState({
          course: res,
          userIdCourse: res.user._id,
          firstName: res.user.firstName,
          lastName: res.user.lastName,
          id: this.props.id
        });

      })
      .catch(error => {
        console.log('Error fetching and parsing data', error);
      }
      )
  };

  state = {
    idCourse: this.props.id,
    userIdCourse: '',
    course: '',
    user: this.props.user,
    error: false,
    isLoding: true
  }

  //add good formatting text for field materialsNeeded
  splitMaterials = data => {
    const split = data.split(/\r?\n/)
    const readySplit = split.map(el => { return "\n* " + el }).join('');
    return readySplit;
  }

  //delete course using "DELETE" request
  deleteCourse = (el) => {
    el.preventDefault();
    if (this.state.user.idUserLogin === this.state.userIdCourse) {
      axios.delete(`http://localhost:5000/api/courses/${this.state.idCourse}`, {
        data: {
          _id: this.state.userIdCourse
        }
      })
        .then(res => {
          if (res.status === 204) {
            this.props.history.push('/')
          }
        });
    } else this.props.history.push('/forbidden');
  }
  render() {
    const isOwner = this.state.userIdCourse === this.props.user.idUserLogin
    return (
      <div>
        {this.state.isLoding ? "Loading..." :
          <div>
            <div className="actions--bar">
              <div className="bounds">
                <div className="grid-100">
                  {isOwner ? <span>
                    <Link to={`/courses/${this.state.idCourse}/update`} className="button" >Update Course</Link>
                    <Link to="#" href="#" className="button" onClick={this.deleteCourse}>Delete Course</Link>
                  </span> : null}
                  <Link to="/" className="button button-secondary" >Return to List</Link>
                </div>
              </div>
            </div>
            <div className="bounds course--detail">
              <div className="grid-66">
                <div className="course--header">
                  <h4 className="course--label">Course</h4>
                  <h3 className="course--title">{this.state.course.title}</h3>
                  <p>{this.state.firstName + " " + this.state.lastName}</p>

                </div>
                <div className="course--description">
                  {
                    (this.state.course.description) ? <ReactMarkdown source={this.state.course.description} /> : "No materials specified"
                  }
                </div>
              </div>
              <div className="grid-25 grid-right">
                <div className="course--stats">
                  <ul className="course--stats--list">
                    <li className="course--stats--list--item">
                      <h4>Estimated Time</h4>
                      <h3>{
                        (this.state.course.estimatedTime) ? this.state.course.estimatedTime : "No materials specified"
                      }</h3>
                    </li>
                    <li className="course--stats--list--item">
                      <h4>Materials Needed</h4>
                      <ul>
                        {this.state.course.materialsNeeded ? <ReactMarkdown source={this.splitMaterials(this.state.course.materialsNeeded)} /> : "No materials specified"}

                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}
export default withRouter(CourseDetail);
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Course from "./Course";

class Courses extends Component {
  state = {
    courses: []
  }

  // GET course list
  componentDidMount() {
    axios.get('http://localhost:5000/api/courses')
      .then(response => {
        this.setState({ courses: response.data });
      })
      .catch(error => {
        if (error.status === 404) {
          this.props.history.push('/notfound');
        } else if (error.status === 500) {
          this.props.history.push('/error');
        }
      });
  }

  render() {
    return (
      <div>
        <div className="bounds">
          <div>{this.state.courses.map(course => <Course title={course.title} id={course._id} key={course._id} />)}</div>
          <div className="grid-33">
            <Link className="course--module course--add--module" to={"/courses/create"}>
              <h3 className="course--add--title"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                viewBox="0 0 13 13" className="add">
                <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
              </svg>New Course</h3>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Courses;
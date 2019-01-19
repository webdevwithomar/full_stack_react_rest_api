// imports
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";

class Courses extends Component {

  componentDidMount() {
    fetch('http://localhost:5000/api/courses')
      .then(res => res.json())
      .then(res => this.setState({
        courses: res,
        isLoaded: true
      }))
      .catch(error => console.log('Error fetching and parsing data', error)
      )
  };

  state = {
    courses: '',
    isLoaded: false
  }

  render() {
    const { isLoaded, courses } = this.state;
    if (!isLoaded) {
      return <div>Loading...</div>;
    };
    return (
      <div>
        <hr />
        <div className="bounds">
          {courses.map(course => (
            <div className="grid-33" key={course._id}>
              <Link to={`/courses/${course._id}`} className="course--module course--link" >
                <h4 className="course--label">Course</h4>
                <h3 className="course--title">{course.title}</h3>
              </Link>
            </div>
          ))}
          <div className="grid-33">
            <Link to="/courses/create" className="course--module course--add--module" >
              <h3 className="course--add--title">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 13 13" className="add">
                  <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
                </svg>
                New Course
                     </h3>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(Courses);
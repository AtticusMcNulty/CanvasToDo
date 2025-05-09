import React from "react";

function Courses({
  courses,
  removedCourses,
  setRemovedCourses,
  showCourseName,
  setShowCourseName,
}) {
  const courseTitles = courses ? (
    courses.map((course, index) => {
      const courseName = course.name.split(" (").splice(0, 1)[0].toLowerCase();
      const courseCRN =
        course.name.split("(").splice(-1, 1)[0].split("_")[0] +
        course.name.split("(").splice(-1, 1)[0].split("_")[1];

      const removedCourseNames = removedCourses.map((item) => item[0]);

      return !removedCourseNames.includes(course.name) ? (
        <div key={index}>
          <div className="course">
            {showCourseName ? (
              <div className="course-name">{courseName}</div>
            ) : (
              <div></div>
            )}
            <div className="course-crn">{courseCRN}</div>
            <div
              className="course-delete"
              onClick={() => {
                setRemovedCourses((prevArr) => {
                  const newArr = [...prevArr];
                  newArr.push([course.name, course]);
                  localStorage.setItem(
                    "removedCourses",
                    JSON.stringify(newArr)
                  );
                  return newArr;
                });
              }}
            >
              x
            </div>
          </div>
          <hr
            className="horizontal-line"
            style={{
              border: "1px solid #eee",
              borderRadius: "5px",
              margin: "5px 0px",
            }}
          ></hr>
        </div>
      ) : (
        <div key={index}></div>
      );
    })
  ) : (
    <div>Courses Loading...</div>
  );

  return (
    <div className="section">
      <div className="section-title" style={{ margin: "0px" }}>
        Courses
      </div>
      <div className="course-inputs">
        <button
          className="button"
          onClick={() => {
            document.getElementById("courseModal").style.display = "block";
            document.body.style.overflow = "hidden";
          }}
        >
          Re-add Course
        </button>
        <div className="course-inputs-checkbox">
          <input
            type="checkbox"
            checked={showCourseName}
            onChange={() => {
              setShowCourseName((prevShowCourseName) => {
                if (prevShowCourseName) {
                  Array.from(
                    document.getElementsByClassName("course-crn")
                  ).forEach((courseCRN) => {
                    courseCRN.style.flex = "0.6";
                    courseCRN.style.textAlign = "start";
                  });

                  Array.from(document.getElementsByClassName("course")).forEach(
                    (courseCRN) => {
                      courseCRN.style.justifyContent = "space-evenly";
                    }
                  );
                } else {
                  Array.from(
                    document.getElementsByClassName("course-crn")
                  ).forEach((courseCRN) => {
                    courseCRN.style.flex = "0.4";
                    courseCRN.style.textAlign = "center";
                  });

                  Array.from(document.getElementsByClassName("course")).forEach(
                    (courseCRN) => {
                      courseCRN.style.justifyContent = "space-between";
                    }
                  );
                }

                return !prevShowCourseName;
              });
            }}
          ></input>
          <div>Full Name</div>
        </div>
      </div>
      <div className="course-container">{courseTitles}</div>
    </div>
  );
}

export default Courses;

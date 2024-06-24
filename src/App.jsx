import React from "react";

function Data() {
  const [user, setUser] = React.useState([]);
  const [enrollment, setEnrollment] = React.useState([]);

  const [courses, setCourses] = React.useState([]);
  const [courseVisibility, setCourseVisibility] = React.useState([]);
  const [courseModules, setCourseModules] = React.useState([]);
  const [removedCourses, setRemovedCourses] = React.useState(() => {
    const prevArr = localStorage.getItem("removedCourses");
    return prevArr ? JSON.parse(prevArr) : [];
  });

  const [assignments, setAssignments] = React.useState([]);
  const [sortedToDo, setSortedToDo] = React.useState([]);
  const [unsortedToDo, setUnsortedToDo] = React.useState(() => {
    const prevArr = localStorage.getItem("unsortedToDo");
    return prevArr ? JSON.parse(prevArr) : [];
  });
  const [addedToDo, setAddedToDo] = React.useState(() => {
    const prevArr = localStorage.getItem("addedToDo");
    return prevArr ? JSON.parse(prevArr) : [];
  });
  const [completedAssignments, setCompletedAssignments] = React.useState(() => {
    const prevArr = localStorage.getItem("completedAssignments");
    return prevArr ? JSON.parse(prevArr) : [];
  });

  const [submissions, setSubmissions] = React.useState([]);
  const [items, setItems] = React.useState([]);
  const [itemVisibility, setItemVisibility] = React.useState([]);

  const [selectedDate, setSelectedDate] = React.useState("");
  const [toDoExtent, setToDoExtent] = React.useState(() => {
    const prevExtent = localStorage.getItem("toDoExtent");
    return prevExtent !== null ? prevExtent : "7";
  });

  const [key, setKey] = React.useState(() => {
    // either null or string representation of key
    const key = JSON.parse(localStorage.getItem("key"));
    return key;
  });
  const [validKey, setValidKey] = React.useState(() => {
    const validKey = JSON.parse(localStorage.getItem("validKey"));
    if (validKey == null) return false;
    return validKey;
  });

  const [showCourseName, setShowCourseName] = React.useState(true);

  React.useEffect(() => {
    try {
      // get user information (name, id, etc.)
      fetch(`http://54.153.125.141/api/users/self/${key}`)
        .then((response) => response.json())
        .then((userData) => {
          setUser(userData);

          // get total course grades
          fetch(
            `http://54.153.125.141/api/users/${userData.id}/enrollments/${key}`
          )
            .then((response) => response.json())
            .then((enrollmentData) => {
              setEnrollment(enrollmentData);
            });
        });

      // get user courses
      fetch(`http://54.153.125.141/api/courses/${key}`)
        .then((response) => response.json())
        .then((coursesData) => {
          // filter out invalid courses
          let courses = [];
          coursesData = coursesData.filter((course) => {
            const courseCRN =
              course.name.split("(").splice(-1, 1)[0].split("_")[0] +
              course.name.split("(").splice(-1, 1)[0].split("_")[1];
            if (!courseCRN.includes("undefined")) {
              courses.push(false);
              return course;
            }
          });

          setCourses(coursesData);
          setCourseVisibility(courses);

          let modulesPromise = [];
          let assignmentsPromise = [];

          for (const course of coursesData) {
            modulesPromise.push(
              fetch(
                `http://54.153.125.141/api/courses/${course.id}/modules/${key}`
              ).then((response) => response.json())
            );

            assignmentsPromise.push(
              fetch(
                `http://54.153.125.141/api/courses/${course.id}/assignments/${key}`
              ).then((response) => response.json())
            );
          }

          Promise.all(modulesPromise)
            .then((modulesData) => {
              setCourseModules(modulesData);

              let visibility = [];
              let moduleItemsPromise = [];
              // iterate over modules data to fetch items for each module
              // for each array of modules
              modulesData.forEach((modules, courseIndex) => {
                // if that array is indeed an array
                if (Array.isArray(modules)) {
                  let moduleVisibility = [];

                  // for each module, get its items
                  let itemsPromises = modules.map((module) => {
                    const regex = /courses\/(\d+)\/modules\/(\d+)\/items/;
                    const [call, courseId, moduleId] =
                      module.items_url.match(regex);
                    return fetch(
                      `http://54.153.125.141/api/courses/${courseId}/modules/${moduleId}/items/${key}`
                    ).then((response) => response.json());
                  });

                  for (let i = 0; i < itemsPromises.length; i++) {
                    moduleVisibility.push(false);
                  }

                  visibility.push(moduleVisibility);
                  moduleItemsPromise.push(Promise.all(itemsPromises));
                } else {
                  visibility.push(false);
                  moduleItemsPromise.push(false);
                }
              });

              // after all items are fetched, update the state with the collected data
              Promise.all(moduleItemsPromise)
                .then((moduleItems) => {
                  setItems(moduleItems);
                  setItemVisibility(visibility);
                })
                .catch((error) => {
                  console.log("Error fetching module items:", error);
                });
            })
            .catch((error) => {
              console.log("Error fetching course modules:", error);
            });

          Promise.all(assignmentsPromise)
            .then((assignmentsData) => {
              setAssignments(assignmentsData);

              // if unsortedToDo is already defined, do not wait for loaded submissions to call function
              // if (unsortedToDo.length > 0)
              // populateSortedToDo(assignmentsData, []);

              let submissionsPromise = [];

              // for each assignment
              assignmentsData.forEach((course) => {
                if (Array.isArray(course)) {
                  let submissions = [];

                  course.forEach((assignment) => {
                    const regex = /courses\/(\d+)\/assignments\/(\d+)/;
                    const [call, courseId, assignmentId] =
                      assignment.html_url.match(regex);

                    submissions.push(
                      fetch(
                        `http://54.153.125.141/api/courses/${courseId}/assignments/${assignmentId}/submissions/self/${key}`
                      ).then((response) => response.json())
                    );
                  });

                  submissionsPromise.push(Promise.all(submissions));
                } else {
                  submissionsPromise.push(false);
                }
              });

              Promise.all(submissionsPromise)
                .then((submissionsData) => {
                  setSubmissions(submissionsData);
                  populateSortedToDo(assignmentsData, submissionsData);
                })
                .catch((error) => {
                  console.log("Error fetching submissions:", error);
                });
            })
            .catch((error) => {
              console.log("Error fetching assignments:", error);
            });
        });
    } catch (error) {
      console.log(error);
    }
  }, [validKey]);

  function getCourseGrade(courseId) {
    for (let i = 0; i < enrollment.length; i++) {
      if (courseId == enrollment[i].course_id) {
        return enrollment[i].grades.current_score;
      }
    }
  }

  function getAssignment(courseIndex, item) {
    const assignmentsArray = assignments[courseIndex];

    for (let i = 0; i < assignmentsArray.length; i++) {
      if (assignmentsArray[i].name === item.title) {
        return { assignment: assignmentsArray[i], index: i };
      }
    }
    return null;
  }

  function populateSortedToDo(assignmentsData, submissionsData) {
    let newArr = [];

    for (let i = 0; i < assignmentsData.length; i++) {
      if (Array.isArray(assignmentsData[i])) {
        for (let j = 0; j < assignmentsData[i].length; j++) {
          // default 0 for deleted
          // index, assignObj, courseIndex, assignIndex, deletedBool, unsorted/added, progress bar, submissionObj
          newArr.push([
            newArr.length,
            assignmentsData[i][j],
            i,
            j,
            0,
            1,
            0,
            submissionsData[i][j],
          ]);
        }
      }
    }

    setUnsortedToDo(newArr);

    localStorage.setItem("unsortedToDo", JSON.stringify(newArr));

    setSortedToDo(() => {
      const sortedArr = newArr.concat(addedToDo);

      sortedArr.sort((a, b) => {
        const dateA = new Date(a[1].due_at).getTime();
        const dateB = new Date(b[1].due_at).getTime();
        return dateA - dateB;
      });

      return sortedArr;
    });
  }

  // toggle visibilty of course items
  function toggleCourseVisibility(courseIndex) {
    if (courseVisibility.length > 0) {
      const updatedVisibility = [...courseVisibility];
      updatedVisibility[courseIndex] = !updatedVisibility[courseIndex];
      setCourseVisibility(updatedVisibility);
    }
  }

  // toggle visibility of module items
  function toggleItemVisibility(courseIndex, moduleIndex) {
    if (itemVisibility.length > 0) {
      const updatedVisibility = [...itemVisibility];
      updatedVisibility[courseIndex][moduleIndex] =
        !updatedVisibility[courseIndex][moduleIndex];
      setItemVisibility(updatedVisibility);
    }
  }

  function formatDate(date) {
    if (date) {
      const dateObject = new Date(date);

      const day = dateObject.getUTCDate();
      const month = dateObject.getUTCMonth() + 1;
      const year = dateObject.getUTCFullYear();

      const formattedDay = day < 10 ? "0" + day : day;
      const formattedMonth = month < 10 ? "0" + month : month;

      return `${formattedDay}/${formattedMonth}/${year}`;
    } else {
      return null;
    }
  }

  function getNumDays(dueDate) {
    if (!dueDate) return null;

    const oneDay = 24 * 60 * 60 * 1000;
    const parts = dueDate.split("/");
    const formattedDate = new Date(parts[2], parts[1] - 1, parts[0]);

    // normalize dates to midnight to avoid issues with time of day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    formattedDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round((formattedDate - today) / oneDay);

    if (diffDays == 0) {
      return ["Today", diffDays];
    } else if (diffDays == 1) {
      return ["Tomorrow", diffDays];
    } else {
      const month = formattedDate.toLocaleDateString(undefined, {
        month: "short",
      });
      const day = formattedDate.getDate();
      return [`${month} ${day}`, diffDays];
    }
  }

  function truncateString(str, maxLength) {
    if (str.length <= maxLength) return str;

    // find the last space within the maxLength
    const lastSpaceIndex = str.lastIndexOf(" ", maxLength);
    if (lastSpaceIndex === -1) return str.substring(0, maxLength);

    // truncate at the last space found
    return str.substring(0, lastSpaceIndex);
  }

  const addableCourses = removedCourses.map((course, index) => {
    return (
      <div key={index} className="courseModal-item">
        <div style={{ textTransform: "capitalize" }}>
          {`${
            course[0].split("(").splice(-1, 1)[0].split("_")[0] +
            course[0].split("(").splice(-1, 1)[0].split("_")[1]
          } -
            ${course[0].split(" (").splice(0, 1)[0].toLowerCase()}`}
        </div>
        <button
          className="courseModal-item-btn"
          onClick={() => {
            setRemovedCourses((prevArr) => {
              const newArr = [...prevArr];
              newArr.splice(index, 1);
              localStorage.setItem("removedCourses", JSON.stringify(newArr));
              return newArr;
            });
          }}
        >
          +
        </button>
      </div>
    );
  });

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

  // modules section
  const allModules =
    courseModules && courseModules.length > 0 ? (
      courseModules.map((modules, courseIndex) => {
        const courseVisible = courseVisibility
          ? courseVisibility[courseIndex]
          : false;

        const removedCourseNames = removedCourses.map((item) => item[0]);

        return !removedCourseNames.includes(courses[courseIndex].name) ? (
          <div key={courseIndex}>
            {courseIndex === 0 ? <hr></hr> : ""}
            <div
              className="course-header"
              onClick={
                Array.isArray(modules)
                  ? () => toggleCourseVisibility(courseIndex)
                  : undefined
              }
            >
              <div className="course-title">
                {
                  courseTitles[courseIndex].props.children[0].props.children[1]
                    .props.children
                }
              </div>
              <div className="course-grade">
                Grade: {getCourseGrade(courses[courseIndex].id)}
              </div>
              <span className={"course-arrow"}>
                {Array.isArray(modules)
                  ? courseVisibility
                    ? courseVisibility[courseIndex]
                      ? "▲"
                      : "▼"
                    : ""
                  : ""}
              </span>
            </div>

            {courseVisible ? (
              Array.isArray(modules) ? (
                modules.map((module, moduleIndex) => {
                  const itemVisible = itemVisibility[courseIndex]
                    ? itemVisibility[courseIndex][moduleIndex]
                      ? itemVisibility[courseIndex][moduleIndex]
                      : false
                    : false;
                  return (
                    <div key={moduleIndex}>
                      <div
                        className="module"
                        onClick={() =>
                          toggleItemVisibility(courseIndex, moduleIndex)
                        }
                      >
                        <div className="module-header">
                          <div className="module-name">{module.name}</div>
                          <span className={"module-arrow"}>
                            {itemVisible ? "▲" : "▼"}
                          </span>
                        </div>
                      </div>
                      <div className="module-items">
                        {itemVisible &&
                        items[courseIndex][moduleIndex].length > 0 ? (
                          items[courseIndex][moduleIndex].map(
                            (item, itemIndex) => {
                              const assignObj = getAssignment(
                                courseIndex,
                                item
                              );
                              const formattedDate = assignObj
                                ? formatDate(assignObj.assignment.due_at)
                                : null;
                              const [dueDate, daysUntil] = formattedDate
                                ? getNumDays(formattedDate)
                                : [null, null];
                              const itemTitle = truncateString(item.title, 30);
                              const submissionValid =
                                assignObj &&
                                submissions[courseIndex] &&
                                submissions[courseIndex][assignObj.index]
                                  ? true
                                  : false;

                              return (
                                <div key={itemIndex} className="module-item">
                                  {/*<div style={{ width: "90px" }}>
                                    {item.type}
                                  </div>*/}
                                  <div style={{ width: "220px" }}>
                                    {itemTitle}
                                  </div>
                                  <div
                                    className="module-item-attributes"
                                    style={{ width: "75px" }}
                                  >
                                    <div
                                      style={{
                                        width: "55px",
                                        textAlign: "start",
                                      }}
                                    >
                                      {submissionValid &&
                                      submissions[courseIndex][assignObj.index]
                                        .grade
                                        ? `${parseFloat(
                                            parseFloat(
                                              submissions[courseIndex][
                                                assignObj.index
                                              ].grade
                                            ).toFixed(2)
                                          )}/${
                                            assignObj.assignment.points_possible
                                          }`
                                        : ""}
                                    </div>
                                    <div
                                      className={`${
                                        daysUntil <= 0 ? "past-due" : ""
                                      } ${daysUntil > 0 ? "due" : ""}`}
                                    >
                                      {submissionValid
                                        ? submissions[courseIndex][
                                            assignObj.index
                                          ].workflow_state === "graded"
                                          ? "🟩"
                                          : submissions[courseIndex][
                                              assignObj.index
                                            ].workflow_state === "submitted"
                                          ? dueDate
                                            ? `${dueDate}`
                                            : "🟨"
                                          : ""
                                        : ""}
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div>Course has no modules</div>
              )
            ) : (
              <div></div>
            )}
            <hr></hr>
          </div>
        ) : (
          <div key={courseIndex}></div>
        );
      })
    ) : (
      <div>Modules Loading...</div>
    );

  const toDoCurrent =
    sortedToDo.length > 0 ? (
      sortedToDo.map((element, curAssignIndex) => {
        const [
          index,
          assignment,
          courseIndex,
          assignIndex,
          visible,
          arrayType,
          progress,
          submission,
        ] = element;

        const formattedDate = assignment ? formatDate(assignment.due_at) : null;
        const [dueDate, daysUntil] = formattedDate
          ? getNumDays(formattedDate)
          : [null, null];

        const name = assignment
          ? truncateString(assignment.name, 20)
          : assignment.name;

        const removedCourseNames = removedCourses.map((item) => item[0]);

        const validWorkflows = ["graded", "submitted"];

        // while assignment is not submitted, not graded, visible, course hasn't been removed, and toDo extent met
        return !validWorkflows.includes(submission.workflow_state) &&
          visible == 0 &&
          (courseIndex === "userAdded" ||
            !removedCourseNames.includes(courses[courseIndex].name)) &&
          daysUntil < toDoExtent ? (
          <div key={curAssignIndex}>
            <div className="toDo-item">
              <div className="toDo-item-title">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    onChange={() => {
                      setCompletedAssignments((prevArr) => {
                        let newArr = [
                          [
                            assignment,
                            curAssignIndex,
                            index,
                            courseIndex,
                            arrayType,
                          ],
                          ...prevArr,
                        ];

                        if (newArr.length > 5) newArr.pop();

                        localStorage.setItem(
                          "completedAssignments",
                          JSON.stringify(newArr)
                        );

                        return newArr;
                      });
                      setSortedToDo((prevArr) => {
                        // change assignment in unsorted/added arr to not visible
                        if (arrayType == 1)
                          setUnsortedToDo((prevArr) => {
                            const newArr = [...prevArr];
                            newArr[index][4] = 1;
                            localStorage.setItem(
                              "unsortedToDo",
                              JSON.stringify(newArr)
                            );
                            return newArr;
                          });
                        else
                          setAddedToDo((prevArr) => {
                            const newArr = [...prevArr];
                            newArr[index][4] = 1;
                            localStorage.setItem(
                              "addedToDo",
                              JSON.stringify(newArr)
                            );
                            return newArr;
                          });

                        // change assignment in sorted arr to not visible
                        const newArr = [...prevArr];
                        newArr[curAssignIndex][4] = 1;
                        return newArr;
                      });
                    }}
                  ></input>
                </label>
                <div>
                  {courseIndex && courseTitles[courseIndex]
                    ? `${courseTitles[courseIndex].props.children[0].props.children[1].props.children} - `
                    : ""}
                  {name}
                </div>
              </div>
              <div
                className={`${daysUntil < 0 ? "past-due" : ""} ${
                  daysUntil == 0 || daysUntil == 1 ? "due" : ""
                }`}
              >
                {dueDate}
              </div>
            </div>
            <div className="toDo-item-slider">
              <input
                className="toDo-item-slider-input"
                type="range"
                min="0"
                max="10"
                value={progress}
                onChange={(event) => {
                  setSortedToDo((prevArr) => {
                    if (arrayType == 1)
                      setUnsortedToDo((prevArr) => {
                        const newArr = [...prevArr];
                        newArr[index][6] = event.target.value;
                        localStorage.setItem(
                          "unsortedToDo",
                          JSON.stringify(newArr)
                        );
                        return newArr;
                      });
                    else
                      setAddedToDo((prevArr) => {
                        const newArr = [...prevArr];
                        newArr[index][6] = event.target.value;
                        localStorage.setItem(
                          "addedToDo",
                          JSON.stringify(newArr)
                        );
                        return newArr;
                      });
                    const newArr = [...prevArr];
                    newArr[curAssignIndex][6] = event.target.value;
                    return newArr;
                  });
                }}
                style={{
                  background: (() => {
                    const percentage = ((progress - 0) / (10 - 0)) * 100;
                    return `linear-gradient(to right, #4CAF50 0%, #4CAF50 ${percentage}%, #d3d3d3 ${percentage}%, #d3d3d3 100%)`;
                  })(),
                }}
              ></input>
              <span
                className="toDo-item-slider-span"
                style={{
                  left: `calc(${((progress - 0) / (10 - 0)) * 100}% - 10px)`,
                }}
              >
                {((progress - 0) / (10 - 0)) * 100}%
              </span>
            </div>
          </div>
        ) : (
          <div key={curAssignIndex}></div>
        );
      })
    ) : (
      <div>Assignments Loading...</div>
    );

  const toDoCompleted =
    toDoCurrent.length > 0 ? (
      completedAssignments.map((element, compAssignIndex) => {
        const [assignment, curAssignIndex, index, courseIndex, arrayType] =
          element;

        const formattedDate = assignment ? formatDate(assignment.due_at) : null;
        const [dueDate, daysUntil] = formattedDate
          ? getNumDays(formattedDate)
          : [null, null];

        const name =
          assignment.name.length > 50
            ? truncateString(
                assignment.name,
                Math.round(window.screen.width / 25)
              )
            : assignment.name;

        return (
          <div key={compAssignIndex}>
            <div className="toDo-item">
              <div className="toDo-item-title">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={true}
                    onChange={() => {
                      setSortedToDo((prevArr) => {
                        // change assignment in unsorted arr to not visible
                        if (arrayType == 1)
                          setUnsortedToDo((prevArr) => {
                            const newArr = [...prevArr];
                            newArr[index][4] = 0;
                            localStorage.setItem(
                              "unsortedToDo",
                              JSON.stringify(newArr)
                            );
                            return newArr;
                          });
                        else
                          setAddedToDo((prevArr) => {
                            const newArr = [...prevArr];
                            newArr[index][4] = 0;
                            localStorage.setItem(
                              "addedToDo",
                              JSON.stringify(newArr)
                            );
                            return newArr;
                          });

                        // change assignment in sorted arr to visible
                        const newArr = [...prevArr];
                        newArr[curAssignIndex][4] = 0;
                        return newArr;
                      });
                      setCompletedAssignments((prevArr) => {
                        const newArr = [...prevArr];
                        newArr.splice(compAssignIndex, 1);
                        localStorage.setItem(
                          "completedAssignments",
                          JSON.stringify(newArr)
                        );
                        return newArr;
                      });
                    }}
                  />
                  <span></span>
                </label>
                <div className="toDo-item-name">
                  {courseIndex && courses[courseIndex]
                    ? `${
                        courses[courseIndex].name
                          .split("(")
                          .splice(-1, 1)[0]
                          .split("_")[0] +
                        courses[courseIndex].name
                          .split("(")
                          .splice(-1, 1)[0]
                          .split("_")[1]
                      } - `
                    : ""}
                  {name}
                </div>
              </div>
              <div className="toDo-item-dueDate">{dueDate}</div>
            </div>
            {compAssignIndex !== compAssignIndex.length - 1 ? (
              <hr className="horizontal-line" />
            ) : (
              ""
            )}
          </div>
        );
      })
    ) : (
      <div></div>
    );

  /*
  localStorage.removeItem("key");
  localStorage.removeItem("validKey");
    */
  return (
    <div className="container">
      {key == null ? (
        <div className="login-container">
          <div className="login">
            <div className="login-header">Canvas ToDo</div>
            <input
              id="login-input"
              type="text"
              placeholder="Enter API token"
              autoComplete="off"
            ></input>
            <div id="login-alert">Invalid token</div>
            <button
              className="login-button"
              onClick={() => {
                const key = document.getElementById("login-input").value;

                // check the length of input is greater than 0
                const check = fetch(
                  `http://54.153.125.141/api/users/self/${key}`
                ).then((response) => response.json());

                check
                  .then((result) => {
                    if (key.length == 0 || result.errors) throw new Error();

                    setValidKey(true);
                    localStorage.setItem("validKey", JSON.stringify(true));
                    setKey(key);
                    localStorage.setItem("key", JSON.stringify(key));
                  })
                  .catch(() => {
                    document
                      .getElementById("login-alert")
                      .classList.add("show");

                    setTimeout(() => {
                      document
                        .getElementById("login-alert")
                        .classList.remove("show");
                    }, 2000);
                  });
              }}
            >
              Login
            </button>
            <div className="tutorial">
              <a
                id="tutorial-text"
                href="https://kb.iu.edu/d/aaja"
                target="_blank"
              >
                Request an API token
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div id="courseModal" className="modal">
            <div id="courseModal-content" className="modal-content">
              <div className="modal-header">
                <div className="modal-title">Removed Courses</div>
                <span
                  className="close"
                  onClick={() => {
                    document.getElementById("courseModal").style.display =
                      "none";
                    document.body.style.overflow = "auto";
                  }}
                >
                  &times;
                </span>
              </div>
              {addableCourses}
            </div>
          </div>
          <div className="user">
            <div className="user-info">
              <div>{user.name}</div>
              <div>ID: {user.id}</div>
            </div>
            <div className="dropdown-container">
              <img
                className="user-img"
                src={
                  user.avatar_url
                    ? user.avatar_url
                    : "/default_profile_pic.jpeg"
                }
                alt="User Avatar"
              />
              <div className="dropdown-menu">
                <ul>
                  <li
                    onClick={() => {
                      // reset key
                      setKey("");
                      setValidKey(false);
                      localStorage.removeItem("key");
                      localStorage.removeItem("validKey");
                      window.location.reload();
                    }}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="section">
            <div className="section-title" style={{ margin: "0px" }}>
              Courses
            </div>
            <div className="course-inputs">
              <button
                className="button"
                onClick={() => {
                  document.getElementById("courseModal").style.display =
                    "block";
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

                        Array.from(
                          document.getElementsByClassName("course")
                        ).forEach((courseCRN) => {
                          courseCRN.style.justifyContent = "space-evenly";
                        });
                      } else {
                        Array.from(
                          document.getElementsByClassName("course-crn")
                        ).forEach((courseCRN) => {
                          courseCRN.style.flex = "0.4";
                          courseCRN.style.textAlign = "center";
                        });

                        Array.from(
                          document.getElementsByClassName("course")
                        ).forEach((courseCRN) => {
                          courseCRN.style.justifyContent = "space-between";
                        });
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
          <div className="section">
            <div className="toDo-title">To-do</div>
            <div className="toDo-add">
              <div className="toDo-add-container">
                <input
                  id="toDo-add-inputTask"
                  placeholder="Enter task"
                  autoComplete="off"
                ></input>
                <input
                  id="toDo-add-inputDate"
                  type="date"
                  value={selectedDate}
                  onChange={(event) => {
                    setSelectedDate(event.target.value);
                  }}
                ></input>
                <button
                  className="toDo-add-btn"
                  onClick={() => {
                    const inputElement =
                      document.getElementById("toDo-add-inputTask");
                    const content = inputElement.value;

                    setAddedToDo((prevArr) => {
                      const arr = [...prevArr];

                      const object = { name: content, due_at: selectedDate };
                      arr.push([
                        arr.length,
                        object,
                        "userAdded",
                        "userAdded",
                        0,
                        2,
                        0,
                        { grade: "userAdded", workflow_state: "userAdded" },
                      ]);

                      // Update local storage
                      localStorage.setItem("addedToDo", JSON.stringify(arr));

                      // Sort the new array
                      const sortedArr = unsortedToDo.concat(arr);
                      sortedArr.sort((a, b) => {
                        const dateA = new Date(a[1].due_at).getTime();
                        const dateB = new Date(b[1].due_at).getTime();
                        return dateA - dateB;
                      });

                      // Update sorted array state
                      setSortedToDo(sortedArr);

                      return arr;
                    });

                    // clear the input field after updating the state
                    inputElement.value = "";
                  }}
                >
                  +
                </button>
              </div>
              <select
                className="toDo-select"
                value={toDoExtent}
                onChange={(event) => {
                  setToDoExtent(event.target.value);
                  localStorage.setItem("toDoExtent", event.target.value);
                }}
              >
                <option value="7">1 Week</option>
                <option value="14">2 Weeks</option>
                <option value="30">1 Month</option>
                <option value="1000">Show All</option>
              </select>
            </div>
            {sortedToDo.length > 0 ? (
              <div className="toDo-header">Current</div>
            ) : (
              <div></div>
            )}
            {toDoCurrent}
            {sortedToDo.length > 0 ? (
              <div className="toDo-header second">Completed</div>
            ) : (
              <div></div>
            )}
            {toDoCompleted}
          </div>
          <div className="section">
            <div className="section-title">Modules</div>
            {allModules}
          </div>
        </div>
      )}
    </div>
  );
}

export default Data;

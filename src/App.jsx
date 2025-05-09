import React from "react";
import Header from "./Header/Header.jsx";
import Courses from "./Courses/Courses.jsx";
import ToDo from "./ToDo/ToDo.jsx";
import Modules from "./Modules/Modules.jsx";
import Login from "./Login/Login.jsx";

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
  const [toDoLength, setToDoLength] = React.useState(() => {
    const prevExtent = localStorage.getItem("toDoLength");
    return prevExtent !== null ? prevExtent : 20;
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
  const [reset, setReset] = React.useState(false);

  const [showCourseName, setShowCourseName] = React.useState(true);

  React.useEffect(() => {
    if (reset) {
      // reset valid key to original value
      setValidKey(!validKey);
      setReset(false);
    }

    if (validKey)
      try {
        // get user in ion (name, id, etc.)
        fetch(`https://canvastodobackend.onrender.com/api/users/self/${key}`)
          .then((response) => response.json())
          .then((userData) => {
            setUser(userData);

            // get total course grades
            fetch(
              `https://canvastodobackend.onrender.com/api/users/${userData.id}/enrollments/${key}`
            )
              .then((response) => response.json())
              .then((enrollmentData) => {
                setEnrollment(enrollmentData);
              });
          });

        // get user courses
        fetch(`https://canvastodobackend.onrender.com/api/courses/${key}`)
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
                  `https://canvastodobackend.onrender.com/api/courses/${course.id}/modules/${key}`
                ).then((response) => response.json())
              );

              assignmentsPromise.push(
                fetch(
                  `https://canvastodobackend.onrender.com/api/courses/${course.id}/assignments/${key}`
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
                        `https://canvastodobackend.onrender.com/api/courses/${courseId}/modules/${moduleId}/items/${key}`
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
                          `https://canvastodobackend.onrender.com/api/courses/${courseId}/assignments/${assignmentId}/submissions/self/${key}`
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

    // get and convert assignment due date
    const parts = dueDate.split("/");
    const formattedDate = new Date(parts[2], parts[1] - 1, parts[0]);
    const formattedDateConv = new Date(
      formattedDate.getTime() - formattedDate.getTimezoneOffset() * 60 * 1000
    );

    // get current time at users location
    const today = new Date();
    const todayConv = new Date(
      today.getTime() - today.getTimezoneOffset() * 60 * 1000
    );

    // calculate number of days difference between assignment and users time
    const diffDays = Math.round((formattedDateConv - todayConv) / oneDay);

    if (diffDays == 0) {
      return ["Today", diffDays];
    } else if (diffDays == 1) {
      return ["Tmrw", diffDays];
    } else {
      const month = formattedDateConv.toLocaleDateString(undefined, {
        month: "short",
      });
      const day = formattedDateConv.getDate();
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

  /*
  localStorage.removeItem("key");
  localStorage.removeItem("validKey");
    */

  return (
    <div className="container">
      {key == null ? (
        <Login setKey={setKey} setValidKey={setValidKey} />
      ) : (
        <div>
          <Header
            user={user}
            setValidKey={setValidKey}
            validKey={validKey}
            setKey={setKey}
            setReset={setReset}
            removedCourses={removedCourses}
            setRemovedCourses={setRemovedCourses}
          />
          <Courses
            courses={courses}
            removedCourses={removedCourses}
            setRemovedCourses={setRemovedCourses}
            showCourseName={showCourseName}
            setShowCourseName={setShowCourseName}
          />
          <ToDo
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            formatDate={formatDate}
            getNumDays={getNumDays}
            truncateString={truncateString}
            courses={courses}
            removedCourses={removedCourses}
            completedAssignments={completedAssignments}
            setCompletedAssignments={setCompletedAssignments}
            setAddedToDo={setAddedToDo}
            unsortedToDo={unsortedToDo}
            setUnsortedToDo={setUnsortedToDo}
            sortedToDo={sortedToDo}
            setSortedToDo={setSortedToDo}
            toDoExtent={toDoExtent}
            setToDoExtent={setToDoExtent}
            toDoLength={toDoLength}
            setToDoLength={setToDoLength}
          />
          <Modules
            enrollment={enrollment}
            assignments={assignments}
            submissions={submissions}
            courses={courses}
            courseModules={courseModules}
            removedCourses={removedCourses}
            courseVisibility={courseVisibility}
            items={items}
            itemVisibility={itemVisibility}
            setItemVisibility={setItemVisibility}
            formatDate={formatDate}
            getNumDays={getNumDays}
            truncateString={truncateString}
            setCourseVisibility={setCourseVisibility}
          />
        </div>
      )}
    </div>
  );
}

export default Data;

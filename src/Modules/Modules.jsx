import React from "react";

function Modules({
  enrollment,
  assignments,
  submissions,
  courses,
  courseModules,
  removedCourses,
  courseVisibility,
  items,
  itemVisibility,
  setItemVisibility,
  formatDate,
  getNumDays,
  truncateString,
  setCourseVisibility,
}) {
  function getCourseGrade(courseId) {
    for (let i = 0; i < enrollment.length; i++) {
      if (courseId == enrollment[i].course_id) {
        return enrollment[i].grades.current_score;
      }
    }
  }

  function getCourseName(course) {
    return (
      course.name.split("(").splice(-1, 1)[0].split("_")[0] +
      course.name.split("(").splice(-1, 1)[0].split("_")[1]
    );
  }

  function getAssignment(courseIndex, item) {
    const assignmentsArray = assignments ? assignments[courseIndex] : [];

    for (let i = 0; i < assignmentsArray.length; i++) {
      if (assignmentsArray[i].name === item.title) {
        return { assignment: assignmentsArray[i], index: i };
      }
    }
    return null;
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

  function getWorkflowClassification(submissionValid, dueDate, workflowState) {
    let result = "";

    if (submissionValid) {
      if (workflowState === "graded") {
        result = "🟩";
      } else if (workflowState === "submitted") {
        result = "🟨";
      } else {
        if (dueDate) {
          result = `${dueDate}`;
        } else {
          result = "";
        }
      }
    } else {
      result = "";
    }

    return result;
  }

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
                {getCourseName(courses[courseIndex])}
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
                        Array.isArray(
                          items &&
                            items[courseIndex] &&
                            items[courseIndex][moduleIndex]
                        ) &&
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
                                submissions?.[courseIndex]?.[
                                  assignObj.index
                                ] !== undefined;

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
                                    style={{ width: "100px" }}
                                  >
                                    <div
                                      style={{
                                        width: "55px",
                                        textAlign: "end",
                                      }}
                                    >
                                      {submissionValid
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
                                      {getWorkflowClassification(
                                        submissionValid,
                                        dueDate,
                                        submissionValid
                                          ? submissions[courseIndex][
                                              assignObj.index
                                            ].workflow_state
                                          : null
                                      )}
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

  return (
    <div className="section">
      <div className="section-title">Modules</div>
      {allModules}
    </div>
  );
}

export default Modules;

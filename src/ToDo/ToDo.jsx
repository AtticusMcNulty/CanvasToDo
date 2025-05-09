import React from "react";

function ToDo({
  selectedDate,
  setSelectedDate,
  formatDate,
  getNumDays,
  truncateString,
  courses,
  removedCourses,
  completedAssignments,
  setCompletedAssignments,
  setAddedToDo,
  unsortedToDo,
  setUnsortedToDo,
  sortedToDo,
  setSortedToDo,
  toDoExtent,
  setToDoExtent,
  toDoLength,
  setToDoLength,
}) {
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
          ? truncateString(assignment.name, toDoLength)
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
                  {courseIndex
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

  return (
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
        <div className="toDo-settings-container">
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
          <div>{`Title Length: ${toDoLength}`}</div>
          <input
            type="range"
            min="0"
            max="100"
            value={toDoLength}
            onChange={(event) => {
              setToDoLength(event.target.value);
              localStorage.setItem("toDoLength", event.target.value);
            }}
          />
        </div>
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
  );
}

export default ToDo;

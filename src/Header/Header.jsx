import React from "react";

function Header({
  user,
  setValidKey,
  validKey,
  setKey,
  setReset,
  removedCourses,
  setRemovedCourses,
}) {
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

  return (
    <div>
      <div id="courseModal" className="modal">
        <div id="courseModal-content" className="modal-content">
          <div className="modal-header">
            <div className="modal-title">Removed Courses</div>
            <span
              className="close"
              onClick={() => {
                document.getElementById("courseModal").style.display = "none";
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
          <button
            onClick={() => {
              // change dependecy array to refresh api calls
              setValidKey(!validKey);
              setReset(true);
            }}
          >
            🔄
          </button>
        </div>
        <div className="dropdown-container">
          <img
            className="user-img"
            src={
              user.avatar_url ? user.avatar_url : "/default_profile_pic.jpeg"
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
    </div>
  );
}

export default Header;

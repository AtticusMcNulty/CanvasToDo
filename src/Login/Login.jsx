import React from "react";

function Login({ setKey, setValidKey }) {
  return (
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
              `https://canvastodobackend.onrender.com/api/users/self/${key}`
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
                document.getElementById("login-alert").classList.add("show");

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
          <a id="tutorial-text" href="https://kb.iu.edu/d/aaja" target="_blank">
            Request an API token
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;

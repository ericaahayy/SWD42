import { back_end_url, front_end_url } from "../URL/link.js";

const wrapper = document.querySelector(".wrapper");
const loginLink = document.querySelector(".login-link");
const registerLink = document.querySelector(".register-link");

registerLink.addEventListener("click", () => {
    wrapper.classList.add("active");
});

loginLink.addEventListener("click", () => {
    wrapper.classList.remove("active");
});

document
    .getElementById("user_login")
    .addEventListener("submit", function (event) {
        event.preventDefault();
        const username = document.getElementById("log_username").value;
        const password = document.getElementById("log_password").value;
        const log_error = document.getElementById("log_error");
        try {
            fetch(back_end_url + "/api/login", {
                method: "POST",
                body: JSON.stringify({ username, password }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                if (!response.ok) {
                    log_error.innerHTML = "Username and password do not match";
                    throw new Error("Username and password do not match");
                }
                return response.json();
            })
            .then((data) => {
                log_error.innerText = "";
                // console.log(data.data[0]);
                let { username, first_login, clientID } = data.data[0];
                window.localStorage.setItem("username", username);
                window.localStorage.setItem("first_login", first_login);
                window.localStorage.setItem("clientID", clientID);
                if(first_login === 1){
                    window.location.replace(front_end_url + "/client/LoginForm/form.html");
                }else{
                    window.location.replace(front_end_url + "/client/Profile/profile.html");
                }
            });
        } catch (error) {
            document.getElementById("log_error").innerHTML = "Username and password do not match";
            console.error(error);
        }
    });

document
    .getElementById("user_reg")
    .addEventListener("submit", async function (event) {
        event.preventDefault();
        const username = document.getElementById("reg_username").value;
        const password = document.getElementById("reg_password").value;
        const first_login = 1;
        const confirm_password = document.getElementById("reg_confirm_password").value;
        const reg_error = document.getElementById("reg_error");
        const reg_success = document.getElementById("reg_success");
        reg_error.innerHTML = "";
        reg_success.innerHTML = "";

        if (password !== confirm_password) {
            reg_error.innerHTML = "Passwords do not match";
            return;
        }

        try {
            const response = await fetch(back_end_url + "/user/register", {
                method: "POST",
                body: JSON.stringify({ username, password, first_login }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            reg_success.innerHTML = data.message;
            event.target.reset();
        } catch (error) {
            console.error(error);
            reg_error.innerHTML = error.message || "User registration failed";
        }
    });

    document.addEventListener('DOMContentLoaded', function() { // for the log out button!
        const logoutButton = document.getElementById('logoutBtn');
      
        logoutButton.addEventListener('click', function() {
          localStorage.removeItem('clientID');
          localStorage.removeItem('username');
      
          window.location.href = '/client/Login/login.html'; 
        });
      });
    
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
        
    });
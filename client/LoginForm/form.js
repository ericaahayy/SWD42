import { back_end_url, front_end_url } from "../URL/link.js";

document.addEventListener("DOMContentLoaded", () => {
    document
        .getElementById("profile_form")
        .addEventListener("submit", async function (event) {
            event.preventDefault();

            const name = document.getElementById("name").value;
            const address1 = document.getElementById("address1").value;
            const address2 = document.getElementById("address2").value;
            const city = document.getElementById("city").value;
            const state = document.getElementById("state").value;
            const zipcode = document.getElementById("zipcode").value;

            const username = localStorage.getItem("username");
            const client_id = localStorage.getItem("client_id");

            try {
                const response = await fetch(back_end_url + "/profile/update", {
                    method: "POST",
                    body: JSON.stringify({
                        username,
                        client_id,
                        name,
                        address1,
                        address2,
                        city,
                        state,
                        zipcode,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to create profile.");
                }

                window.location.replace(front_end_url + "/client/Profile/profile.html");
            } catch (error) {
                console.error("Error:", error.message);
            }
        });
});
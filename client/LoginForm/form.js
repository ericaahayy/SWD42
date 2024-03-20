import { back_end_url, front_end_url } from "../URL/link.js";

document
    .getElementById("profile_form")
    .addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = localStorage.getItem("username");
        const clientID = localStorage.getItem("clientID");

        const fullName = document.getElementById("name").value;
        const [fname, ...lnameArray] = fullName.split(" ");
        const lname = lnameArray.join(" ");

        const address1 = document.getElementById("address1").value;
        const address2 = document.getElementById("address2").value;
        const city = document.getElementById("city").value;
        const state = document.getElementById("state").value;
        const zipcode = document.getElementById("zipcode").value;
        
        try {
            const response = await fetch(back_end_url + "/api/add_profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    fname,
                    lname,
                    address1,
                    address2,
                    city,
                    state,
                    zipcode,
                    clientID
                }),
            });

            if(response.ok) {
                const data = await response.json();
                localStorage.setItem("first_login", 0);
                window.location.replace(front_end_url + "/client/Profile/profile.html")
            } else {
                const errorData = await response.json();
                console.error("Profile update failed:", errorData.message);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    });
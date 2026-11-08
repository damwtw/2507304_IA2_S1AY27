
document.addEventListener("DOMContentLoaded", function () {
    const ticketPage = document.getElementById("ticketPage");

    const attendeeName = document.getElementById("attendeeName");
    const attendeeEmail = document.getElementById("attendeeEmail");

    const ticketName = document.getElementById("ticketName");
    const ticketGithub = document.getElementById("ticketGithub");
    const ticketAvatar = document.getElementById("ticketAvatar");
    const ticketNumber = document.getElementById("ticketNumber");

    // Retrieve the registration data.
    const savedData = sessionStorage.getItem(
        "codingConfRegistration"
    );

    // Redirect if no registration data exists.
    if (!savedData) {
        window.location.href = "index.html";
        return;
    }

    let registration;

    // Convert the saved JSON data into a JavaScript object.
    try {
        registration = JSON.parse(savedData);
    } catch (error) {
        window.location.href = "index.html";
        return;
    }

    // Check that all required information exists.
    if (
        !registration ||
        !registration.name ||
        !registration.email ||
        !registration.github ||
        !registration.avatar ||
        !registration.ticketNumber
    ) {
        window.location.href = "index.html";
        return;
    }

    // Display the attendee's details.
    attendeeName.textContent = registration.name;
    attendeeEmail.textContent = registration.email;

    ticketName.textContent = registration.name;
    ticketGithub.textContent = "@" + registration.github;
    ticketGithub.href = "https://github.com/" + registration.github;

    // Validate and display the uploaded avatar.
    if (
        registration.avatar.startsWith("data:image/png;base64,") ||
        registration.avatar.startsWith("data:image/jpeg;base64,")
    ) {
        ticketAvatar.src = registration.avatar;
    } else {
        window.location.href = "index.html";
        return;
    }

    // Display the generated ticket number.
    ticketNumber.textContent = "#" + registration.ticketNumber;

    // Show the completed ticket.
    ticketPage.hidden = false;
});

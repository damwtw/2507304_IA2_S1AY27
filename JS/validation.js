
const form = document.getElementById("registrationForm");

const avatarInput = document.getElementById("avatar");
const uploadBox = document.getElementById("uploadBox");
const uploadIcon = document.getElementById("uploadIcon");
const uploadText = document.getElementById("uploadText");
const avatarPreview = document.getElementById("avatarPreview");
const imageActions = document.getElementById("imageActions");
const removeImage = document.getElementById("removeImage");
const changeImage = document.getElementById("changeImage");
const avatarMessage = document.getElementById("avatarMessage");
const avatarHint = document.getElementById("avatarHint");

const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const github = document.getElementById("github");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const githubError = document.getElementById("githubError");

let avatarData = "";

// Open the file picker.
uploadBox.addEventListener("click", function (event) {
    if (event.target === removeImage ||
        event.target === changeImage) {
        return;
    }

    avatarInput.click();
});

// Allow keyboard selection.
uploadBox.addEventListener("keydown", function (event) {
    if (event.target === uploadBox &&
        (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        avatarInput.click();
    }
});

// Display avatar errors.
function showAvatarError(message) {
    avatarHint.textContent = message;
    avatarMessage.classList.add("invalid");
    uploadBox.classList.add("invalid");
}

// Clear avatar errors.
function clearAvatarError() {
    avatarHint.textContent =
        "Upload your photo (JPG or PNG, max size: 500KB).";

    avatarMessage.classList.remove("invalid");
    uploadBox.classList.remove("invalid");
}

// Validate the selected image.
avatarInput.addEventListener("change", function () {
    const file = avatarInput.files[0];

    if (!file) {
        return;
    }

    // Clear previously selected avatar data.
    avatarData = "";

    if (file.type !== "image/jpeg" &&
        file.type !== "image/png") {
        showAvatarError("Please upload a JPG or PNG image.");
        return;
    }

    if (file.size > 500 * 1024) {
        showAvatarError("Image must not exceed 500KB.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function () {
        avatarData = reader.result;

        avatarPreview.src = avatarData;
        avatarPreview.hidden = false;

        uploadIcon.hidden = true;
        uploadText.hidden = true;
        imageActions.hidden = false;

        clearAvatarError();
    };

    reader.onerror = function () {
        avatarData = "";
        showAvatarError("Unable to read the selected image.");
    };

    reader.readAsDataURL(file);
});

// Remove selected image.
removeImage.addEventListener("click", function (event) {
    event.stopPropagation();

    avatarInput.value = "";
    avatarData = "";

    avatarPreview.src = "";
    avatarPreview.hidden = true;

    uploadIcon.hidden = false;
    uploadText.hidden = false;
    imageActions.hidden = true;

    clearAvatarError();
});

// Change selected image.
changeImage.addEventListener("click", function (event) {
    event.stopPropagation();
    avatarInput.click();
});

// Display text field errors.
function showError(input, errorElement, message) {
    input.classList.add("invalid");
    input.setAttribute("aria-invalid", "true");
    errorElement.textContent = message;
}

// Clear text field errors.
function clearError(input, errorElement) {
    input.classList.remove("invalid");
    input.removeAttribute("aria-invalid");
    errorElement.textContent = "";
}

// Validate full name.
function validateName() {
    const value = fullName.value.trim();

    if (value === "") {
        showError(
            fullName,
            nameError,
            "Please enter your full name."
        );
        return false;
    }

    if (value.length < 2) {
        showError(
            fullName,
            nameError,
            "Name must contain at least 2 characters."
        );
        return false;
    }

    clearError(fullName, nameError);
    return true;
}

// Validate email address.
function validateEmail() {
    const value = email.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (value === "") {
        showError(
            email,
            emailError,
            "Please enter your email address."
        );
        return false;
    }

    if (!emailPattern.test(value)) {
        showError(
            email,
            emailError,
            "Please enter a valid email address."
        );
        return false;
    }

    clearError(email, emailError);
    return true;
}

// Validate GitHub username.
function validateGithub() {
    const value = github.value.trim();
    const githubPattern = /^@[a-zA-Z0-9-]+$/;

    if (value === "") {
        showError(
            github,
            githubError,
            "Please enter your GitHub username."
        );
        return false;
    }

    if (!githubPattern.test(value) ||
        value.endsWith("-") ||
        value.includes("--") ||
        value.length > 40) {
        showError(
            github,
            githubError,
            "Enter a valid GitHub username starting with @."
        );
        return false;
    }

    clearError(github, githubError);
    return true;
}

// Validate inputs when leaving each field.
fullName.addEventListener("blur", validateName);
email.addEventListener("blur", validateEmail);
github.addEventListener("blur", validateGithub);

// Generate ticket.
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const nameValid = validateName();
    const emailValid = validateEmail();
    const githubValid = validateGithub();

    if (avatarData === "") {
        showAvatarError("Please upload your avatar.");
    }

    if (
        !nameValid ||
        !emailValid ||
        !githubValid ||
        avatarData === ""
    ) {
        return;
    }

    const ticketNumber = String(
        Math.floor(Math.random() * 100000)
    ).padStart(5, "0");

    const registrationData = {
        name: fullName.value.trim(),
        email: email.value.trim(),
        github: github.value.trim().substring(1),
        avatar: avatarData,
        ticketNumber: ticketNumber
    };

    try {
        sessionStorage.setItem(
            "codingConfRegistration",
            JSON.stringify(registrationData)
        );

        window.location.href = "ticket.html";
    } catch (error) {
        alert("Unable to save registration. Please try again.");
    }
});

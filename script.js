
const form = document.querySelector("#registrationForm");

const fullName = document.querySelector("#fullName");
const email = document.querySelector("#email");
const position = document.querySelector("#position");
const section = document.querySelector("#section");
const attachment = document.querySelector("#attachment");
const agreement = document.querySelector("#agreement");

const nameError = document.querySelector("#nameError");
const emailError = document.querySelector("#emailError");
const positionError = document.querySelector("#positionError");
const fileError = document.querySelector("#fileError");
const agreementError = document.querySelector("#agreementError");

const fileName = document.querySelector("#fileName");
const formMessage = document.querySelector("#formMessage");

const maxFileSize = 5 * 1024 * 1024;
const allowedExtensions = ["jpg", "jpeg", "png", "pdf"];
const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf"
];

function setError(input, output, message) {
    output.textContent = message;

    if (input) {
        input.classList.toggle("invalid", Boolean(message));
        input.classList.toggle(
            "valid",
            !message && input.value.trim() !== ""
        );

        input.setAttribute("aria-invalid", message ? "true" : "false");
    }
}

function clearMessage() {
    formMessage.textContent = "";
    formMessage.className = "form-message";
}

function validateName() {
    const value = fullName.value.trim();
    let message = "";

    if (value.length < 2) {
        message = "Введи ім’я довжиною щонайменше 2 символи.";
    } else if (!/[A-Za-zА-Яа-яІіЇїЄєҐґ]/.test(value)) {
        message = "Ім’я має містити літери.";
    }

    setError(fullName, nameError, message);
    return message === "";
}

function validateEmail() {
    let message = "";

    if (!email.value.trim() || !email.validity.valid) {
        message = "Введи коректну електронну адресу.";
    }

    setError(email, emailError, message);
    return message === "";
}

function validatePosition() {
    const message = position.value.trim()
        ? ""
        : "Вкажи свою посаду.";

    setError(position, positionError, message);
    return message === "";
}

function validateFile() {
    const file = attachment.files[0];
    fileError.textContent = "";

    if (!file) {
        fileName.textContent = "Додай файл або натисни тут";
        return true;
    }

    const extension = file.name.split(".").pop().toLowerCase();
    const validType = allowedTypes.includes(file.type) ||
        (file.type === "" && allowedExtensions.includes(extension));

    if (!allowedExtensions.includes(extension) || !validType) {
        fileError.textContent = "Дозволені лише файли JPG, PNG або PDF.";
        fileName.textContent = file.name;
        return false;
    }

    if (file.size > maxFileSize) {
        fileError.textContent = "Максимальний розмір файлу — 5 МБ.";
        fileName.textContent = file.name;
        return false;
    }

    fileName.textContent = file.name;
    return true;
}

function validateSection() {
    section.classList.toggle("invalid", !section.value);
    return Boolean(section.value);
}

function validateAgreement() {
    agreementError.textContent = agreement.checked
        ? ""
        : "Потрібно погодитися з правилами участі.";

    return agreement.checked;
}

fullName.addEventListener("input", () => {
    validateName();
    clearMessage();
});

email.addEventListener("input", () => {
    validateEmail();
    clearMessage();
});

position.addEventListener("input", () => {
    validatePosition();
    clearMessage();
});

section.addEventListener("change", () => {
    validateSection();
    clearMessage();
});

attachment.addEventListener("change", () => {
    validateFile();
    clearMessage();
});

agreement.addEventListener("change", () => {
    validateAgreement();
    clearMessage();
});

form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearMessage();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPositionValid = validatePosition();
    const isSectionValid = validateSection();
    const isFileValid = validateFile();
    const isAgreementValid = validateAgreement();

    const isFormValid =
        isNameValid &&
        isEmailValid &&
        isPositionValid &&
        isSectionValid &&
        isFileValid &&
        isAgreementValid;

    if (!isFormValid) {
        formMessage.textContent =
            "Перевір форму та виправ позначені помилки.";
        formMessage.classList.add("failure");

        const firstInvalid = form.querySelector(
            ".invalid, [aria-invalid='true']"
        );

        if (firstInvalid) {
            firstInvalid.focus();
        } else if (!agreement.checked) {
            agreement.focus();
        }

        return;
    }

    const participantName = fullName.value.trim();
    const selectedSection = section.value;

    formMessage.textContent =
        `Дякуємо, ${participantName}! Форму перевірено. Напрям: ${selectedSection}.`;

    formMessage.classList.add("success");

    form.reset();

    fileName.textContent = "Додай файл або натисни тут";

    [fullName, email, position, section].forEach((input) => {
        input.classList.remove("invalid", "valid");
        input.removeAttribute("aria-invalid");
    });
});

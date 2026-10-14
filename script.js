const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelectorAll(".nav-link");

// Restore the saved theme preference.
if (localStorage.getItem("portfolio-theme") === "dark") {
    body.classList.add("dark-mode");
}
updateThemeButton();

themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    const theme = body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("portfolio-theme", theme);
    updateThemeButton();
});

function updateThemeButton() {
    const isDark = body.classList.contains("dark-mode");
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    themeToggle.querySelector(".theme-icon").textContent = isDark ? "☀" : "☾";
    themeToggle.querySelector(".theme-label").textContent = isDark ? "Light mode" : "Dark mode";
}

// Open and close the mobile navigation.
menuToggle.addEventListener("click", () => {
    const isOpen = body.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        body.classList.remove("menu-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
    });
});

// Highlight the navigation link for the section currently in view.
const sections = document.querySelectorAll("main section[id]");
if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            navLinks.forEach((link) => {
                const isActive = link.getAttribute("href") === `#${entry.target.id}`;
                link.classList.toggle("active", isActive);
                if (isActive) link.setAttribute("aria-current", "page");
                else link.removeAttribute("aria-current");
            });
        });
    }, { rootMargin: "-35% 0px -50% 0px" });

    sections.forEach((section) => sectionObserver.observe(section));
}

// Validate the contact form and open an email draft.
const contactForm = document.getElementById("contactForm");
const fields = {
    name: document.getElementById("name"),
    email: document.getElementById("email"),
    reason: document.getElementById("reason"),
    message: document.getElementById("message")
};
const errorFields = {
    name: document.getElementById("nameError"),
    email: document.getElementById("emailError"),
    reason: document.getElementById("reasonError"),
    message: document.getElementById("messageError")
};

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    Object.values(errorFields).forEach((element) => {
        element.textContent = "";
    });

    let valid = true;
    if (!fields.name.value.trim()) {
        errorFields.name.textContent = "Please enter your name.";
        valid = false;
    }

    const emailValue = fields.email.value.trim();
    if (!emailValue || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
        errorFields.email.textContent = "Please enter a valid email address.";
        valid = false;
    }

    if (!fields.reason.value) {
        errorFields.reason.textContent = "Please choose a reason for contacting me.";
        valid = false;
    }

    if (!fields.message.value.trim()) {
        errorFields.message.textContent = "Please enter a message.";
        valid = false;
    }

    if (!valid) {
        const firstInvalid = contactForm.querySelector(".error-message:not(:empty)");
        if (firstInvalid) {
            firstInvalid.closest(".form-group").querySelector("input, select, textarea").focus();
        }
        return;
    }

    const subject = encodeURIComponent(`${fields.reason.value} — Portfolio Contact`);
    const message = encodeURIComponent(
        `Name: ${fields.name.value.trim()}\nEmail: ${emailValue}\nReason: ${fields.reason.value}\n\nMessage:\n${fields.message.value.trim()}`
    );
    window.location.href = `mailto:junhuiyu825@gmail.com?subject=${subject}&body=${message}`;

    let status = contactForm.querySelector(".form-status");
    if (!status) {
        status = document.createElement("p");
        status.className = "form-status";
        status.setAttribute("role", "status");
        contactForm.appendChild(status);
    }
    status.textContent = "Your email app should open with the message ready to send.";
});

// Keep the footer year current.
const currentYear = document.getElementById("currentYear");
if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

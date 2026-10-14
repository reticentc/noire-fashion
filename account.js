
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    updateProfile
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

import { auth } from "./firebase.js";

const accountButton = document.getElementById("accountButton");
const accountOverlay = document.getElementById("accountOverlay");
const closeAccount = document.getElementById("closeAccount");
const accountForm = document.getElementById("accountForm");
const accountName = document.getElementById("accountName");
const accountEmail = document.getElementById("accountEmail");
const accountPassword = document.getElementById("accountPassword");
const nameField = document.getElementById("nameField");
const accountTitle = document.getElementById("accountTitle");
const accountSubtitle = document.getElementById("accountSubtitle");
const accountMessage = document.getElementById("accountMessage");
const accountSubmit = document.getElementById("accountSubmit");
const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");

const accountLogout = document.createElement("button");
accountLogout.type = "button";
accountLogout.id = "accountLogout";
accountLogout.textContent = "LOG OUT";
accountLogout.hidden = true;
accountLogout.style.cssText =
    "width:100%;padding:16px;margin-top:16px;background:#171612;color:#f8f5ef;border:0;font-weight:700;cursor:pointer;";
accountForm.after(accountLogout);

let mode = "login";

function showMessage(message) {
    accountMessage.textContent = message;
}

function setMode(nextMode) {
    mode = nextMode;

    const signingUp = mode === "signup";

    nameField.hidden = !signingUp;
    accountName.required = signingUp;
    accountPassword.autocomplete = signingUp
        ? "new-password"
        : "current-password";

    loginTab.classList.toggle("active", !signingUp);
    signupTab.classList.toggle("active", signingUp);

    accountTitle.textContent = signingUp
        ? "Join NOIRÉ."
        : "Welcome Back.";

    accountSubtitle.textContent = signingUp
        ? "Create your private client account."
        : "Sign in to your account.";

    accountSubmit.textContent = signingUp
        ? "CREATE ACCOUNT →"
        : "LOG IN →";

    showMessage("");
}

loginTab.addEventListener("click", () => setMode("login"));
signupTab.addEventListener("click", () => setMode("signup"));

accountButton.addEventListener("click", () => {
    accountOverlay.classList.add("open");
    accountOverlay.setAttribute("aria-hidden", "false");
});

function closeAccountWindow() {
    accountOverlay.classList.remove("open");
    accountOverlay.setAttribute("aria-hidden", "true");
}

closeAccount.addEventListener("click", closeAccountWindow);

accountOverlay.addEventListener("click", event => {
    if (event.target === accountOverlay) {
        closeAccountWindow();
    }
});

accountForm.addEventListener("submit", async event => {
    event.preventDefault();

    accountSubmit.disabled = true;
    showMessage("Please wait...");

    try {
        const email = accountEmail.value.trim();
        const password = accountPassword.value;

        if (mode === "signup") {
            const name = accountName.value.trim();

            if (!name) {
                throw new Error("Please enter your full name.");
            }

            const result = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            await updateProfile(result.user, {
                displayName: name
            });

            showMessage("Your NOIRÉ account has been created!");
        } else {
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            showMessage("Login successful!");
        }

        accountForm.reset();
    } catch (error) {
        const messages = {
            "auth/email-already-in-use":
                "This email already has an account. Please log in.",
            "auth/invalid-email":
                "Please enter a valid email address.",
            "auth/weak-password":
                "Choose a stronger password with at least 6 characters.",
            "auth/invalid-credential":
                "Email or password is incorrect. Please try again.",
            "auth/too-many-requests":
                "Too many attempts. Please wait and try again.",
            "auth/network-request-failed":
                "Network error. Check your internet connection."
        };

        showMessage(
            messages[error.code] ||
            error.message ||
            "Something went wrong. Please try again."
        );
    } finally {
        accountSubmit.disabled = false;
    }
});

onAuthStateChanged(auth, user => {
    if (user) {
        accountButton.textContent =
            user.displayName || "MY ACCOUNT";

        accountTitle.textContent = "You're In.";
        accountSubtitle.textContent =
            `Signed in as ${user.email}`;

        accountForm.hidden = true;
        loginTab.hidden = true;
        signupTab.hidden = true;
        accountLogout.hidden = false;
        showMessage("");
    } else {
        accountButton.textContent = "MY ACCOUNT";

        accountForm.hidden = false;
        loginTab.hidden = false;
        signupTab.hidden = false;
        accountLogout.hidden = true;

        setMode("login");
    }
});

accountLogout.addEventListener("click", async () => {
    try {
        await signOut(auth);
        closeAccountWindow();
        showMessage("You have signed out.");
    } catch (error) {
        showMessage("Could not sign out. Please try again.");
    }
});

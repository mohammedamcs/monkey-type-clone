const toggleModeInput = document.getElementById("light-mode-toggle");
const logoImage = document.getElementById("logo");

window.addEventListener("DOMContentLoaded", () => {
  const lightMode = JSON.parse(localStorage.getItem("lightMode"));

  if (!lightMode) {
    // Create local storage to default
    localStorage.setItem("lightMode", false);
    logoImage.src = "images/logo.svg";
  } else {
    document.body.classList.add("light-mode");
    toggleModeInput.checked = true;
    logoImage.src = "images/logo-light-mode.svg";
  }
});

toggleModeInput.addEventListener("click", (e) => {
  if (e.target.checked) {
    document.body.classList.add("light-mode");
    localStorage.setItem("lightMode", true);
    logoImage.src = "images/logo-light-mode.svg";
  } else {
    document.body.classList.remove("light-mode");
    localStorage.setItem("lightMode", false);
    logoImage.src = "images/logo.svg";
  }
});

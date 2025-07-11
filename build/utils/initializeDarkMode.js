let isDarkMode = false;
const savedDarkMode = localStorage.getItem("dark_mode");
const darkMode = savedDarkMode === "true";

const checkbox = document.createElement("input");
checkbox.type = "checkbox";
checkbox.style.display = "none";
checkbox.id = "dark-mode-toggle";
checkbox.checked = darkMode;
document.documentElement.appendChild(checkbox);
isDarkMode = darkMode;

if (darkMode) {
  document.documentElement.classList.remove("bg-(--color-bg-dark)");
  document.documentElement.classList.add("bg-(--color-bg)");
} else {
  document.documentElement.classList.add("bg-(--color-bg-dark)");
  document.documentElement.classList.remove("bg-(--color-bg)");
}

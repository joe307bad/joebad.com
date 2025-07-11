window.addEventListener("DOMContentLoaded", function () {
  // TODO this could prob be some custom event emitter that i can emit an event in react and listen here
  setTimeout(() => {
    const checkbox = document.getElementById("dark-mode-toggle");
    const switchBg = document.getElementById("switch-bg");
    const switchCircle = document.getElementById("switch-circle");
    const html = document.getElementById("html");

    // Handle toggle changes
    checkbox.addEventListener("change", function () {
      console.log(this.checked);
      if (this.checked) {
        document.documentElement.classList.remove("bg-(--color-bg-dark)");
        document.documentElement.classList.add("bg-(--color-bg)");
        switchCircle.classList.add("translate-x-4");
        localStorage.setItem("dark_mode", "true");
      } else {
        document.documentElement.classList.add("bg-(--color-bg-dark)");
        document.documentElement.classList.remove("bg-(--color-bg)");
        switchCircle.classList.remove("translate-x-4");
        localStorage.setItem("dark_mode", "false");
      }
    });
  }, 500);
});

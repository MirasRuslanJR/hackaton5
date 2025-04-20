//support form
const form = document.getElementById("support-form");
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const button = form.querySelector("button");
  button.disabled = true;
  button.textContent = "Sending...";
  setTimeout(() => {
    alert("Your message has been sent!");
    form.reset();
    button.disabled = false;
    button.textContent = "Send Message";
  }, 1000);
});

// scroll indicator
const indicator = document.createElement("div");
indicator.classList.add("scroll-indicator");
document.body.appendChild(indicator);

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = (scrollTop / docHeight) * 100;
  indicator.style.height = scrolled + "%";
});

// menu hamburger
function toggleMenu() {
  const navLinks = document.querySelector('.nav-links');
  navLinks.classList.toggle('active');
}

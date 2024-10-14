import { API_BASE_URL, endpoints } from "./constants.js";
import { checkUser, deleteDataById, getAllData } from "./helpers.js";


//check navbar for login
window.addEventListener("load", async () => {
    const isLogged = await checkUser();
      renderNavbar(isLogged);
  });

  function renderNavbar(isLogged) {
    const navLinks = document.querySelector(".nav__links");
    const accordionLinks = document.querySelector(".accordion__links");
    if (isLogged) {
      navLinks.innerHTML = `
                              <li><a href="./index.html">Home</a></li>
                          <li><a href="./about.html">About</a></li>
                          <li><a href="./blog.html">Blog</a></li>
                          <li><a href="./services.html">Services</a></li>
                          <li><a href="./contact.html">Contact</a></li>
                         <li class="text-danger">${isLogged.username}</li>
                       <li><a class="sign-out">Sign Out</a></li>
        `;

        accordionLinks.innerHTML = `
         <li class="text-danger">${isLogged.username}</li>
        <li><a href="./index.html">Home</a></li>
    <li><a href="./about.html">About</a></li>
    <li><a href="./blog.html">Blog</a></li>
    <li><a href="./services.html">Services</a></li>
    <li><a href="./contact.html">Contact</a></li>
  <li><a class="sign-out">Sign Out</a></li>
  `;
    } else {
      navLinks.innerHTML = `
                          <li><a href="./index.html">Home</a></li>
                          <li><a href="./about.html">About</a></li>
                          <li><a href="./blog.html">Blog</a></li>
                          <li><a href="./services.html">Services</a></li>
                          <li><a href="./contact.html">Contact</a></li>
                          <li><a href="./register.html">Register</a></li>
                          <li><a href="./login.html">Login</a></li>
      `;

      accordionLinks.innerHTML = `
      <li><a href="./index.html">Home</a></li>
      <li><a href="./about.html">About</a></li>
      <li><a href="./blog.html">Blog</a></li>
      <li><a href="./services.html">Services</a></li>
      <li><a href="./contact.html">Contact</a></li>
      <li><a href="./register.html">Register</a></li>
      <li><a href="./login.html">Login</a></li>
  `;
    }

    const signOutBtn = document.querySelector(".sign-out");

    if (signOutBtn) {
      signOutBtn.addEventListener("click", () => {
        Swal.fire({
          title: "Are you sure to log out?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, logged out!",
        }).then(async(result) => {
          if (result.isConfirmed) {
            //log out
          //   const blogs = await getAllData(API_BASE_URL, endpoints.blogs);
            localStorage.setItem("user", JSON.stringify(null));
          //   renderBlogsHTML(blogs);
            renderNavbar(false);
          
            Swal.fire({
              title: "Logged Out!",
              text: "User logged out.",
              icon: "success",
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.href = "index.html";
              }
            });
          }
        });
      });
    }
  }
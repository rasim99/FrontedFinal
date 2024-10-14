import { API_BASE_URL, endpoints } from "./constants.js";
import { checkUser, deleteDataById, getAllData } from "./helpers.js";
const blogCards = document.querySelector(".blog__cards");
let wishlist = [];

//dom load
document.addEventListener("DOMContentLoaded", async () => {
  const blogs = await getAllData(API_BASE_URL, endpoints.blogs);
  renderBlogsHTML(blogs);
  const anyUser = JSON.parse(localStorage.getItem("user"))
  if (anyUser) {
    let wishListAnchor = document.createElement("a")
    wishListAnchor.setAttribute("href", "wishlist.html");
    wishListAnchor.classList.add("wish");
    wishListAnchor.textContent="Go Wishlist"
    blogCards.parentElement.appendChild(wishListAnchor)
  }
});

function renderBlogsHTML(arr) {
  blogCards.innerHTML = "";
  const userId = JSON.parse(localStorage.getItem("user"));
  arr.forEach((blog) => {
    const isInWishlist = wishlist.some(item => item.id === blog.id);
    
    blogCards.innerHTML += `
     <div class="blog__elements">
                        <div class="img__wrapper">
                            <img src=".${blog.imgUrl}" alt="photo">
                        </div>
                        
                        <div class="create__date">
                          <a href="./blog.html">
                            <p>${returnedDay(blog.createDate)}</p>
                          <p>${returnedMonth(blog.createDate)}</p>
                          </a>
                        </div>

                        <div class="blog__detail">
                            <a href="./index.html"><p>${blog.title}</p>
                            </a>
                           <p> ${blog.details}</p>
                        </div>
                        <div class="tag__comment">
                            <a href="#">
                            &#127991;
                            <p class="tag">${blog.tags} </p>
                         </a>
                         <a href="#">&#128490; 
                              <p class="comment"> ${
                                blog.countOfComment
                              }  Comments</p>
                         </a>
                        </div>

                         <div class="writing ms-3 d-grid gap-2 p-3">
                         ${
                           userId
                             ? `<button data-id="${blog.id}" class="btn btn-outline-danger delete"> &#10006;</button>`
                             : ""
                         }

                           ${
                             userId
                               ? `<a href="edit.html?id=${blog.id}" class="btn btn-outline-primary">&#x270D</a>
                               <button data-id="${blog.id}" class="btn mt-3 btn-outline-warning toggle-wishlist">
                            ${isInWishlist ? '➖' : '😍'}
                        </button>
                              `
                               : ""
                           }
                           <a href="detail.html?id=${
                             blog.id
                           }" class="btn btn-outline-info"> &#9432</a>
                         </div>
                    </div>
      `;

      const toggleWishlistBtns = document.querySelectorAll(".toggle-wishlist");
        toggleWishlistBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                handleToggleWishlist(e);
            });
        });
    
    const deleteBtns = document.querySelectorAll(".delete");
    deleteBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        }).then((result) => {
          if (result.isConfirmed) {
            //delete from UI - html
            e.target.closest(".blog__elements").remove();
            //delete from API
            const id = e.target.getAttribute("data-id");
            console.log("deleted id: ", id);
            deleteDataById(API_BASE_URL, endpoints.blogs, id).then((res) => {
              console.log("response: ", res);
            });
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
          }
        });
      });
    });
  });
}

//handletoggle for wishlist
async function handleToggleWishlist(e) {
  const id = e.target.getAttribute("data-id");
  const blog = await getAllData(API_BASE_URL, endpoints.blogs + '/' + id); 

  const wishlistItem = {
      id: blog.id,
      title: blog.title,
      details: blog.details,
      createDate: blog.createDate,
      imgUrl: blog.imgUrl
  };
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const itemIndex = wishlist.findIndex(item => item.id === blog.id);
  
  if (itemIndex > -1) {
      wishlist.splice(itemIndex, 1);
      e.target.textContent = 'Add to Wishlist';
      e.target.nextElementSibling.classList.replace('fa-solid', 'fa-regular'); 
      Swal.fire("Removed!", "The city has been removed from your wishlist.", "success");
  } else {
      wishlist.push(wishlistItem);
      e.target.textContent = 'Remove from Wishlist';
      e.target.nextElementSibling.classList.replace('fa-regular', 'fa-solid'); 
      Swal.fire("Added!", "The city has been added to your wishlist.", "success");
  }
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

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

  signOutBtn.addEventListener("click", () => {
    Swal.fire({
      title: "Are you sure to log out?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logged out!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        //log out
        const blogs = await getAllData(API_BASE_URL, endpoints.blogs);
        localStorage.setItem("user", JSON.stringify(null));
        renderBlogsHTML(blogs);
        renderNavbar(false);
        if (wishListAnchor) {
          wishListAnchor.remove();
          console.log("okeee");
        }else {
          console.log("false");
        }
        Swal.fire({
          title: "Logged Out!",
          text: "User logged out.",
          icon: "success",
        });
      }
    });
  });
}

// day formatted
function returnedDay(dateUtc) {
  const day = new Date(dateUtc);
  return day.getUTCDate();
}
// month formatted
function returnedMonth(dateUtc) {
  const date = new Date(dateUtc);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[date.getUTCMonth()];
}

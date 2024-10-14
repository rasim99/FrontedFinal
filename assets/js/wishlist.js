
import { API_BASE_URL, endpoints } from "./constants.js";
import { checkUser, deleteDataById, getAllData } from "./helpers.js";

const wishlistRow = document.querySelector(".wishlist-row");

// DOM load
document.addEventListener("DOMContentLoaded", async () => {
    
    const wishlistItems = JSON.parse(localStorage.getItem("wishlist")) || [];
    renderWishlistHTML(wishlistItems);
    
});
console.log("wishlistItems");

function renderWishlistHTML(arr) {
    wishlistRow.innerHTML = "";
    if (arr.length === 0) {
        wishlistRow.innerHTML = `<p class="text-center">Your wishlist is empty.</p>`;
        return;
    }

    arr.forEach((item) => {
        wishlistRow.innerHTML += `
            <div class="col-12 mt-4">
                <div class="card">
                    <div class="img-wrapper"">
                        <img src="${item.imgUrl}" 
                        class="card-img-top" alt="photo">
                    </div>
                    <div class="card-body">
                        <h2 class="card-title">${item.title}</h2>
                        <p class="m-0">cretate date: ${item.createDate}</p>
                        <button data-id="${item.id}" class="btn btn-outline-danger  remove">Remove from Wishlist</button>
                    </div>
                </div>
            </div>`;
    });

    const removeBtns = document.querySelectorAll(".remove");
    removeBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const id = e.target.getAttribute("data-id");
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, remove it!"
            }).then((result) => {
                if (result.isConfirmed) {
                    // Remove from UI
                    e.target.closest(".col-3").remove();
                    
                    // Remove from local storage
                    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
                    wishlist = wishlist.filter(item => item.id !== id);
                    localStorage.setItem("wishlist", JSON.stringify(wishlist));
                    
                    Swal.fire("Removed!", "Your item has been removed from the wishlist.", "success");
                }
            });
        });
    });
}

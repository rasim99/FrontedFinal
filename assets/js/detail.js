import { API_BASE_URL, endpoints } from "./constants.js";
import { getDataById } from "./helpers.js";

const blogCards = document.querySelector(".blog__cards");

document.addEventListener("DOMContentLoaded", async () => {
  const id = new URLSearchParams(location.search).get("id");
  const blogs = await getDataById(API_BASE_URL, endpoints.blogs, id);
  const blog = blogs[0];
  blogCards.innerHTML = `  <div class="col-12">
                        <div class="card">
                            <div class="img-wrapper">
                                <img src=${blog.imgUrl} class="card-img-top" alt="photo">
                            </div>
                            <div class="card-body">
                                <h5>${blog.title}</h5>
                                <p class="detail__details">  ${blog.details}</p>
                                <p class="detail__count">count : ${blog.countOfComment}</p>
                                <a href="blog.html" >Go Back</a>
                            </div>
                        </div>
                    </div>`;
});
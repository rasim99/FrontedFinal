import { API_BASE_URL, endpoints } from './constants.js';
import { getDataById, updateDataById } from './helpers.js';

document.addEventListener('DOMContentLoaded', async () => {
    const editFormContainer = document.getElementById('edit-form-container');
    const resultMessage = document.getElementById('result-message');
    let blogData = {};
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');

    if (blogId) {
        try {
            const blog = await getDataById(API_BASE_URL, endpoints.blogs, blogId);
            if (blog && blog.length > 0) {
                blogData = blog[0]; 
                createEditForm(blogData); 
            } else {
                resultMessage.textContent = 'Blog not found.';
            }
        } catch (error) {
            resultMessage.textContent = 'Error fetching blog data.';
            console.error("Fetch error:", error); 
        }
    }

    function createEditForm(blog) {        
        const form = document.createElement('form');
        form.id = 'edit-form';

        // Blog Title Input
        const titleLabel = document.createElement('label');
        titleLabel.setAttribute('for', 'blog-title');
        titleLabel.textContent = 'Blog title:';
        form.appendChild(titleLabel);
 
        const blogTitleInput = document.createElement('input');
        blogTitleInput.type = 'text';
        blogTitleInput.id = 'blog-title';
        blogTitleInput.name = 'blog-title';
        blogTitleInput.required = true;
        blogTitleInput.value = blog.title;         
        form.appendChild(blogTitleInput);

        form.appendChild(document.createElement('br'));

        // Details Input
        const detailsLabel = document.createElement('label');
        detailsLabel.setAttribute('for', 'details');
        detailsLabel.textContent = 'Details:';
        form.appendChild(detailsLabel);

        const detailsInput = document.createElement('input');
        detailsInput.type = 'text';
        detailsInput.id = 'details';
        detailsInput.name = 'details';
        detailsInput.required = true;
        detailsInput.value = blog.details; 
        form.appendChild(detailsInput);
        form.appendChild(document.createElement('br'));

        // Image URL Input
        const imgUrlLabel = document.createElement('label');
        imgUrlLabel.setAttribute('for', 'imgUrl');
        imgUrlLabel.textContent = 'Image URL:';
        form.appendChild(imgUrlLabel);

        const imgUrlInput = document.createElement('input');
        imgUrlInput.type = 'text';
        imgUrlInput.id = 'imgUrl';
        imgUrlInput.name = 'imgUrl';
        imgUrlInput.value = blog.imgUrl; 
        form.appendChild(imgUrlInput);
        form.appendChild(document.createElement('br'));

        // Submit Button
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Update Blog';
        form.appendChild(submitButton);
        editFormContainer.appendChild(form);

        // Submit Event Listener
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const updatedBlog = {
                ...blog,
                imgUrl: imgUrlInput.value || blog.imgUrl,
                title: blogTitleInput.value || blog.title,
                details: detailsInput.value || blog.details,
                updateDate:new Date()
            };

            if (blogId) {
                try {
                    const response = await updateDataById(API_BASE_URL, endpoints.blogs, blogId, updatedBlog);
                    
                    if (response) {
                        Swal.fire({
                            title: "Update Successful",
                            text: "Blog updated successfully.",
                            icon: "success"
                        }).then(() => {
                            window.location.href="blog.html"
                        });
                    }
                } catch (error) {
                    resultMessage.textContent = 'Error updating blog.';
                    console.error(error);
                }
            } else {
                resultMessage.textContent = 'Please enter all required fields.';
            }
        });
    }
});


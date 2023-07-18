// Reads the login user's ID from the cookie
const cookieArr = document.cookie.split("=");
console.log(cookieArr);
const userId = cookieArr[1];

// Sermon DOM Elements
const submitSermonForm = document.getElementById("sermon-form");
const sermonContainer = document.getElementById("sermon-container");

// Comment DOM Elements
const submitCommentForm = document.getElementById("comment-form");
const commentContainer = document.getElementById("comment-container");

// Sermon Modal Elements
const sermonBody = document.getElementById("sermon-body");
const updateSermonBtn = document.getElementById("update-sermon-button");

// Comment Modal Elements
const commentBody = document.getElementById("comment-body");
const updateCommentBtn = document.getElementById("update-comment-button");

// Function to handle logout
function handleLogout() {
    let c = document.cookie.split(";");
    for (let i in c) {
        document.cookie =
            /^[^=]+/.exec(c[i])[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

// Fetch sermons by user
const baseUrl = "http://localhost:8080/api/v1/sermons";
const headers = {
    "Content-Type": "application/json",
};

const getSermonsByUser = async (userId) => {
    try {
        const response = await fetch(`${baseUrl}/user/${userId}`, {
            method: "GET",
            headers: headers,
        });
        if (response.ok) {
            const data = await response.json();
            createSermonCards(data);
        } else {
            console.error("Failed to fetch sermons:", response.status);
        }
    } catch (error) {
        console.error("Error fetching sermons:", error);
    }
};

async function addSermon(obj) {
    try {
        const response = await fetch(`${baseUrl}user/${userId}`, {
            method: "POST",
            body: JSON.stringify(obj),
            headers: headers,
        });

        if (response.status === 200) {
            await getSermons(userId);
        } else {
            console.error("Failed to add sermon:", response.status);
        }
    } catch (error) {
        console.error("Error adding sermon:", error);
    }
}

const addSermonByUser = async (sermonDto, userId) => {
    try {
        const response = await fetch(`${baseUrl}/user/${userId}`, {
            method: "POST",
            body: JSON.stringify(sermonDto),
            headers: headers,
        });
        if (response.ok) {
            await getSermonsByUser(userId);
        } else {
            console.error("Failed to add sermon:", response.status);
        }
    } catch (error) {
        console.error("Error adding sermon:", error);
    }
};

// Function to get sermon by ID
const getSermonById = async (sermonId) => {
    try {
        const response = await fetch(`${baseUrl}/${sermonId}`, {
            method: "GET",
            headers: headers,
        });
        if (response.ok) {
            const data = await response.json();
            populateSermonModal(data);
        } else {
            console.error("Failed to fetch sermon by ID:", response.status);
        }
    } catch (error) {
        console.error("Error fetching sermon by ID:", error);
    }
};

async function getSermons(userId) {
    try {
        const response = await fetch(`${baseUrl}user/${userId}`, {
            method: "GET",
            headers: headers,
        });

        if (response.status === 200) {
            const data = await response.json();
            createSermonCards(data);
        } else {
            console.error("Failed to fetch sermons:", response.status);
        }
    } catch (error) {
        console.error("Error fetching sermons:", error);
    }
}

async function handleSermonEdit(sermonId) {
    let sermonTitle = document.getElementById("edit-sermon-title").value;
    let sermonDescription = document.getElementById("edit-sermon-input").value;
    let sermonScripture = document.getElementById("edit-sermon-scripture").value;
    let sermonDate = document.getElementById("edit-sermon-date").value;
    let sermonCategory = document.getElementById("edit-category-name").value;

    let bodyObj = {
        id: sermonId,
        body: sermonBody.innerText,
        title: sermonTitle,
        description: sermonDescription,
        scripture: sermonScripture,
        date: sermonDate,
        category: {
            id: sermonCategory,
        },
    };

    try {
        const response = await fetch(`${baseUrl}${sermonId}`, {
            method: "PUT",
            body: JSON.stringify(bodyObj),
            headers: headers,
        });

        if (response.status === 200) {
            await getSermons(userId);
            $('#sermon-edit-modal').modal('hide');
        } else {
            console.error("Failed to update sermon:", response.status);
        }
    } catch (error) {
        console.error("Error updating sermon:", error);
    }
}

// Placeholder for handleSermonDelete function
const handleSermonDelete = async (sermonId) => {
    try {
        const confirmed = confirm("Are you sure you want to delete this sermon?");
        if (!confirmed) return;

        const response = await fetch(`${baseUrl}/${sermonId}`, {
            method: "DELETE",
            headers: headers,
        });
        if (response.ok) {
            // Remove the deleted sermon card from the UI
            const deletedSermonCard = document.querySelector(`[id="${sermonId}"]`);
            console.log(deletedSermonCard);

            if (deletedSermonCard) {
                deletedSermonCard.remove();
            }
        } else {
            console.error("Failed to delete sermon:", response.status);
        }
    } catch (error) {
        console.error("Error deleting sermon:", error);
    }
};

const deleteSermonById = async (sermonId) => {
    try {
        const confirmed = confirm("Are you sure you want to delete this sermon?");
        if (!confirmed) return;

        const response = await fetch(`${baseUrl}/${sermonId}`, {
            method: "DELETE",
            headers: headers,
        });
        if (response.ok) {
            // Handle success case if needed
        } else {
            console.error("Failed to delete sermon:", response.status);
        }
    } catch (error) {
        console.error("Error deleting sermon:", error);
    }
};

const updateSermonById = async (sermonDto, sermonId) => {
    try {
        const response = await fetch(`${baseUrl}/${sermonId}`, {
            method: "PUT",
            body: JSON.stringify(sermonDto),
            headers: headers,
        });
        if (response.ok) {
            await getSermonsByUser(userId);
        } else {
            console.error("Failed to update sermon:", response.status);
        }
    } catch (error) {
        console.error("Error updating sermon:", error);
    }
};

const getCommentsBySermonId = async (sermonId) => {
    try {
        const response = await fetch(`${baseUrl}/comments/sermons/${sermonId}`, {
            method: "GET",
            headers: headers,
        });
        if (response.ok) {
            const data = await response.json();
            createCommentCards(data, sermonId);
        } else {
            console.error("Failed to fetch comments:", response.status);
        }
    } catch (error) {
        console.error("Error fetching comments:", error);
    }
};

const addComment = async (body, userId, sermonId) => {
    try {
        const response = await fetch(`${baseUrl}/comments/${userId}/${sermonId}`, {
            method: "POST",
            body: JSON.stringify({ body }),
            headers: headers,
        });
        if (response.ok) {
            await getCommentsBySermonId(sermonId);
        } else {
            console.error("Failed to add comment:", response.status);
        }
    } catch (error) {
        console.error("Error adding comment:", error);
    }
};

const deleteCommentById = async (commentId, sermonId) => {
    try {
        const confirmed = confirm("Are you sure you want to delete this comment?");
        if (!confirmed) return;

        const response = await fetch(`${baseUrl}/comments/${commentId}`, {
            method: "DELETE",
            headers: headers,
        });
        if (response.ok) {
            await getCommentsBySermonId(sermonId);
        } else {
            console.error("Failed to delete comment:", response.status);
        }
    } catch (error) {
        console.error("Error deleting comment:", error);
    }
};

const updateCommentById = async (commentDto, sermonId) => {
    try {
        const response = await fetch(`${baseUrl}/comments/${commentDto.id}`, {
            method: "PUT",
            body: JSON.stringify(commentDto),
            headers: headers,
        });
        if (response.ok) {
            await getCommentsBySermonId(sermonId);
        } else {
            console.error("Failed to update comment:", response.status);
        }
    } catch (error) {
        console.error("Error updating comment:", error);
    }
};

// Function to create sermon cards
const createSermonCards = (array) => {
    sermonContainer.innerHTML = "";
    array.forEach((obj) => {
        let sermonCard = document.createElement("div");
        sermonCard.classList.add("m-2");
        sermonCard.innerHTML = `
      <div class="card d-flex" style="width: 18rem; height: 18rem;">
        <div class="card-body d-flex flex-column  justify-content-between" style="height: available">
          <p class="card-text">${obj.title}</p>
          <p class="card-text">${obj.scriptureReference}</p>
          <p class="card-text">${obj.description}</p>
          <p class="card-text">${obj.category}</p>
          <p class="card-text">${obj.date}</p>
          <div class="d-flex justify-content-between">
            <button class="btn btn-danger" onclick="handleSermonDelete(${obj.id})">Delete</button>
            <button onclick="getSermonById(${obj.id})" type="button" class="btn btn-primary" 
              data-bs-toggle="modal" data-bs-target="#sermon-edit-modal">
              Edit
            </button>
          </div>
        </div>
      </div>
    `;
        sermonContainer.append(sermonCard);
    });
};

const populateSermonModal = (data) => {
    sermonTitle.innerText = data.title;
    sermonScripture.innerText = data.scriptureReference;
    sermonDescription.innerText = data.description;
    sermonDate.innerText = data.date;
    categoryText.innerText = data.category.name;
    editSermonTitle.value = data.title;
    editSermonDescription.value = data.description;
    editSermonScripture.value = data.scriptureReference;
    editSermonDate.value = data.date;
    editCategoryName.value = data.category.id;
    updateSermonBtn.setAttribute("data-sermon-id", data.id);
};

// Event listener for submitting new sermons
const submitForm = document.getElementById("sermon-form");

const handleSubmit = async (e) => {
    e.preventDefault();
    const sermonInput = document.getElementById("sermon-input").value.trim();
    const sermonTitle = document.getElementById("sermon-title").value.trim();
    const sermonDescription = document.getElementById("sermon-input").value.trim();
    const sermonScripture = document.getElementById("sermon-scripture").value.trim();
    const sermonDate = document.getElementById("sermon-date").value.trim();

    if (!sermonInput || !sermonTitle || !sermonDescription || !sermonScripture || !sermonDate) {
        console.error("Invalid input. Please provide all the required fields.");
        return;
    }

    // Disable form inputs while submitting
    submitSermonForm.querySelectorAll("input, button").forEach((element) => {
        element.disabled = true;
    });

    const sermonDto = {
        body: sermonInput,
        title: sermonTitle,
        description: sermonDescription,
        scriptureReference: sermonScripture,
        date: sermonDate,
    };
    await addSermonByUser(sermonDto, userId);
    document.getElementById("sermon-title").value = "";
    document.getElementById("sermon-description").value = "";
    document.getElementById("sermon-scripture").value = "";
    document.getElementById("sermon-date").value = "";

    // Enable form inputs after submitting
    submitSermonForm.querySelectorAll("input, button").forEach((element) => {
        element.disabled = false;
    });
};

// Event listener for submitting new comments
const handleCommentSubmit = async (e, sermonId) => {
    e.preventDefault();
    const commentInput = e.target.querySelector("input");
    const commentBody = commentInput.value.trim();

    if (!commentBody) {
        console.error("Invalid comment. Please provide a non-empty comment.");
        return;
    }

    // Disable comment input while submitting
    commentInput.disabled = true;

    await addComment(commentBody, userId, sermonId);
    commentInput.value = "";

    // Enable comment input after submitting
    commentInput.disabled = false;
};

// Function to handle category checkbox change event
const handleCategoryCheckboxChange = () => {
    const categoryCheckbox = document.getElementById("category-checkbox");
    const categoryOptions = document.getElementById("category-options");
    const categoryInput = document.getElementById("category-input");

    if (categoryCheckbox.checked) {
        categoryOptions.style.display = "block";
        categoryInput.style.display = "none";
    } else {
        categoryOptions.style.display = "none";
        categoryInput.style.display = "block";
    }
};

// Attach event listener to category checkbox
const categoryCheckbox = document.getElementById("category-checkbox");
categoryCheckbox.addEventListener("change", handleCategoryCheckboxChange);

// Function to display API errors
const displayError = (message) => {
    const errorContainer = document.getElementById("error-container");
    errorContainer.textContent = message;
    errorContainer.style.display = "block";
};

// Function to populate the categories dynamically
async function populateCategories() {
    const categorySelect = document.getElementById("category-name");
    const editCategorySelect = document.getElementById("edit-category-name");

    // Static categories
    const staticCategories = [
        { id: 1, name: "holidays" },
        { id: 2, name: "special occasions" },
        { id: 3, name: "friendship" },
        { id: 4, name: "love" },
        { id: 5, name: "forgiveness" },
    ];

    // Populate category options in the sermon form
    staticCategories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });

    // Populate category options in the edit sermon modal
    staticCategories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        editCategorySelect.appendChild(option);
    });

    try {
        const response = await fetch("http://localhost:8080/api/v1/categories", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const categories = await response.json();

            // Populate category options in the sermon form
            categories.forEach((category) => {
                const option = document.createElement("option");
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });

            // Populate category options in the edit sermon modal
            categories.forEach((category) => {
                const option = document.createElement("option");
                option.value = category.id;
                option.textContent = category.name;
                editCategorySelect.appendChild(option);
            });
        } else {
            console.error("Failed to fetch categories");
        }
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}

// Call the populateCategories function to populate the category options
populateCategories();

// Fetch sermons on page load
getSermonsByUser(userId);

// Add event listener to the sermon form
submitForm.addEventListener("submit", handleSubmit);

// Event listener for edit sermon modal open
const sermonEditModal = document.getElementById("sermon-edit-modal");
sermonEditModal.addEventListener("show.bs.modal", function (event) {
    const button = event.relatedTarget;
    const sermonId = button.getAttribute("data-sermon-id", obj.id);
    getSermonById(sermonId);
});

// Event listener for edit sermon form submission
const editSermonForm = document.getElementById("edit-sermon-form");
editSermonForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const sermonId = updateSermonBtn.getAttribute("data-sermon-id", obj.id);
    const sermonDto = {
        title: editSermonTitle.value.trim(),
        description: editSermonDescription.value.trim(),
        scriptureReference: editSermonScripture.value.trim(),
        date: editSermonDate.value.trim(),
        category: {
            id: editCategoryName.value.trim(),
        },
    };
    updateSermonById(sermonDto, sermonId);
    const modal = bootstrap.Modal.getInstance(sermonEditModal);
    modal.hide();
});

// Event listener for delete sermon button
const deleteSermonButton = document.getElementById("delete-sermon-button");
deleteSermonButton.addEventListener("click", function () {
    const sermonId = updateSermonBtn.getAttribute("data-sermon-id");
    deleteSermonById(sermonId);
    const modal = bootstrap.Modal.getInstance(sermonEditModal);
    modal.hide();
});

// Event listener for comment form submission
const commentForms = document.querySelectorAll(".comment-form");
commentForms.forEach((form) => {
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const sermonId = this.getAttribute("data-sermon-id");
        handleCommentSubmit(event, sermonId);
    });
});

// Event listener for edit comment modal open
const commentEditModal = document.getElementById("comment-edit-modal");
commentEditModal.addEventListener("show.bs.modal", function (event) {
    const button = event.relatedTarget;
    const commentId = button.getAttribute("data-comment-id");
    const sermonId = button.getAttribute("data-sermon-id");
    getCommentById(commentId, sermonId);
});

// Event listener for edit comment form submission
const editCommentForm = document.getElementById("edit-comment-form");
editCommentForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const commentId = updateCommentBtn.getAttribute("data-comment-id");
    const sermonId = updateCommentBtn.getAttribute("data-sermon-id");
    const commentDto = {
        body: editCommentBody.value.trim(),
    };
    updateCommentById(commentDto, sermonId);
    const modal = bootstrap.Modal.getInstance(commentEditModal);
    modal.hide();
});

// Event listener for delete comment button
const deleteCommentButton = document.getElementById("delete-comment-button");
deleteCommentButton.addEventListener("click", function () {
    const commentId = updateCommentBtn.getAttribute("data-comment-id");
    const sermonId = updateCommentBtn.getAttribute("data-sermon-id");
    deleteCommentById(commentId, sermonId);
    const modal = bootstrap.Modal.getInstance(commentEditModal);
    modal.hide();
});



















// edited with Robert
// // Reads the login user's ID from the cookie
// const cookieArr = document.cookie.split("=");
// console.log(cookieArr);
// const userId = cookieArr[1];
//
// // Sermon DOM Elements
// const submitSermonForm = document.getElementById("sermon-form");
// const sermonContainer = document.getElementById("sermon-container");
//
// // Comment DOM Elements
// const submitCommentForm = document.getElementById("comment-form");
// const commentContainer = document.getElementById("comment-container");
//
// // Sermon Modal Elements
// const sermonBody = document.getElementById("sermon-body");
// const updateSermonBtn = document.getElementById("update-sermon-button");
//
// // Comment Modal Elements
// const commentBody = document.getElementById("comment-body");
// const updateCommentBtn = document.getElementById("update-comment-button");
//
// // Function to handle logout
// function handleLogout() {
//     let c = document.cookie.split(";");
//     for (let i in c) {
//         document.cookie =
//             /^[^=]+/.exec(c[i])[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
//     }
// }
//
// // Fetch sermons by user
// const baseUrl = "http://localhost:8080/api/v1/sermons";
// const headers = {
//     "Content-Type": "application/json",
// };
//
// const getSermonsByUser = async (userId) => {
//     try {
//         const response = await fetch(`${baseUrl}/user/${userId}`, {
//             method: "GET",
//             headers: headers,
//         });
//         if (response.ok) {
//             const data = await response.json();
//             createSermonCards(data);
//         } else {
//             console.error("Failed to fetch sermons:", response.status);
//         }
//     } catch (error) {
//         console.error("Error fetching sermons:", error);
//     }
// };
//
// const addSermonByUser = async (sermonDto, userId) => {
//     try {
//         const response = await fetch(`${baseUrl}/user/${userId}`, {
//             method: "POST",
//             body: JSON.stringify(sermonDto),
//             headers: headers,
//         });
//         if (response.ok) {
//             await getSermonsByUser(userId);
//         } else {
//             console.error("Failed to add sermon:", response.status);
//         }
//     } catch (error) {
//         console.error("Error adding sermon:", error);
//     }
// };
//
// const deleteSermonById = async (sermonId) => {
//     try {
//         const confirmed = confirm("Are you sure you want to delete this sermon?");
//         if (!confirmed) return;
//
//         const response = await fetch(`${baseUrl}/${sermonId}`, {
//             method: "DELETE",
//             headers: headers,
//         });
//         if (response.ok) {
//             // Handle success case if needed
//         } else {
//             console.error("Failed to delete sermon:", response.status);
//         }
//     } catch (error) {
//         console.error("Error deleting sermon:", error);
//     }
// };
//
// const updateSermonById = async (sermonDto, sermonId) => {
//     try {
//         const response = await fetch(`${baseUrl}/${sermonId}`, {
//             method: "PUT",
//             body: JSON.stringify(sermonDto),
//             headers: headers,
//         });
//         if (response.ok) {
//             await getSermonsByUser(userId);
//         } else {
//             console.error("Failed to update sermon:", response.status);
//         }
//     } catch (error) {
//         console.error("Error updating sermon:", error);
//     }
// };
//
// const getCommentsBySermonId = async (sermonId) => {
//     try {
//         const response = await fetch(`${baseUrl}/comments/users/${userId}/${sermonId}`, {
//             method: "GET",
//             headers: headers,
//         });
//         if (response.ok) {
//             const data = await response.json();
//             createCommentCards(data, sermonId);
//         } else {
//             console.error("Failed to fetch comments:", response.status);
//         }
//     } catch (error) {
//         console.error("Error fetching comments:", error);
//     }
// };
//
// const addComment = async (body, userId, sermonId) => {
//     try {
//         const response = await fetch(`${baseUrl}/comments/${userId}/${sermonId}`, {
//             method: "POST",
//             body: JSON.stringify({ body }),
//             headers: headers,
//         });
//         if (response.ok) {
//             await getCommentsBySermonId(sermonId);
//         } else {
//             console.error("Failed to add comment:", response.status);
//         }
//     } catch (error) {
//         console.error("Error adding comment:", error);
//     }
// };
//
// const deleteCommentById = async (commentId, sermonId) => {
//     try {
//         const confirmed = confirm("Are you sure you want to delete this comment?");
//         if (!confirmed) return;
//
//         const response = await fetch(`${baseUrl}/comments/${commentId}`, {
//             method: "DELETE",
//             headers: headers,
//         });
//         if (response.ok) {
//             await getCommentsBySermonId(sermonId);
//         } else {
//             console.error("Failed to delete comment:", response.status);
//         }
//     } catch (error) {
//         console.error("Error deleting comment:", error);
//     }
// };
//
// const updateCommentById = async (commentDto, sermonId) => {
//     try {
//         const response = await fetch(`${baseUrl}/comments/${commentDto.id}`, {
//             method: "PUT",
//             body: JSON.stringify(commentDto),
//             headers: headers,
//         });
//         if (response.ok) {
//             await getCommentsBySermonId(sermonId);
//         } else {
//             console.error("Failed to update comment:", response.status);
//         }
//     } catch (error) {
//         console.error("Error updating comment:", error);
//     }
// };
//
// // Function to create sermon cards
// const createSermonCards = (array) => {
//     sermonContainer.innerHTML = "";
//     array.forEach((obj) => {
//         let sermonCard = document.createElement("div");
//         sermonCard.classList.add("m-2");
//         sermonCard.innerHTML = `
//       <div class="card d-flex" style="width: 18rem; height: 18rem;">
//         <div class="card-body d-flex flex-column  justify-content-between" style="height: available">
//           <p class="card-text">${obj.title}</p>
//           <p class="card-text">${obj.scriptureReference}</p>
//           <p class="card-text">${obj.description}</p>
//           <!--p class="card-text"--><!--${obj.category.name.value}</p>-->
//           <p class="card-text">${obj.date}</p>
//           <div class="d-flex justify-content-between">
//             <button class="btn btn-danger" onclick="handleSermonDelete(${obj.id})">Delete</button>
//             <button onclick="getSermonById(${obj.id})" type="button" class="btn btn-primary"
//               data-bs-toggle="modal" data-bs-target="#sermon-edit-modal">
//               Edit
//             </button>
//           </div>
//         </div>
//       </div>
//     `;
//         sermonContainer.append(sermonCard);
//     });
// };
//
// const populateSermonModal = (data) => {
//     sermonBody.innerText = data.body;
//     sermonTitle.innerText = data.title;
//     sermonScripture.innerText = data.scripture;
//     sermonDescription.innerText = data.description;
//     sermonDate.innerText = data.date;
//     categoryText.innerText = data.category.name;
//     editSermonTitle.value = data.title;
//     editSermonDescription.value = data.description;
//     editSermonScripture.value = data.scripture;
//     editSermonDate.value = data.date;
//     editCategoryName.value = data.category.id;
//     updateSermonBtn.setAttribute("data-sermon-id", data.id);
// };
//
// // Event listener for submitting new sermons
// const submitForm = document.getElementById("sermon-form");
//
// const handleSubmit = async (e) => {
//     e.preventDefault();
//     const sermonInput = document.getElementById("sermon-input").value.trim();
//     const sermonTitle = document.getElementById("sermon-title").value.trim();
//     const sermonDescription = document.getElementById("sermon-description").value.trim();
//     const sermonScripture = document.getElementById("sermon-scripture").value.trim();
//     const sermonDate = document.getElementById("sermon-date").value.trim();
//
//     if (!sermonInput || !sermonTitle || !sermonDescription || !sermonScripture || !sermonDate) {
//         console.error("Invalid input. Please provide all the required fields.");
//         return;
//     }
//
//     // Disable form inputs while submitting
//     submitSermonForm.querySelectorAll("input, button").forEach((element) => {
//         element.disabled = true;
//     });
//
//     const sermonDto = {
//         body: sermonInput,
//         title: sermonTitle,
//         description: sermonDescription,
//         scriptureReference: sermonScripture,
//         date: sermonDate,
//     };
//     await addSermonByUser(sermonDto, userId);
//     document.getElementById("sermon-title").value = "";
//     document.getElementById("sermon-description").value = "";
//     document.getElementById("sermon-scripture").value = "";
//     document.getElementById("sermon-date").value = "";
//
//     // Enable form inputs after submitting
//     submitSermonForm.querySelectorAll("input, button").forEach((element) => {
//         element.disabled = false;
//     });
// };
//
// // Event listener for submitting new comments
// const handleCommentSubmit = async (e, sermonId) => {
//     e.preventDefault();
//     const commentInput = e.target.querySelector("input");
//     const commentBody = commentInput.value.trim();
//
//     if (!commentBody) {
//         console.error("Invalid comment. Please provide a non-empty comment.");
//         return;
//     }
//
//     // Disable comment input while submitting
//     commentInput.disabled = true;
//
//     await addComment(commentBody, userId, sermonId);
//     commentInput.value = "";
//
//     // Enable comment input after submitting
//     commentInput.disabled = false;
// };
//
// // Function to handle category checkbox change event
// const handleCategoryCheckboxChange = () => {
//     const categoryCheckbox = document.getElementById("category-checkbox");
//     const categoryOptions = document.getElementById("category-options");
//     const categoryInput = document.getElementById("category-input");
//
//     if (categoryCheckbox.checked) {
//         categoryOptions.style.display = "block";
//         categoryInput.style.display = "none";
//     } else {
//         categoryOptions.style.display = "none";
//         categoryInput.style.display = "block";
//     }
// };
//
// // Attach event listener to category checkbox
// const categoryCheckbox = document.getElementById("category-checkbox");
// categoryCheckbox.addEventListener("change", handleCategoryCheckboxChange);
//
// // Function to display API errors
// const displayError = (message) => {
//     const errorContainer = document.getElementById("error-container");
//     errorContainer.textContent = message;
//     errorContainer.style.display = "block";
// };
//
// // Function to populate the categories dynamically
// async function populateCategories() {
//     const categorySelect = document.getElementById("category-name");
//     const editCategorySelect = document.getElementById("edit-category-name");
//
//     // Static categories
//     const staticCategories = [
//         { id: 1, name: "holidays" },
//         { id: 2, name: "special occasions" },
//         { id: 3, name: "friendship" },
//         { id: 4, name: "love" },
//         { id: 5, name: "forgiveness" },
//     ];
//
//     // Populate category options in the sermon form
//     staticCategories.forEach((category) => {
//         const option = document.createElement("option");
//         option.value = category.id;
//         option.textContent = category.name;
//         categorySelect.appendChild(option);
//     });
//
//     // Populate category options in the edit sermon modal
//     staticCategories.forEach((category) => {
//         const option = document.createElement("option");
//         option.value = category.id;
//         option.textContent = category.name;
//         editCategorySelect.appendChild(option);
//     });
//
//     try {
//         const response = await fetch("http://localhost:8080/api/v1/categories", {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         });
//
//         if (response.ok) {
//             const categories = await response.json();
//
//             // Populate category options in the sermon form
//             categories.forEach((category) => {
//                 const option = document.createElement("option");
//                 option.value = category.id;
//                 option.textContent = category.name;
//                 categorySelect.appendChild(option);
//             });
//
//             // Populate category options in the edit sermon modal
//             categories.forEach((category) => {
//                 const option = document.createElement("option");
//                 option.value = category.id;
//                 option.textContent = category.name;
//                 editCategorySelect.appendChild(option);
//             });
//         } else {
//             console.error("Failed to fetch categories");
//         }
//     } catch (error) {
//         console.error("Error fetching categories:", error);
//     }
// }
//
// // Call the populateCategories function to populate the category options
// populateCategories();
//
// // Fetch sermons on page load
// getSermonsByUser(userId);
//
// // Add event listener to the sermon form
// submitForm.addEventListener("submit", handleSubmit);
//
// // Event listener for edit sermon modal open
// const sermonEditModal = document.getElementById("sermon-edit-modal");
// sermonEditModal.addEventListener("show.bs.modal", function (event) {
//     const button = event.relatedTarget;
//     const sermonId = button.getAttribute("data-sermon-id");
//     getSermonById(sermonId);
// });
//
// // Event listener for edit sermon form submission
// const editSermonForm = document.getElementById("edit-sermon-form");
// editSermonForm.addEventListener("submit", function (event) {
//     event.preventDefault();
//     const sermonId = updateSermonBtn.getAttribute("data-sermon-id");
//     const sermonDto = {
//         title: editSermonTitle.value.trim(),
//         description: editSermonDescription.value.trim(),
//         scriptureReference: editSermonScripture.value.trim(),
//         date: editSermonDate.value.trim(),
//         category: {
//             id: editCategoryName.value.trim(),
//         },
//     };
//     updateSermonById(sermonDto, sermonId);
//     const modal = bootstrap.Modal.getInstance(sermonEditModal);
//     modal.hide();
// });
//
// // Event listener for delete sermon button
// const deleteSermonButton = document.getElementById("delete-sermon-button");
// deleteSermonButton.addEventListener("click", function () {
//     const sermonId = updateSermonBtn.getAttribute("data-sermon-id");
//     deleteSermonById(sermonId);
//     const modal = bootstrap.Modal.getInstance(sermonEditModal);
//     modal.hide();
// });
//
// // Event listener for comment form submission
// const commentForms = document.querySelectorAll(".comment-form");
// commentForms.forEach((form) => {
//     form.addEventListener("submit", function (event) {
//         event.preventDefault();
//         const sermonId = this.getAttribute("data-sermon-id");
//         handleCommentSubmit(event, sermonId);
//     });
// });
//
// // Event listener for edit comment modal open
// const commentEditModal = document.getElementById("comment-edit-modal");
// commentEditModal.addEventListener("show.bs.modal", function (event) {
//     const button = event.relatedTarget;
//     const commentId = button.getAttribute("data-comment-id");
//     const sermonId = button.getAttribute("data-sermon-id");
//     getCommentById(commentId, sermonId);
// });
//
// // Event listener for edit comment form submission
// const editCommentForm = document.getElementById("edit-comment-form");
// editCommentForm.addEventListener("submit", function (event) {
//     event.preventDefault();
//     const commentId = updateCommentBtn.getAttribute("data-comment-id");
//     const sermonId = updateCommentBtn.getAttribute("data-sermon-id");
//     const commentDto = {
//         body: editCommentBody.value.trim(),
//     };
//     updateCommentById(commentDto, sermonId);
//     const modal = bootstrap.Modal.getInstance(commentEditModal);
//     modal.hide();
// });
//
// // Event listener for delete comment button
// const deleteCommentButton = document.getElementById("delete-comment-button");
// deleteCommentButton.addEventListener("click", function () {
//     const commentId = updateCommentBtn.getAttribute("data-comment-id");
//     const sermonId = updateCommentBtn.getAttribute("data-sermon-id");
//     deleteCommentById(commentId, sermonId);
//     const modal = bootstrap.Modal.getInstance(commentEditModal);
//     modal.hide();
// });
























// // Reads the login user's ID from the cookie
// const cookieArr = document.cookie.split("=");
// console.log(cookieArr);
// const userId = cookieArr[1];
//
// // Sermon DOM Elements
// const submitSermonForm = document.getElementById("sermon-form");
// const sermonContainer = document.getElementById("sermon-container");
//
// // Comment DOM Elements
// const submitCommentForm = document.getElementById("comment-form");
// const commentContainer = document.getElementById("comment-container");
//
// // Sermon Modal Elements
// let sermonBody;
// let updateSermonBtn;
//
// // Comment Modal Elements
// let commentBody;
// let updateCommentBtn;
//
// // Function to handle logout
// function handleLogout() {
//     let c = document.cookie.split(";");
//     for (let i in c) {
//         document.cookie =
//             /^[^=]+/.exec(c[i])[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
//     }
// }
//
// // Fetch sermons by user
// const baseUrl = "http://localhost:8080/api/v1/sermons";
// const headers = {
//     "Content-Type": "application/json",
// };
//
// const getSermonsByUser = async (userId) => {
//     try {
//         const response = await fetch(`${baseUrl}/user/${userId}`, {
//             method: "GET",
//             headers: headers,
//         });
//         if (response.status === 200) {
//             const data = await response.json();
//             createSermonCards(data);
//         } else {
//             console.error("Failed to fetch sermons:", response.status);
//         }
//     } catch (error) {
//         console.error("Error fetching sermons:", error);
//     }
// };
//
// const addSermonByUser = async (sermonDto, userId) => {
//     try {
//         const response = await fetch(`${baseUrl}/user/${userId}`, {
//             method: "POST",
//             body: JSON.stringify(sermonDto),
//             headers: headers,
//         });
//         if (response.status === 200) {
//             await getSermonsByUser(userId);
//         } else {
//             console.error("Failed to add sermon:", response.status);
//         }
//     } catch (error) {
//         console.error("Error adding sermon:", error);
//     }
// };
//
// const deleteSermonById = async (sermonId) => {
//     try {
//         const response = await fetch(`${baseUrl}/${sermonId}`, {
//             method: "DELETE",
//             headers: headers,
//         });
//         if (response.status === 200) {
//             // Handle success case if needed
//         } else {
//             console.error("Failed to delete sermon:", response.status);
//         }
//     } catch (error) {
//         console.error("Error deleting sermon:", error);
//     }
// };
//
// const updateSermonById = async (sermonDto, sermonId) => {
//     try {
//         const response = await fetch(`${baseUrl}/${sermonId}`, {
//             method: "PUT",
//             body: JSON.stringify(sermonDto),
//             headers: headers,
//         });
//         if (response.status === 200) {
//             await getSermonsByUser(userId);
//         } else {
//             console.error("Failed to update sermon:", response.status);
//         }
//     } catch (error) {
//         console.error("Error updating sermon:", error);
//     }
// };
//
// const getCommentsBySermonId = async (sermonId) => {
//     try {
//         const response = await fetch(`${baseUrl}/comments/users/${userId}/${sermonId}`, {
//             method: "GET",
//             headers: headers,
//         });
//         if (response.status === 200) {
//             const data = await response.json();
//             createCommentCards(data, sermonId);
//         } else {
//             console.error("Failed to fetch comments:", response.status);
//         }
//     } catch (error) {
//         console.error("Error fetching comments:", error);
//     }
// };
//
// const addComment = async (body, userId, sermonId) => {
//     try {
//         const response = await fetch(`${baseUrl}/comments/${userId}/${sermonId}`, {
//             method: "POST",
//             body: JSON.stringify({ body }),
//             headers: headers,
//         });
//         if (response.status === 200) {
//             await getCommentsBySermonId(sermonId);
//         } else {
//             console.error("Failed to add comment:", response.status);
//         }
//     } catch (error) {
//         console.error("Error adding comment:", error);
//     }
// };
//
// const deleteCommentById = async (commentId, sermonId) => {
//     try {
//         const response = await fetch(`${baseUrl}/comments/${commentId}`, {
//             method: "DELETE",
//             headers: headers,
//         });
//         if (response.status === 200) {
//             await getCommentsBySermonId(sermonId);
//         } else {
//             console.error("Failed to delete comment:", response.status);
//         }
//     } catch (error) {
//         console.error("Error deleting comment:", error);
//     }
// };
//
// const updateCommentById = async (commentDto, sermonId) => {
//     try {
//         const response = await fetch(`${baseUrl}/comments/${commentDto.id}`, {
//             method: "PUT",
//             body: JSON.stringify(commentDto),
//             headers: headers,
//         });
//         if (response.status === 200) {
//             await getCommentsBySermonId(sermonId);
//         } else {
//             console.error("Failed to update comment:", response.status);
//         }
//     } catch (error) {
//         console.error("Error updating comment:", error);
//     }
// };
//
// // Function to create sermon cards
// const createSermonCards = (array) => {
//     sermonContainer.innerHTML = "";
//     array.forEach((obj) => {
//         let sermonCard = document.createElement("div");
//         sermonCard.classList.add("m-2");
//         sermonCard.innerHTML = `
//       <div class="card d-flex" style="width: 18rem; height: 18rem;">
//         <div class="card-body d-flex flex-column  justify-content-between" style="height: available">
//           <p class="card-text">${obj.body}</p>
//           <p class="card-text">${obj.title}</p>
//           <p class="card-text">${obj.scripture}</p>
//           <p class="card-text">${obj.description}</p>
//           <p class="card-text">${obj.category}</p>
//           <p class="card-text">${obj.date}</p>
//           <div class="d-flex justify-content-between">
//             <button class="btn btn-danger" onclick="handleSermonDelete(${obj.id})">Delete</button>
//             <button onclick="getSermonById(${obj.id})" type="button" class="btn btn-primary"
//               data-bs-toggle="modal" data-bs-target="#sermon-edit-modal">
//               Edit
//             </button>
//           </div>
//         </div>
//       </div>
//     `;
//         sermonContainer.append(sermonCard);
//     });
// };
//
// const populateSermonModal = (data) => {
//     sermonBody.innerText = data.body;
//     sermonTitle.innerText = data.title;
//     sermonScripture.innerText = data.scripture;
//     sermonDescription.innerText = data.description;
//     sermonDate.innerText = data.date;
//     categoryText.innerText = data.category.name;
//     editSermonTitle.value = data.title;
//     editSermonDescription.value = data.description;
//     editSermonScripture.value = data.scripture;
//     editSermonDate.value = data.date;
//     editCategoryName.value = data.category.id;
//     updateSermonBtn.setAttribute("data-sermon-id", data.id);
// };
//
// // Event listener for submitting new sermons
// const submitForm = document.getElementById("sermon-form");
//
// const handleSubmit = async (e) => {
//     e.preventDefault();
//     const sermonInput = document.getElementById("sermon-input").value.trim();
//     const sermonTitle = document.getElementById("sermon-title").value.trim();
//     const sermonDescription = document.getElementById("sermon-description").value.trim();
//     const sermonScripture = document.getElementById("sermon-scripture").value.trim();
//     const sermonDate = document.getElementById("sermon-date").value.trim();
//
//     if (!sermonInput || !sermonTitle || !sermonDescription || !sermonScripture || !sermonDate) {
//         console.error("Invalid input. Please provide all the required fields.");
//         return;
//     }
//
//     const sermonDto = {
//         body: sermonInput,
//         title: sermonTitle,
//         description: sermonDescription,
//         scriptureReference: sermonScripture,
//         date: sermonDate,
//     };
//     await addSermonByUser(sermonDto, userId);
//     document.getElementById("sermon-title").value = "";
//     document.getElementById("sermon-description").value = "";
//     document.getElementById("sermon-scripture").value = "";
//     document.getElementById("sermon-date").value = "";
// };
//
// // Event listener for submitting new comments
// const handleCommentSubmit = async (e, sermonId) => {
//     e.preventDefault();
//     const commentInput = e.target.querySelector("input");
//     const commentBody = commentInput.value.trim();
//
//     if (!commentBody) {
//         console.error("Invalid comment. Please provide a non-empty comment.");
//         return;
//     }
//
//     await addComment(commentBody, userId, sermonId);
//     commentInput.value = "";
// };
//
// let sermonId;
//
// // Function to populate the categories dynamically
// async function populateCategories() {
//     const categorySelect = document.getElementById("category-name");
//     const editCategorySelect = document.getElementById("edit-category-name");
//
//     // Static categories
//     const staticCategories = [
//         { id: 1, name: "holidays" },
//         { id: 2, name: "special occasions" },
//         { id: 3, name: "friendship" },
//         { id: 4, name: "love" },
//         { id: 5, name: "forgiveness" },
//     ];
//
//     // Populate category options in the sermon form
//     staticCategories.forEach((category) => {
//         const option = document.createElement("option");
//         option.value = category.id;
//         option.textContent = category.name;
//         categorySelect.appendChild(option);
//     });
//
//     // Populate category options in the edit sermon modal
//     staticCategories.forEach((category) => {
//         const option = document.createElement("option");
//         option.value = category.id;
//         option.textContent = category.name;
//         editCategorySelect.appendChild(option);
//     });
//
//     try {
//         const response = await fetch("http://localhost:8080/api/v1/categories", {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         });
//
//         if (response.ok) {
//             const categories = await response.json();
//
//             // Populate category options in the sermon form
//             categories.forEach((category) => {
//                 const option = document.createElement("option");
//                 option.value = category.id;
//                 option.textContent = category.name;
//                 categorySelect.appendChild(option);
//             });
//
//             // Populate category options in the edit sermon modal
//             categories.forEach((category) => {
//                 const option = document.createElement("option");
//                 option.value = category.id;
//                 option.textContent = category.name;
//                 editCategorySelect.appendChild(option);
//             });
//         } else {
//             console.error("Failed to fetch categories");
//         }
//     } catch (error) {
//         console.error("Error fetching categories:", error);
//     }
// }
//
// // Call the populateCategories function to populate the category options
// populateCategories();
//
//     // Function to handle category checkbox change event
//     const handleCategoryCheckboxChange = () => {
//         const categoryCheckbox = document.getElementById("category-checkbox");
//         const categoryOptions = document.getElementById("category-options");
//         const categoryInput = document.getElementById("category-input");
//
//         if (categoryCheckbox.checked) {
//             categoryOptions.style.display = "block";
//             categoryInput.style.display = "none";
//         } else {
//             categoryOptions.style.display = "none";
//             categoryInput.style.display = "block";
//         }
//
//         // Attach event listener to category checkbox
//         categoryCheckbox.addEventListener("change", handleCategoryCheckboxChange);
//     };
//
//
// const createCommentCards = (data, sermonId) => {
//     const commentContainer = document.getElementById(`comment-container-${sermonId}`);
//     commentContainer.innerHTML = "";
//
//     if (Array.isArray(data)) {
//         data.forEach((comment) => {
//             const commentCard = document.createElement("div");
//             commentCard.classList.add("card", "mb-2");
//
//             const commentCardBody = document.createElement("div");
//             commentCardBody.classList.add("card-body");
//
//             const commentBody = document.createElement("p");
//             commentBody.classList.add("card-text");
//             commentBody.textContent = comment.body;
//
//             const deleteButton = document.createElement("button");
//             deleteButton.classList.add("btn", "btn-danger", "mx-2");
//             deleteButton.textContent = "Delete";
//             deleteButton.addEventListener("click", () =>
//                 deleteCommentById(comment.id, sermonId)
//             );
//
//             const editButton = document.createElement("button");
//             editButton.classList.add("btn", "btn-primary", "mx-2");
//             editButton.textContent = "Edit";
//             editButton.addEventListener("click", () =>
//                 showEditModal(comment.id, comment.body, sermonId)
//             );
//
//             commentCardBody.appendChild(commentBody);
//             commentCardBody.appendChild(deleteButton);
//             commentCardBody.appendChild(editButton);
//
//             commentCard.appendChild(commentCardBody);
//
//             commentContainer.appendChild(commentCard);
//         });
//     } else {
//         console.error("Invalid data format:", data);
//     }
// };
//
// function showEditModal(commentId, commentBody, sermonId) {
//     const editCommentModal = document.getElementById("comment-edit-modal");
//     const editCommentForm = document.getElementById("edit-comment-form");
//     const editCommentBody = document.getElementById("edit-comment-body");
//     const updateCommentButton = document.getElementById("update-comment-button");
//
//     editCommentBody.value = commentBody;
//
//     updateCommentButton.addEventListener("click", () =>
//         handleCommentUpdate(commentId, sermonId)
//     );
//
//     new bootstrap.Modal(editCommentModal).show();
// }
//
// const handleCommentUpdate = async (commentId, sermonId) => {
//     const editCommentBody = document.getElementById("edit-comment-body").value.trim();
//
//     if (!editCommentBody) {
//         console.error("Invalid comment. Please provide a non-empty comment.");
//         return;
//     }
//
//     try {
//         const commentDto = {
//             id: commentId,
//             body: editCommentBody,
//         };
//         await updateCommentById(commentDto, sermonId);
//         const editCommentModal = document.getElementById("comment-edit-modal");
//         const modalInstance = bootstrap.Modal.getInstance(editCommentModal);
//         modalInstance.hide();
//     } catch (error) {
//         console.error("Error updating comment:", error);
//     }
// };
//
// // Fetch sermons on page load
// getSermonsByUser(userId);
//
// // Add event listener to the sermon form
// submitForm.addEventListener("submit", handleSubmit);


















// // Cookie
// const cookieArr = document.cookie.split("=");
// const userId = cookieArr[1];
//
// // Sermon DOM Elements
// const submitSermonForm = document.getElementById("sermon-form");
// const sermonContainer = document.getElementById("sermon-container");
//
// // Comment DOM Elements
// const submitCommentForm = document.getElementById("comment-form");
// const commentContainer = document.getElementById("comment-container");
//
// // Sermon Modal Elements
// let sermonBody;
// let updateSermonBtn;
//
// // Comment Modal Elements
// let commentBody;
// let updateCommentBtn;
//
// const headers = {
//     "Content-Type": "application/json",
// };
//
// const baseUrl = "http://localhost:8080/api/v1/sermons/";
//
// let sermonId;
//
// // Function to populate the categories dynamically
// async function populateCategories() {
//     const categorySelect = document.getElementById("category-name");
//     const editCategorySelect = document.getElementById("edit-category-name");
//
//     // Static categories
//     const staticCategories = [
//         { id: 1, name: "holidays" },
//         { id: 2, name: "special occasions" },
//         { id: 3, name: "friendship" },
//         { id: 4, name: "love" },
//         { id: 5, name: "forgiveness" },
//     ];
//
//     // Populate category options in the sermon form
//     staticCategories.forEach((category) => {
//         const option = document.createElement("option");
//         option.value = category.id;
//         option.textContent = category.name;
//         categorySelect.appendChild(option);
//     });
//
//     // Populate category options in the edit sermon modal
//     staticCategories.forEach((category) => {
//         const option = document.createElement("option");
//         option.value = category.id;
//         option.textContent = category.name;
//         editCategorySelect.appendChild(option);
//     });
//
//     try {
//         const response = await fetch("http://localhost:8080/api/v1/categories", {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         });
//
//         if (response.ok) {
//             const categories = await response.json();
//
//             // Populate category options in the sermon form
//             categories.forEach((category) => {
//                 const option = document.createElement("option");
//                 option.value = category.id;
//                 option.textContent = category.name;
//                 categorySelect.appendChild(option);
//             });
//
//             // Populate category options in the edit sermon modal
//             categories.forEach((category) => {
//                 const option = document.createElement("option");
//                 option.value = category.id;
//                 option.textContent = category.name;
//                 editCategorySelect.appendChild(option);
//             });
//         } else {
//             console.error("Failed to fetch categories");
//         }
//     } catch (error) {
//         console.error("Error fetching categories:", error);
//     }
// }
//
// // Call the populateCategories function to populate the category options
// populateCategories();
//
// document.addEventListener("DOMContentLoaded", () => {
//     // Sermon Modal Elements
//     sermonBody = document.getElementById("sermon-body");
//     updateSermonBtn = document.getElementById("update-sermon-button");
//
//     // Comment Modal Elements
//     commentBody = document.getElementById("comment-body");
//     updateCommentBtn = document.getElementById("update-comment-button");
//
//     submitSermonForm.addEventListener("submit", handleSermonSubmit);
//
//     updateSermonBtn.addEventListener("click", (e) => {
//         e.preventDefault();
//         let sermonId = e.target.getAttribute("data-sermon-id");
//         handleSermonEdit(sermonId);
//     });
//
//     // Function to handle category checkbox change event
//     const handleCategoryCheckboxChange = () => {
//         const categoryCheckbox = document.getElementById("category-checkbox");
//         const categoryOptions = document.getElementById("category-options");
//         const categoryInput = document.getElementById("category-input");
//
//         if (categoryCheckbox.checked) {
//             categoryOptions.style.display = "block";
//             categoryInput.style.display = "none";
//         } else {
//             categoryOptions.style.display = "none";
//             categoryInput.style.display = "block";
//         }
//     };
//
//     // Attach event listener to category checkbox
//     const categoryCheckbox = document.getElementById("category-checkbox");
//     categoryCheckbox.addEventListener("change", handleCategoryCheckboxChange);
// });
//
// const handleSermonSubmit = async (e) => {
//     e.preventDefault();
//     let sermonTitle = document.getElementById("sermon-title").value;
//     let sermonDescription = document.getElementById("sermon-description").value;
//     let sermonScripture = document.getElementById("sermon-scripture").value;
//     let sermonDate = document.getElementById("sermon-date").value;
//     let sermonCategoryCheckbox = document.getElementById("category-checkbox");
//     let sermonCategory = sermonCategoryCheckbox.checked
//         ? document.getElementById("category-name").value
//         : document.getElementById("category-name-input").value;
//     let bodyObj = {
//         body: document.getElementById("sermon-input").value,
//         title: sermonTitle,
//         description: sermonDescription,
//         scripture: sermonScripture,
//         date: sermonDate,
//         category: {
//             id: sermonCategory,
//         },
//     };
//     await addSermon(bodyObj);
//     document.getElementById("sermon-input").value = "";
// };
//
// async function addSermon(obj) {
//     try {
//         const response = await fetch(`${baseUrl}user/${userId}`, {
//             method: "POST",
//             body: JSON.stringify(obj),
//             headers: headers,
//         });
//
//         if (response.status === 200) {
//             await getSermons(userId);
//         } else {
//             console.error("Failed to add sermon:", response.status);
//         }
//     } catch (error) {
//         console.error("Error adding sermon:", error);
//     }
// }
//
// async function getSermons(userId) {
//     try {
//         const response = await fetch(`${baseUrl}user/${userId}`, {
//             method: "GET",
//             headers: headers,
//         });
//
//         if (response.status === 200) {
//             const data = await response.json();
//             createSermonCards(data);
//         } else {
//             console.error("Failed to fetch sermons:", response.status);
//         }
//     } catch (error) {
//         console.error("Error fetching sermons:", error);
//     }
// }
//
// async function handleSermonDelete(sermonId) {
//     try {
//         const response = await fetch(`${baseUrl}${sermonId}`, {
//             method: "DELETE",
//             headers: headers,
//         });
//
//         if (response.status === 200) {
//             await getSermons(userId);
//         } else {
//             console.error("Failed to delete sermon:", response.status);
//         }
//     } catch (error) {
//         console.error("Error deleting sermon:", error);
//     }
// }
//
// async function getSermonById(sermonId) {
//     try {
//         const response = await fetch(`${baseUrl}${sermonId}`, {
//             method: "GET",
//             headers: headers,
//         });
//
//         if (response.status === 200) {
//             const data = await response.json();
//             populateSermonModal(data);
//         } else {
//             console.error("Failed to fetch sermon:", response.status);
//         }
//     } catch (error) {
//         console.error("Error fetching sermon:", error);
//     }
// }
//
// async function handleSermonEdit(sermonId) {
//     let sermonTitle = document.getElementById("edit-sermon-title").value;
//     let sermonDescription = document.getElementById("edit-sermon-description").value;
//     let sermonScripture = document.getElementById("edit-sermon-scripture").value;
//     let sermonDate = document.getElementById("edit-sermon-date").value;
//     let sermonCategory = document.getElementById("edit-category-name").value;
//
//     let bodyObj = {
//         id: sermonId,
//         body: sermonBody.innerText,
//         title: sermonTitle,
//         description: sermonDescription,
//         scripture: sermonScripture,
//         date: sermonDate,
//         category: {
//             id: sermonCategory,
//         },
//     };
//
//     try {
//         const response = await fetch(`${baseUrl}${sermonId}`, {
//             method: "PUT",
//             body: JSON.stringify(bodyObj),
//             headers: headers,
//         });
//
//         if (response.status === 200) {
//             await getSermons(userId);
//             $('#sermon-edit-modal').modal('hide');
//         } else {
//             console.error("Failed to update sermon:", response.status);
//         }
//     } catch (error) {
//         console.error("Error updating sermon:", error);
//     }
// }
//
// const createSermonCards = (array) => {
//     sermonContainer.innerHTML = "";
//     array.forEach((obj) => {
//         let sermonCard = document.createElement("div");
//         sermonCard.classList.add("m-2");
//         sermonCard.innerHTML = `
//       <div class="card d-flex" style="width: 18rem; height: 18rem;">
//         <div class="card-body d-flex flex-column  justify-content-between" style="height: available">
//           <p class="card-text">${obj.body}</p>
//           <p class="card-text">${obj.title}</p>
//           <p class="card-text">${obj.scripture}</p>
//           <p class="card-text">${obj.description}</p>
//           <p class="card-text">${obj.category}</p>
//           <p class="card-text">${obj.date}</p>
//           <div class="d-flex justify-content-between">
//             <button class="btn btn-danger" onclick="handleSermonDelete(${obj.id})">Delete</button>
//             <button onclick="getSermonById(${obj.id})" type="button" class="btn btn-primary"
//               data-bs-toggle="modal" data-bs-target="#sermon-edit-modal">
//               Edit
//             </button>
//           </div>
//         </div>
//       </div>
//     `;
//         sermonContainer.append(sermonCard);
//     });
// };
//
// const populateSermonModal = (data) => {
//     sermonBody.innerText = data.title;
//     sermonBody.innerText = data.description;
//     sermonBody.innerText = data.scripture;
//     sermonBody.innerText = data.date;
//     sermonBody.innerText = data.category.name;
//     sermonBody.innerText = data.category.id;
//
//     document.getElementById("edit-sermon-title").value = data.title;
//     document.getElementById("edit-sermon-description").value = data.description;
//     document.getElementById("edit-sermon-scripture").value = data.scripture;
//     document.getElementById("edit-sermon-date").value = data.date;
//     document.getElementById("category-name").innerText = data.category.name;
//     document.getElementById("edit-category-name").value = data.category.id;
//
//     updateSermonBtn.setAttribute("data-sermon-id", data.id);
// };
//
// getSermons(userId);
//
// const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     const commentFormBody = document.getElementById("comment-form-body");
//     const commentBody = commentFormBody.value.trim();
//     if (commentBody === "") {
//         return;
//     }
//     const comment = {
//         body: commentBody,
//         sermonId: sermonId,
//     };
//     await addComment(comment);
//     commentFormBody.value = "";
// };
//
// async function addComment(comment) {
//     try {
//         const response = await fetch(`${baseUrl}${sermonId}/comments`, {
//             method: "POST",
//             body: JSON.stringify(comment),
//             headers: headers,
//         });
//
//         if (response.status === 200) {
//             await getComments(sermonId);
//         } else {
//             console.error("Failed to add comment:", response.status);
//         }
//     } catch (error) {
//         console.error("Error adding comment:", error);
//     }
// }
//
// async function getComments(sermonId) {
//     try {
//         const response = await fetch(`${baseUrl}${sermonId}/comments`, {
//             method: "GET",
//             headers: headers,
//         });
//
//         if (response.status === 200) {
//             const data = await response.json();
//             createCommentCards(data);
//         } else {
//             console.error("Failed to fetch comments:", response.status);
//         }
//     } catch (error) {
//         console.error("Error fetching comments:", error);
//     }
// }
//
// async function handleCommentDelete(commentId) {
//     try {
//         const response = await fetch(`${baseUrl}${sermonId}/comments/${commentId}`, {
//             method: "DELETE",
//             headers: headers,
//         });
//
//         if (response.status === 200) {
//             await getComments(sermonId);
//         } else {
//             console.error("Failed to delete comment:", response.status);
//         }
//     } catch (error) {
//         console.error("Error deleting comment:", error);
//     }
// }
//
// async function handleCommentEdit(commentId, updatedCommentBody) {
//     try {
//         const response = await fetch(`${baseUrl}${sermonId}/comments/${commentId}`, {
//             method: "PUT",
//             body: JSON.stringify({ body: updatedCommentBody }),
//             headers: headers,
//         });
//
//         if (response.status === 200) {
//             await getComments(sermonId);
//         } else {
//             console.error("Failed to update comment:", response.status);
//         }
//     } catch (error) {
//         console.error("Error updating comment:", error);
//     }
// }
//
// const createCommentCards = (comments) => {
//     commentContainer.innerHTML = "";
//     comments.forEach((comment) => {
//         const commentCard = document.createElement("div");
//         commentCard.classList.add("card", "m-2");
//         commentCard.innerHTML = `
//       <div class="card-body d-flex justify-content-between">
//         <p class="card-text">${comment.body}</p>
//         <div>
//           <button class="btn btn-danger" onclick="handleCommentDelete(${comment.id})">Delete</button>
//           <button onclick="handleCommentEdit(${comment.id}, '${comment.body}')" type="button" class="btn btn-primary"
//             data-bs-toggle="modal" data-bs-target="#comment-edit-modal">
//             Edit
//           </button>
//         </div>
//       </div>
//     `;
//         commentContainer.append(commentCard);
//     });
// };
//
// submitCommentForm.addEventListener("submit", handleCommentSubmit);






































































































// new last code to partial work with dom errors
// Cookie
// const cookieArr = document.cookie.split("=");
// const userId = cookieArr[1];
//
// // Sermon DOM Elements
// const submitSermonForm = document.getElementById("sermon-form");
// const sermonContainer = document.getElementById("sermon-container");
//
// // Comment DOM Elements
// const submitCommentForm = document.getElementById("comment-form");
// const commentContainer = document.getElementById("comment-container");
//
// // Sermon Modal Elements
// let sermonBody = document.getElementById("sermon-body");
// let updateSermonBtn = document.getElementById("update-sermon-button");
//
// // Comment Modal Elements
// let commentBody = document.getElementById("comment-body");
// let updateCommentBtn = document.getElementById("update-comment-button");
//
// const headers = {
//     "Content-Type": "application/json",
// };
//
// const baseUrl = "http://localhost:8080/api/v1/sermons/";
//
// let sermonId;
// let categoryId;
//
// const handleSermonSubmit = async (e) => {
//     e.preventDefault();
//
//     const sermonTitle = document.getElementById("sermon-title").value;
//     const sermonDescription = document.getElementById("sermon-description").value;
//     const sermonScripture = document.getElementById("sermon-scripture").value;
//     const sermonDate = document.getElementById("sermon-date").value;
//     const sermonCategoryCheckbox = document.getElementById("category-checkbox");
//     const sermonCategory = sermonCategoryCheckbox.checked
//         ? document.getElementById("category-name").value
//         : document.getElementById("category-name-input").value;
//
//     const bodyObj = {
//         body: document.getElementById("sermon-input").value,
//         title: sermonTitle,
//         description: sermonDescription,
//         scripture: sermonScripture,
//         date: sermonDate,
//         category: {
//             id: sermonCategory,
//         },
//     };
//
//     await addSermon(bodyObj);
//     document.getElementById("sermon-input").value = "";
// };
//
// async function addSermon(obj) {
//     try {
//         const response = await fetch(`${baseUrl}user/${userId}`, {
//             method: "POST",
//             body: JSON.stringify(obj),
//             headers: headers,
//         });
//
//         if (response.ok) {
//             await getSermons(userId);
//         } else {
//             console.error("Failed to add sermon:", response.status);
//         }
//     } catch (error) {
//         console.error("Error adding sermon:", error);
//     }
// }
//
// async function getSermons(userId) {
//     try {
//         const response = await fetch(`${baseUrl}user/${userId}`, {
//             method: "GET",
//             headers: headers,
//         });
//
//         if (response.ok) {
//             const data = await response.json();
//             createSermonCards(data);
//         } else {
//             console.error("Failed to fetch sermons:", response.status);
//         }
//     } catch (error) {
//         console.error("Error fetching sermons:", error);
//     }
// }
//
// async function handleSermonDelete(sermonId) {
//     try {
//         const response = await fetch(`${baseUrl}${sermonId}`, {
//             method: "DELETE",
//             headers: headers,
//         });
//
//         if (response.ok) {
//             await getSermons(userId);
//         } else {
//             console.error("Failed to delete sermon:", response.status);
//         }
//     } catch (error) {
//         console.error("Error deleting sermon:", error);
//     }
// }
//
// async function getSermonById(sermonId) {
//     try {
//         const response = await fetch(`${baseUrl}${sermonId}`, {
//             method: "GET",
//             headers: headers,
//         });
//
//         if (response.ok) {
//             const data = await response.json();
//             populateSermonModal(data);
//         } else {
//             console.error("Failed to fetch sermon:", response.status);
//         }
//     } catch (error) {
//         console.error("Error fetching sermon:", error);
//     }
// }
//
// async function handleSermonEdit(sermonId) {
//     const sermonTitle = document.getElementById("edit-sermon-title").value;
//     const sermonDescription = document.getElementById("edit-sermon-description").value;
//     const sermonScripture = document.getElementById("edit-sermon-scripture").value;
//     const sermonDate = document.getElementById("edit-sermon-date").value;
//     const sermonCategory = document.getElementById("edit-category-name").value;
//
//     const bodyObj = {
//         id: sermonId,
//         body: sermonBody.innerText,
//         title: sermonTitle,
//         description: sermonDescription,
//         scripture: sermonScripture,
//         date: sermonDate,
//         category: {
//             id: sermonCategory,
//         },
//     };
//
//     try {
//         const response = await fetch(`${baseUrl}${sermonId}`, {
//             method: "PUT",
//             body: JSON.stringify(bodyObj),
//             headers: headers,
//         });
//
//         if (response.ok) {
//             await getSermons(userId);
//             $("#sermon-edit-modal").modal("hide");
//         } else {
//             console.error("Failed to update sermon:", response.status);
//         }
//     } catch (error) {
//         console.error("Error updating sermon:", error);
//     }
// }
//
// const createSermonCards = (array) => {
//     sermonContainer.innerHTML = "";
//     array.forEach((obj) => {
//         let sermonCard = document.createElement("div");
//         sermonCard.classList.add("m-2");
//         sermonCard.innerHTML = `
//       <div class="card d-flex" style="width: 18rem; height: 18rem;">
//         <div class="card-body d-flex flex-column  justify-content-between" style="height: available">
//           <p class="card-text">${obj.body}</p>
//           <p class="card-text">${obj.title}</p>
//           <p class="card-text">${obj.scripture}</p>
//           <p class="card-text">${obj.description}</p>
//           <p class="card-text">${obj.category}</p>
//           <p class="card-text">${obj.date}</p>
//           <div class="d-flex justify-content-between">
//             <button class="btn btn-danger" onclick="handleSermonDelete(${obj.id})">Delete</button>
//             <button onclick="getSermonById(${obj.id})" type="button" class="btn btn-primary"
//               data-bs-toggle="modal" data-bs-target="#sermon-edit-modal">
//               Edit
//             </button>
//           </div>
//         </div>
//       </div>
//     `;
//         sermonContainer.append(sermonCard);
//     });
// };
//
// const populateSermonModal = (data) => {
//     sermonBody.innerText = data.title;
//     sermonBody.innerText = data.description;
//     sermonBody.innerText = data.scripture;
//     sermonBody.innerText = data.date;
//     sermonBody.innerText = data.category.name;
//     sermonBody.innerText = data.category.id;
//
//     document.getElementById("edit-sermon-title").value = data.title;
//     document.getElementById("edit-sermon-description").value = data.description;
//     document.getElementById("edit-sermon-scripture").value = data.scripture;
//     document.getElementById("edit-sermon-date").value = data.date;
//     document.getElementById("category-name").innerText = data.category.name;
//     document.getElementById("edit-category-name").value = data.category.id;
//
//     updateSermonBtn.setAttribute("data-sermon-id", data.id);
// };
//
// async function populateCategories() {
//     const categorySelect = document.getElementById("category-name");
//     const editCategorySelect = document.getElementById("edit-category-name");
//
//     // Static categories
//     const staticCategories = [
//         { id: 1, name: "holidays" },
//         { id: 2, name: "special occasions" },
//         { id: 3, name: "friendship" },
//         { id: 4, name: "love" },
//         { id: 5, name: "forgiveness" },
//     ];
//
//     // Populate category options in the sermon form
//     staticCategories.forEach((category) => {
//         const option = document.createElement("option");
//         option.value = category.id;
//         option.textContent = category.name;
//         categorySelect.appendChild(option);
//     });
//
//     // Populate category options in the edit sermon modal
//     staticCategories.forEach((category) => {
//         const option = document.createElement("option");
//         option.value = category.id;
//         option.textContent = category.name;
//         editCategorySelect.appendChild(option);
//     });
//
//     // Fetch categories from the server
//     try {
//         const response = await fetch("http://localhost:8080/api/v1/categories", {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         });
//
//         if (response.ok) {
//             const categories = await response.json();
//
//             // Populate category options in the sermon form
//             categories.forEach((category) => {
//                 const option = document.createElement("option");
//                 option.value = category.id;
//                 option.textContent = category.name;
//                 categorySelect.appendChild(option);
//             });
//
//             // Populate category options in the edit sermon modal
//             categories.forEach((category) => {
//                 const option = document.createElement("option");
//                 option.value = category.id;
//                 option.textContent = category.name;
//                 editCategorySelect.appendChild(option);
//             });
//         } else {
//             console.error("Failed to fetch categories");
//         }
//     } catch (error) {
//         console.error("Error fetching categories:", error);
//     }
// }
//
// // Call the populateCategories function to populate the category options
// populateCategories();
//
// // Function to handle category checkbox change event
// const handleCategoryCheckboxChange = () => {
//     const categoryCheckbox = document.getElementById("category-checkbox");
//     const categoryOptions = document.getElementById("category-options");
//     const categoryInput = document.getElementById("category-input");
//
//     if (categoryCheckbox.checked) {
//         categoryOptions.style.display = "block";
//         categoryInput.style.display = "none";
//     } else {
//         categoryOptions.style.display = "none";
//         categoryInput.style.display = "block";
//     }
// };
//
// // Attach event listener to category checkbox
// const categoryCheckbox = document.getElementById("category-checkbox");
// categoryCheckbox.addEventListener("change", handleCategoryCheckboxChange);
//
// // Get all categories
// const getCategories = async () => {
//     try {
//         const response = await fetch(`${baseUrl}/categories`, {
//             method: "GET",
//         });
//
//         if (response.ok) {
//             return response.json();
//         } else {
//             throw new Error("Failed to get categories");
//         }
//     } catch (error) {
//         console.error(error);
//     }
// };
//
// // Add a new category
// const addCategory = async (category) => {
//     try {
//         const response = await fetch(`${baseUrl}/categories`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(category),
//         });
//
//         if (response.ok) {
//             return response.json();
//         } else {
//             throw new Error("Failed to add category");
//         }
//     } catch (error) {
//         console.error(error);
//     }
// };
//
// // Update a category
// const updateCategory = async (categoryId, updatedCategory) => {
//     try {
//         const response = await fetch(`${baseUrl}/categories/${categoryId}`, {
//             method: "PUT",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(updatedCategory),
//         });
//
//         if (response.ok) {
//             return response.json();
//         } else {
//             throw new Error("Failed to update category");
//         }
//     } catch (error) {
//         console.error(error);
//     }
// };
//
// // Delete a category
// const deleteCategory = async (categoryId) => {
//     try {
//         const response = await fetch(`${baseUrl}/categories/${categoryId}`, {
//             method: "DELETE",
//         });
//
//         if (response.ok) {
//             return response.json();
//         } else {
//             throw new Error("Failed to delete category");
//         }
//     } catch (error) {
//         console.error(error);
//     }
// };
//
// // Comment functions
//
// // Function to handle comment submit
// const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//
//     const commentFormBody = document.getElementById("comment-form-body");
//     const commentBody = commentFormBody.value.trim();
//
//     if (commentBody === "") {
//         return;
//     }
//
//     const comment = {
//         body: commentBody,
//         sermonId: sermonId,
//     };
//
//     await addComment(comment);
//     commentFormBody.value = "";
// };
//
// // Function to add a comment
// async function addComment(comment) {
//     try {
//         const response = await fetch(`${baseUrl}${sermonId}/comments`, {
//             method: "POST",
//             body: JSON.stringify(comment),
//             headers: headers,
//         });
//
//         if (response.ok) {
//             await getComments(sermonId);
//         } else {
//             console.error("Failed to add comment:", response.status);
//         }
//     } catch (error) {
//         console.error("Error adding comment:", error);
//     }
// }
//
// // Function to get comments for a sermon
// async function getComments(sermonId) {
//     try {
//         const response = await fetch(`${baseUrl}${sermonId}/comments`, {
//             method: "GET",
//             headers: headers,
//         });
//
//         if (response.ok) {
//             const data = await response.json();
//             createCommentCards(data);
//         } else {
//             console.error("Failed to fetch comments:", response.status);
//         }
//     } catch (error) {
//         console.error("Error fetching comments:", error);
//     }
// }
//
// // Function to handle comment delete
// async function handleCommentDelete(commentId) {
//     try {
//         const response = await fetch(`${baseUrl}${sermonId}/comments/${commentId}`, {
//             method: "DELETE",
//             headers: headers,
//         });
//
//         if (response.ok) {
//             await getComments(sermonId);
//         } else {
//             console.error("Failed to delete comment:", response.status);
//         }
//     } catch (error) {
//         console.error("Error deleting comment:", error);
//     }
// }
//
// // Function to handle comment edit
// async function handleCommentEdit(commentId, updatedCommentBody) {
//     try {
//         const response = await fetch(`${baseUrl}${sermonId}/comments/${commentId}`, {
//             method: "PUT",
//             body: JSON.stringify({ body: updatedCommentBody }),
//             headers: headers,
//         });
//
//         if (response.ok) {
//             await getComments(sermonId);
//         } else {
//             console.error("Failed to update comment:", response.status);
//         }
//     } catch (error) {
//         console.error("Error updating comment:", error);
//     }
// }
//
// // Function to create comment cards
// const createCommentCards = (comments) => {
//     commentContainer.innerHTML = "";
//     comments.forEach((comment) => {
//         const commentCard = document.createElement("div");
//         commentCard.classList.add("card", "m-2");
//
//         const cardBody = document.createElement("div");
//         cardBody.classList.add("card-body", "d-flex", "justify-content-between");
//
//         const commentText = document.createElement("p");
//         commentText.classList.add("card-text");
//         commentText.innerText = comment.body;
//
//         const deleteBtn = document.createElement("button");
//         deleteBtn.classList.add("btn", "btn-danger");
//         deleteBtn.innerText = "Delete";
//         deleteBtn.addEventListener("click", () => handleCommentDelete(comment.id));
//
//         const editBtn = document.createElement("button");
//         editBtn.classList.add("btn", "btn-primary");
//         editBtn.innerText = "Edit";
//         editBtn.setAttribute("data-bs-toggle", "modal");
//         editBtn.setAttribute("data-bs-target", "#comment-edit-modal");
//         editBtn.addEventListener("click", () => {
//             commentBody.value = comment.body;
//             updateCommentBtn.setAttribute("data-comment-id", comment.id);
//         });
//
//         cardBody.appendChild(commentText);
//         cardBody.appendChild(deleteBtn);
//         cardBody.appendChild(editBtn);
//
//         commentCard.appendChild(cardBody);
//         commentContainer.appendChild(commentCard);
//     });
// };
//
// // Add event listener to comment form submit
// submitCommentForm.addEventListener("submit", handleCommentSubmit);
//
// // Add event listener to update comment button
// updateCommentBtn.addEventListener("click", () => {
//     const commentId = updateCommentBtn.getAttribute("data-comment-id");
//     const updatedCommentBody = commentBody.value.trim();
//
//     if (updatedCommentBody === "") {
//         return;
//     }
//
//     handleCommentEdit(commentId, updatedCommentBody);
// });
//
// // Add event listener to delete comment button
// const deleteCommentBtn = document.getElementById("delete-comment-button");
// deleteCommentBtn.addEventListener("click", () => {
//     const commentId = updateCommentBtn.getAttribute("data-comment-id");
//     handleCommentDelete(commentId);
// });
//
// // Function to handle logout
// const handleLogout = () => {
//     document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//     window.location.href = "./login.html";
// };
//
// submitSermonForm.addEventListener("submit", handleSermonSubmit);
//
// updateSermonBtn.addEventListener("click", (e) => {
//     e.preventDefault();
//     const sermonId = e.target.getAttribute("data-sermon-id");
//     handleSermonEdit(sermonId);
// });
//
// // Function to handle category form submit
// const handleCategorySubmit = async (e) => {
//     e.preventDefault();
//
//     const categoryName = document.getElementById("category-name-input").value;
//
//     if (categoryName.trim() === "") {
//         return;
//     }
//
//     const category = {
//         name: categoryName,
//     };
//
//     await addCategory(category);
//     await getCategories();
//
//     document.getElementById("category-name-input").value = "";
// };
//
// // Function to handle category edit form submit
// const handleCategoryEditSubmit = async (e) => {
//     e.preventDefault();
//
//     const categoryId = document.getElementById("edit-category-id").value;
//     const categoryName = document.getElementById("edit-category-name-input").value;
//
//     if (categoryName.trim() === "") {
//         return;
//     }
//
//     const updatedCategory = {
//         name: categoryName,
//     };
//
//     await updateCategory(categoryId, updatedCategory);
//     await getCategories();
//
//     $("#category-edit-modal").modal("hide");
// };
//
// // Function to handle category delete
// const handleCategoryDelete = async (categoryId) => {
//     await deleteCategory(categoryId);
//     await getCategories();
// };
//
// // Add event listener to category form submit
// const categoryForm = document.getElementById("category-form");
// categoryForm.addEventListener("submit", handleCategorySubmit);
//
// // Add event listener to category edit form submit
// const categoryEditForm = document.getElementById("category-edit-form");
// categoryEditForm.addEventListener("submit", handleCategoryEditSubmit);
//
// // Function to populate the categories dynamically
// async function populateCategories() {
//     const categorySelect = document.getElementById("category-name");
//     const editCategorySelect = document.getElementById("edit-category-name");
//
//     try {
//         const categories = await getCategories();
//
//         // Clear existing options
//         categorySelect.innerHTML = "";
//         editCategorySelect.innerHTML = "";
//
//         categories.forEach((category) => {
//             const option = document.createElement("option");
//             option.value = category.id;
//             option.textContent = category.name;
//             categorySelect.appendChild(option);
//         });
//
//         categories.forEach((category) => {
//             const option = document.createElement("option");
//             option.value = category.id;
//             option.textContent = category.name;
//             editCategorySelect.appendChild(option);
//         });
//     } catch (error) {
//         console.error("Error fetching categories:", error);
//     }
// }
//
// // Call the populateCategories function to populate the category options
// populateCategories();


























// // Cookie
// const cookieArr = document.cookie.split("=");
// const userId = cookieArr[1];
//
// // Sermon DOM Elements
// const submitSermonForm = document.getElementById("sermon-form");
// const sermonContainer = document.getElementById("sermon-container");
//
// // Comment DOM Elements
// const submitCommentForm = document.getElementById("comment-form");
// const commentContainer = document.getElementById("comment-container");
//
// // Sermon Modal Elements
// let sermonBody = document.getElementById("sermon-body");
// let updateSermonBtn = document.getElementById("update-sermon-button");
//
// // Comment Modal Elements
// let commentBody = document.getElementById("comment-body");
// let updateCommentBtn = document.getElementById("update-comment-button");
//
// const headers = {
//     "Content-Type": "application/json",
// };
//
// const baseUrl = "http://localhost:8080/api/v1/sermons/";
//
// const handleSermonSubmit = async (e) => {
//     e.preventDefault();
//     let sermonTitle = document.getElementById("sermon-title").value;
//     let sermonDescription = document.getElementById("sermon-description").value;
//     let sermonScripture = document.getElementById("sermon-scripture").value;
//     let sermonDate = document.getElementById("sermon-date").value;
//     let sermonCategoryCheckbox = document.getElementById("category-checkbox");
//     let sermonCategory = sermonCategoryCheckbox.checked ? document.getElementById("category-name").value : document.getElementById("category-name-input").value;
//     let bodyObj = {
//         body: document.getElementById("sermon-input").value,
//         title: sermonTitle,
//         description: sermonDescription,
//         scripture: sermonScripture,
//         date: sermonDate,
//         category: {
//             id: sermonCategory,
//         },
//     };
//     await addSermon(bodyObj);
//     document.getElementById("sermon-input").value = "";
// };
//
// async function addSermon(obj) {
//     const response = await fetch(`${baseUrl}user/${userId}`, {
//         method: "POST",
//         body: JSON.stringify(obj),
//         headers: headers,
//     }).catch((err) => console.error(err.message));
//     if (response.status == 200) {
//         return getSermons(userId);
//     }
//         try {
//         const response = await fetch(`${baseUrl}/user/${userId}`, {
//             method: "POST",
//             body: JSON.stringify(sermonDto),
//             headers: headers,
//         });
//         if (response.status === 200) {
//             await getSermonsByUser(userId);
//         } else {
//             console.error("Failed to add sermon:", response.status);
//         }
//     } catch (error) {
//         console.error("Error adding sermon:", error);
//     }
// }
//
// async function getSermons(userId) {
//     await fetch(`${baseUrl}user/${userId}`, {
//         method: "GET",
//         headers: headers,
//     })
//         .then((response) => response.json())
//         .then((data) => createSermonCards(data))
//         .catch((err) => console.error(err));
// }
//
// async function handleSermonDelete(sermonId) {
//     await fetch(`${baseUrl}${sermonId}`, {
//         method: "DELETE",
//         headers: headers,
//     }).catch((err) => console.error(err));
//
//     return getSermons(userId);
// }
//
// async function getSermonById(sermonId) {
//     await fetch(`${baseUrl}${sermonId}`, {
//         method: "GET",
//         headers: headers,
//     })
//         .then((res) => res.json())
//         .then((data) => populateSermonModal(data))
//         .catch((err) => console.error(err.message));
// }
//
// async function handleSermonEdit(sermonId) {
//     let sermonTitle = document.getElementById("edit-sermon-title").value;
//     let sermonDescription = document.getElementById("edit-sermon-description").value;
//     let sermonScripture = document.getElementById("edit-sermon-scripture").value;
//     let sermonDate = document.getElementById("edit-sermon-date").value;
//     let sermonCategory = document.getElementById("edit-category-name").value;
//
//     let bodyObj = {
//         id: sermonId,
//         body: sermonBody,
//         title: sermonTitle,
//         description: sermonDescription,
//         scripture: sermonScripture,
//         date: sermonDate,
//         category: {
//             id: sermonCategory,
//         },
//     };
//
//     await fetch(`${baseUrl}${sermonId}`, {
//         method: "PUT",
//         body: JSON.stringify(bodyObj),
//         headers: headers,
//     }).catch((err) => console.error(err));
//
//     return getSermons(userId);
//
//     try {
//         const response = await fetch(`${baseUrl}${sermonId}`, {
//             method: "PUT",
//             body: JSON.stringify(bodyObj),
//             headers: headers,
//         });
//
//         if (response.status === 200) {
//             await getSermons(userId); // Fetch the updated sermons
//             $('#sermon-edit-modal').modal('hide'); // Hide the edit modal
//         } else {
//             console.error("Failed to update sermon:", response.status);
//         }
//     } catch (error) {
//         console.error("Error updating sermon:", error);
//     }
// }
//
// const createSermonCards = (array) => {
//     sermonContainer.innerHTML = "";
//     array.forEach((obj) => {
//         let sermonCard = document.createElement("div");
//         sermonCard.classList.add("m-2");
//         sermonCard.innerHTML = `
//       <div class="card d-flex" style="width: 18rem; height: 18rem;">
//         <div class="card-body d-flex flex-column  justify-content-between" style="height: available">
//         <p class="card-text">${obj.body}</p>
//         <p class="card-text">${obj.title}</p>
//         <p class="card-text">${obj.scripture}</p>
//         <p class="card-text">${obj.description}</p>
//           <p class="card-text">${obj.category}</p>
//           <p class="card-text">${obj.date}</p>
//           <div class="d-flex justify-content-between">
//             <button class="btn btn-danger" onclick="handleSermonDelete(${obj.id})">Delete</button>
//             <button onclick="getSermonById(${obj.id})" type="button" class="btn btn-primary"
//               data-bs-toggle="modal" data-bs-target="#sermon-edit-modal">
//               Edit
//             </button>
//           </div>
//         </div>
//       </div>
//     `;
//         sermonContainer.append(sermonCard);
//     });
// };
//
// const populateSermonModal = (obj) => {
//     sermonBody.innerText = "";
//     sermonBody.innerText = obj.body;
//
//     document.getElementById("edit-sermon-title").value = obj.title;
//     document.getElementById("edit-sermon-description").value = obj.description;
//     document.getElementById("edit-sermon-scripture").value = obj.scripture;
//     document.getElementById("edit-sermon-date").value = obj.date;
//     document.getElementById("category-name").innerText = obj.category.name;
//     document.getElementById("edit-category-name").value = obj.category.id;
//
//     updateSermonBtn.setAttribute("data-sermon-id", obj.id);
// };
//
// getSermons(userId);
//
// submitSermonForm.addEventListener("submit", handleSermonSubmit);
//
// updateSermonBtn.addEventListener("click", (e) => {
//     e.preventDefault();
//     let sermonId = e.target.getAttribute("data-sermon-id");
//     handleSermonEdit(sermonId);
// });
//
// // Function to populate the categories dynamically
// async function populateCategories() {
//     const categorySelect = document.getElementById("category-name");
//     const editCategorySelect = document.getElementById("edit-category-name");
//
//     // Static categories
//     const staticCategories = [
//         { id: 1, name: "holidays" },
//         { id: 2, name: "special occasions" },
//         { id: 3, name: "friendship" },
//         { id: 4, name: "love" },
//         { id: 5, name: "forgiveness" },
//     ];
//
//     // Populate category options in the sermon form
//     staticCategories.forEach((category) => {
//         const option = document.createElement("option");
//         option.value = category.id;
//         option.textContent = category.name;
//         categorySelect.appendChild(option);
//     });
//
//     // Populate category options in the edit sermon modal
//     staticCategories.forEach((category) => {
//         const option = document.createElement("option");
//         option.value = category.id;
//         option.textContent = category.name;
//         editCategorySelect.appendChild(option);
//     });
//
//     // Fetch categories from the server
//     const response = await fetch("http://localhost:8080/api/v1/categories", {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//         },
//     });
//
//     if (response.ok) {
//         const categories = await response.json();
//
//         // Populate category options in the sermon form
//         categories.forEach((category) => {
//             const option = document.createElement("option");
//             option.value = category.id;
//             option.textContent = category.name;
//             categorySelect.appendChild(option);
//         });
//
//         // Populate category options in the edit sermon modal
//         categories.forEach((category) => {
//             const option = document.createElement("option");
//             option.value = category.id;
//             option.textContent = category.name;
//             editCategorySelect.appendChild(option);
//         });
//     } else {
//         console.error("Failed to fetch categories");
//     }
// }
//
// // Call the populateCategories function to populate the category options
// populateCategories();
//
// // Function to handle category checkbox change event
// const handleCategoryCheckboxChange = () => {
//     const categoryCheckbox = document.getElementById("category-checkbox");
//     const categoryOptions = document.getElementById("category-options");
//     const categoryInput = document.getElementById("category-input");
//
//     if (categoryCheckbox.checked) {
//         categoryOptions.style.display = "block";
//         categoryInput.style.display = "none";
//     } else {
//         categoryOptions.style.display = "none";
//         categoryInput.style.display = "block";
//     }
// };
//
// // Attach event listener to category checkbox
// const categoryCheckbox = document.getElementById("category-checkbox");
// categoryCheckbox.addEventListener("change", handleCategoryCheckboxChange);
//
// // Comment
// const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     let sermonId = e.target.getAttribute("data-sermon-id");
//     let commentObj = {
//         body: document.getElementById("comment-form-body").value,
//         time_stamp: new Date().toISOString()
//     };
//     await addComment(sermonId, commentObj);
//     document.getElementById("comment-form-body").value = "";
// };
//
// async function addComment(sermonId, obj, userId) {
//     const response = await fetch(`${baseUrl}comments/${userId}/${sermonId}`, {
//         method: "POST",
//         body: JSON.stringify(obj),
//         headers: headers,
//     }).catch((err) => console.error(err.message));
//
//     if (response.status == 200) {
//         return getComments(userId);
//     }
//
//     try {
//         const response = await fetch(`${baseUrl}/comments/${userId}/${sermonId}`, {
//             method: "POST",
//             body: JSON.stringify({ body }),
//             headers: headers,
//         });
//         if (response.status === 200) {
//             await getCommentsBySermonId(sermonId);
//         } else {
//             console.error("Failed to add comment:", response.status);
//         }
//     } catch (error) {
//         console.error("Error adding comment:", error);
//     }
// }
//
// async function getComments(userId) {
//     await fetch(`${baseUrl}user/${userId}`, {
//         method: "GET",
//         headers: headers,
//     })
//         .then((response) => response.json())
//         .then((data) => createCommentCards(data))
//         .catch((err) => console.error(err));
// }
//
// async function handleCommentDelete(commentId) {
//     await fetch(`${baseUrl}${commentId}`, {
//         method: "DELETE",
//         headers: headers,
//     }).catch((err) => console.error(err));
//
//     return getComments(userId);
// }
//
// async function getCommentsById(sermonId) {
//     await fetch(`${baseUrl}${sermonId}`, {
//         method: "GET",
//         headers: headers,
//     })
//         .then((res) => res.json())
//         .then((data) => populateCommentModal(data))
//         .catch((err) => console.error(err.message));
// }
//
// async function handleCommentEdit(commentId) {
//     let bodyObj = {
//         id: commentId,
//         body: commentBody.value,
//     };
//
//     await fetch(`${baseUrl}${commentId}`, {
//         method: "PUT",
//         body: JSON.stringify(bodyObj),
//         headers: headers,
//     }).catch((err) => console.error(err));
//
//     return getComments(userId);
// }
//
// const createCommentCards = (array) => {
//     commentContainer.innerHTML = "";
//     array.forEach((obj) => {
//         let commentCard = document.createElement("div");
//         commentCard.classList.add("m-2");
//         commentCard.innerHTML = `
//       <div class="card d-flex" style="width: 18rem; height: 18rem;">
//         <div class="card-body d-flex flex-column  justify-content-between" style="height: available">
//           <p class="card-text">${obj.body}</p>
//           <div class="d-flex justify-content-between">
//             <button class="btn btn-danger" onclick="handleCommentDelete(${obj.id})">Delete</button>
//             <button onclick="getCommentsById(${obj.id})" type="button" class="btn btn-primary"
//               data-bs-toggle="modal" data-bs-target="#comment-edit-modal">
//               Edit
//             </button>
//           </div>
//         </div>
//       </div>
//     `;
//         commentContainer.append(commentCard);
//     });
// };
//
// const populateCommentModal = (obj) => {
//     commentBody.innerText = "";
//     commentBody.innerText = obj.body;
//     updateCommentBtn.setAttribute("data-comment-id", obj.id);
// };
//
// getComments(userId);
//
// submitCommentForm.addEventListener("submit", handleCommentSubmit);
//
// updateCommentBtn.addEventListener("click", (e) => {
//     let commentId = e.target.getAttribute("data-comment-id");
//     handleCommentEdit(commentId);
// });
//
// const getSermonsByUser = async (userId) => {
//     try {
//         const response = await fetch(`${baseUrl}/user/${userId}`, {
//             method: "GET",
//             headers: headers,
//         });
//         if (response.status === 200) {
//             const data = await response.json();
//             createSermonCards(data);
//         } else {
//             console.error("Failed to fetch sermons:", response.status);
//         }
//     } catch (error) {
//         console.error("Error fetching sermons:", error);
//     }
// };
//
// const addSermonByUser = async (sermonDto, userId) => {
//     try {
//         const response = await fetch(`${baseUrl}/user/${userId}`, {
//             method: "POST",
//             body: JSON.stringify(sermonDto),
//             headers: headers,
//         });
//         if (response.status === 200) {
//             await getSermonsByUser(userId);
//         } else {
//             console.error("Failed to add sermon:", response.status);
//         }
//     } catch (error) {
//         console.error("Error adding sermon:", error);
//     }
// };
//
// const deleteSermonById = async (sermonId) => {
//     try {
//         const response = await fetch(`${baseUrl}/${sermonId}`, {
//             method: "DELETE",
//             headers: headers,
//         });
//         if (response.status === 200) {
//
//         } else {
//             console.error("Failed to delete sermon:", response.status);
//         }
//     } catch (error) {
//         console.error("Error deleting sermon:", error);
//     }
// };
//
// const updateSermonById = async (sermonDto, sermonId) => {
//     try {
//         const response = await fetch(`${baseUrl}/${sermonId}`, {
//             method: "PUT",
//             body: JSON.stringify(sermonDto),
//             headers: headers,
//         });
//         if (response.status === 200) {
//             await getSermonsByUser(userId);
//         } else {
//             console.error("Failed to update sermon:", response.status);
//         }
//     } catch (error) {
//         console.error("Error updating sermon:", error);
//     }
// };
//
// const getCommentsBySermonId = async (sermonId) => {
//     try {
//         const response = await fetch(`${baseUrl}comments/users/${userId}/${sermonId}`, {
//             method: "GET",
//             headers: headers,
//         });
//         if (response.status === 200) {
//             const data = await response.json();
//             createCommentCards(data, sermonId);
//         } else {
//             console.error("Failed to fetch comments:", response.status);
//         }
//     } catch (error) {
//         console.error("Error fetching comments:", error);
//     }
// };
//
// const deleteCommentById = async (commentId, sermonId) => {
//     try {
//         const response = await fetch(`${baseUrl}comments/${commentId}`, {
//             method: "DELETE",
//             headers: headers,
//         });
//         if (response.status === 200) {
//             await getCommentsBySermonId(sermonId);
//         } else {
//             console.error("Failed to delete comment:", response.status);
//         }
//     } catch (error) {
//         console.error("Error deleting comment:", error);
//     }
// };
//
// const updateCommentById = async (commentDto, sermonId) => {
//     try {
//         const response = await fetch(`${baseUrl}comments/${commentDto.id}`, {
//             method: "PUT",
//             body: JSON.stringify(commentDto),
//             headers: headers,
//         });
//         if (response.status === 200) {
//             await getCommentsBySermonId(sermonId);
//         } else {
//             console.error("Failed to update comment:", response.status);
//         }
//     } catch (error) {
//         console.error("Error updating comment:", error);
//     }
// };
//
// function handleLogout() {
//     let c = document.cookie.split(";");
//     for (let i in c) {
//         document.cookie = /^[^=]+/.exec(c[i])[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
//     }
// }


// // Reads the login user's ID from the cookie
// const cookieArr = document.cookie.split("=");
// console.log(cookieArr);
// const userId = cookieArr[1];
//
// // Function to handle logout
// function handleLogout() {
//     let c = document.cookie.split(";");
//     for (let i in c) {
//         document.cookie =
//             /^[^=]+/.exec(c[i])[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
//     }
// }
//
// // Fetch sermons by user
// const baseUrl = "http://localhost:8080/api/v1/sermons";
// const headers = {
//     "Content-Type": "application/json",
// };
//
// const getSermonsByUser = async (userId) => {
//     try {
//         const response = await fetch(`${baseUrl}/user/${userId}`, {
//             method: "GET",
//             headers: headers,
//         });
//         if (response.status === 200) {
//             const data = await response.json();
//             createSermonCards(data);
//         } else {
//             console.error("Failed to fetch sermons:", response.status);
//         }
//     } catch (error) {
//         console.error("Error fetching sermons:", error);
//     }
// };
//
// const addSermonByUser = async (sermonDto, userId) => {
//     try {
//         const response = await fetch(`${baseUrl}/user/${userId}`, {
//             method: "POST",
//             body: JSON.stringify(sermonDto),
//             headers: headers,
//         });
//         if (response.status === 200) {
//             await getSermonsByUser(userId);
//         } else {
//             console.error("Failed to add sermon:", response.status);
//         }
//     } catch (error) {
//         console.error("Error adding sermon:", error);
//     }
// };
//
// const deleteSermonById = async (sermonId) => {
//     try {
//         const response = await fetch(`${baseUrl}/${sermonId}`, {
//             method: "DELETE",
//             headers: headers,
//         });
//         if (response.status === 200) {
//
//         } else {
//             console.error("Failed to delete sermon:", response.status);
//         }
//     } catch (error) {
//         console.error("Error deleting sermon:", error);
//     }
// };
//
// const updateSermonById = async (sermonDto, sermonId) => {
//     try {
//         const response = await fetch(`${baseUrl}/${sermonId}`, {
//             method: "PUT",
//             body: JSON.stringify(sermonDto),
//             headers: headers,
//         });
//         if (response.status === 200) {
//             await getSermonsByUser(userId);
//         } else {
//             console.error("Failed to update sermon:", response.status);
//         }
//     } catch (error) {
//         console.error("Error updating sermon:", error);
//     }
// };
//
// const getCommentsBySermonId = async (sermonId) => {
//     try {
//         const response = await fetch(`${baseUrl}/comments/users/${userId}/${sermonId}`, {
//             method: "GET",
//             headers: headers,
//         });
//         if (response.status === 200) {
//             const data = await response.json();
//             createCommentCards(data, sermonId);
//         } else {
//             console.error("Failed to fetch comments:", response.status);
//         }
//     } catch (error) {
//         console.error("Error fetching comments:", error);
//     }
// };
//
// const addComment = async (body, userId, sermonId) => {
//     try {
//         const response = await fetch(`${baseUrl}/comments/${userId}/${sermonId}`, {
//             method: "POST",
//             body: JSON.stringify({ body }),
//             headers: headers,
//         });
//         if (response.status === 200) {
//             await getCommentsBySermonId(sermonId);
//         } else {
//             console.error("Failed to add comment:", response.status);
//         }
//     } catch (error) {
//         console.error("Error adding comment:", error);
//     }
// };
//
// const deleteCommentById = async (commentId, sermonId) => {
//     try {
//         const response = await fetch(`${baseUrl}/comments/${commentId}`, {
//             method: "DELETE",
//             headers: headers,
//         });
//         if (response.status === 200) {
//             await getCommentsBySermonId(sermonId);
//         } else {
//             console.error("Failed to delete comment:", response.status);
//         }
//     } catch (error) {
//         console.error("Error deleting comment:", error);
//     }
// };
//
// const updateCommentById = async (commentDto, sermonId) => {
//     try {
//         const response = await fetch(`${baseUrl}/comments/${commentDto.id}`, {
//             method: "PUT",
//             body: JSON.stringify(commentDto),
//             headers: headers,
//         });
//         if (response.status === 200) {
//             await getCommentsBySermonId(sermonId);
//         } else {
//             console.error("Failed to update comment:", response.status);
//         }
//     } catch (error) {
//         console.error("Error updating comment:", error);
//     }
// };
//
// // Function to create sermon cards
// function createSermonCards(data) {
//     const sermonContainer = document.getElementById("sermon-container");
//     sermonContainer.innerHTML = "";
//
//     if (Array.isArray(data)) {
//         data.forEach((sermon) => {
//             const card = document.createElement("div");
//             card.classList.add("card");
//
//             const cardBody = document.createElement("div");
//             cardBody.classList.add("card-body");
//
//             const sermonTitle = document.createElement("h5");
//             sermonTitle.classList.add("card-title");
//             sermonTitle.textContent = sermon.title;
//
//             const sermonDescription = document.createElement("p");
//             sermonDescription.classList.add("card-text");
//             sermonDescription.textContent = sermon.description;
//
//             const sermonScripture = document.createElement("p");
//             sermonScripture.classList.add("card-text");
//             sermonScripture.textContent = sermon.scriptureReference;
//
//             const sermonDate = document.createElement("p");
//             sermonDate.classList.add("card-text");
//             sermonDate.textContent = sermon.date;
//
//             const editButton = document.createElement("button");
//             editButton.type = "button";
//             editButton.onclick = `getSermonById(${sermon.id})`;
//             editButton.classList.add("btn", "btn-danger");
//
//             const deleteButton = document.createElement("button")
//             deleteButton.type = "button";
//             deleteButton.onclick = `handleDelete(${sermon.id})`;
//             deleteButton.classList.add("btn", "btn-danger");
//
//             // Comment Form
//             const commentForm = document.createElement("form");
//             commentForm.id = `comment-form-${sermon.id}`;
//             const commentInput = document.createElement("input");
//             commentInput.type = "text";
//             commentInput.placeholder = "Enter your comment";
//             commentInput.classList.add("form-control");
//             const commentButton = document.createElement("button");
//             commentButton.type = "submit";
//             commentButton.classList.add("btn", "btn-primary");
//             commentButton.textContent = "Submit Comment";
//
//             commentForm.appendChild(commentInput);
//             commentForm.appendChild(commentButton);
//
//             // Comment Container
//             const commentContainer = document.createElement("div");
//             commentContainer.id = `comment-container-${sermon.id}`;
//
//             cardBody.appendChild(sermonTitle);
//             cardBody.appendChild(sermonDescription);
//             cardBody.appendChild(sermonScripture);
//             cardBody.appendChild(sermonDate);
//             cardBody.appendChild(commentForm);
//             cardBody.appendChild(commentContainer);
//
//             card.appendChild(cardBody);
//
//             sermonContainer.appendChild(card);
//
//             // Add event listener to comment form
//             commentForm.addEventListener("submit", (e) =>
//                 handleCommentSubmit(e, sermon.id)
//             );
//
//             // Fetch comments for the sermon
//             getCommentsBySermonId(sermon.id);
//         });
//     } else {
//         console.error("Invalid data format:", data);
//     }
// }
//
// // Event listener for submitting new sermons
// const submitForm = document.getElementById("sermon-form");
//
// const handleSubmit = async (e) => {
//     e.preventDefault();
//     let bodyObj = {
//         body: document.getElementById("sermon-input").value,
//         title: document.getElementById("sermon-title").value,
//         description: document.getElementById("sermon-description").value,
//         scriptureReference: document.getElementById("sermon-scripture").value,
//         date: document.getElementById("sermon-date").value,
//     };
//     await addSermonByUser(bodyObj, userId);
//     document.getElementById("sermon-title").value = "";
//     document.getElementById("sermon-description").value = "";
//     document.getElementById("sermon-scripture").value = "";
//     document.getElementById("sermon-date").value = "";
// };
//
// // Event listener for submitting new comments
// async function handleCommentSubmit(e, sermonId) {
//     e.preventDefault();
//     const commentInput = e.target.querySelector("input");
//     const commentBody = commentInput.value.trim();
//     if (commentBody === "") {
//         return;
//     }
//     await addComment(commentBody, userId, sermonId);
//     commentInput.value = "";
// }
//
// const createCommentCards = (data, sermonId) => {
//     const commentContainer = document.getElementById(`comment-container-${sermonId}`);
//     commentContainer.innerHTML = "";
//
//     if (Array.isArray(data)) {
//         data.forEach((comment) => {
//             const commentCard = document.createElement("div");
//             commentCard.classList.add("card", "mb-2");
//
//             const commentCardBody = document.createElement("div");
//             commentCardBody.classList.add("card-body");
//
//             const commentBody = document.createElement("p");
//             commentBody.classList.add("card-text");
//             commentBody.textContent = comment.body;
//
//             const deleteButton = document.createElement("button");
//             deleteButton.classList.add("btn", "btn-danger", "mx-2");
//             deleteButton.textContent = "Delete";
//             deleteButton.addEventListener("click", () =>
//                 deleteCommentById(comment.id, sermonId)
//             );
//
//             const editButton = document.createElement("button");
//             editButton.classList.add("btn", "btn-primary", "mx-2");
//             editButton.textContent = "Edit";
//             editButton.addEventListener("click", () =>
//                 showEditModal(comment.id, comment.body, sermonId)
//             );
//
//             commentCardBody.appendChild(commentBody);
//             commentCardBody.appendChild(deleteButton);
//             commentCardBody.appendChild(editButton);
//
//             commentCard.appendChild(commentCardBody);
//
//             commentContainer.appendChild(commentCard);
//         });
//     } else {
//         console.error("Invalid data format:", data);
//     }
// };
//
// function showEditModal(commentId, commentBody, sermonId) {
//     const editCommentModal = document.getElementById("comment-edit-modal");
//     const editCommentForm = document.getElementById("edit-comment-form");
//     const editCommentBody = document.getElementById("edit-comment-body");
//     const updateCommentButton = document.getElementById("update-comment-button");
//
//     editCommentBody.value = commentBody;
//
//     updateCommentButton.addEventListener("click", () =>
//         handleCommentUpdate(commentId, sermonId)
//     );
//
//     new bootstrap.Modal(editCommentModal).show();
// }
//
// const handleCommentUpdate = async (commentId, sermonId) => {
//     const editCommentBody = document.getElementById("edit-comment-body").value.trim();
//
//     if (editCommentBody === "") {
//         return;
//     }
//
//     try {
//         const commentDto = {
//             id: commentId,
//             body: editCommentBody,
//         };
//         await updateCommentById(commentDto, sermonId);
//         const editCommentModal = document.getElementById("comment-edit-modal");
//         const modalInstance = bootstrap.Modal.getInstance(editCommentModal);
//         modalInstance.hide();
//     } catch (error) {
//         console.error("Error updating comment:", error);
//     }
// };
//
// // Fetch sermons on page load
// getSermonsByUser(userId);
//
// // Add event listener to the sermon form
// submitForm.addEventListener("submit", handleSubmit);





















// // Reads the login user's ID from the cookie
// const cookieArr = document.cookie.split("=");
// console.log(cookieArr);
// const userId = cookieArr[1];
//
// // Function to handle logout
// function handleLogout() {
//     let c = document.cookie.split(";");
//     for (let i in c) {
//         document.cookie =
//             /^[^=]+/.exec(c[i])[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
//     }
// }
//
// // Fetch sermons by user
// const baseUrl = "http://localhost:8080/api/v1/sermons";
//
// const headers = {
//     "Content-Type": "application/json",
// };
//
// const getSermonsByUser = async (userId) => {
//     await fetch(`${baseUrl}/user/${userId}`, {
//         method: "GET",
//         headers: headers,
//     })
//         .then((response) => response.json())
//         .then((data) => createSermonCards(data))
//         .catch((err) => console.error(err));
// };
//
// const addSermonByUser = async (sermonDto, userId) => {
//     const response = await fetch(`${baseUrl}/user/${userId}`, {
//         method: "POST",
//         body: JSON.stringify(sermonDto),
//         headers: headers,
//     }).catch((err) => console.error(err.message));
//
//     if (response.status === 200) {
//         return getSermonsByUser(userId);
//     }
// };
//
// const deleteSermonById = async (sermonId) => {
//     const response = await fetch(`${baseUrl}/${sermonId}`, {
//         method: "DELETE",
//         headers: headers,
//     }).catch((err) => console.error(err.message));
//
//     if (response.status === 200) {
//         return;
//     }
// };
//
// const updateSermonById = async (sermonDto, sermonId) => {
//     const response = await fetch(`${baseUrl}/${sermonId}`, {
//         method: "PUT",
//         body: JSON.stringify(sermonDto),
//         headers: headers,
//     }).catch((err) => console.error(err.message));
//
//     if (response.status === 200) {
//         return;
//     }
// };
//
// // Function to create sermon cards
// function createSermonCards(data) {
//     const sermonContainer = document.getElementById("sermon-container");
//     sermonContainer.innerHTML = "";
//
//     data.forEach((sermon) => {
//         const card = document.createElement("div");
//         card.classList.add("card");
//
//         const cardBody = document.createElement("div");
//         cardBody.classList.add("card-body");
//
//         const sermonTitle = document.createElement("h5");
//         sermonTitle.classList.add("card-title");
//         sermonTitle.textContent = sermon.title;
//
//         const sermonDescription = document.createElement("p");
//         sermonDescription.classList.add("card-text");
//         sermonDescription.textContent = sermon.description;
//
//         const sermonScripture = document.createElement("p");
//         sermonScripture.classList.add("card-text");
//         sermonScripture.textContent = sermon.scriptureReference;
//
//         const sermonDateInput = document.createElement("input");
//         sermonDateInput.classList.add("form-control");
//         sermonDateInput.value = sermon.date;
//         sermonDateInput.addEventListener("click", () => openSermonEditModal(sermon));
//
//         const commentForm = document.createElement("form");
//         commentForm.id = `comment-form-${sermon.id}`;
//         const commentInput = document.createElement("input");
//         commentInput.type = "text";
//         commentInput.placeholder = "Enter your comment";
//         commentInput.classList.add("form-control");
//         const commentButton = document.createElement("button");
//         commentButton.type = "submit";
//         commentButton.classList.add("btn", "btn-primary");
//         commentButton.textContent = "Submit Comment";
//
//         commentForm.appendChild(commentInput);
//         commentForm.appendChild(commentButton);
//
//         const commentContainer = document.createElement("div");
//         commentContainer.id = `comment-container-${sermon.id}`;
//
//         cardBody.appendChild(sermonTitle);
//         cardBody.appendChild(sermonDescription);
//         cardBody.appendChild(sermonScripture);
//         cardBody.appendChild(sermonDateInput);
//         cardBody.appendChild(commentForm);
//         cardBody.appendChild(commentContainer);
//
//         card.appendChild(cardBody);
//
//         sermonContainer.appendChild(card);
//
//         commentForm.addEventListener("submit", (e) =>
//             handleCommentSubmit(e, sermon.id, sermon.date)
//         );
//     });
// }
//
// function openSermonEditModal(sermon) {
//     const editSermonModal = document.getElementById("sermon-edit-modal");
//     const editSermonForm = document.getElementById("edit-sermon-form");
//     const editSermonTitle = document.getElementById("edit-sermon-title");
//     const editSermonDescription = document.getElementById("edit-sermon-description");
//     const editSermonInput = document.getElementById("edit-sermon-input");
//     const editSermonScripture = document.getElementById("edit-sermon-scripture");
//     const editSermonDate = document.getElementById("edit-sermon-date");
//
//     editSermonTitle.value = sermon.title;
//     editSermonDescription.value = sermon.description;
//     editSermonInput.value = sermon.input;
//     editSermonScripture.value = sermon.scriptureReference;
//     editSermonDate.value = sermon.date;
//
//     new bootstrap.Modal(editSermonModal).show();
// }
//
// const handleSubmit = async (e) => {
//     e.preventDefault();
//     let bodyObj = {
//         body: document.getElementById("sermon-input").value,
//         title: document.getElementById("sermon-title").value,
//         description: document.getElementById("sermon-description").value,
//         scriptureReference: document.getElementById("sermon-scripture").value,
//         date: document.getElementById("sermon-date").value,
//     };
//     await addSermonByUser(bodyObj, userId);
//     document.getElementById("sermon-title").value = "";
//     document.getElementById("sermon-description").value = "";
//     document.getElementById("sermon-scripture").value = "";
//     document.getElementById("sermon-date").value = "";
// };
//
// async function handleCommentSubmit(e, sermonId, sermonDate) {
//     e.preventDefault();
//     const commentInput = e.target.querySelector("input");
//     const commentBody = commentInput.value.trim();
//     if (commentBody === "") {
//         return;
//     }
//     await addComment(commentBody, sermonId, sermonDate);
//     commentInput.value = "";
// }
//
// const addComment = async (body, sermonId, sermonDate) => {
//     const response = await fetch(`${baseUrl}/comments/${userId}/${sermonId}`, {
//         method: "POST",
//         body: JSON.stringify({ body, date: sermonDate }),
//         headers: headers,
//     }).catch((err) => console.error(err.message));
//
//     if (response.status === 200) {
//         return getComments(sermonId);
//     }
// };
//
// const getComments = async (sermonId) => {
//     await fetch(`${baseUrl}/comments/sermon/${sermonId}`, {
//         method: "GET",
//         headers: headers,
//     })
//         .then((response) => response.json())
//         .then((data) => createCommentCards(data, sermonId))
//         .catch((err) => console.error(err));
// };
//
// function createCommentCards(data, sermonId) {
//     const commentContainer = document.getElementById(`comment-container-${sermonId}`);
//     commentContainer.innerHTML = "";
//
//     data.forEach((comment) => {
//         const commentCard = document.createElement("div");
//         commentCard.classList.add("card", "mb-2");
//
//         const commentCardBody = document.createElement("div");
//         commentCardBody.classList.add("card-body");
//
//         const commentBody = document.createElement("p");
//         commentBody.classList.add("card-text");
//         commentBody.textContent = comment.body;
//
//         const deleteButton = document.createElement("button");
//         deleteButton.classList.add("btn", "btn-danger", "mx-2");
//         deleteButton.textContent = "Delete";
//         deleteButton.addEventListener("click", () =>
//             deleteComment(comment.id, sermonId)
//         );
//
//         const editButton = document.createElement("button");
//         editButton.classList.add("btn", "btn-primary", "mx-2");
//         editButton.textContent = "Edit";
//         editButton.addEventListener("click", () =>
//             showEditModal(comment.id, comment.body, sermonId)
//         );
//
//         commentCardBody.appendChild(commentBody);
//         commentCardBody.appendChild(deleteButton);
//         commentCardBody.appendChild(editButton);
//
//         commentCard.appendChild(commentCardBody);
//
//         commentContainer.appendChild(commentCard);
//     });
// }
//
// const deleteComment = async (commentId, sermonId) => {
//     const response = await fetch(`${baseUrl}/comments/${commentId}`, {
//         method: "DELETE",
//         headers: headers,
//     }).catch((err) => console.error(err.message));
//
//     if (response.status === 200) {
//         return getComments(sermonId);
//     }
// };
//
// function showEditModal(commentId, commentBody, sermonId) {
//     const editCommentModal = document.getElementById("comment-edit-modal");
//     const editCommentForm = document.getElementById("edit-comment-form");
//     const editCommentBody = document.getElementById("edit-comment-body");
//     const updateCommentButton = document.getElementById("update-comment-button");
//
//     editCommentBody.value = commentBody;
//
//     updateCommentButton.addEventListener("click", () =>
//         handleCommentUpdate(commentId, sermonId)
//     );
//
//     new bootstrap.Modal(editCommentModal).show();
// }
//
// const handleCommentUpdate = async (commentId, sermonId) => {
//     const editCommentBody = document.getElementById("edit-comment-body").value.trim();
//
//     if (editCommentBody === "") {
//         return;
//     }
//
//     const response = await fetch(`${baseUrl}/comments/${commentId}`, {
//         method: "PUT",
//         body: JSON.stringify({ body: editCommentBody }),
//         headers: headers,
//     }).catch((err) => console.error(err.message));
//
//     if (response.status === 200) {
//         const editCommentModal = document.getElementById("comment-edit-modal");
//         const modalInstance = bootstrap.Modal.getInstance(editCommentModal);
//         modalInstance.hide();
//         return getComments(sermonId);
//     }
// };
//
// // Fetch sermons on page load
// getSermonsByUser(userId);
//
// // Add event listener to the sermon form
// const submitForm = document.getElementById("sermon-form");
// submitForm.addEventListener("submit", handleSubmit);
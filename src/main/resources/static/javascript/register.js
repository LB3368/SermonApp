const registerForm = document.getElementById('register-form');
const registerUsername = document.getElementById('register-username');
const registerPassword = document.getElementById('register-password');
const registerFirstname = document.getElementById('register-firstname');
const registerLastname = document.getElementById('register-lastname');
const registerEmail = document.getElementById('register-email');

const headers = {
    'Content-Type':'application/json'
}

const baseUrl = 'http://localhost:8080/api/v1/users'

// const handleSubmit = async (e) =>{
//     e.preventDefault()
//
//     let bodyObj = {
//         username: registerUsername.value,
//         password: registerPassword.value,
//         firstname: registerFirstname.value,
//         lastname: registerLastname.value,
//         email: registerEmail.value
//     }
//
//     const response = await fetch(`${baseUrl}/register`, {
//         method: "POST",
//         body: JSON.stringify(bodyObj),
//         headers: headers
//     })
//         .catch(err => console.error(err.message))
//
//     const responseArr = await response.json()
//
//     if (response.status == 200){
//         window.location.replace(responseArr[0])
//     }
// }
//
// registerForm.addEventListener("submit", handleSubmit)

const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!validateForm()) {
    //     return;
    // }

    const bodyObj = {
        username: registerUsername.value,
        password: registerPassword.value,
        firstname: registerFirstname.value,
        lastname: registerLastname.value,
        email: registerEmail.value
    };

    try {
        const response = await fetch(`${baseUrl}/register`, {
            method: 'POST',
            body: JSON.stringify(bodyObj),
            headers: headers
        });

        if (response.status !== 200) {
            throw new Error('Registration failed');
        }

        const responseArr = await response.json();

        // Customize the success behavior based on your application's requirements
        window.location.replace(responseArr[0]);
    } catch (error) {
        console.error(error.message);
        // Display an error message to the user or handle the error appropriately
    }
};

// const validateForm = () => {
//     // Perform form validation checks
//     if (!registerUsername.value || !registerPassword.value || !registerFirstname.value || !registerLastname.value || !registerEmail.value) {
//         // Display an error message or visually indicate the required fields to the user
//         return false;
//     }
//
//     // Perform additional validation if needed
//
//     return true;
// };

registerForm.addEventListener('submit', handleSubmit);













// const registerForm = document.getElementById('register-form');
// const registerUsername = document.getElementById('register-username');
// const registerPassword = document.getElementById('register-password');
// const registerFirstname = document.getElementById('register-firstname');
// const registerLastname = document.getElementById('register-lastname');
// const registerEmail = document.getElementById('register-email');
//
// const headers = {
//     'Content-Type':'application/json'
// }
//
// const baseUrl = 'http://localhost:8080/api/v1/users'
//
// const handleSubmit = async (e) => {
//     e.preventDefault();
//
//     let bodyObj = {
//         username: registerUsername.value,
//         password: registerPassword.value,
//         firstname: registerFirstname.value,
//         lastname: registerLastname.value,
//         email: registerEmail.value
//     }
//
//         const response = await fetch(`${baseUrl}/register`, {
//             method: 'POST',
//             body: JSON.stringify(bodyObj),
//             headers: headers
//         })
//             .catch(err => console.error(err.message))
//
//         const responseArr = await response.json()
//
//         if (!response.status == 200) {
//             window.location.replace(responseArr[0])
//         }
// }
// registerForm.addEventListener("submit", handleSubmit)

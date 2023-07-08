const form = document.getElementById("formRegister");
form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitForm();
});
const submitForm = async () => {
    const name = document.getElementById("userName").value;
    const lastname = document.getElementById("userLastname").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("userEmail").value;
    const password = document.getElementById("userPassword").value;
    await fetch(`${window.location.href}`, {
        method: "post",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name:name,
            lastname:lastname,
            username:username,
            email: email,
            password: password,
        }),
    }).then(async (res) => {
        data = await res.json();
        if (data.status === "error") {
            alerts(data.status, data.payload)
        }
        if (data.status === 'success') {
            alerts(data.status, data.payload)
            setTimeout(() => {
                window.location.replace("/api/user/login");
            }, 1500);
        }
    });
}
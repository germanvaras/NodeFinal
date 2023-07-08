const form = document.getElementById("formReset");
form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitForm();
});
const submitForm = async () => {
    const user = document.getElementById("userEmail").value;
    const token = document.getElementById("token").value;
    const newPassword = document.getElementById("userPassword").value;
    const repeatNewPassword = document.getElementById("userRepeat").value;
    await fetch(`${window.location.href}`, {
        method: "post",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({
            email: user,
            token: token,
            password: newPassword,
            repeatPassword: repeatNewPassword
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
    })
}

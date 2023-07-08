const form = document.getElementById("formForgot");
form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitForm();
});
const submitForm = async () => {
    const user = document.getElementById("userEmail").value;
    await fetch(`${window.location.href}`, {
        method: "post",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({
            email:user
        }),
    }).then(async (res) => {
        data = await res.json();
        if (data.status === "error") {
            alerts(data.status, data.payload)
        }
        if (data.status === 'success') {
            alerts(data.status, data.payload)
            setTimeout(() => {
                window.location.replace("/api/user/resetPassword");
            }, 1500);
        }
    })
}

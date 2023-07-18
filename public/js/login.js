const form = document.getElementById("formLogin");
form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitForm();
});
const submitForm = async () => {
    const user = document.getElementById("userEmail").value;
    const login = user.includes("@") ? { email: user } : { username: user }
    const password = document.getElementById("userPassword").value;
    await fetch(`${window.location.href}`, {
        method: "post",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...login,
            password: password,
        }),
    }).then(async (res) => {
        data = await res.json();
        if (data.status === "error") {
            alerts(data.status, data.payload)
        }
        if (data.status === 'success') {
            sessionStorage.setItem("cartId", data.cartId);
            window.location.replace("/api/products");
        }
    })
}
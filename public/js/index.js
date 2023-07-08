const sectionRolUser = document.getElementById("sectionRolButton")
const rolUser = document.getElementById("admin") ||
document.getElementById("premium") ||
document.getElementById("user");
const rolUserButton = (text, url) => {
    rolUser.innerText = text
    rolUser.onclick = () => {
        let newUrl = `${window.location.protocol}//${window.location.host}/api/${url}`
        window.location.href = newUrl;
    }
}
if (rolUser.id === "admin" || rolUser.id === "premium") {
    rolUserButton("Sección Admin", "products/form")
}
else {
    sectionRolUser.innerHTML = ""
}

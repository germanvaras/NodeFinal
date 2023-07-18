var hamburger = document.getElementById("hamburger");
var dropdownMenu = document.getElementById("dropdownMenu");
hamburger.addEventListener("click", () => {
    if (dropdownMenu.classList.contains("active")) {
        dropdownMenu.classList.remove("active");
        setTimeout(() => {
            dropdownMenu.style.display = 'none';
            hamburger.innerHTML = '<i class="fa-solid fa-bars fa-lg"></i>';
        }, 500);
    } else {
        dropdownMenu.style.display = 'flex';
        dropdownMenu.style.flexDirection = 'column';
        setTimeout(() => {
            dropdownMenu.classList.add("active");
            hamburger.innerHTML = '<i class="fa-solid fa-xmark fa-lg"></i>';
        }, 50);
    }
});
const moveMenuItems = () => {
    var menu = document.getElementById("navListContainer");
    var dropdownMenu = document.getElementById("dropdownMenu");
    if (window.innerWidth <= 768) {
        while (menu.children.length > 0) {
            dropdownMenu.appendChild(menu.children[0]);
        }
        dropdownMenu.style.display = 'none';
    } else {
        while (dropdownMenu.children.length > 0) {
            menu.appendChild(dropdownMenu.children[0]);
        }
        dropdownMenu.style.display = 'none';
    }
}

window.addEventListener("resize", moveMenuItems);
document.addEventListener("DOMContentLoaded", moveMenuItems);
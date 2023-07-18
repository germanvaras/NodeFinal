const alerts = (status, errorMessage) => {
    Swal.fire({
        position: 'top-end',
        icon: status,
        text: errorMessage,
        showConfirmButton: false,
        iconColor: 'var(--main-color)',
        background: 'var(--black)',
        timer: 1500,
    })
}
var hamburger = document.getElementById("hamburger");
var dropdownMenu = document.getElementById("dropdownMenu");

const backHome = () => {
    location.href = `${window.location.protocol}//${window.location.host}/api/products`
}
const goChat = () => {
    location.href = `${window.location.protocol}//${window.location.host}/api/chat`
}
const goToCart = (cid) => {
    location.href = `${window.location.protocol}//${window.location.host}/api/cart/${cid}`
}
const changeRol = async (id) => {
    const baseUrl = `${window.location.protocol}//${window.location.host}/api/`;
    const endpoint = `user/premium/${id}`
    const url = `${baseUrl}${endpoint}`;
    await fetch(url, {
        method: "post",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => response.json())
        .then((data) => {
            if (data.status === "error") {
                alerts(data.status, data.payload)
            }
            else {
                alerts(data.status, data.payload)
                setTimeout(() => {
                    window.location.reload()
                }, 1500);       
            }
        })

};

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

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





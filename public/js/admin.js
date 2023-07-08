const productsContainer = document.getElementById('products')
const form = document.getElementById("formProduct");
const pageLink = document.querySelector('.pageLink');
form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitForm();
});
const submitForm = async () => {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const code = document.getElementById("code").value;
    const category = document.getElementById("category").value;
    const price = document.getElementById("price").value;
    const stock = document.getElementById("stock").value;
    const img = document.getElementById("img").value;
    const owner = document.getElementById("owner").value || "admin";
    
    await fetch(`${window.location.href}`, {
        method: "post",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: title,
            description: description,
            code: code,
            price: price,
            stock: stock,
            category: category,
            thumbnail: img,
            owner: owner
        }),
    }).then((response) => response.json())
        .then((data) => {
            if (data.status === "error") {
                Swal.fire({
                    position: 'top-end',
                    icon: data.status,
                    html: `<ul> ${data.payload.map((field) => {
                        return `<li>${field}</li>`;
                    }).join('')} </ul>`,
                    showConfirmButton: false,
                    iconColor: 'var(--main-color)',
                    background: 'var(--black)',
                    timer: 2000,
                });
            }
            else {
                alerts(data.status, data.payload)
                setTimeout(() => {
                    window.location.reload()
                }, 2000);
            }
        })
};
const deleteProduct = async (id) => {
    await fetch(`${window.location.protocol}//${window.location.host}/api/products/form/${id}`, {
        method: "delete",
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
                }, 2000);
            }
        })
}

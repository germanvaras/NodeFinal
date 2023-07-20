const productsContainer = document.getElementById('products')
const form = document.getElementById("formProduct");
const pageLink = document.querySelector('.pageLink');
form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitForm();
});
const submitForm = async () => {
    const formData = new FormData(form);
    try {
        const response = await fetch(`${window.location.href}`, {
            method: "post",
            mode: "cors",
            cache: "no-cache",
            body: formData,
        });
        const data = await response.json();
        let errorMessage;
        if (Array.isArray(data.payload)) {
            errorMessage = `<ul> ${data.payload
                .map((field) => {
                    return `<li>${field}</li>`;
                })
                .join("")} </ul>`;
        } else {
            errorMessage = data.payload;
        }

        Swal.fire({
            position: "top-end",
            icon: data.status,
            html: errorMessage,
            showConfirmButton: false,
            iconColor: "var(--main-color)",
            background: "var(--black)",
            timer: 2000,
        });

        if (data.status !== "error") {
            alerts(data.status, data.payload);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    } catch (error) {
        console.error(error);
    }
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
const showFileName = () => {
    const input = document.getElementById('img');
    const fileNameDisplay = document.getElementById('fileName');
    fileNameDisplay.textContent = input.files && input.files[0] ? 
        'Nombre del archivo: ' + input.files[0].name : 'No hay archivo cargado';
}

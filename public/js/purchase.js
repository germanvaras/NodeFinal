const purchaseProducts = () => {
    Swal.fire({
        title:"Te gustaría continuar con tu compra?",
        text: "Recordá que no contamos con todos los productos en stock, aquellos que no cuenten con la cantidad a comprar pemaneceran en el carrito",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Continuar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
        background: 'var(--black)',
    }).then(async (result) => {
        if (result.isConfirmed) {
            fetch(window.location.href + "/purchase", { method: "GET" })
                .then((res) => res.json())
                .then((res) => {
                    if (res.status === "success") {
                        Swal.fire({
                            html: `<p>${res.payload.purchaser} tu total de tu compra es: $${res.payload.amount}</p> <p>Codigo de compra:${res.payload.code}</p> `,
                            icon: res.status,
                            showConfirmButton: true,
                            confirmButtonText: "Continuar",
                            background: 'var(--black)',
                        }).then(async (result) => {
                            if(result.isConfirmed){
                                window.location.reload()
                            }
                        })
                    }
                    else{
                        Swal.fire({
                            html: `<p>${res.payload}</p> `,
                            icon: res.status,
                            background: 'var(--black)',
                        })    
                    }
                });
        }
    });
};
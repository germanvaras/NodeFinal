let stripe;
let elements;
document.addEventListener('DOMContentLoaded', (event) => {
    fetch('/stripe-key')
        .then((result) => result.json())
        .then((data) => {
            stripe = Stripe(data.publishableKey);
            elements = stripe.elements();
            card = elements.create('card', {
                style: {
                    base: {
                        color: '#ffffff', 
                        '::placeholder': {
                            color: '#ffffff' 
                        }
                    }
                }
            });
            card.mount('#card-element');
        });
});

const purchaseProducts = (cartId) => {
    Swal.fire({
        title: "¿Te gustaría continuar con tu compra?",
        text: "Recuerda que no contamos con todos los productos en stock. Aquellos que no tengan la cantidad para comprar permanecerán en el carrito.",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Continuar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
        background: 'var(--black)',
    }).then(async (result) => {
        if (result.isConfirmed) {
            fetch(`${window.location.protocol}//${window.location.host}/api/cart/${cartId}/purchase`, { method: "POST" })
                .then((res) => res.json())
                .then((res) => {
                    if (res.status === "success") {
                        stripe.confirmCardPayment(res.payload.client_secret, {
                            payment_method: {
                                card: card,
                                billing_details: {
                                    name: res.payload.purchaser,
                                }
                            },
                        }).then((result) => {
                            if (result.error) {
                                Swal.fire({
                                    html: `<p>${result.error.message}</p>`,
                                    icon: "error",
                                    background: 'var(--black)',
                                });
                            } else {
                                if (result.paymentIntent.status === 'succeeded') {
                                    confirmPurchase(cartId);
                                }
                            }
                        });
                    } else {
                        Swal.fire({
                            html: `<p>${res.payload}</p> `,
                            icon: res.status,
                            background: 'var(--black)',
                        });
                    }
                });
        }
    });
};
const confirmPurchase = (cartId) => {
    fetch(`${window.location.protocol}//${window.location.host}/api/cart/${cartId}/confirm-purchase`, { method: "POST" })
        .then((res) => res.json())
        .then((res) => {
            if (res.status === "success") {
                Swal.fire({
                    html: `<p>${res.payload.ticket.purchaser}, el total de tu compra es: $${res.payload.ticket.amount}</p> <p>Código de compra: ${res.payload.ticket.code}</p> `,
                    icon: res.status,
                    showConfirmButton: true,
                    confirmButtonText: "Continuar",
                    background: 'var(--black)',
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        window.location.href = window.location.origin + "/api/products"
                    }
                });
            } else {
                Swal.fire({
                    html: `<p>${res.payload}</p> `,
                    icon: res.status,
                    background: 'var(--black)',
                });
            }
        });
}


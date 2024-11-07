const contenedorTarjetas = document.getElementById("productos-container");
const unidadesElement = document.getElementById("unidades");
const precioElement = document.getElementById("precio");
const carritoVacioElement = document.getElementById("carrito-vacio");
const totalesElement = document.getElementById("totales");
const reiniciarCarritoVacioElement = document.getElementById("reiniciar");

function crearTarjetasProductosInicio() {
    contenedorTarjetas.innerHTML = "";
    const productos = JSON.parse(localStorage.getItem("mascotas"));///
    console.log(productos);
    if (productos && productos.length > 0) {
        productos.forEach(producto => {
            const nuevoProducto = document.createElement("div");
            nuevoProducto.classList = "tarjeta-producto";
            nuevoProducto.innerHTML = `
            <img src="${producto.urlimagen}">
            <h3>${producto.nombre}</h3>
            <p>$${producto.precio}</p>
            <div>
                <button>-</button>
                <span class="cantidad">${producto.cantidad}</span>
                <button>+</button>
            </div>
            `;
            contenedorTarjetas.appendChild(nuevoProducto);
            nuevoProducto
                .getElementsByTagName("button")[1]
                .addEventListener("click", (e) => {
                    const cuentaElement = e.target.parentElement.getElementsByTagName("span")[0];
                    cuentaElement.innerText = agregarAlCarrito(producto);
                    actualizarTotales();
                });
            nuevoProducto
                .getElementsByTagName("button")[0]
                .addEventListener("click", (e) => {
                    restarAlCarrito(producto);
                    crearTarjetasProductosInicio();
                    actualizarTotales();
                });

        });
    }
}

crearTarjetasProductosInicio();
actualizarTotales();
//${} sitaxis para escribir js dentro de un string

function actualizarTotales() {
    const productos = JSON.parse(localStorage.getItem("mascotas"));
    let unidades = 0;
    let precio = 0;
    if (productos && productos.length > 0) {
        productos.forEach(producto => {
            unidades += producto.cantidad;
            precio += producto.precio * producto.cantidad;
        })
        unidadesElement.innerText = unidades;
        precioElement.innerText = precio;
    }
    revisarMensajeVacio();
}

function revisarMensajeVacio() {
    const productos = JSON.parse(localStorage.getItem("mascotas"));
    console.log(productos, productos == true);
    carritoVacioElement.classList.toggle("escondido", productos && productos.length > 0);
    totalesElement.classList.toggle("escondido", !(productos && productos.length > 0));
}

revisarMensajeVacio();

reiniciarCarritoVacioElement.addEventListener("click", reiniciarCarrito);
function reiniciarCarrito() {
    localStorage.removeItem("mascotas");
    actualizarTotales();
    crearTarjetasProductosInicio();
}


//mp
const mp = new MercadoPago("APP_USR-45896824-68ca-491c-8de3-2fcc185d4947", {
    locale: "es-AR",
});


document.getElementById("comprar").addEventListener("click", async () => {
    const productos = JSON.parse(localStorage.getItem("mascotas"));
    if (!productos || productos.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    try {
        // Convertir a números y crear el cuerpo para la preferencia
        const orderData = productos.map(producto => ({
            title: producto.nombre,
            quantity: Number(producto.cantidad), // Asegurar de que sea un número
            unit_price: Number(producto.precio) // También asegurar de que el precio sea un número
        }));

        const response = await fetch("http://localhost:4000/create_preference", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ items: orderData }), // Enviar como { items: orderData }
        });

        const preference = await response.json();
        if (response.ok) {
            createCheckoutButton(preference.id);
        } else {
            console.error("Error al crear la preferencia", preference);
            alert("Hubo un problema al procesar tu compra. Intenta nuevamente.");
        }
    } catch (error) {
        console.error("Error de red", error);
        alert("Hubo un problema al procesar tu compra. Intenta nuevamente.");
    }
});

const createCheckoutButton = (preferenceId) => {
    const bricksBuilder = mp.bricks();

    if (window.checkoutButton) window.checkoutButton.unmount();

    const renderComponent = async () => {
        await bricksBuilder.create("wallet", "wallet_container", {
            initialization: {
                preferenceId: preferenceId,
                redirectMode: 'modal',
            },
            customization: {
                button: {
                    className: "custom-checkout-button", // Clase CSS personalizada
                },
            },
        });
    };

    renderComponent();
}

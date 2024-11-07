const express = require('express');
const morgan = require('morgan'); // Permite ver el progreso por consola
const database = require("./database"); // Conexión con la base de datos
const cors = require("cors");

const { MercadoPagoConfig, Preference } = require('mercadopago'); // Importa MercadoPago
// Agrega credenciales
const client = new MercadoPagoConfig({ accessToken: 'APP_USR-7189712532191986-110617-a98cdef6f6814092ad4089c0d983e74e-2060333351' }); // Reemplaza con tu token real

// Configuración inicial
const app = express();

// Middlewares
app.use(cors({
    origin: ["http://127.0.0.1:5501", "http://127.0.0.1:5500"]
}));
app.use(morgan("dev"));
app.use(express.json());

// Rutas
app.get("/productos", async (req, res) => {
    const connection = await database.getConnection();
    const result = await connection.query("SELECT * from producto");
    res.json(result);
});

app.post("/carrito/comprar", async (req, res) => {
    if (req.body && req.body.length > 0) {
        return res.sendStatus(200);
    }
    res.sendStatus(400);
});

app.post("/create_preference", async (req, res) => {
    try {
        const items = req.body.items; // AEsperando que items sea un array

        // Agregar una validación para verificar que las cantidades son números
        items.forEach(item => {
            if (typeof item.quantity !== 'number') {
                throw new Error("Invalid quantity: must be a number");
            }
        });

        const body = {
            items: items,
            back_urls: {
                success: "https://github.com/GiuntaP",
                failure: "https://github.com/GiuntaP",
                pending: "https://github.com/GiuntaP",
            },
            auto_return: "approved",
        };

        const preference = new Preference(client);
        const result = await preference.create({ body });
        res.json({ id: result.id });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al crear preferencia" });
    }
});

// Configura el puerto y escucha
app.set("port", 4000);
app.listen(app.get("port"), () => {
    console.log("Comunicaciones del puerto " + app.get("port"));
});

const express = require('express');
const app = express();
// Importar los datos de los cafés desde el archivo cafes.json
const cafes = require("./cafes.json")


app.listen(3000, console.log("SERVER IS ON!😉"))

app.use(express.json())


// Ruta para obtener la lista de cafés
app.get("/cafes", (req, res) => {
    res.status(200).send(cafes)
})

// Ruta para obtener un café por su ID
app.get("/cafes/:id", (req, res) => {
    // Extraer el valor del parámetro "id" de la solicitud
    const { id } = req.params;

    // Buscar el café en el arreglo(Json) de cafés que tenga el mismo ID
    const cafe = cafes.find(c => c.id == id);

    // Si se encontró un café con el ID dado
    if (cafe) {
        // Responder con un estado 200 (Éxito) y enviar el café como respuesta
        res.status(200).send(cafe);
    } else {
        // Si no(else) se encontró un café con el ID dado
        // Responder con un estado 404 (No encontrado) y un mensaje de error
        res.status(404).send({ message: "No se encontró ningún cafe con ese ID 😥" });
    }
});


// Ruta para agregar un nuevo café
app.post("/cafes", (req, res) => {
    // Extraer el objeto del cafe de la solicitud
    const cafe = req.body;

    // Extraer el ID del cafe del objeto
    const { id } = cafe;

    // Verificar si ya existe un cafe con el mismo ID
    const existeUnCafeConEseId = cafes.some(c => c.id === id);
    //Usamos el método Array.some() para verificar si ya existe un café en el arreglo cafes con el mismo ID. 
    //Este método devuelve true si al menos un elemento cumple con la condición de búsqueda.

    // Si ya existe un café con ese ID
    if (existeUnCafeConEseId) {
        // Responder con un estado 400 (Solicitud incorrecta) y un mensaje de error
        res.status(400).send({ message: "Ya existe un cafe con ese ID 🥺" });
    } else {
        // Si no existe un café con ese ID, agregar el nuevo café a la lista (push)
        cafes.push(cafe);

        // Responder con un estado 201 (Creado) y enviar la lista actualizada de cafés
        res.status(201).send(cafes);
    }
});


// Ruta para actualizar un café por su ID
app.put("/cafes/:id", (req, res) => {
    // Extraer el objeto del café de la solicitud
    const cafe = req.body;

    // Extraer el ID del parámetro de la URL
    const { id } = req.params;

    // Verificar si el ID en el cuerpo coincide con el ID en el parámetro
    if (id != cafe.id) {
        // Si los IDs no coinciden, responder con un estado 400 (Solicitud incorrecta) y un mensaje de error
        return res
            .status(400)
            .send({
                message: "El ID del parámetro no coincide con el id del café recibido",
            });
    }

    // Encontrar el índice del café a actualizar dentro del arreglo cafes
    const cafeIndexFound = cafes.findIndex((p) => p.id === id);

    // Si se encuentra el café en el arreglo
    if (cafeIndexFound >= 0) {
        // Actualizar el café en la lista
        cafes[cafeIndexFound] = cafe;
        // Responder con la lista actualizada de cafés
        res.send(cafes);
    } else {
        // Si no se encuentra el café en el arreglo, responder con un estado 404 (No encontrado) y un mensaje de error
        res
            .status(404)
            .send({ message: "No se encontró ningún café con ese ID 🥺" });
    }
});


// Ruta para eliminar un café por su ID, con verificación de token
app.delete("/cafes/:id", (req, res) => {
    // Extraer el token de autorización de las cabeceras de la solicitud
    const jwt = req.header("Authorization");

    // Verificar si se proporcionó un token de autorización
    if (jwt) {
        // Extraer el ID del café de los parámetros de la URL
        const { id } = req.params;

        // Encontrar el índice del café a eliminar dentro del arreglo cafes
        const cafeIndexFound = cafes.findIndex(c => c.id === id);

        // Si se encuentra el café en el arreglo
        if (cafeIndexFound >= 0) {
            // Eliminar el café del arreglo utilizando el método splice
            cafes.splice(cafeIndexFound, 1);
            // Registrar información en la consola
            console.log(cafeIndexFound, cafes);
            // Responder con la lista actualizada de cafés
            res.send(cafes);
        } else {
            // Si no se encuentra el café en el arreglo, responder con un estado 404 (No encontrado) y un mensaje de error
            res.status(404).send({ message: "No se encontró ningún cafe con ese ID 🥺" });
        }
    } else {
        // Si no se proporcionó un token de autorización, responder con un estado 400 (Solicitud incorrecta) y un mensaje de error
        res.status(400).send({ message: "No recibió ningún token en las cabeceras (Authorization)" });
    }
});



// Ruta para manejar cualquier otra consulta a rutas no definidas
app.use("*", (req, res) => {
    res.status(404).send({ message: "La ruta que intenta consultar no existe 🥴" })
})


module.exports = app

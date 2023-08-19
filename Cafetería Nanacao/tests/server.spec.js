const request = require("supertest"); // Importamos el módulo supertest para hacer solicitudes HTTP
const server = require("../index"); // Importamos el servidor Express desde index.js

// Prueba para la ruta GET /cafes:
describe("GET /cafes", () => {
    it("Debe devolver un código de estado 200 y un arreglo(array) con al menos 1 objeto", 
    async () => {
        // Realizamos una solicitud GET a la ruta /cafes utilizando el servidor Express simulado
        const response = await request(server).get("/cafes");

        // Verificamos que el código de estado de la respuesta sea 200 (OK)
        expect(response.status).toBe(200);

        // Verificamos que la respuesta sea un arreglo
        expect(Array.isArray(response.body)).toBe(true);

        // Verificamos que el arreglo tenga al menos un objeto
        expect(response.body.length).toBeGreaterThan(0);
    });
});

// Prueba para la ruta DELETE /cafes con id inexistente:
describe("DELETE /cafes/:id", () => {
    it("Debe devolver un código de estado 404(No encontrado) al intentar eliminar un café con una ID que no existe",
    async () => {
        // Realizamos una solicitud DELETE a la ruta /cafes/:id utilizando el servidor Express simulado
        // y simulamos el uso de un token de autorización válido
        const response = await request(server)
            .delete(`/cafes/${16}`)
            .set("Authorization", "Bearer my-valid-token"); // Simular un token válido

        // Verificamos que el código de estado de la respuesta sea 404 (No encontrado)
        expect(response.status).toBe(404);
    });
});

// Prueba para la ruta POST /cafes:
describe("POST /cafes", () => {
    it("Debe agregar un nuevo café y devolver un código de estado 201(Creado)", 
    async () => {
        // Creamos un nuevo objeto de café
        const newCafe = {
            id: 5,
            nombre: "Latte Vainilla"
        };

        // Realizamos una solicitud POST a la ruta /cafes utilizando el servidor Express simulado
        // y enviamos el nuevo objeto de café en el cuerpo de la solicitud
        const response = await request(server)
            .post("/cafes")
            .send(newCafe);

        // Verificamos que el código de estado de la respuesta sea 201 (Creado)
        expect(response.status).toBe(201);

        // Realizamos una solicitud GET a la ruta /cafes para obtener la lista actualizada de cafés
        const getCafesResponse = await request(server).get("/cafes");

        // Extraemos los IDs de los cafés en la respuesta
        const cafeIds = getCafesResponse.body.map(cafe => cafe.id);

        // Verificamos que el ID del nuevo café esté incluido en la lista de IDs
        expect(cafeIds).toContain(newCafe.id);
    });
});




// Prueba para la ruta PUT /cafes con id incorrectos:
describe("PUT /cafes/:id", () => {
    it("Debe devolver un código de estado 400 si intenta actualizar un café con ID's incorrectos", 
    async () => {
        const cafeUpdate = {
            id: 1, // Suponiendo que el café existente tenga esta ID
            nombre: "Cortado a lo loco"
        };

        const response = await request(server)
            .put(`/cafes/${cafeUpdate.id + 1}`) // Enviando una ID diferente en el parámetro
            .send(cafeUpdate);

        expect(response.status).toBe(400);
    });
});
const express = require('express');
const app = express();
app.use(express.json());

/*Get*/
app.get("/cursos", (request, response) => {
    const query = request.query;
    console.log(query);
    return response.json([
        "Curso 1",
        "Curso 2",
        "Curso 3"
    ]);
})

/*Post*/
app.post("/cursos", (request, response) => {
    const body = request.body;
    console.log(body);
    return response.json([
        "Curso 1",
        "Curso 2",
        "Curso 3",
        "Curso 4"
    ]);
})

/*Put*/
app.put("/cursos/:id", (request, response) => {
    const {id} = request.params;
    console.log(id);
    return response.json([
        "Curso 6",
        "Curso 2",
        "Curso 3",
        "Curso 4"
    ]);
})

/*Patch*/
app.patch("/cursos/:id", (request, response) => {
    return response.json([
        "Curso 6",
        "Curso 7",
        "Curso 3",
        "Curso 4"
    ]);
})

/*Delete*/
app.delete("/cursos/:id", (request, response) => {
    return response.json([
        "Curso 6",
        "Curso 7",
        "Curso 3",
        "Curso 4"
    ]);
})
//Porta do servidor
app.listen(3333);
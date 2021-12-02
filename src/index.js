const { request, response } = require("express");
const {v4: uuidV4} = require("uuid");
const express = require('express');

const app = express();
app.use(express.json());

const customers = [];

/**
 * CPF - String
 * name - String
 * id - uuid
 * statement - Array
 */
app.post("/account", (request, response) =>{
    const {cpf, name} = request.body;

    //verifica se o cpf ja esta cadastrado
    const customerAlreadyExists = customers.some(
        (customers) => customers.cpf === cpf
    );

    if(customerAlreadyExists){
        return response.status(400).json({error: "CPF do cliente ja se encontra cadastrado!"});
    }

    customers.push({
        cpf,
        name,
        id:uuidV4,
        statement:[],
    });
    return response.status(201).send();
});

app.get("/statement/:cpf", (request, response) =>{
   const {cpf} = request.params;
   
   const custumer = customers.find((customers => customers.cpf === cpf));

   if(!custumer){
       return response.status(400).json({error: "Desculpe, cliente nao encontrado! :( "});
   }

   return response.json(customers.statement);
});

//Porta do servidor
app.listen(3333);
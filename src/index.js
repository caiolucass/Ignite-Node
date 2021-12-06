const { request, response } = require("express");
const {v4: uuidV4} = require("uuid");
const express = require('express');

const app = express();
app.use(express.json());

const customers = [];

/**
 * Middleware Verifica se a conta com o CPF ja existe
 */
function verifyIfExistsAccountCPF(request, response, next){
    const {cpf} = request.headers;
   
    const customer = customers.find((customer => customer.cpf === cpf));

    if(!customer){
        return response.status(400).json({error: "Desculpe, cliente nao encontrado! :( "});
    }
    request.customer = customer;
    return next();
}

/**
 * Criar uma conta
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
        return response.status(400).json({error: "Desculpe. O CPF do cliente ja se encontra cadastrado!"});
    }

    customers.push({
        cpf,
        name,
        id:uuidV4(),
        statement:[],
    });
    return response.status(201).json({sucess: "Sucesso, conta cadastrada com sucesso! :) "});
    
});

/**
 * Verifica se a conta com o CPF ja existem
 */
app.get("/statement", verifyIfExistsAccountCPF, (request, response) =>{
    const{customer} = request;
    return response.json(customer.statement);
});

/**
 * Verifica se existe saldo na conta e o tipo de oeracao realizada
 */
function getBalance(statement){
   const balance = statement.reduce((acc, operation) =>{
    if(operation.type === 'Credit'){
        return acc + operation.amount;
    }else{
        return acc - operation.amount;
    }
   }, 0); //inicia o reduce com o valor 0
   return balance;
}
/**
 * Deposita em um conta
 */
app.post("/deposit", verifyIfExistsAccountCPF, (request, response) =>{
   const {amount} = request.body;
   const {customer} = request;

   const statementOperation = {
       description: "Deposito realizado pelo (a) cliente de cpf: " + `${customer.cpf}` + " e nome: " + `${customer.name}`,
       amount: "R$: " + amount,
       created_at: new Date(),
       type: "Credit",
   };

   customer.statement.push(statementOperation);
   return response.status(201).json({sucess: "Sucesso, seu deposito foi realizado com sucesso! :) "});
});

/**
 * Saque em uma conta
 */
 app.post("/withdraw", verifyIfExistsAccountCPF, (request, response) =>{
    const {amount} = request.body;
    const {customer} = request;
    const balance = getBalance(customer.statement);

    // se o valor da operacao for menor que o saldo da conta
    if(balance < amount){
      return response.status(400).json({errror: "Operacao nao realizada, saldo insuficiente em sua conta :( ! "});
    }
 
    const statementOperation = {
        description: "Saque realizado pelo (a) cliente de cpf: " + `${customer.cpf}` + " e nome: " + `${customer.name}`,
        amount: "R$: " + amount,
        created_at: new Date(),
        type: "Debit",
    };
    
    customer.statement.push(statementOperation);
    return response.status(201).json({sucess: "Sucesso, seu saque foi realizado com sucesso! :) "});
 });

 /**
 * Obtem extrato pela data
 */
 app.get("/statement/date", verifyIfExistsAccountCPF, (request, response) =>{
    const{customer} = request;
    const{date} = request.query;

    //poder pegar o extrato independente da hora
    const dateFormat = new Date(date + " 00:00");

    //converter a data pra string
    const statement = customer.statement.filter((statement) => statement.created_at.toDateString() === new Date(dateFormat).toDateString());
    return response.json(statement);
});

/**
 * Atualiza as informacoes de uma conta
 */
 app.put("/account", verifyIfExistsAccountCPF, (request, response) =>{
    const {name} = request.body;
    const {customer} = request;

    customer.name = name;
    return response.status(201).json({sucess: "Sucesso, conta atualizada com sucesso! :) "});  
});

/*
* Obtem uma conta
**/
app.get("/account", verifyIfExistsAccountCPF, (request, response) =>{
    const {customer} = request;
    return response.json(customer);    
});

/*
* Deleta uma uma conta
**/
app.delete("/account", verifyIfExistsAccountCPF, (request, response) =>{
    const {customer} = request;

    customers.splice(customer, 1);
    return response.status(200).json({sucess: "Conta excluida com sucesso! ", customer});
});

/*
* Deleta uma uma conta
**/
app.get("/balance", verifyIfExistsAccountCPF, (request, response) =>{
    const {customer} = request;
    const balance = getBalance(customer.statement);

    return response.json(balance);
});

//Porta do servidor
app.listen(3333);
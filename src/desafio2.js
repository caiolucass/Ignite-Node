const { request, response } = require("express");
const {v4: uuidV4} = require("uuid");
const express = require('express');

const app = express();
app.use(express.json());


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

/*
** Verfica se existe a conta do usuario
*/
function checkExistsUserAccount(request, response, next){
    const {username} = request.headers;
 
    const  user = users.find(user => user.username === username);
 
    if(!user){
        return response.status(400).json({error: 'Desculpe, nao foi possivel encontrar o usuario.'})
    }
 
   request.user = user;
   return next();
 }

 /*
** Encontra o usuario pelo ID
*/
function findUserById(request, response, next){
    const {user}  = request;
    const {id} = request.params;

    user = user.id.find(user => user.id === id);

    if(!user){
      return response.status(404).json({erro: "Desculpe, usuario nao encotrado! "});
    }

    request.user = user;
    return next();
  }

  /*
** Verfica se existe a tarea vinculada ao usuario do usuario
*/
function checkTodoExists(request, response, next){
    const {username} = request.headers;
    const {id} = request.params;
 
   const user = users.find(user => user.username === username);
   const todo = todos.find(todo => todo.id === id);
 
    if(todo != user.todos.id && todo){
        return response.status(400).json({error: 'Desculpe, essa tarefa nao percetence a esse usuario.'});
    }
 
    todo = {
     id: uuidV4(),
     title: 'Teste',
     deadline: new Date(),
     done: false,
     created_at: new Date()
   }
 
    users.push({
     id: uuidV4(),
     name: 'Caio',
     username: 'Cafox',
     pro: false,
     todos: [todo]
   });
 
   request.user = user;
   return next();
 }

//Porta do servidor
app.listen(3333);


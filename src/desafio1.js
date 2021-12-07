const { request, response } = require("express");
const {v4: uuidV4} = require("uuid");
const express = require('express');
const cors =  require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const users = [];

function checkExistsUserAccount(request, response, next){
   const {username} = request.headers;

   const user = users.find(user => user.username === username);

   if(!user){
       return response.status(400).json({error: 'Dseculpe, nao foi possivel encontrar o usuario.'})
   }

  request.user = user;
  return next();
}

/*
** Cria um novo usuario
*/
app.post('/users', (request, response) => {
    const {name, username} = request.body;
    
    //verifica se existe um cliente
    const userAlreadyExists = users.find(user => user.username === username);

        if(userAlreadyExists){
          return response.status(400).json({error:"Desculpe o usuario " + `${user}` +  " ja se encontra cadastrado no sistema :( ! "});
        }

        const user = ({
          id:uuidV4(),
          name,
          username,
          todos:[],
      }); 

      users.push(user);
      return response.status(201).json({sucess:"Parabens," + `${user}` + "criado com sucesso!"});
});

/*
** Obtem a lista de tarefa
*/
app.get('/todos'), checkExistsUserAccount ,(request, response) =>{
  const {user} = request;
  return response.json(user.todos);
}

app.listen(3333);
const { request, response } = require("express");
const {v4: uuidV4} = require("uuid");
const express = require('express');

const app = express();
app.use(express.json());

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

/*
** Cria um novo usuario
*/
const users = [];
app.post("/users",  (request, response) => {
    const {name, username} = request.body;
    
    //verifica se existe um cliente
    const userAlreadyExists = users.find(user => user.username === username);

        if(userAlreadyExists){
          return response.status(400).json({error:"Desculpe o " + `${username}` +  " ja se encontra cadastrado no sistema :( ! "});
        }

        users.push = ({
          id:uuidV4(),
          name,
          username,
          todo:[],
      }); 
      return response.status(201).json({sucess:"Parabens, " + `${username}` + " cadastrado com sucesso!"});
});

/*
** Cria uma nova tarefa
*/
app.post('/todos' , (request, response) =>{
    const {title, deadline} = request.body;
    const user = request;
  
    const todoList = {
         id: uuidV4(),
         title,
         description: "A tarefa" + `${todo.name}` + "criada pelo " + `${user.username}`,
         deadline: new Date(deadline),
         done: false,
    }
  
    user.todos.push(todoList);
    return response.status(201).json({sucess: "Sucesso, tarefa" + `${todoList.name}` + "atualizada com exito!"});
  });
  
  /*
  ** Obtem a lista de tarefa
  */
  app.get('/todos'), checkExistsUserAccount, checkTodoExists, (request, response) => {
    const user = request;
    return response.json(user.todos);
  }
  
  /*
  ** Atualiza as tarefas
  */
  app.put('/todos', checkExistsUserAccount,(request, response) =>{
    const {username} = request.body;
    const user = request;
  
    user.username = username;
    return response.status(201).json({sucess: "Sucesso, as tarefas atualizado com sucesso!"});
  });
  /*
  ** Atualiza a tarefa pelo id
  */
  app.put("/todos/:id", checkExistsUserAccount,(request, response) =>{
    const {title, deadline} = request.body;
    const user = request;
    const {id} = request.params;
  
    const todo = user.todos.find(todo => todo.id === id);
  
    if(!todo){
      return response.status(404).json({erro: "Desculpe, essa tarefa nao existe! "});
    }
  
    todo.title = title;
    todo.deadline = new Date(deadline);
  
    user.todos.push(todoList);
    return response.status(201).json({sucess: "Sucesso, tarefa" + `${todo.title}` + "atualizada com exito!"});
  });
  
  /*
  ** Atualiza uma tarefa como feita
  */
  app.patch('/todos/:id/done', checkExistsUserAccount,(request, response) =>{
    const  user = request;
    const {id} = request.params;
  
    const todo = user.todos.find(todo => todo.id === id);
  
    if(!todo){
      return response.status(404).json({erro: "Desculpe, essa tarefa nao existe! "});
    }
  
    todo.done = true;
    return response.json(todo);
  });
  
  /*
  ** Exclui uma tarefa
  */
  app.delete('/todos/:id', checkExistsUserAccount, findUserById,(request, response) =>{
    const user = request;
    const {id} = request.params;
  
    const todoIndex = user.todos.findIndex(todo => todo.id === id);
  
    if(todoIndex === -1){
      return response.status(404).json({erro: "Desculpe, essa tarefa nao existe! "});
    }
     
    user.todos.splice(todoIndex, 1);
    return response.status(204).json({erro: "Sucesso, todo excluido com exito!"});
  });

  //Porta do servidor
app.listen(3333);
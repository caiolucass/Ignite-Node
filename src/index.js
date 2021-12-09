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

/**
 * Middleware Verifica se a conta com o CPF ja existe
 */
 function verifyIfExistsRepository(request, response, next){
  const {title} = request.headers;
 
  const repository = repositories.find((respository => respository.title === title));

  if(!repository){
      return response.status(400).json({error: "Desculpe, respositorio nao encontrado! :( "});
  }
  request.repository = repository;
  return next();
}

/**
 * Criar uma conta
 * CPF - String
 * name - String
 * id - uuid
 * statement - Array
 */
 const customers = [];
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
        id:uuidV4(),
        cpf,
        name,
        statement:[],
    });
    return response.status(201).json({sucess: "Sucesso, conta cadastrada com sucesso! :) "});    
});

/**
 * Verifica o extrato
 */
app.get("/statement", verifyIfExistsAccountCPF, (request, response) =>{
    const {customer} = request;
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

/**
 * Cria um novo repositorio
 */
 const repositories = [];
app.post("/repositories", (request, response) =>{
const {title, url, techs} = request.body;

const repositoriesAlreadyExists = repositories.find(repository => repository.title === title);

if(repositoriesAlreadyExists){
    return response.status(400).json({error: "Desculpe, o repositorio ja se encontra cadastrado no sistema. "});
}

repositories.push({
    id: uuidV4(),
    title,
    url,
    techs,
    likes: 0,
});

return response.status(201).json({error: "Sucesso, o repositorio " + `${title}` + " foi cadastrado com exito"});
});

/**
 * Obtem um novo repositorio
 */
 app.get("/repositories", verifyIfExistsRepository, (request, response) =>{
    const {repository} = request;
    return response.json(repository);
});

/**
 * Atualiza um novo repositorio
 */
app.put("/repositories/:id", verifyIfExistsRepository, (request, response) =>{
    const {title, url, techs} = request.body;
    const {id} = request.params;
    const{repository} = request;

    const repo = repository.techs.find(repo => repo.id === id);
  
    if(!repo){
      return response.status(404).json({erro: "Desculpe, esse repositorio nao existe! "});
    }

    repository.title = title;
    repository.url = url;
    repository.techs = techs;
  
    repository.push(repositories);
    return response.status(201).json({sucess: "Sucesso, respositorio" + `${repo.title}` + "atualizado com exito!"});
});

/**
 * Deleta um novo repositorio
 */
 app.delete("/repositories/:id", verifyIfExistsRepository, (request, response) =>{
    const {id} = request.params;
    const{repository} = request;

    const repoIndex = repository.techs.find(repoIndex => repoIndex.id === id);
  
    if(repoIndex === -1){
      return response.status(404).json({erro: "Desculpe, esse repositorio nao existe! "});
    }

    repositories.splice(repoIndex, 1);
    return response.status(201).json({sucess: "Sucesso, respositorio" + `${repoIndex.title}` + "excluido com exito!"});
});


app.post("/repositories/:id/like", (request, response) =>{
  const {id} = request.params;

  const repoIndex = repository.techs.find(repoIndex => repoIndex.id === id);

  if(repoIndex === -1){
    return response.status(404).json({erro: "Desculpe, esse repositorio nao existe! "});
  }
  repositories[repoIndex].likes++;
  const repository = repositories[repoIndex];
  return response.json(repository);
});

//Porta do servidor
app.listen(3333);
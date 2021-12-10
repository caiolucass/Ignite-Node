const { request, response } = require("express");
const {v4: uuidV4} = require("uuid");
const express = require('express');

const app = express();
app.use(express.json());

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
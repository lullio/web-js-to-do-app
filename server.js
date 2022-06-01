let express = require("express");
let {MongoClient, ObjectId} = require('mongodb');

let myApp = express();
myApp.use(express.urlencoded({extended: false}));
myApp.use(express.static("public"));
myApp.use(express.json());


let bd;
async function go(){
  let client = new MongoClient('mongodb+srv://admin:admin@cluster0.6arhq.mongodb.net/?retryWrites=true&w=majority');
  await client.connect();
  bd = client.db('Lista-Tarefas-Felipe');
    
  myApp.listen(3000, "0.0.0.0", () => {
    console.log("listening on port 3000: ");
  });
}
go();

myApp.get("/", function(req, res){
  bd.collection('tarefas').find().toArray(function(err, arr){
    res.send(`<html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple To-Do App!!</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <h1 class="display-4 text-center py-1">Lista de Tarefas - Felipe JS</h1>
        <h4 class="text-left py-1">Prorgama criado utilizando Javascript + NodeJS + Express + MongoDB</h4>
        
        <div class="jumbotron p-3 shadow-sm">
          <form action="/criar-tarefa" method="POST">
            <div class="input-group mb-3">
               <div class="input-group-prepend">
                 <span class="input-group-text" id="basic-addon1">@Tarefa</span>
               </div>
               <input name="nomeTarefa" type="text" class="form-control" placeholder="nome da tarefa" aria-label="nomeTarefa" aria-describedby="basic-addon1">
             </div>
             <div class="input-group mb-3">
               <div class="input-group-prepend">
                 <span class="input-group-text" id="basic-addon2">@Desc</span>
               </div>
               <textarea name="descTarefa" type="text" class="form-control" placeholder="descrição da tarefa" aria-label="descTarefa" aria-describedby="basic-addon2" rows="4"></textarea>
             </div>
             <div class="input-group mb-3">
               <div class="input-group-prepend">
                 <span class="input-group-text" id="basic-addon3">@Prioridade</span>
               </div>
               <select name="prioridadeTarefa" class="form-control">
                  <option value="Baixa">Baixa</option>
                  <option value="Média">Média</option>
                  <option value="Alta">Alta</option>
               </select>
             </div>
             <div class="input-group mb-3">
               <div class="input-group-prepend">
                 <span class="input-group-text" id="basic-addon2">@Data</span>
               </div>
               <input name="dataTarefa" class="form-control" readonly type="date">
             </div>
            <div class="d-flex justify-content-center">
               <button type="submit" class="btn btn-outline-primary btn-lg">ENVIAR FORMULÁRIO</button>
            </div>        
         </form>
        </div>
  
  
        <h1 class="display-4">Lista de Tarefas!</h1>
      <!--
        <ul class="list-group pb-5">
          <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
            <span class="item-text">teste</span>
            <div>
              <button class="edit-me btn btn-secondary btn-sm mr-1">Editar</button>
              <button class="delete-me btn btn-danger btn-sm">Deletar</button>
            </div>
          </li>
        </ul>
        -->
        ${arr.filter(function(val){
          return val.prioridade;
        }).map(function(val, i , arr){
          return `
        <div class="list-group pb-2">
          <a href="#" class="list-group-item list-group-item-action">
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1 texto-tarefa">${val.nomeTarefa}</h5>
              <small>Tarefa Nº: ${i+1}</small>
            </div>
            <p class="mb-1">${val.descTarefa}</p>
            <small>${val.prioridade}</small>
            <div class="mt-2">
             <button data-id="${val._id}" class="me-editar btn btn-secondary btn-sm mr-1">Edit</button>
             <button data-id="${val._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
             <small class="mt-2" style="display:block;">Data: ${val.data}</small>
           </div>
          </a>
        </div>`
        }).join('')}
        <p>Total de tarefas: ${arr.length}</p>
        <script type="text/javascript" src="/browser.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    </body>
  </html>`);

  });
});

myApp.post("/criar-tarefa", function(req, res){
  bd.collection("tarefas").insertOne({nomeTarefa: req.body.nomeTarefa, descTarefa: req.body.descTarefa, data: "PRA HOJE AMIGO", prioridade: req.body.prioridadeTarefa}, () => {
    res.redirect("/");
  });
});

myApp.post("/atualizar-tarefa", function(req, res){
  bd.collection('tarefas').findOneAndUpdate({_id: new ObjectId(req.body.id)}, {$set: {nomeTarefa: req.body.texto}}, ()=>{
    res.send("sucess");
    console.log("sucess");
  });
});

myApp.post("/deletar-tarefa", function(req, res){
  bd.collection('tarefas').deleteOne({_id: new ObjectId(req.body.id)}, function(){
    res.send("removido do bd com sucesso!");
    console.log("removido do bd com sucesso!");
  })
});
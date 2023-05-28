let express = require("express");
let {MongoClient, ObjectId} = require('mongodb');
let sanitizeHTML = require('sanitize-html')

let myApp = express();
myApp.use(express.urlencoded({extended: false}));
myApp.use(express.static("public"));
myApp.use(express.json());
const passwordProtected = (req, res, next) => {
  res.set('WWW-Authenticate', 'Basic realm="hi friend"');
  console.log(req.headers.authorization);
  // user: felipe //pass: javascript
  if(req.headers.authorization == 'Basic ZmVsaXBlOmphdmFzY3JpcHQ='){
    next();
  }else{
    res.status(401).send('rerr error')
  }
}
myApp.use(passwordProtected);


let bd;
async function go(){
  let client = new MongoClient('mongodb+srv://admin:admin@cluster0.6arhq.mongodb.net/?retryWrites=true&w=majority');
  await client.connect();
  bd = client.db('Lista-Tarefas-Felipe');
    
  myApp.listen(process.env.PORT || 2000, function() {
    console.log("listening on port %s: in %s ", this.address(), myApp.settings.env);
  });
}
go();



myApp.get("/", function(req, res){
  bd.collection('tarefas').find().toArray(function(err, items){
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
        <!--
        <h4 class="text-left py-1">WebApp desenvolvido com:</h4>
        <h4 class="text-left py-1"> JavaScript + Node.JS + framework EXPRESS + AXIOS + MongoDB</h4>-->
        
        <div class="jumbotron p-3 shadow-sm">
          <form id="form" action="/criar-tarefa" method="POST">
            <div class="input-group mb-3">
               <div class="input-group-prepend">
                 <span class="input-group-text" id="basic-addon1">@Tarefa</span>
               </div>
               <input id="tarefaNome" name="nomeTarefa" type="text" class="form-control" placeholder="nome da tarefa" aria-label="nomeTarefa" aria-describedby="basic-addon1">
             </div>
             <div class="input-group mb-3">
               <div class="input-group-prepend">
                 <span class="input-group-text" id="basic-addon2">@Desc</span>
               </div>
               <textarea id="tarefaDesc" name="descTarefa" type="text" class="form-control" placeholder="descrição da tarefa" aria-label="descTarefa" aria-describedby="basic-addon2" rows="4"></textarea>
             </div>
             <div class="input-group mb-3">
               <div class="input-group-prepend">
                 <span class="input-group-text" id="basic-addon3">@Prioridade</span>
               </div>
               <select id="tarefaPrioridade" name="prioridadeTarefa" class="form-control">
                  <option value="Baixa">Baixa</option>
                  <option value="Média">Média</option>
                  <option value="Alta">Alta</option>
               </select>
             </div>
             <div class="input-group mb-3">
               <div class="input-group-prepend">
                 <span class="input-group-text" id="basic-addon2">@Data</span>
               </div>
               <input id="tarefaData" name="dataTarefa" class="form-control" readonly type="date">
             </div>
            <div class="d-flex justify-content-center">
               <button type="submit" class="btn btn-outline-primary btn-lg">ENVIAR TAREFA</button>
            </div>        
         </form>
        </div>
  
  
        <h1 class="display-4">Lista de Tarefas!</h1>
        <ul id="list-item" class="list-group pb-5">
          <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
            <span class="item-text">teste</span>
            <div>
              <button class="edit-me btn btn-secondary btn-sm mr-1">Editar</button>
              <button class="delete-me btn btn-danger btn-sm">Deletar</button>
            </div>
          </li>
        </ul>
        -->
        <!--
        - o browser tem um objeto chamado JSON e método chamado stringify (converte dados javascript/json numa string de texto). Queremos enviar nosso array de objetos do banco de dados(items) db.collection('items').find().toArray(function(err, items)
        -->
        <script>
          let items = ${JSON.stringify(items)}    
        </script>
        <script type="text/javascript" src="/browser.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    </body>
  </html>`);

  });
});
const d = new Date();
myApp.post("/criar-tarefas", function(req, res){
  let safeText = sanitizeHTML(req.body.nomeTarefa, {allowedTags: [], allowedAttributes: {}})
  bd.collection("tarefas").insertOne({nomeTarefa: req.body.nomeTarefa, descTarefa: req.body.descTarefa, data: d, prioridade: req.body.prioridadeTarefa}, (err, info) => {
    res.json({_id: info.insertedId, text: safeText}) // retornar um objeto javascript para o browser com os nomes  _id contendo o id que o mongodb acabou de criar para o item(insertedId) e text contendo o valor do input do browser
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

myApp.post('/criar-tarefa', function(req, res){
  bd.collection('tarefas').insertOne({nomeTarefa:req.body.axiosNomeT, descTarefa: req.body.axiosDescT, data: req.body.axiosData, prioridade: req.body.axiosPrio  }, function(err, info){
    res.json({_id: info.insertedId, nomeTarefa:req.body.axiosNomeT, descTarefa: req.body.axiosDescT, data: d, prioridade: req.body.axiosPrio})
  })
})
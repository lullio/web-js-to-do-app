let express = require("express");
let {MongoClient} = require('mongodb');


let myApp = express();

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
  res.send("teste");
});

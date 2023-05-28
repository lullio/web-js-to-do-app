
// DELETAR TAREFA INTEIRA / LISTA
document.addEventListener("click", function(e){
   if(e.target.classList.contains("delete-me")){
      if(confirm("Deseja remover esta tarefa?")){
         e.preventDefault(); // redirecionar para topo da página
         axios.post("/deletar-tarefa", {id: e.target.getAttribute('data-id')}).then(function(){
            e.target.parentElement.parentElement.parentElement.remove(); 
         }).catch(function(){
   
         })
      }else{
         alert("cancelado!");
      }
     
   }
})

// ATUALIZAR NOME DA TAREFA
document.addEventListener("click", function(e){
   if(e.target.classList.contains("me-editar")){
      let userInput = prompt('Editar o nome da Tarefa: ', e.target.parentElement.parentElement.querySelector('h5.texto-tarefa').innerHTML);
      if(userInput){
         axios.post("/atualizar-tarefa", {texto: userInput, id: e.target.getAttribute('data-id')}).then(() => {
            e.target.parentElement.parentElement.querySelector('h5.texto-tarefa').innerHTML = userInput;
         }).catch((err)=>{
            console.log("ERRO: " + e);
         })
      }
   }
})

// CRIAR TAREFA AXIOS
let 
inputNomeTarefa = document.getElementById("tarefaNome"),
inputDescTarefa = document.getElementById("tarefaDesc"),
inputDescPrio = document.getElementById("tarefaPrioridade"),
inputDataTarefa = document.getElementById("tarefaData");
listaUL = document.getElementById("listaUL");

// criar html, lista
// como vai saber oq eh ${item._id}? , o node precisa enviar um json lá no app.post(create-item)
function htmlItemTemplate(item){
   return  `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
   <span class="item-text">${item.text}</span>
   <div>
     <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
     <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
   </div>
 </li>`
}

// INITIAL PAGE LOAD RENDER
// acessar o raw data(array de objetos do banco de dados(items)) enviado pelo browser(JSON.stringify)
let ourHTML = items.map(function(item, indice, arr){
   return htmlItemTemplate(item); // vai passar o current item do array(item)
}).join('');
document.getElementById("list-item").insertAdjacentHTML("beforeend", ourHTML);

function criarHTML(item, indice, arr){
   return `
   <div id="listaUL" class="list-group">
          <a href="#" class="list-group-item list-group-item-action">
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1 texto-tarefa">${item.nomeTarefa}</h5>
              <small>Tarefa Nº: ${indice+1}</small>
            </div>
            <p class="mb-1">${item.descTarefa}</p>
            <small>${item.prioridade}</small>
            <div class="mt-2">
             <button data-id="${item._id}" class="me-editar btn btn-secondary btn-sm mr-1">Edit</button>
             <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
             <small class="mt-2" style="display:block;">Data: ${item.data}</small>
           </div>
          </a>
      </div>
        }).join('')}
        <p>Total de tarefas no Banco de Dados: ${arr.length}</p>
        <p>Total de tarefas sem nome: ${arr.length}</p>`
}



document.getElementById("form").addEventListener("submit", function(e){
   e.preventDefault();

   axios.post('/criar-tarefa', {axiosNomeT: inputNomeTarefa.value, axiosDescT: inputDescTarefa.value, axiosPrio: inputDescPrio.value, axiosData: 'hoje' }).then((response) => {
      listaUL.insertAdjacentHTML('beforeend', criarHTML(response.data));
   }).catch((e) => {
      console.log(e);
   })
})


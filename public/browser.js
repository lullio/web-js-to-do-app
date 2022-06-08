
// DELETAR TAREFA INTEIRA / LISTA
document.addEventListener("click", function(e){
   if(e.target.classList.contains("delete-me")){
      if(confirm("deseja remover mesmo?")){
         e.preventDefault(); // redirecionar para topo da página
         axios.post("/deletar-tarefa", {id: e.target.getAttribute('data-id')}).then(function(){
            e.target.parentElement.parentElement.parentElement.remove(); 
         }).catch(function(){
   
         })
      }else{
         alert("cancelar pressionado!");
      }
     
   }
})

// ATUALIZAR NOME DA TAREFA
document.addEventListener("click", function(e){
   if(e.target.classList.contains("me-editar")){
      let userInput = prompt('editar somente o nome da tarefa: ', e.target.parentElement.parentElement.querySelector('h5.texto-tarefa').innerHTML);
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

function criarHTML(val){
   return `
   <a href="#" class="list-group-item list-group-item-action">
     <div class="d-flex w-100 justify-content-between">
       <h5 class="mb-1 texto-tarefa">${val.nomeTarefa}</h5>
       <small>Tarefa Nº: </small>
     </div>
     <p class="mb-1">${val.descTarefa}</p>
     <small>${val.prioridade}</small>
     <div class="mt-2">
      <button data-id="${val._id}" class="me-editar btn btn-secondary btn-sm mr-1">Edit</button>
      <button data-id="${val._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
      <small class="mt-2" style="display:block;">Data: ${val.data}</small>
    </div>
   </a>`
}



document.getElementById("form").addEventListener("submit", function(e){
   e.preventDefault();

   axios.post('/criar-tarefa', {axiosNomeT: inputNomeTarefa.value, axiosDescT: inputDescTarefa.value, axiosPrio: inputDescPrio.value, axiosData: 'hoje' }).then((response) => {
      listaUL.insertAdjacentHTML('beforeend', criarHTML(response.data));
   }).catch((e) => {
      console.log(e);
   })
})


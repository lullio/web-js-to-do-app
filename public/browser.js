
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


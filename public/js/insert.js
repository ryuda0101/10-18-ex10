const writeBtn = document.querySelector("button");
        
writeBtn.addEventListener("click",function(event){
    const writeInput = document.querySelector("#insert_container #brd_form input").value.trim();
    const writeTextarea = document.querySelector("#insert_container #brd_form textarea").value.trim();
    if(writeInput === "" || writeTextarea === ""){
        event.preventDefault();
        alert("글을 작성해 주세요")
    }
});
const userinput = document.getElementById("userinput");
const AddTask = document.getElementById("Add_Task");
const Tasklist = document.getElementById("Tasklist");

/* 
1- take the value of user input and add it to ul 

2- need to create li and take the value of inputuser and append to ul

3-add the check box and the delet button

4- need to create checkbox and delete button 


 */
AddTask.addEventListener("click", () => {
  li = document.createElement("li");
  checkbox = document.createElement("input");
  checkbox.type = "checkbox";

  deletebtn = document.createElement("delete");
  deletebtn.addEventListener('click',()=> {
    li.remove()
  })
 const span = document.createElement("span");
span.textContent = userinput.value;
  li.appendChild(checkbox);
  li.appendChild(span);
  Tasklist.appendChild(li);
});

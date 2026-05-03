const userinput = document.getElementById("userinput");
const AddTask = document.getElementById("Add_Task");
const Tasklist = document.getElementById("Tasklist");
let tasks = [];
/* 
1- take the value of user input and add it to ul 

2- need to create li and take the value of inputuser and append to ul

3-add the check box and the delet button

4- need to create checkbox and delete button 


 */
AddTask.addEventListener("click", () => {
  const li = document.createElement("li");
  const checkbox = document.createElement("input");
  const deletebtn = document.createElement("button");
  const span = document.createElement("span");
  if (userinput.value === "") return alert("Enter a Task please");
  // delete button
  deletebtn.addEventListener("click", () => {
    li.remove();
  });
  deletebtn.textContent = "🗑️";

  // checkbox
  checkbox.type = "checkbox";

  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      span.style.textDecoration = "line-through";
    } else {
      span.style.textDecoration = "none";
    }
  });
  // span
  span.textContent = userinput.value;

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deletebtn);
  Tasklist.appendChild(li);
  tasks.push({ text: userinput.value, checked: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  userinput.value = "";
});

function loadTasks() {
  const saved = localStorage.getItem("tasks");
  if (!saved) return;

  tasks = JSON.parse(saved);

  tasks.forEach((task) => {
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    const deletebtn = document.createElement("button");
    const span = document.createElement("span");

    checkbox.type = "checkbox";
    checkbox.checked = task.checked;
    span.textContent = task.text;
    deletebtn.textContent = "🗑️";

    if (task.checked) {
      span.style.textDecoration = "line-through";
    }

    checkbox.addEventListener("change", () => {
      task.checked = checkbox.checked;
      span.style.textDecoration = checkbox.checked ? "line-through" : "none";
      localStorage.setItem("tasks", JSON.stringify(tasks));
    });

    deletebtn.addEventListener("click", () => {
      li.remove();
      tasks = tasks.filter((t) => t !== task);
      localStorage.setItem("tasks", JSON.stringify(tasks));
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deletebtn);
    Tasklist.appendChild(li);
  });
}

loadTasks();

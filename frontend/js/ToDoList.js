const userinput = document.getElementById("userinput");
const AddTask = document.getElementById("Add_Task");
const Tasklist = document.getElementById("Tasklist");
let tasks = [];

AddTask.addEventListener("click", () => {
  const li = document.createElement("li");
  const checkbox = document.createElement("input");
  const deletebtn = document.createElement("button");
  const span = document.createElement("span");
  if (userinput.value === "")
    return showGlassAlert("Enter a task please", "warning");
  // here we create a task object to store
  const task = { text: userinput.value, checked: false };
  // delete button
  deletebtn.addEventListener("click", (event) => {
    event.stopPropagation();
    li.remove();
    tasks = tasks.filter((t) => t !== task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  });
  deletebtn.textContent = "🗑️";

  // checkbox
  checkbox.type = "checkbox";

  li.addEventListener("click", () => {
    checkbox.checked = !checkbox.checked;
    task.checked = checkbox.checked;
    // here the stily link to the task is updated based on the checkbox state
    span.style.textDecoration = checkbox.checked ? "line-through" : "none";
    li.classList.toggle("checked");

    localStorage.setItem("tasks", JSON.stringify(tasks));
  });

  // span
  span.textContent = userinput.value;
  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deletebtn);
  Tasklist.appendChild(li);
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  userinput.value = "";
});

// load task
// do list task save storage
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

    li.addEventListener("click", () => {
      task.checked = !task.checked;
      span.style.textDecoration = task.checked ? "line-through" : "none";
      li.classList.toggle("checked");
      localStorage.setItem("tasks", JSON.stringify(tasks));
    });

    deletebtn.addEventListener("click", (event) => {
      event.stopPropagation();
      li.remove();
      tasks = tasks.filter((t) => t !== task);
      localStorage.setItem("tasks", JSON.stringify(tasks));
    });
    if (task.checked) {
      span.style.textDecoration = "line-through";
      li.classList.add("checked");
    }

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deletebtn);
    Tasklist.appendChild(li);
  });
}

loadTasks();

window.addEventListener("storage", () => {
  ToDoList.innerHTML = "";
  loadTasks();
});

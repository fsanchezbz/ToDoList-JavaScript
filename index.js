const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#tasks");
const taskList = Array.from(JSON.parse(localStorage.getItem("taskList")) || []);

//make store
const setStorage = () => {
  localStorage.setItem("taskList", JSON.stringify(taskList));
};

const addTaskToStorage = ({ value, isCompleted, id }) => {
  taskList.push({ value, isCompleted, id });
};

const findTaskIndex = (id) => taskList.findIndex((x) => x.id === id);

const findTask = (id) => taskList.find((x) => x.id === id);

const completeTask = (task_input, isCompleted) => {
  if (isCompleted) {
    task_input.style.textDecoration = "line-through";
    task_input.setAttribute("readonly", "readonly");
  }
};

const addTaskRow = ({ value, isCompleted, id }) => {
  const task_div = document.createElement("div");
  task_div.classList.add("task");
  list.appendChild(task_div);

  const task_content_div = document.createElement("div");
  task_content_div.classList.add("content");
  task_div.appendChild(task_content_div);
  const task_input = document.createElement("input");
  task_input.classList.add("text");
  task_input.type = "text";
  task_input.value = value;
  task_input.id = id;
  task_input.setAttribute("readonly", "readonly");
  task_content_div.appendChild(task_input);

  const task_actions_div = document.createElement("div");
  task_actions_div.classList.add("actions");
  task_div.appendChild(task_actions_div);

  const task_edit_botton = document.createElement("button");
  task_edit_botton.classList.add("Edit");
  task_edit_botton.innerHTML = "Edit";

  const task_delete_button = document.createElement("button");
  task_delete_button.classList.add("Delete");
  task_delete_button.innerHTML = "Delete";

  const task_completed_button = document.createElement("button");
  task_completed_button.classList.add("Marked");
  task_completed_button.innerHTML = "Marked";

  completeTask(task_input, isCompleted);

  task_actions_div.appendChild(task_edit_botton);
  task_actions_div.appendChild(task_completed_button);
  task_actions_div.appendChild(task_delete_button);

  task_edit_botton.addEventListener("click", () => {
    if (task_edit_botton.innerText.toLowerCase() == "edit") {
      task_input.removeAttribute("readonly");
      task_input.focus();
      task_edit_botton.innerText = "Save";
      task_input.style.textDecoration = "none";
    } else {
      task_input.setAttribute("readonly", "readonly");
      task_edit_botton.innerText = "Edit";
      const task_edited = findTask(id);
      task_edited.value = task_input.value;
      setStorage();
    }
  });

  task_delete_button.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete this task?")) {
      list.removeChild(task_div);
      const idx = findTaskIndex(id);
      taskList.splice(idx, 1);
      setStorage();
    }
  });

  task_completed_button.addEventListener("click", () => {
    completeTask(task_input, true);
    const task_completed = findTask(id);
    task_completed.isCompleted = true;
    setStorage();
  });
};

window.addEventListener("load", () => {
  taskList.forEach((task) => {
    addTaskRow({
      value: task.value,
      id: task.id,
      isCompleted: task.isCompleted,
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const task = {
      value: input.value,
      id: taskList.length,
      isCompleted: false,
    };
    if (!task.value) {
      return;
    }

    addTaskRow(task);

    addTaskToStorage(task);
    
    setStorage();
    input.value = "";
  });
});

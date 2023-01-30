const todos = [];
const RENDER_EVENT = "render-todo";
const STORAGE_KEY = "TODO_APPS";
document.addEventListener(RENDER_EVENT, function () {
  // const todoList = JSON.parse(todos);
  console.log(todos);
  const uncompletedTodos = document.getElementById("todos");
  uncompletedTodos.innerHTML = "";
  const completedTodos = document.getElementById("completed-todos");
  completedTodos.innerHTML = "";

  for (todoItem of todos) {
    const todosElement = makeTodo(todoItem);
    console.log(todosElement);
    if (!todoItem.isComplete) {
      uncompletedTodos.append(todosElement);
    } else {
      completedTodos.append(todosElement);
    }
  }
});

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let todoList = JSON.parse(serializedData);

  if (todoList !== null) {
    for (const todo of todoList) {
      todos.push(todo);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateID() {
  return +new Date();
}

function generateTodo(id, task, date, isComplete) {
  return {
    id,
    task,
    date,
    isComplete,
  };
}

function addTodo() {
  const taskText = document.getElementById("task").value;
  const dateText = document.getElementById("date").value;
  const generateId = generateID();
  const todoList = generateTodo(generateId, taskText, dateText, false);

  todos.push(todoList);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findId(id) {
  for (todoItem of todos) {
    if (todoItem.id === id) {
      return todoItem;
    }
  }
  return null;
}

function findTodoIndex(id) {
  for (index in todos) {
    if (todos[index].id == id) {
      return index;
    }
  }
  return null;
}

function removeTask(id) {
  const todoTarget = findTodoIndex(id);
  if (todoTarget == null) {
    return;
  }
  todos.splice(todoTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function toUncompleteTask(id) {
  const todoTarget = findId(id);
  if (todoTarget == null) {
    return;
  }
  todoTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function toCompletedTask(id) {
  const todoTarget = findId(id);
  if (todoTarget == null) {
    return;
  }
  todoTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function makeTodo(todoItem) {
  const taskTitle = document.createElement("h2");
  taskTitle.innerHTML = todoItem.task;

  const taskDate = document.createElement("p");
  taskDate.innerHTML = todoItem.date;

  const inner = document.createElement("div");
  inner.classList.add("inner");
  inner.append(taskTitle, taskDate);

  const icons = document.createElement("div");
  icons.classList.add("icons");

  if (!todoItem.isComplete) {
    const buttonCheck = document.createElement("i");
    buttonCheck.setAttribute("id", "button-check");
    buttonCheck.classList.add("icon", "fa-solid", "fa-check");
    buttonCheck.addEventListener("click", function () {
      toCompletedTask(todoItem.id);
    });
    icons.append(buttonCheck);
  } else {
    const buttonUndo = document.createElement("i");
    buttonUndo.setAttribute("id", "button-undo");
    buttonUndo.classList.add("icon", "fa-solid", "fa-rotate-left");
    buttonUndo.addEventListener("click", function () {
      toUncompleteTask(todoItem.id);
    });
    const buttonRemove = document.createElement("i");
    buttonRemove.setAttribute("id", "button-remove");
    buttonRemove.classList.add("icon", "fa-solid", "fa-trash");
    buttonRemove.addEventListener("click", () => {
      removeTask(todoItem.id);
    });
    icons.append(buttonUndo, buttonRemove);
  }

  const itemShadow = document.createElement("div");
  itemShadow.classList.add("item", "shadow");
  itemShadow.append(inner, icons);

  return itemShadow;
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.querySelector(".form-task");
  submitForm.addEventListener("submit", function (e) {
    e.preventDefault();
    document.dispatchEvent(new Event(RENDER_EVENT));
    addTodo();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

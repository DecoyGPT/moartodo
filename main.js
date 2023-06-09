// Retrieve tasks from local storage or initialize an empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Retrieve title from local storage or set default title
let title = document.getElementById('title');
let storedTitle = localStorage.getItem('title');
if (storedTitle) {
  title.textContent = storedTitle;
}

let editTitleButton = document.getElementById('edit-title-button');

// Function to escape HTML special characters
function escapeHTML(text) {
  let div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Toggle contenteditable attribute on click of the edit button
editTitleButton.addEventListener('click', function() {
  let isEditable = title.getAttribute('contenteditable');
  if (isEditable == 'false') {
    title.setAttribute('contenteditable', 'true');
    title.focus();
  } else {
    title.setAttribute('contenteditable', 'false');
    // Save the title to local storage
    localStorage.setItem('title', escapeHTML(title.textContent));
  }
});

let infoButton = document.getElementById('info-button');
let infoText = document.getElementById('info-text');

infoButton.addEventListener('click', function() {
  if (infoText.style.display === 'none') {
    infoText.style.display = 'block';
  } else {
    infoText.style.display = 'none';
  }
});

// Function to render the task list
function renderTasks() {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
    listItem.innerHTML = `
      <span>${escapeHTML(task)}</span>
      <div>
        <button class="btn btn-success btn-sm mr-1 complete-task" data-index="${index}">Complete</button>
        <button class="btn btn-danger btn-sm delete-task" data-index="${index}">Delete</button>
      </div>
    `;
    taskList.appendChild(listItem);
  });

  // Add event listeners for complete and delete buttons
  const completeButtons = document.getElementsByClassName('complete-task');
  for (let button of completeButtons) {
    button.addEventListener('click', completeTask);
  }

  const deleteButtons = document.getElementsByClassName('delete-task');
  for (let button of deleteButtons) {
    button.addEventListener('click', deleteTask);
  }
}

// Function to add a new task
function addTask(event) {
  event.preventDefault();
  const input = document.getElementById('todo-input');
  const task = input.value.trim();

  if (task !== '') {
    tasks.push(task);
    input.value = '';
    renderTasks();
    updateLocalStorage();
  }
}

// Function to complete a task
function completeTask(event) {
  const index = event.target.getAttribute('data-index');
  tasks.splice(index, 1);
  renderTasks();
  updateLocalStorage();
}

// Function to delete a task
function deleteTask(event) {
  const index = event.target.getAttribute('data-index');
  tasks.splice(index, 1);
  renderTasks();
  updateLocalStorage();
}

// Function to update local storage with tasks
function updateLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add event listener for form submission
const form = document.getElementById('todo-form');
form.addEventListener('submit', addTask);

// Initial rendering of tasks
renderTasks();

// Initialize sortable
let taskList = document.getElementById('task-list');
new Sortable(taskList, {
  animation: 150,
  filter: '.btn',
  preventOnFilter: false,
  onEnd: function () {
    tasks = [];
    let taskItems = taskList.getElementsByClassName('list-group-item');
    for (let taskItem of taskItems) {
      let taskText = taskItem.getElementsByTagName('span')[0].textContent;
      tasks.push(taskText);
    }
    updateLocalStorage();
  }
});
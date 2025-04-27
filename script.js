// Task Management
const addTaskButton = document.getElementById('add-task');
const taskTitleInput = document.getElementById('task-title');
const taskDescriptionInput = document.getElementById('task-description');
const taskDateInput = document.getElementById('task-date');
const taskCategoryInput = document.getElementById('task-category');
const taskPriorityInput = document.getElementById('task-priority');
const tasksList = document.getElementById('tasks').getElementsByTagName('tbody')[0];
const searchBar = document.getElementById('search-bar');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Function to render the task list
const renderTasks = () => {
  const searchTerm = searchBar.value.toLowerCase();
  tasksList.innerHTML = '';

  tasks
    .filter(task => task.title.toLowerCase().includes(searchTerm) || task.priority.toLowerCase().includes(searchTerm))
    .forEach((task, index) => {
      const taskRow = document.createElement('tr');
      taskRow.classList.add('task-item');
      if (task.completed) taskRow.classList.add('completed');
  
      taskRow.innerHTML = `
        <td>${task.title}</td>
        <td>${task.description}</td>
        <td>${task.dueDate}</td>
        <td>
          <select class="category-edit" data-index="${index}">
            <option value="Work" ${task.category === 'Work' ? 'selected' : ''}>Work</option>
            <option value="Personal" ${task.category === 'Personal' ? 'selected' : ''}>Personal</option>
            <option value="Urgent" ${task.category === 'Urgent' ? 'selected' : ''}>Urgent</option>
          </select>
        </td>
        <td>${task.priority}</td>
        <td><input type="checkbox" class="complete-checkbox" data-index="${index}" ${task.completed ? 'checked' : ''}></td>
        <td>
          <button class="edit-task" data-index="${index}">Edit</button>
          <button class="delete-task" data-index="${index}">Delete</button>
        </td>
      `;
      tasksList.appendChild(taskRow);
    });

  // Add event listeners to buttons and checkboxes
  document.querySelectorAll('.complete-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', toggleCompletion);
  });
  document.querySelectorAll('.delete-task').forEach(button => {
    button.addEventListener('click', deleteTask);
  });
  document.querySelectorAll('.edit-task').forEach(button => {
    button.addEventListener('click', editTask);
  });
  document.querySelectorAll('.category-edit').forEach(select => {
    select.addEventListener('change', editCategory);
  });
};

// Add Task
const addTask = () => {
  const title = taskTitleInput.value.trim();
  const description = taskDescriptionInput.value.trim();
  const dueDate = taskDateInput.value.trim();
  const category = taskCategoryInput.value;
  const priority = taskPriorityInput.value;

  if (title === '' || dueDate === '' || category === '' || priority === '') return;

  const newTask = {
    title,
    description,
    dueDate,
    category,
    priority,
    completed: false
  };

  tasks.push(newTask);
  saveToLocalStorage();
  resetForm();
  renderTasks();
};

// Toggle Task Completion
const toggleCompletion = (event) => {
  const taskIndex = event.target.dataset.index;
  tasks[taskIndex].completed = event.target.checked;
  saveToLocalStorage();
  renderTasks();
};

// Delete Task with Confirmation
const deleteTask = (event) => {
  const taskIndex = event.target.dataset.index;

  // Confirm Deletion
  const confirmDelete = confirm("Are you sure you want to delete this task?");
  if (!confirmDelete) return; // Do nothing if the user cancels

  tasks.splice(taskIndex, 1);
  saveToLocalStorage();
  renderTasks();
};

// Edit Task
const editTask = (event) => {
  const taskIndex = event.target.dataset.index;
  const task = tasks[taskIndex];

  taskTitleInput.value = task.title;
  taskDescriptionInput.value = task.description;
  taskDateInput.value = task.dueDate;
  taskCategoryInput.value = task.category;
  taskPriorityInput.value = task.priority;

  addTaskButton.textContent = "Save Changes";
  addTaskButton.removeEventListener('click', addTask);
  addTaskButton.addEventListener('click', () => saveChanges(taskIndex));
};

// Save Task Changes
const saveChanges = (taskIndex) => {
  const title = taskTitleInput.value.trim();
  const description = taskDescriptionInput.value.trim();
  const dueDate = taskDateInput.value.trim();
  const category = taskCategoryInput.value;
  const priority = taskPriorityInput.value;

  if (title === '' || dueDate === '' || category === '' || priority === '') return;

  tasks[taskIndex] = { ...tasks[taskIndex], title, description, dueDate, category, priority };
  saveToLocalStorage();
  resetForm();
  renderTasks();
};

// Reset Form
const resetForm = () => {
  taskTitleInput.value = '';
  taskDescriptionInput.value = '';
  taskDateInput.value = '';
  taskCategoryInput.value = 'Work';
  taskPriorityInput.value = 'Low';

  addTaskButton.textContent = "Add Task";
  addTaskButton.removeEventListener('click', saveChanges);
  addTaskButton.addEventListener('click', addTask);
};

// Edit Category
const editCategory = (event) => {
  const taskIndex = event.target.dataset.index;
  tasks[taskIndex].category = event.target.value;
  saveToLocalStorage();
  renderTasks();
};

// Save tasks to localStorage
const saveToLocalStorage = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Sort Tasks by Priority
const sortByPriority = () => {
  const priorityOrder = { 'Low': 3, 'Medium': 2, 'High': 1 };

  tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  renderTasks();
};

// Sort Tasks by Due Date
const sortByDueDate = () => {
  tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  renderTasks();
};

// Search Tasks
searchBar.addEventListener('input', renderTasks);

// Sorting Buttons Event Listeners
document.getElementById('sort-due-date').addEventListener('click', sortByDueDate);
document.getElementById('sort-priority').addEventListener('click', sortByPriority);

// Initial render
renderTasks();

// Add Event Listener to Add Task Button
addTaskButton.addEventListener('click', addTask);

// Toggle Dark Mode
document.getElementById('theme-toggle').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const currentMode = document.body.classList.contains('dark-mode') ? 'Dark' : 'Light';
  document.getElementById('theme-toggle').textContent = `Switch to ${currentMode} Mode`;
});

let state = {
  columns: [
    {
      id: "col1",
      title: "To Do",
      tasks: [
        {
          id: "task1",
          title: "জাভাস্ক্রিপ্ট শিখবো",
          description: "মডার্ন জাভাস্ক্রিপ্ট প্রাকটিস",
          priority: "high", // 'high', 'medium', 'low'
          dueDate: "2024-03-20", // YYYY-MM-DD format
        },
        {
          id: "task2",
          title: "কানবান বানাবো",
          description: "ড্র্যাগ ড্রপ ফিচার যোগ করতে হবে",
          priority: "high",
          dueDate: "2024-03-15",
        },
      ],
    },
    {
      id: "col2",
      title: "In Progress",
      tasks: [
        {
          id: "task3",
          title: "রেন্ডার ফাংশন লিখছি",
          description: "পারফরমেন্স অপটিমাইজ করতে হবে",
          priority: "medium",
          dueDate: "2024-03-18",
        },
      ],
    },
    {
      id: "col3",
      title: "Done",
      tasks: [],
    },
  ],
};

const boardEl = document.getElementById("board");
const addColumnBtn = document.getElementById("addColumnBtn");
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const fileInput = document.getElementById("fileInput");
let modal = document.getElementById("formModal");
let nextColumnId = state.columns.length;
let taskToDelete = null;
let editingTask = null;
let columnToDelete = null;
let deletingColumn = null;
let draggedTaskId = null;
const closeAddTaskModal = document.getElementById("closeAddTaskModal");
const addTaskBtn = document.getElementById("openAddTaskModal");
const editAddTask = document.getElementById("openAddTaskModal");
const delateModal = document.getElementById("deleteModal");
const cancelDelateBtn = document.getElementById("cancelDelete");
const confirmDeleteBtn = document.getElementById("confirmDelete");
const addColumnModal = document.getElementById("columnModal");
const confirmAddColumn = document.getElementById("confirm-add-col");
const cancelAddColumn = document.getElementById("cancel-add-col");
const newColumnName = document.getElementById("newColumnName");
const addColumnForm = document.getElementById("addColumnForm");
const closeModal = document.querySelector(".close-column-modal");
const editTask = document.getElementById("editTask");
const confirmEditColumn = document.getElementById("confirm-edit-col");
const editColumnModal = document.getElementById("editColumnModal");
const cancelEditColumn = document.getElementById("cancel-edit-col");
const editedColumnName = document.getElementById("newColumnName-edit");
const searchInput = document.getElementById("searchInput");
let crossBtn = document.getElementById('cross-column-modal')

const title = document.getElementById("newTitle");
const description = document.getElementById("newDescription");
const priority = document.getElementById("newPriority");
const date = document.getElementById("newDate");

function render(data = state.columns) {
  // ১. বোর্ড খালি করুন
  boardEl.innerHTML = "";

  // ২. প্রতিটি কলামের জন্য লুপ
  for (let i = 0; i < data.length; i++) {
    const column = data[i];

    // ৩. কলাম ডিভ বানান
    const columnDiv = document.createElement("div");
    columnDiv.className = "column";
    columnDiv.setAttribute("data-column-id", column.id);

    // ৪. কলামের ভিতরের HTML সেট করুন
    columnDiv.innerHTML = `
            <div class="column-header">
                <h3 class='column-title'>${column.title} (${column.tasks.length})</h3>
                <div class="column-actions">
                    <button class="add-task-btn">➕</button>
                    <button class="edit-column-btn">✏️</button>
                    <button class="delete-column-btn">🗑️</button>
              </div>
            </div>
            <div class="tasks-container" data-column-id="${column.id}">
                ${
                  column.tasks.length === 0
                    ? `<p class='empty-task'>Drop tasks here or add new</p>`
                    : column.tasks
                        .map(
                          (task) => `
                    <div draggable='true' class="task" data-task-id="${task.id}">
                        <div class='task-content'>
                        <span id='taskTitle'>${task.title}</span>
                        <span id='task-description'>${task.description}</span>
                        <div class="priority">
                        <span class="priority-dot ${task.priority}"></span>
                        <span class="priority-text">${task.priority}</span>
                        </div>
                        </div>
                        <div class='task-action-and-date'>
                        <div class="task-actions">
                            <button class="edit-task-btn">✏️</button>
                            <button class="delete-task-btn">🗑️</button>
                        </div>
                        <span class='span-date'>${task.dueDate ? `📅 ${task.dueDate}` : ""}</span>
                        </div>
                    </div>
                `,
                        )
                        .join("")
                }
            </div>
        `;

    // ৫. কলাম বোর্ডে যোগ করুন
    boardEl.appendChild(columnDiv);
  }

  attachDragEvents();
}

// local storage

function saveToLocalStorage() {
  localStorage.setItem("data", JSON.stringify(state));
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem("data");

  if (saved) {
    state = JSON.parse(saved);
    render();
  }
}

// add task

let currentColumnId = null;

boardEl.addEventListener("click", function (e) {
  if (e.target.classList.contains("add-task-btn")) {
    const column = e.target.closest(".column");
    currentColumnId = column.dataset.columnId;

    modal.style.display = "flex";
  }
});

addTaskBtn.addEventListener("click", function () {
  if (!currentColumnId) return;

  let titleVal = document.getElementById("newTitle").value;
  if (titleVal === "") {
    modal.style.display = "none";
    return;
  }

  const newTask = {
    id: `task${Date.now()}`,
    title: document.getElementById("newTitle").value,
    description: document.getElementById("newDescription").value,
    priority: document.getElementById("newPriority").value,
    dueDate: document.getElementById("newDate").value,
  };

  addTask(currentColumnId, newTask);
  modal.style.display = "none";

  currentColumnId = null;

  ((document.getElementById("newTitle").value = ""),
    (document.getElementById("newDescription").value = ""),
    (document.getElementById("newPriority").value = "medium"),
    (document.getElementById("newDate").value = ""));
});

function addTask(columnId, newTask) {
  const columnData = state.columns.find((col) => col.id === columnId);
  columnData.tasks.push(newTask);

  saveToLocalStorage();
  render();
}

closeAddTaskModal.addEventListener("click", function () {
  modal.style.display = "none";
});
document.addEventListener("DOMContentLoaded", function () {
  loadFromLocalStorage();
  render();
});

// edit task

boardEl.addEventListener("click", function (e) {
  if (e.target.classList.contains("edit-task-btn")) {
    let taskDiv = e.target.closest(".task");
    const taskId = taskDiv.dataset.taskId;

    const columnDiv = e.target.closest(".column");
    const columnId = columnDiv.dataset.columnId;

    modal.style.display = "flex";

    const columnData = state.columns.find((col) => col.id === columnId);

    editingTask = columnData.tasks.find((task) => task.id === taskId);

    title.value = editingTask.title;
    description.value = editingTask.description;
    priority.value = editingTask.priority;
    date.value = editingTask.dueDate;
  }
});

editAddTask.addEventListener("click", function () {
  if (!editingTask) return;

  editingTask.title = title.value;
  editingTask.description = description.value;
  editingTask.priority = priority.value;
  editingTask.dueDate = date.value;

  saveToLocalStorage();
  render();

  modal.style.display = "none";
});

// delete task
boardEl.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-column-btn")) {
    delateModal.style.display = "flex";

    const columnDiv = e.target.closest(".column");
    deletingColumn = columnDiv.dataset.columnId;
  }
});

boardEl.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-task-btn")) {
    delateModal.style.display = "flex";

    const taskDiv = e.target.closest(".task");
    taskToDelete = taskDiv.dataset.taskId;

    const columnDiv = e.target.closest(".column");
    columnToDelete = columnDiv.dataset.columnId;
  }
});

confirmDeleteBtn.addEventListener("click", function () {
  if (taskToDelete) {
    deleteTask(taskToDelete, columnToDelete);
    delateModal.style.display = "none";
  }

  if (deletingColumn) {
    delateColumn(deletingColumn);
    delateModal.style.display = "none";
  }
});

function deleteTask(taskId, columnId) {
  const columnData = state.columns.find((col) => col.id === columnId);

  columnData.tasks = columnData.tasks.filter((task) => task.id !== taskId);

  saveToLocalStorage();
  render();
  delateModal.style.display = "none";
  taskToDelete = null;
}

// cancel button code
cancelDelateBtn.addEventListener("click", function () {
  delateModal.style.display = "none";
});

closeModal.addEventListener("click", function () {
  addColumnModal.style.display = "none";
});

// add column

cancelAddColumn.addEventListener("click", function () {
  addColumnModal.style.display = "none";
});

addColumnBtn.addEventListener("click", function () {
  addColumnModal.style.display = "flex";
});

addColumnForm.addEventListener("submit", function (e) {
  let titleVal = newColumnName.value;

  if (titleVal.trim() === "") return;

  e.preventDefault();

  const newColumn = {
    id: `col${nextColumnId++}`,
    title: titleVal,
    tasks: [],
  };

  state.columns.push(newColumn);

  saveToLocalStorage();
  render();
  addColumnModal.style.display = "none";
  addColumnForm.reset();
});

// delate column

function delateColumn(columnId) {
  state.columns = state.columns.filter((col) => col.id !== columnId);

  deletingColumn = null;

  saveToLocalStorage();
  render();
}

// Edit Column
let sourceColumn = null;
boardEl.addEventListener("click", function (e) {
  if (e.target.classList.contains("edit-column-btn")) {
    let columnDiv = e.target.closest(".column");
    let columnId = columnDiv.dataset.columnId;

    editColumnModal.style.display = "flex";

    selectedColumn = state.columns.find((col) => col.id === columnId);

    editedColumnName.value = selectedColumn.title;
  }
});

crossBtn.addEventListener('click',function(){
  editColumnModal.style.display = 'none'
})

confirmEditColumn.addEventListener("click", function () {
  let newColName = editedColumnName.value;
  editColumn(selectedColumn, newColName);
});

cancelEditColumn.addEventListener("click", function () {
  editColumnModal.style.display = "none";
});

function editColumn(selectedColumn, newColumnName) {
  selectedColumn.title = newColumnName;

  saveToLocalStorage();
  render();

  editColumnModal.style.display = "none";
}

// Search input

searchInput.addEventListener("input", function (e) {
  let input = e.target.value.toLowerCase();

  let filtered = state.columns.map(function (column) {
    return {
      ...column,
      tasks: column.tasks.filter(function (task) {
        return (
          task.title?.toLocaleLowerCase().includes(input) ||
          task.description?.toLocaleLowerCase().includes(input) ||
          task.dueDate?.toLocaleLowerCase().includes(input) ||
          task.priority?.toLocaleLowerCase().includes(input)
        );
      }),
    };
  });

  render(filtered);
});

// export btn

exportBtn.addEventListener("click", function () {
  const dataStr = JSON.stringify(
    {
      columns: state.columns,
      exportTime: new Date().toISOString(),
      version: "1.0",
    },
    null,
    2,
  );

  const blob = new Blob([dataStr], { type: "application/json" });

  const url = URL.createObjectURL(blob);
  let a = document.createElement("a");

  a.href = url;
  a.download = `kanban-board-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();

  URL.revokeObjectURL(url);
});

// import btn

importBtn.addEventListener("click", function () {
  fileInput.click();
});

fileInput.addEventListener("change", function (e) {
  let file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (event) {
    try {
      let content = event.target.result;

      const parsed = JSON.parse(content);
      if (!parsed.columns || !Array.isArray(parsed.columns)) {
        throw new Error("Invalid structure");
      }

      state.columns = parsed.columns;

      saveToLocalStorage();
      render();
    } catch (error) {
      alert(error.message);
    }
  };
  reader.readAsText(file);

  fileInput.value = "";
});

// drag and drop

function attachDragEvents() {
  const tasks = document.querySelectorAll(".task");

  tasks.forEach((task) => {
    task.addEventListener("dragstart", function () {
      draggedTaskId = this.dataset.taskId;
    });
  });
}

boardEl.addEventListener("dragover", function (e) {
  e.preventDefault();
});

boardEl.addEventListener("drop", function (e) {
  e.preventDefault(); 
  let taskContainer = e.target.closest('.tasks-container');

  if(!taskContainer) return;

  const newColumnId = taskContainer.dataset.columnId;

  let draggedTask = null;

  if (!draggedTaskId) return;

  state.columns.forEach(col => {
    col.tasks = col.tasks.filter(task => {
        if(task.id === draggedTaskId){
            draggedTask = task;
            return false; // remove from old column
        }
        return true;
    });
  });

  if(draggedTask){
    const targetColumn = state.columns.find(col => col.id === newColumnId);
    targetColumn.tasks.push(draggedTask);
  }

  draggedTaskId = null;
  saveToLocalStorage();
  render();
});


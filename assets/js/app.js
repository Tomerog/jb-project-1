function collectData() {
    const description = document.getElementById('description').value
    const date = document.getElementById('date').value
    const time = document.getElementById('time').value
    const index = getNumberOfTasksInLocalStorage()
    return {
        index,
        description,
        date,
        time,
    }
}

function generateHTML(data) {
    const newHTML = `
        <div  class="task">
            <div class="taskContent">
                <div> 
                    <span onclick="deleteTask(${data.index})" class="glyphicon glyphicon-remove" aria-hidden="true"></span> 
                </div>
                <div>${data.description}</div>
                <div>${data.date}</div>
                <div>${data.time}</div>
            </div>
        </div>
    `
    return newHTML
}

function renderHTML(newHTML) {
    const tasksContainer = document.getElementById('tasks')
    tasksContainer.innerHTML += newHTML
}

function clearForm() {
    const tasksForm = document.getElementById('tasksForm')
    tasksForm.reset()
    const descriptionInput = document.getElementById('description')
    descriptionInput.focus()
}

function saveTaskToStorage(taskObject) {
    const currentTasksInStorageJSON = localStorage.getItem('tasks')
    const currentTasksInStorage = JSON.parse(currentTasksInStorageJSON)
    currentTasksInStorage.push(taskObject)
    localStorage.setItem('tasks', JSON.stringify(currentTasksInStorage))
}

function loadTasksFromLocalStorage() {
    const tasksJSON = localStorage.getItem('tasks')
    if (tasksJSON) {
        const tasks = JSON.parse(tasksJSON)
        for (let i = 0; i < tasks.length; i++) {
            tasks[i].index = i
            const newHTML = generateHTML(tasks[i])
            renderHTML(newHTML)
        }
    }
}

function initStorage() {
    const currentTasksInStorageJSON = localStorage.getItem('tasks')
    if (!currentTasksInStorageJSON) {
        localStorage.setItem('tasks', JSON.stringify([]))
    }
}

function getNumberOfTasksInLocalStorage() {
    return JSON.parse(localStorage.getItem('tasks')).length
}

function addTask(event) {
    event.preventDefault()
    const data = collectData()
    const newHTML = generateHTML(data)
    renderHTML(newHTML)
    saveTaskToStorage(data)
    clearForm()
}

// Modified deleteTask function to update indices of remaining tasks
function deleteTask(index) {
    const tasksContainer = document.getElementById('tasks')
    const taskToDelete = tasksContainer.children[index]
    if (taskToDelete) {
        tasksContainer.removeChild(taskToDelete) // Remove from DOM
    }

    // Update tasks in localStorage
    const tasks = JSON.parse(localStorage.getItem('tasks'))
    tasks.splice(index, 1) // Remove the task from the array

    // Update the index of the remaining tasks in the array and the DOM
    for (let i = 0; i < tasks.length; i++) {
        tasks[i].index = i // Update each task's index
        // Update the DOM element's index attribute if needed
        const taskElement = tasksContainer.children[i]
        if (taskElement) {
            const deleteButton = taskElement.querySelector('span')
            if (deleteButton) {
                deleteButton.setAttribute('onclick', 'deleteTask(' + i + ')') // Update the delete button's onclick
            }
        }
    }

    // Save the updated tasks back to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

initStorage()
loadTasksFromLocalStorage()

function loadTasksFromLocalStorage() {
    const tasksJSON = localStorage.getItem('tasks')
    if (tasksJSON) {
        const tasks = JSON.parse(tasksJSON)
        const now = new Date()  // Get current date and time

        // Filter out tasks that have passed their date and time
        const updatedTasks = tasks.filter(function(task) {
            const taskDateTime = new Date(task.date + ' ' + task.time);  // Combine date and time from task object
            return taskDateTime >= now; // Keep only tasks that have not passed
        })

        // Save the updated tasks back to localStorage
        localStorage.setItem('tasks', JSON.stringify(updatedTasks))

        // Render remaining tasks
        for (let i = 0; i < updatedTasks.length; i++) {
            updatedTasks[i].index = i // Update the index
            const newHTML = generateHTML(updatedTasks[i])
            renderHTML(newHTML)
        }
    }
}



let config;

async function loadConfig() {
    const response = await fetch("config.json");
    config = await response.json();
    loadTasks();
}

async function loadTasks() {
    const response = await fetch(
        `${config.supabaseUrl}/rest/v1/tasks?select=*`,
        {
            headers: {
                "apikey": config.supabasePublishableKey,
                "Authorization": `Bearer ${config.supabasePublishableKey}`
            }
        }
    );

    const tasks = await response.json();

    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    tasks.forEach(task => {
        taskList.innerHTML += `
            <div class="task-item" data-id="${task.id}">
                <h3 class="task-title">${task.title}</h3>

                <p class="task-description">
                    ${task.description || ""}
                </p>

                <p class="task-status">
                    ${task.completed ? "Completed" : "Incomplete"}
                </p>

                <button class="edit-task">
                    Edit
                </button>

                <button class="delete-task"
                        onclick="deleteTask(${task.id})">
                    Delete
                </button>

                <button class="toggle-task">
                    Toggle Status
                </button>
            </div>
        `;
    });
}

async function deleteTask(id) {
    await fetch(
        `${config.supabaseUrl}/rest/v1/tasks?id=eq.${id}`,
        {
            method: "DELETE",
            headers: {
                "apikey": config.supabasePublishableKey,
                "Authorization": `Bearer ${config.supabasePublishableKey}`
            }
        }
    );

    loadTasks();
}

document.getElementById("task-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("task-title").value;
    const description = document.getElementById("task-description").value;

    await fetch(
        `${config.supabaseUrl}/rest/v1/tasks`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": config.supabasePublishableKey,
                "Authorization": `Bearer ${config.supabasePublishableKey}`
            },
            body: JSON.stringify({
                title,
                description,
                completed: false
            })
        }
    );

    document.getElementById("task-form").reset();
    loadTasks();
});

loadConfig();
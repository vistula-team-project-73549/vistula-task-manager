let config;
let editingTaskId = null;

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

        const taskDiv = document.createElement("div");
        taskDiv.className = "task-item";
        taskDiv.dataset.id = task.id;

        taskDiv.innerHTML = `
            <h3 class="task-title">${task.title}</h3>
            <p class="task-description">${task.description || ""}</p>
            <p class="task-status">
                ${task.completed ? "Completed" : "Incomplete"}
            </p>

            <button class="edit-task">Edit</button>
            <button class="delete-task">Delete</button>
            <button class="toggle-task">Toggle Status</button>
        `;

        taskDiv.querySelector(".edit-task")
            .addEventListener("click", () => {

                document.getElementById("task-title").value = task.title;
                document.getElementById("task-description").value =
                    task.description || "";

                editingTaskId = task.id;

                document.getElementById("task-submit").textContent =
                    "Update Task";
            });

        taskDiv.querySelector(".delete-task")
            .addEventListener("click", async () => {

                await fetch(
                    `${config.supabaseUrl}/rest/v1/tasks?id=eq.${task.id}`,
                    {
                        method: "DELETE",
                        headers: {
                            "apikey": config.supabasePublishableKey,
                            "Authorization": `Bearer ${config.supablePublishableKey || config.supabasePublishableKey}`
                        }
                    }
                );

                loadTasks();
            });

        taskDiv.querySelector(".toggle-task")
            .addEventListener("click", async () => {

                await fetch(
                    `${config.supabaseUrl}/rest/v1/tasks?id=eq.${task.id}`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            "apikey": config.supabasePublishableKey,
                            "Authorization": `Bearer ${config.supabasePublishableKey}`
                        },
                        body: JSON.stringify({
                            completed: !task.completed
                        })
                    }
                );

                loadTasks();
            });

        taskList.appendChild(taskDiv);
    });
}

document.getElementById("task-form").addEventListener("submit", async (e) => {

    e.preventDefault();

    const title = document.getElementById("task-title").value;
    const description = document.getElementById("task-description").value;

    if (editingTaskId !== null) {

        await fetch(
            `${config.supabaseUrl}/rest/v1/tasks?id=eq.${editingTaskId}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": config.supabasePublishableKey,
                    "Authorization": `Bearer ${config.supabasePublishableKey}`
                },
                body: JSON.stringify({
                    title,
                    description
                })
            }
        );

        editingTaskId = null;
        document.getElementById("task-submit").textContent = "Save Task";

    } else {

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
    }

    document.getElementById("task-form").reset();

    loadTasks();
});

loadConfig();
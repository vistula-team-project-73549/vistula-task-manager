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
        const taskElement = document.createElement("div");
        taskElement.className = "task-item";
        taskElement.setAttribute("data-id", task.id);

        taskElement.innerHTML = `
            <h3 class="task-title">${task.title}
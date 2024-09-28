#!/usr/bin/env node
const fs = require('fs')
const {Command} = require('commander')

const TASK_FILE = 'tasks.json'

//Load tasks from JSON file
function loadTasks(status) {
    status = status || null

    if(!fs.existsSync(TASK_FILE)){
        return []
    }

    const data = fs.readFileSync(TASK_FILE)
    const _data = status !== null ? 
    JSON.parse(data).filter(t => t.status == status) :
    JSON.parse(data)

    return _data
}

//Save tasks to file
function saveTasks(tasks) {
    fs.writeFileSync(TASK_FILE, JSON.stringify(tasks,null))
}

//Add a new task
function addTask(description) {
    const tasks = loadTasks();

    const newTask = {
        id: tasks.length + 1,
        description,
        status:'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }

    tasks.push(newTask)
    saveTasks(tasks)
    console.log(`Task added successfully (ID: ${newTask.id})`)
}

//update an existing task
function updateTask(id, description) {
    const tasks = loadTasks();

    const task = tasks.find(t => t.id === id)
    if(task){
        task.description = description;
        task.updatedAt = new Date().toISOString()
        saveTasks(tasks)

        console.log(`Task updated successfully (ID: ${id})`)
    }
}

//mark in progress
function markInProgress(id){
    let tasks = loadTasks()
    const task = tasks.filter(t => t.id === id)

    if(task){
        task.status = 'in-progress',
        task.updatedAt = new Date().toISOString()
        saveTasks(tasks)

        console.log(`Task marked as in-progress successfully (ID: ${id})`)

    }

}

//mark as done
function markAsDone(id){
    let tasks = loadTasks()
    const task = tasks.filter(t => t.id === id)

    if(task){
        task.status = 'done',
        task.updatedAt = new Date().toISOString()
        saveTasks(tasks)

        console.log(`Task marked as in-progress successfully (ID: ${id})`)

    }

}

// delete a task
function deleteTask(id) {
    let tasks = loadTasks();
    const initialLength = task.length;

    tasks = tasks.filter(t => t.id !== id)

    if(tasks.length < initialLength) {
        saveTasks(tasks)
        console.log(`Task delete successfully (ID: ${id})`)
    }else{
        console.log(`Task with ID: ${id} not found`)
    }
}

function main() {
    const program = new Command()

    program
        .name('task-cli')
        .description('A simple task management CLI')
        .version('1.0.0')

    //add a task
    program
        .command('add <description>')
        .description('Add a new task')
        .action((description) => {
            addTask(description)
        })
    
    //update a task
    program
        .command('update <id> <description>')
        .description('Update an existing task')
        .action((id, description) => {
            updateTask(parseInt(id, 10), description)
        })
    
    // delete a task
    program
        .command('delete <id>')
        .description('Delete a task')
        .action((id) => {
            deleteTask(parseInt(id, 10))
        })
    
    //mark as in-progress
    program
        .command('mark-in-progress <id>')
        .description('Mark task as in-progress')
        .action((id) => {
            markInProgress(id)
        })

    //mark as done
    program
        .command('mark-done <id>')
        .description('Mark task as done')
        .action((id) => {
            markAsDone(id)
        })
    
    //list tasks
    program
        .command('list <status>')
        .description('List tasks based on status')
        .action((status) => {
            loadTasks(status)
        })
    
    program.parse(process.argv)
}

main()


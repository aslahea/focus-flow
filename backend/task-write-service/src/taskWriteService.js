import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tasksDbPath = path.join(__dirname, '../db/tasks.json');

// Initialize tasks file if it doesn't exist
const initializeTasksDb = () => {
  const initialTasks = [
    {
      id: '1',
      text: 'Complete project documentation',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      text: 'Review pull requests',
      completed: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      text: 'Plan sprint tasks',
      completed: false,
      createdAt: new Date().toISOString(),
    },
  ];

  if (!fs.existsSync(tasksDbPath)) {
    fs.writeFileSync(tasksDbPath, JSON.stringify(initialTasks, null, 2));
  }
};

const loadTasks = () => {
  try {
    initializeTasksDb();
    const data = fs.readFileSync(tasksDbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
};

const saveTasks = (tasks) => {
  try {
    fs.writeFileSync(tasksDbPath, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};

// WRITE OPERATIONS
export const createTask = (text) => {
  const tasks = loadTasks();
  const newTask = {
    id: Date.now().toString(),
    text,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
};

export const updateTask = (id, updates) => {
  const tasks = loadTasks();
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return null;
  }

  // Prevent accidental removal of text when updates.text is undefined
  const safeUpdates = {};
  if (typeof updates.text !== 'undefined') safeUpdates.text = updates.text;
  if (typeof updates.completed !== 'undefined')
    safeUpdates.completed = updates.completed;

  const updatedTask = { ...tasks[index], ...safeUpdates };
  tasks[index] = updatedTask;
  saveTasks(tasks);
  return updatedTask;
};

export const deleteTask = (id) => {
  const tasks = loadTasks();
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return false;
  }

  tasks.splice(index, 1);
  saveTasks(tasks);
  return true;
};

export const bulkDeleteTasks = (ids) => {
  const tasks = loadTasks();
  const filteredTasks = tasks.filter((task) => !ids.includes(task.id));
  saveTasks(filteredTasks);
  return filteredTasks.length;
};

// READ OPERATIONS
export const getAllTasks = () => loadTasks();

export const getTaskById = (id) => {
  const tasks = loadTasks();
  return tasks.find((t) => t.id === id) || null;
};
// commit marker 26

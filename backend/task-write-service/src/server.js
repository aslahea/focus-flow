import express from 'express';
import { createTask, updateTask, deleteTask, getAllTasks, getTaskById } from './taskWriteService.js';

const app = express();
app.use(express.json());

app.post('/tasks', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Task text required' });
  const task = createTask(text);
  res.status(201).json(task);
});

app.get('/tasks', (req, res) => {
  const tasks = getAllTasks();
  res.json(tasks);
});

app.get('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const task = getTaskById(id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const task = updateTask(id, updates);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const success = deleteTask(id);
  if (!success) return res.status(404).json({ error: 'Task not found' });
  res.json({ message: 'Task deleted' });
});

app.listen(3002, () => {
  console.log('Task Write Service running on port 3002');
});

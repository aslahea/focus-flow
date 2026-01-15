const READ_BASE = process.env.TASK_READ_URL || 'http://task-read-service:3001';
const WRITE_BASE = process.env.TASK_WRITE_URL || 'http://task-write-service:3002';

const forwardJson = async (res, fetchPromise, upstreamUrl) => {
  try {
    const r = await fetchPromise;
    const ct = r.headers.get('content-type') || '';
    const text = await r.text();
    if (!ct.includes('application/json')) {
      console.error(`Upstream ${upstreamUrl} returned non-JSON (content-type: ${ct})`);
      console.error('Upstream body (truncated):', text.slice(0, 2000));
      return res.status(502).json({ error: 'Upstream returned non-JSON' });
    }
    const data = JSON.parse(text);
    return res.status(r.status >= 200 && r.status < 300 ? r.status : 500).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Service proxy error' });
  }
};

export const getAllTasks = async (req, res) => {
  return forwardJson(res, fetch(`${READ_BASE}/tasks`));
};

export const getTaskById = async (req, res) => {
  const { id } = req.params;
  return forwardJson(res, fetch(`${READ_BASE}/tasks/${id}`));
};

export const createNewTask = async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return res.status(400).json({ error: 'Task text is required' });
  }

  return forwardJson(res, fetch(`${WRITE_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: text.trim() }),
  }));
};

export const updateExistingTask = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  return forwardJson(res, fetch(`${WRITE_BASE}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  }));
};

export const deleteExistingTask = async (req, res) => {
  const { id } = req.params;

  return forwardJson(res, fetch(`${WRITE_BASE}/tasks/${id}`, {
    method: 'DELETE',
  }));
};

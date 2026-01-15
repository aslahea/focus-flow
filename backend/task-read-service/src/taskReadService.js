const WRITE_BASE = process.env.TASK_WRITE_URL || 'http://task-write-service:3002';

async function fetchJsonOrThrow(url, opts) {
  const r = await fetch(url, opts);
  const ct = r.headers.get('content-type') || '';
  const text = await r.text();
  if (!ct.includes('application/json')) {
    console.error(`Expected JSON from ${url} but got '${ct || 'no content-type'}'`);
    console.error('Response body (truncated):', text.slice(0, 2000));
    const err = new Error('Upstream returned non-JSON');
    err.status = r.status || 502;
    throw err;
  }
  return JSON.parse(text);
}

// The read service no longer keeps its own copy of the DB.
// It forwards read requests to the write service which is the single source of truth.
export const getTasks = async () => {
  return fetchJsonOrThrow(`${WRITE_BASE}/tasks`);
};

export const getTask = async (id) => {
  try {
    return await fetchJsonOrThrow(`${WRITE_BASE}/tasks/${id}`);
  } catch (err) {
    if (err.status === 404) return null;
    throw err;
  }
};

export const getTasksByStatus = async (completed) => {
  const all = await getTasks();
  return all.filter((t) => t.completed === completed);
};

export const searchTasks = async (query) => {
  const all = await getTasks();
  return all.filter((task) => task.text.toLowerCase().includes(query.toLowerCase()));
};

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST || 'db', // Cambiar localhost a db
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT || 5432,
});


// Ruta para obtener todas las tareas, con categoría y etiquetas
app.get('/tasks', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.id, t.title, t.description, t.completed, t.created_at, 
             c.name AS category, 
             array_agg(tg.name) AS tags
      FROM tasks t
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN task_tags tt ON t.id = tt.task_id
      LEFT JOIN tags tg ON tt.tag_id = tg.id
      GROUP BY t.id, c.name
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al obtener las tareas');
  }
});

// Ruta para crear una tarea con categoría y etiquetas
app.post('/tasks', async (req, res) => {
  const { title, description, category_id, tag_names } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO tasks (title, description, category_id) VALUES ($1, $2, $3) RETURNING *',
      [title, description, category_id]
    );

    const task = result.rows[0];

    // Asignar etiquetas a la tarea
    for (let tag_name of tag_names) {
      const tagResult = await pool.query(
        'INSERT INTO tags (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING id',
        [tag_name]
      );

      if (tagResult.rows.length > 0) {
        const tag_id = tagResult.rows[0].id;
        await pool.query(
          'INSERT INTO task_tags (task_id, tag_id) VALUES ($1, $2)',
          [task.id, tag_id]
        );
      }
    }

    res.status(201).json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al crear la tarea');
  }
});

// Ruta para actualizar una tarea
app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed, category_id, tag_names } = req.body;

  try {
    const result = await pool.query(
      'UPDATE tasks SET title = $1, completed = $2, category_id = $3 WHERE id = $4 RETURNING *',
      [title, completed, category_id, id]
    );
    const task = result.rows[0];

    // Eliminar etiquetas existentes y volver a asociarlas
    await pool.query('DELETE FROM task_tags WHERE task_id = $1', [task.id]);

    for (let tag_name of tag_names) {
      const tagResult = await pool.query(
        'INSERT INTO tags (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING id',
        [tag_name]
      );

      if (tagResult.rows.length > 0) {
        const tag_id = tagResult.rows[0].id;
        await pool.query(
          'INSERT INTO task_tags (task_id, tag_id) VALUES ($1, $2)',
          [task.id, tag_id]
        );
      }
    }

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al actualizar la tarea');
  }
});

// Ruta para eliminar una tarea
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM task_tags WHERE task_id = $1', [id]); // Eliminar las relaciones con etiquetas
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]); // Eliminar la tarea
    res.status(204).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al eliminar la tarea');
  }
});

// Ruta para obtener todas las categorías
app.get('/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al obtener las categorías');
  }
});

// Ruta para crear una categoría
app.post('/categories', async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al crear la categoría');
  }
});

// Ruta para obtener todas las etiquetas
app.get('/tags', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tags');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al obtener las etiquetas');
  }
});

// Ruta para crear una etiqueta
app.post('/tags', async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tags (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al crear la etiqueta');
  }
});

// Ruta principal para probar el backend
app.get('/', (req, res) => {
  res.send('Backend funcionando correctamente');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});

import 'dotenv/config';
import express from 'express';
import { pool } from './db.js';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/forces/:parentId', async (req, res) => {
  const parentId = req.params.parentId === "null" ? null : parseInt(req.params.parentId);
  
  try {
    const result = await pool.query(
      `SELECT id, name, force_type, parent_id
       FROM forces
       WHERE (parent_id = $1 OR ($1 IS NULL AND parent_id IS NULL))
        AND is_deleted = false`,
      [parentId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("DB query error:", err);
    res.status(500).send("Server error");
  }
});

app.get('/forces/search/:term', async (req, res) => {
  const term = req.params.term;

  try {
    const query = `
      WITH RECURSIVE force_path AS (
        SELECT id, name, force_type, parent_id, ARRAY[id] AS path_ids
        FROM forces
        WHERE (name ILIKE $1 OR force_type ILIKE $1) AND is_deleted = false

        UNION ALL

        SELECT f.id, f.name, f.force_type, f.parent_id, fp.path_ids || f.id
        FROM forces f
        INNER JOIN force_path fp ON f.id = fp.parent_id
        WHERE f.is_deleted = false
      )
      SELECT fp.id, fp.name, fp.force_type, fp.path_ids,
             ARRAY(
               SELECT json_build_object('id', f2.id, 'name', f2.name)
               FROM forces f2
               WHERE f2.id = ANY(fp.path_ids)
               ORDER BY array_position(fp.path_ids, f2.id)
             ) AS path
      FROM force_path fp;
    `;

    const result = await pool.query(query, [`%${term}%`]);
    res.json(result.rows);
  } catch (err) {
    console.error("DB search error:", err);
    res.status(500).send("Server error");
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


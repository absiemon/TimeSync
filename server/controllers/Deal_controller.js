import db from '../config/mySQL_DB.js'
import fs from 'fs'

export const createDeal = async (req, res) => {
    const fields = req.body;

    try {
        let insertedFileds = [];
        let query = 'INSERT INTO deals (';

        for (const [key, value] of Object.entries(fields)) {
            query += `${key}, `
            insertedFileds.push(value);
        }
        query = query.slice(0, -2); // Removing last comma space
        query += ') VALUES ('
        insertedFileds.map((m) => {
            query += '?, '
        })
        query = query.slice(0, -2); // Removing last comma and space
        query += ')'

        db.query(query, insertedFileds, (err, result) => {
            if (err) throw err;
            const updateQuery = 'UPDATE pipelines SET total_deal_value = COALESCE(total_deal_value, 0) + ?, no_of_deals = COALESCE(no_of_deals, 0) + 1 WHERE id = ?';
            db.query(updateQuery, [fields.deal_value, fields.pipeline_id], (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Failed to update total_deal_value' });
                } else {
                    res.send(`Inserted ${result.affectedRows} row(s)`);
                }
            });
        })

    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Internal server error' });
    }
};

export const getAllDeal = async (req, res) => {
    const date = req.query.date;
    try {
        if (date) {

            const query = `SELECT * FROM deals WHERE atten_date LIKE '${date}%'`;
            db.query(query, (err, result) => {
                if (err) throw err;
                res.send(result);
            })
        }
        else {
            const query = 'SELECT * FROM deals';
            db.query(query, (err, result) => {
                if (err) throw err;
                res.send(result);
            })
        }

    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Internal server error' });
    }
}

export const getSingleDeal = async (req, res) => {
    const id = req.params.id;
    try {
        const query = 'SELECT * FROM deals WHERE id = ?';
        db.query(query, [id], (err, result) => {
            if (err) throw err;
            res.send(result);
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
export const updateDeal = async (req, res) => {
    const id = req.params.id;
    const fieldsToUpdate = req.body.values;

    console.log(fieldsToUpdate, id)
    try {
        let query = "UPDATE deals SET ";

        let updateValues = [];
        for (const [key, value] of Object.entries(fieldsToUpdate)) {
            query += `${key}=?,`;
            updateValues.push(value);

        }
        query = query.slice(0, -1); // Removing last comma

        query += " WHERE id=?"
        updateValues.push(id);

        db.query(query, updateValues, (err, result) => {
            if (err) throw err;
            
            const updateQuery = 'UPDATE pipelines SET total_deal_value = COALESCE(total_deal_value, 0) + ? WHERE id = ?';
            db.query(updateQuery, [req.body.deal_value_diff, fieldsToUpdate.pipeline_id], (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Failed to update total_deal_value' });
                } else {
                    res.send(result);
                }
            });
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}


export const updateDealStage = async (req, res) => {
    const id = req.params.id;
    const fieldsToUpdate = req.body;

    try {
        let query = "UPDATE deals SET ";

        let updateValues = [];
        for (const [key, value] of Object.entries(fieldsToUpdate)) {
            query += `${key}=?,`;
            updateValues.push(value);

        }
        query = query.slice(0, -1); // Removing last comma

        query += " WHERE id=?"
        updateValues.push(id);

        db.query(query, updateValues, (err, result) => {
            if (err) throw err;
            
            res.send(result);
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const deleteDeal = async (req, res) => {
    const id = req.params.id;

    try {
        const query = 'DELETE FROM deals WHERE id = ?';
        db.query(query, [id], (err, result) => {
            if (err) throw err;
            res.send(result);
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

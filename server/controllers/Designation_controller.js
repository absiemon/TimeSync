import db from '../config/mySQL_DB.js'
import fs from 'fs'

export const createEmployeeDesignation = async (req, res) => {
    const fields = req.body;

    try {
        let insertedFileds = [];
        let query = 'INSERT INTO designations (';

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
            res.send(`Inserted ${result.affectedRows} row(s)`);
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getAllEmployeeDesignation = async (req, res) => {
    const { name } = req.query
    try {
        const query = 'SELECT * FROM designations';
        if (name && name !== 'undefined') {
            db.query(query, (err, result) => {
                if (err) throw err;
                const ans = result.filter((element) => {
                    return element.name.toLowerCase().includes(name.toLowerCase())
                })
                res.send(ans);
            })
        }
        else {
            db.query(query, (err, result) => {
                if (err) throw err;
                res.send(result);
            })
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getSingleEmployeeDesignation = async (req, res) => {
    const id = req.params.id;
    try {
        const query = 'SELECT * FROM designations WHERE id = ?';
        db.query(query, [id], (err, result) => {
            if (err) throw err;
            res.send(result);
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const updateEmployeeDesignation = async (req, res) => {
    const id = req.params.id;
    const fieldsToUpdate = req.body;

    try {
        let query = "UPDATE designations SET ";

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

export const deleteEmployeeDesignation = async (req, res) => {
    const id = req.params.id;

    try {
        const query = 'DELETE FROM designations WHERE id = ?';
        db.query(query, [id], (err, result) => {
            if (err) throw err;
            res.send(result);
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

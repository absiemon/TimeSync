import db from '../config/mySQL_DB.js'
import fs, { createReadStream } from 'fs'
import ftpClient from '../config/ftpConfig.js';


export const createEmergencyContact = async (req, res) => {
    const fields = req.body;

    try {
        let insertedFileds = [];
        let query = 'INSERT INTO emergency_contact (';

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

export const getAllEmergencyContact = async (req, res) => {
    const { emp_id} = req.params;
    const { name, } = req.query
    console.log(emp_id)
    try {
        const query = 'SELECT * FROM emergency_contact WHERE emp_id = ?';
        if (name && name !== 'undefined') {
            db.query(query, [emp_id], (err, result) => {
                if (err) throw err;
                const ans = result.filter((user) => {
                    return user.name.toLowerCase().includes(name.toLowerCase())
                })
                res.send(ans);
            })
        }

        else {
            db.query(query, [emp_id], (err, result) => {
                if (err) throw err;
                res.send(result);
            })
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getSingleEmergencyContact = async (req, res) => {
    const id = req.params.id;
    try {
        const query = 'SELECT * FROM emergency_contact WHERE id = ?';
        db.query(query, [id], (err, result) => {
            if (err) throw err;
            res.send(result);
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
export const updateEmergencyContact = async (req, res) => {
    const id = req.params.id;
    const fieldsToUpdate = req.body;

    try {
        let query = "UPDATE emergency_contact SET ";

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

export const deleteEmergencyContact = async (req, res) => {
    const id = req.params.id;

    try {
        const query = 'DELETE FROM emergency_contact WHERE id = ?';
        db.query(query, [id], (err, result) => {
            if (err) throw err;
            res.send(result);
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}


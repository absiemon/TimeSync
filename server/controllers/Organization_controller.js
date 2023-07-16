import db from '../config/mySQL_DB.js'
import fs from 'fs'

export const createOrganization = async (req, res) => {
    const fields = req.body;

    try {
        let insertedFileds = [];
        let query = 'INSERT INTO organization (';
        
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
        res.status(400).json({ error: 'Internal server error' });
    }
};

export const getAllOrganization = async (req, res) => {
    const {date, name} = req.query;
    try {
        if(name && name !== 'undefined'){
            const query = 'SELECT * FROM organization';
            db.query(query, (err, result) => {
                if (err) throw err;
                const ans = result.filter((user)=>{
                    return user.name.toLowerCase().includes(name.toLowerCase())
                })
                res.send(ans);
            })
        }
        else if(date){

            const query = `SELECT * FROM organization WHERE atten_date LIKE '${date}%'`;
            db.query(query, (err, result) => {
                if (err) throw err;
                res.send(result);
            })
        }
        else{
            const query = 'SELECT * FROM organization';
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

export const getSingleOrganization = async (req, res) => {
    const id = req.params.id;
    try {
        const query = 'SELECT * FROM organization WHERE id = ?';
        db.query(query, [id], (err, result) => {
            if (err) throw err;
            res.send(result);
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
export const updateOrganization = async (req, res) => {
    const id = req.params.id;
    const fieldsToUpdate = req.body;

    try {
        let query = "UPDATE organization SET ";

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

export const deleteOrganization = async (req, res) => {
    const id = req.params.id;

    try {
        const query = 'DELETE FROM organization WHERE id = ?';
        db.query(query, [id], (err, result) => {
            if (err) throw err;
            res.send(result);
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    } 
}

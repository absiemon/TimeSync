import db from '../config/mySQL_DB.js'
import fs from 'fs'

export const createAnnouncement = async (req, res) => {
    const fields = req.body;

    try {
        let insertedFileds = [];
        let query = 'INSERT INTO announcements (';

        for (const [key, value] of Object.entries(fields)) {
            query += `${key}, `

            if(key=== 'departments'){
                insertedFileds.push(JSON.stringify(value));
            }
            else{
                insertedFileds.push(value);
            }
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

export const getAllAnnouncement = async (req, res) => {
    const { name } = req.query
    try {
        const query = 'SELECT * FROM announcements';
        if (name && name !== 'undefined') {
            db.query(query, (err, result) => {
                if (err) throw err;
                const ans = result.filter((element) => {
                    return element.created_by.toLowerCase().includes(name.toLowerCase())
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

export const getSingleAnnouncement = async (req, res) => {
    const id = req.params.id;
    try {
        const query = 'SELECT * FROM announcements WHERE id = ?';
        db.query(query, [id], (err, result) => {
            if (err) throw err;
            res.send(result);
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getEmployeeAnnouncement = async (req, res) => {
    const id = req.params.id;
    try {
        const query = 'SELECT * FROM employees WHERE id = ?';
        db.query(query, [id], (err, result) => {
            if (err) throw err;
            const dep_name = result[0].department;

            const query2 = 'SELECT * FROM announcements';
            db.query(query2, [id], (err, result2) => {
                if (err) throw err;
                const response = [];
                result2.map((elem)=>{
                    if(JSON.parse(elem.departments).includes(dep_name)){
                        response.push(elem)
                    }
                })
                res.send(response);
            })
        })


    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const updateAnnouncement = async (req, res) => {
    const id = req.params.id;
    const fieldsToUpdate = req.body;
    console.log(fieldsToUpdate)
    try {
        let query = "UPDATE announcements SET ";

        let updateValues = [];
        for (const [key, value] of Object.entries(fieldsToUpdate)) {

            if(key === 'departments'){
                query += `${key} = ?, `;
                updateValues.push(JSON.stringify(value));
            }
            else{
                query += `${key} = ?, `;
                updateValues.push(value);
            }
        }
        query = query.slice(0, -2); // Removing last comma

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

export const deleteAnnouncement = async (req, res) => {
    const id = req.params.id;

    try {
        const query = 'DELETE FROM announcements WHERE id = ?';
        db.query(query, [id], (err, result) => {
            if (err) throw err;
            res.send(result);
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

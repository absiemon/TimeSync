import db from '../config/mySQL_DB.js'
import fs from 'fs'

export const createEmployeeIssue = async (req, res) => {
    const fields = req.body;

    try {
        let insertedFileds = [];
        let query = 'INSERT INTO employee_issue_list (';
        
        for (const [key, value] of Object.entries(fields)) {
            
            if(key === 'issue_items'){
                console.log(value)
                query += `${key}, `
                insertedFileds.push(JSON.stringify(value));
            }
            else{
                query += `${key}, `
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

export const getAllEmployeeIssue = async (req, res) => {
    try {
        const query = 'SELECT * FROM employee_issue_list';
        db.query(query, (err, result) => {
            if (err) throw err;
            res.send(result);
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getSingleEmployeeIssue = async (req, res) => {
    const id = req.params.id;
    try {
        const query = 'SELECT * FROM employee_issue_list WHERE id = ?';
        db.query(query, [id], (err, result) => {
            if (err) throw err;
            res.send(result);
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
export const getEmployeeIssueById = async (req, res) => {
    const id = req.params.emp_id;
    try {
        const query = 'SELECT * FROM employee_issue_list WHERE emp_id = ?';
        db.query(query, [id], (err, result) => {
            if (err) throw err;
            res.send(result);
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
export const updateEmployeeIssue = async (req, res) => {
    const id = req.params.id;
    const fieldsToUpdate = req.body;

    try {
        let query = "UPDATE employee_issue_list SET ";

        let updateValues = [];
        for (const [key, value] of Object.entries(fieldsToUpdate)) {

            query += `${key}=?,`;
            if(key === 'issue_items'){
                updateValues.push(JSON.stringify(value));
            }
            else{
                updateValues.push(value);
            }
            
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

export const deleteEmployeeIssue = async (req, res) => {
    const id = req.params.id;

    try {
        const query = 'DELETE FROM employee_issue_list WHERE id = ?';
        db.query(query, [id], (err, result) => {
            if (err) throw err;
            res.send(result);
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    } 
}

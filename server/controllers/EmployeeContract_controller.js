import db from '../config/mySQL_DB.js'
import {uplaodToS3, deleteFromS3} from '../services/FilesOperation.js'

export const createEmployeeContract = async (req, res) => {
    const fields = req.body;

    try {
        let insertedFileds = [];
        let query = 'INSERT INTO employee_contract (';
        
        for (const [key, value] of Object.entries(fields)) {
            
            if(key === 'upload_contract'){
                continue;
            }
            else {
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

export const getAllEmployeeContract = async (req, res) => {
    try {
        const query = 'SELECT * FROM employee_contract';
        db.query(query, (err, result) => {
            if (err) throw err;
            res.send(result);
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getSingleEmployeeContract = async (req, res) => {
    const id = req.params.id;
    try {
        const query = 'SELECT * FROM employee_contract WHERE id = ?';
        db.query(query, [id], (err, result) => {
            if (err) throw err;
            res.send(result);
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
export const getEmployeeContractById = async (req, res) => {
    const id = req.params.emp_id;
    try {
        const query = 'SELECT * FROM employee_contract WHERE emp_id = ?';
        db.query(query, [id], (err, result) => {
            if (err) throw err;
            res.send(result);
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
export const updateEmployeeContract = async (req, res) => {
    const id = req.params.id;
    const fieldsToUpdate = req.body;

    try {
        let query = "UPDATE employee_contract SET ";

        let updateValues = [];
        for (const [key, value] of Object.entries(fieldsToUpdate)) {
            if(key === 'upload_contract'){
                continue;
            }
            
            else{
                query += `${key}=?,`;
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

export const deleteEmployeeContract = async (req, res) => {
    const id = req.params.id;

    try {
        const query = 'DELETE FROM employee_contract WHERE id = ?';
        db.query(query, [id], (err, result) => {
            if (err) throw err;
            res.send(result);
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    } 
}


export const uploadFiles = async (req, res) => {
    try {
        const filesUrl = [];
        for (let i = 0; i < req.files.length; i++) {
            const { originalname, mimetype, buffer } = req.files[i];
            const url = await uplaodToS3(buffer, originalname, mimetype);
            filesUrl.push(url);
        }
        res.send(filesUrl);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const deletFTPfile = async (req, res) => {
    const filename = req.params.fname
    const id = req.query.id
    try {
        await deleteFromS3(filename).then((response)=>{
            if(id !== 'undefined'){
                db.query('SELECT contract_attachment FROM employee_contract WHERE id = ?', [id], (err, result) => {
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                        return;
                    }
                    let files = JSON.parse(result[0].contract_attachment);;
                    
                    const newFiles = files.filter(f => f !== filename);
                    console.log(newFiles);
                    const newFilesString = JSON.stringify(newFiles);
                    console.log(newFilesString);

                    db.query('UPDATE employee_contract SET contract_attachment = ? WHERE id = ?', [newFilesString, id], (err, result) => {
                        if (err) {
                          console.log(err);
                          res.sendStatus(500);
                          return;
                        }
                        res.status(200).send(newFilesString);
                      });
                })
            }
            else{
                res.send(response)
            }
            
        }).catch((err)=>{
            throw err;
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}


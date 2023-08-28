import db from '../config/mySQL_DB.js'
import {uplaodToS3, deleteFromS3} from '../services/FilesOperation.js'

const fields = 'id, emp_name, department, designation, email, gender, phone, address, country, state, city, address2, dob, joining_date, basic_salary, emp_status, service_terms, emp_image, emp_cv, total_leave, login_email, role, certificates, created_by, updated_at FROM employees'
export const createEmployee = async (req, res) => {
    const fields = req.body;

    try {
        let insertedFileds = [];
        let query = 'INSERT INTO employees (';
        
        for (const [key, value] of Object.entries(fields)) {
            
            if(key === 'upload_emp_img' || key === 'upload_emp_cv' || key==='upload_certificates' ){
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

export const getAllEmployee = async (req, res) => {
    const {name, dep_name} = req.query
    try {
        console.log(name)
        const query = `SELECT  ${fields}`;

        if(name && name !== 'undefined'){
            db.query(query, (err, result) => {
                if (err) throw err;
                const ans = result.filter((user)=>{
                    return user.emp_name.toLowerCase().includes(name.toLowerCase())
                })
                res.send(ans);
            })
        }
        else if(dep_name){
            const query = `SELECT ${fields} WHERE department = ?`;
            db.query(query, [dep_name], (err, result) => {
                if (err) throw err;
                res.send(result);
            })
        }
        else{
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

export const getSingleEmployee = async (req, res) => {
    const id = req.params.id;
    try {
        const query = `SELECT ${fields} WHERE id = ?`;
        db.query(query, [id], (err, result) => {
            if (err) throw err;
            res.send(result);
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
export const updateEmployee = async (req, res) => {
    const id = req.params.id;
    const fieldsToUpdate = req.body;

    try {
        let query = "UPDATE employees SET ";

        let updateValues = [];
        for (const [key, value] of Object.entries(fieldsToUpdate)) {
            if(key === 'upload_emp_img' || key === 'upload_emp_cv' || key==='upload_certificates' ){
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

export const deleteEmployee = async (req, res) => {
    const id = req.params.id;

    try {
        const query = 'DELETE FROM employees WHERE id = ?';
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
    const field = req.query.field;
    try {
        console.log(filename, id, field)
        await deleteFromS3(filename).then((response)=>{
            if(id !== 'undefined'){
                db.query(`SELECT ${field} FROM employees WHERE id = ?`, [id], (err, result) => {
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                        return;
                    }
                    let files;
                    
                    if(field === 'emp_image'){
                        files = null;
                    }
                    else if(field === 'emp_cv'){
                        files = null
                    }
                    else if(field === 'certificates'){
                        files = JSON.parse(result[0].certificates);
                        const newFiles = files.filter(f => f !== filename);
                        const newFilesString = JSON.stringify(newFiles);
                        files = newFilesString;
                    }
                    console.log(files)
                    db.query(`UPDATE employees SET ${field} = ? WHERE id = ?`, [files, id], (err, result) => {
                        if (err) {
                          console.log(err);
                          res.sendStatus(500);
                          return;
                        }
                        res.status(200).send(files);
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



export const getEmployeeByName = async(req, res)=>{
    const name = req.params.value;

    try{
        const query = `SELECT ${fields} WHERE emp_name = ?`;
        db.query(query, [name], (err, result) => {
            if (err) throw err;
            res.send(result);
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

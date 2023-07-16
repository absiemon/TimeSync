import db from '../config/mySQL_DB.js'
import fs, { createReadStream } from 'fs'
import ftpClient from '../config/ftpConfig.js';
import path, { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { rejects } from 'assert';


const updateValue = async(id, leaveType, leaveDuration)=>{
    new Promise((resolve, reject)=>{
        let lt;
        if(leaveType.replace(/ /g,'') === "Medicalleave") lt = 'medical_leave';
        else if(leaveType.replace(/ /g,'') === "Annualleave") lt = 'annual_leave';
        else if(leaveType.replace(/ /g,'') === "Casualleave") lt = 'casual_leave';

        db.query(`SELECT ${lt} FROM employees WHERE id = ?`, [id], (err, result) => {
            if (err) {
                console.log(err);
                reject("error in fetching data");
            }
            else{
                let actual_leave;
                if(lt === 'medical_leave') actual_leave = parseInt(result[0].medical_leave)
                else if(lt === 'annual_leave') actual_leave = parseInt(result[0].annual_leave)
                else if(lt === 'casual_leave') actual_leave = parseInt(result[0].casual_leave)
                const remainingLeave = actual_leave - leaveDuration;
                if(remainingLeave < 0){
                    reject(`leave duaration should not greater than ${lt}`);
                }
                else{
                    const updatedVal = remainingLeave.toString()
                    console.log(lt, remainingLeave, updatedVal)
                    db.query(`UPDATE employees SET ${lt} = ? WHERE id = ?`, [updatedVal, id], (err, result) => {
                        if (err) {
                          console.log(err);
                          reject("error in Updating data");
                        }
                        resolve();
                    });
                }
            }
        })
    })
}


export const createEmployeeLeave = async (req, res) => {
    const fields = req.body;

    try {
        let insertedFileds = [];
        let query = 'INSERT INTO employee_leave (';
        let id;
        let leaveType;
        let leaveDuration;
        for (const [key, value] of Object.entries(fields)) {
            
            if(key === 'upload_contract'){
                continue;
            }
            // else if(key === 'emp_id'){
            //     id = parseInt(value);
            //     query += `${key}, `
            //     insertedFileds.push(value);
            // }
            // else if(key === 'leave_type'){
            //     leaveType = value;
            //     query += `${key}, `
            //     insertedFileds.push(value);
            // }
            // else if(key === 'leave_duration'){
            //     const arr = value.split(' ');
            //     leaveDuration = parseInt(arr[0])
            //     query += `${key}, `
            //     insertedFileds.push(value);
            // }
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
        
        // await updateValue(id, leaveType, leaveDuration).then((response)=>{
            db.query(query, insertedFileds, async(err, result) => {
                if (err) throw err;
                res.send(`Inserted ${result.affectedRows} row(s)`);
            })
        // }).catch((err)=>{
        //     res.status(400).json({ error: 'Error in creating employee leave! possibly leave duration is not correct' });
        // })
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getAllEmployeeLeave = async (req, res) => {
    const {type, name} = req.query;
    try {
        if(type === 'status'){
            const query = "SELECT * FROM employee_leave WHERE status= 'accepted'";
            if(name !== 'undefined'){
                db.query(query, (err, result) => {
                    if (err) throw err;
                    const ans = result.filter((leave)=>{
                        return leave.emp_name.toLowerCase().includes(name.toLowerCase())
                    })
                    res.send(ans);
                })
            }
            else{
                db.query(query, (err, result) => {
                    if (err) throw err;
                    res.send(result);
                })
            }
        }
        if(type === 'request'){
            const query = "SELECT * FROM employee_leave WHERE status= 'pending'";
            if(name !== 'undefined'){
                db.query(query, (err, result) => {
                    if (err) throw err;
                    const ans = result.filter((leave)=>{
                        return leave.emp_name.toLowerCase().includes(name.toLowerCase())
                    })
                    res.send(ans);
                })
            }
            else{
                db.query(query, (err, result) => {
                    if (err) throw err;
                    res.send(result);
                })
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getSingleEmployeeLeave = async (req, res) => {
    const id = req.params.id;
    try {
        const query = 'SELECT * FROM employee_leave WHERE id = ?';
        db.query(query, [id], (err, result) => {
            if (err) throw err;
            res.send(result);
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
export const getEmployeeLeaveByEmpId = async (req, res) => {
    const id = req.params.emp_id;
    const {type, name} = req.query;
    try {
        if(type === 'status'){
            const query = "SELECT * FROM employee_leave WHERE emp_id='" + id + "' AND status= 'accepted'";
            if(name && name !== 'undefined'){
                db.query(query, (err, result) => {
                    if (err) throw err;
                    const ans = result.filter((leave)=>{
                        return leave.emp_name.toLowerCase().includes(name.toLowerCase())
                    })
                    res.send(ans);
                })
            }
            else{
                db.query(query, (err, result) => {
                    if (err) throw err;
                    res.send(result);
                })
            }
        }
        if(type === 'request'){
            const query = "SELECT * FROM employee_leave WHERE emp_id='" + id + "' AND status= 'pending'";
            if(name !== 'undefined'){
                db.query(query, [id], (err, result) => {
                    if (err) throw err;
                    const ans = result.filter((leave)=>{
                        return leave.emp_name.toLowerCase().includes(name.toLowerCase())
                    })
                    res.send(ans);
                })
            }
            else{
                db.query(query, (err, result) => {
                    if (err) throw err;
                    res.send(result);
                })
            }
        }
        else{
            const query = "SELECT * FROM employee_leave WHERE emp_id='" + id + "'";
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
export const updateEmployeeLeave = async (req, res) => {
    const id = req.params.id;
    const fieldsToUpdate = req.body;

    try {
        let query = "UPDATE employee_leave SET ";

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
        query = query.slice(0, -1); 

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
export const updateEmployeeLeaveStatus = async (req, res) => {
   
    const {id, status, emp_id} = req.body;

    try {
        let query = "UPDATE employee_leave SET status = ? WHERE id = ?";

        db.query(query, [status, id], (err, result) => {
            if (err) throw err;
            res.send(result);
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    } 
}



export const deleteEmployeeLeave = async (req, res) => {
    const id = req.params.id;

    try {
        const query = 'DELETE FROM employee_leave WHERE id = ?';
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
           
            const { path, originalname, mimetype,  filename} = req.files[i];
            const arr = originalname.split('.');
            const newName = Date.now() + '.' + arr[arr.length - 1];
            const readStream = createReadStream(path);
            await ftpClient.uploadFrom(readStream, '/'+ newName).then((res)=>{
                filesUrl.push(newName);
                console.log(res);
	            
            }).catch((err)=>{
                throw new Error(err);
            })
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
        await ftpClient.remove(filename).then((response)=>{
            if(id !== 'undefined'){
                db.query('SELECT attachment FROM employee_leave WHERE id = ?', [id], (err, result) => {
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                        return;
                    }
                    let files = result[0].attachment;
                    files = null;
                    db.query('UPDATE employee_leave SET attachment = ? WHERE id = ?', [files, id], (err, result) => {
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


// https://vimpexltd.com/vimpexltd.com/principles/
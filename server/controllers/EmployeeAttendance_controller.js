import db from '../config/mySQL_DB.js'
import fs from 'fs'

export const createEmployeeAttendance = async (req, res) => {
    const fields = req.body;

    try {
        let insertedFileds = [];
        let query = 'INSERT INTO attendance (';
        
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

export const getAllEmployeeAttendance = async (req, res) => {
    const {name, date} = req.query;
    try {
        if(name && name !== 'undefined'){
            const query = 'SELECT * FROM attendance';
            db.query(query, (err, result) => {
                if (err) throw err;
                const ans = result.filter((user)=>{
                    return user.emp_name.toLowerCase().includes(name.toLowerCase())
                })
                res.send(ans);
            })
        }
        else if(date){
            const query = `SELECT * FROM attendance WHERE atten_date LIKE '${date}%'`;
            db.query(query, (err, result) => {
                if (err) throw err;
                res.send(result);
            })
        }
        else{
            const query = 'SELECT * FROM attendance';
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

export const getSingleEmployeeAttendance = async (req, res) => {
    const id = req.params.id;
    try {
        const query = 'SELECT * FROM attendance WHERE id = ?';
        db.query(query, [id], (err, result) => {
            if (err) throw err;
            res.send(result);
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
export const updateEmployeeAttendance = async (req, res) => {
    const id = req.params.id;
    const fieldsToUpdate = req.body;

    try {
        let query = "UPDATE attendance SET ";

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

export const deleteEmployeeAttendance = async (req, res) => {
    const id = req.params.id;

    try {
        const query = 'DELETE FROM attendance WHERE id = ?';
        db.query(query, [id], (err, result) => {
            if (err) throw err;
            res.send(result);
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    } 
}
export const todayAttendance = async (req, res) => {
    const id = req.params.id;

    try {
        const query = 'SELECT * FROM attendance WHERE emp_id = ?';
        db.query(query, [id], (err, result) => {
            if (err) throw err;

            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            for(let i=0; i<result.length; i++) {
                const specificDate = new Date(result[i]?.atten_date);
                specificDate.setHours(0, 0, 0, 0);
                if(specificDate.getTime() === currentDate.getTime() && result[i].signout_time === null){
                    console.log(result[i])
                    return res.send([result[i]]);
                }
            }
            res.send([]);
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    } 
}


export const getSingleEmployeeAttendanceByEmpId = async (req, res) => {
    const id = req.params.emp_id;
    const {name, date} = req.query;
    try {
        
        if(date && date !== 'undefined'){
            const query = `SELECT * FROM attendance WHERE emp_id='" + id + "' AND atten_date LIKE '${date}%'`;
            db.query(query, (err, result) => {
                if (err) throw err;
                res.send(result);
            })
        }
        else{
            const query = 'SELECT * FROM attendance WHERE emp_id= ? ';
            db.query(query, [id], (err, result) => {
                if (err) throw err;
                res.send(result);
            })
        }

    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Internal server error' });
    }
   
}

export const getIp = async (req, res) => {
    const { address: ipAddress, family: ipFamily } = req.socket.address();
    const fullIpAddress = ipFamily === 'IPv6' ? `[${ipAddress}]` : ipAddress;
    console.log('IP Address:', fullIpAddress);
    res.send(fullIpAddress);
}
// app.get('/get-ip', (req, res) => {
   
//     // Other logic here
//   });
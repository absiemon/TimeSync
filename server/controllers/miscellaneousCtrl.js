import db from '../config/mySQL_DB.js'
import moment from 'moment'


export const allData = async(req, res)=>{
    const {emp_id} = req.query;
    try {
        let data = {};
        db.query('SELECT * FROM employees', (err, result) => {
            if (err) throw err;
            data.employees = result.length;
            db.query('SELECT * FROM departments', (err, result2) => {
                if (err) throw err;
                data.departments = result2;
            })
            
            db.query('SELECT * FROM employee_leave', (err, result) => {
                if (err) throw err;
                let leaveReq = [];
                for (let i = 0; i < result.length; i++) {
                    if(result[i].status === 'pending'){
                        leaveReq.push(result[i]);
                    }
                }
                data.leave_request = leaveReq;

                const currentDate = new Date();
                let count = 0;
                for(let i = 0; i < result.length; i++){
                    const startDate = new Date(result[i].start_date);
                    const endDate = new Date(result[i].start_date);
                    if( result[i].status==='accepted' && currentDate >= startDate && currentDate <= endDate){
                        count++;
                    }
                }
                data.leave_today = count;

                const startDate = moment().startOf('month').format('YYYY-MM-DD');
                const endDate = moment().format('YYYY-MM-DD');
                console.log(startDate)
                console.log(endDate)
                const query = `SELECT * FROM attendance WHERE emp_id = ? AND atten_date BETWEEN ? AND ?`;
                db.query(query, [emp_id, startDate, endDate], (err, result) => {
                    if (err) throw err;
                    let totalHours = 0;

                    result.forEach((record) => {
                        totalHours += parseInt(record.working_hour);
                    });
                    data.total_hours = totalHours;
                    return res.send(data);
                })
            })
        })
    } catch (error) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
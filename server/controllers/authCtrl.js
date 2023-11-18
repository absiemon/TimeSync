import db from '../config/mySQL_DB.js'
import jwt from "jsonwebtoken"

// --------------------------------------------[Register]

// export const register = async (req, res) => {

//     const { username, password, email, signature, role } = req.body;

//     // Check if the user already exists
//     const checkUserQuery = `SELECT * FROM users WHERE email = ?`;
//     db.query(checkUserQuery, [email], (err, result) => {
//         if (err) {
//             console.log(err);
//             res.sendStatus(500);
//         } else if (result.length > 0) {
//             // If the user already exists, return an error response
//             res.status(409).json({ error: 'Email already taken' });
//         } else {
//             // Insert user data into the database
//             const createUserQuery = `INSERT INTO users (username, password, email, signature, role) VALUES (?, ?, ?, ?, ?)`;
//             db.query(createUserQuery, [username, password, email, signature, role], (err, result) => {
//                 if (err) {
//                     console.log(err);
//                     res.sendStatus(500);
//                 } else {
//                     // Retrieve the newly generated user ID
//                     const userId = result.insertId;

//                     // Check if the employee already exists
//                     const checkEmployeeQuery = `SELECT * FROM employees WHERE email = ?`;
//                     db.query(checkEmployeeQuery, [email], (err, result) => {
//                         if (err) {
//                             console.log(err);
//                             res.sendStatus(500);
//                         } else if (result.length > 0) {
//                             // If the employee already exists, return an error response
//                             res.status(409).json({ error: 'Employee already exists' });
//                         } else {
//                             // Insert employee data into the database with the same user ID
//                             const createEmployeeQuery = `INSERT INTO employees (user_id, name, email, email_array, phone_array, job_title, department, salary, hire_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
//                             db.query(createEmployeeQuery, [userId, username, email, JSON.stringify([]), JSON.stringify([]), '', '', 0, ''], (err, result) => {
//                                 if (err) {
//                                     console.log(err);
//                                     res.sendStatus(500);
//                                 } else {
//                                     res.sendStatus(200);
//                                 }
//                             });
//                         }
//                     });
//                 }
//             });
//         }
//     });
// }


// ----------------------------------------------------------[Update User]

// export const updateUser = (req, res) => {
//     const { username, password, email, signature, role } = req.body;
//     const id = req.params.id;

//     // Update the user record with the given ID
//     const updateUserQuery = `UPDATE users SET username = ?, password = ?, email = ?, signature = ?, role = ? WHERE id = ?`;
//     db.query(updateUserQuery, [username, email, password, signature, role, id], (err, result) => {
//         if (err) {
//             console.log(err);
//             res.sendStatus(500);
//         } else if (result.affectedRows === 0) {
//             // If no rows were affected, the user record does not exist
//             res.status(404).json({ error: 'User not found' });
//         } else {
//             // Update the corresponding employee record
//             const updateEmployeeQuery = `UPDATE employees SET name = ?, email = ?  WHERE user_id = ?`;
//             db.query(updateEmployeeQuery, [username, email, id], (err, result) => {
//                 if (err) {
//                     console.log(err);
//                     res.sendStatus(500);
//                 } else {
//                     res.sendStatus(200);
//                 }
//             });
//         }
//     });
// }



// export const deleteUser = (req, res) => {
//     const id = req.params.id;

//     // Delete the user record with the given ID
//     const deleteUserQuery = `DELETE FROM users WHERE id = ?`;
//     db.query(deleteUserQuery, [id], (err, result) => {
//         if (err) {
//             console.log(err);
//             res.sendStatus(500);
//         } else if (result.affectedRows === 0) {
//             // If no rows were affected, the user record does not exist
//             res.status(404).json({ error: 'User not found' });
//         } else {
//             // Delete the employee record with the corresponding user ID
//             const deleteEmployeeQuery = `DELETE FROM employees WHERE user_id = ?`;
//             db.query(deleteEmployeeQuery, [id], (err, result) => {
//                 if (err) {
//                     console.log(err);
//                     res.sendStatus(500);
//                 } else {
//                     res.sendStatus(200);
//                 }
//             });
//         }
//     });
// }



export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const selectUserQuery = 'SELECT * FROM employees WHERE login_email = ?';
        db.query(selectUserQuery, [email], (error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Internal server error.' });
            }

            if (results.length === 0) {
                return res.status(401).json({ error: 'Invalid email or password.' });
            }

            const user = results[0];

            // Check if password is correct
            if (user.password !== password) {
                return res.status(401).json({ error: 'Invalid email or password.' });
            }
            else{
                // Create and sign JWT token
                const token = jwt.sign({ id: user.emp_id }, process.env.JWT_SECRET, { expiresIn: '1d' });

                // Set token as cookie and send success response
                res.cookie('token', token, { 
                    httpOnly: true, 
                    secure: true, // Make sure to set to true if your site is served over HTTPS
                    sameSite: 'None', // Set SameSite attribute to 'None' for cross-site cookies
                    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
                });
                return res.status(200).json({ login_status: true, message: 'Login successful.'});
            }
        });
    } 
    catch (err) {
        res.status(422).json({ error: "Failed to login user", details: err.message });
    }
}

export const profile = async (req, res) => {
    try {
        const response = req.user
        return res.status(200).json({login_status: true, user: response})
    }
    catch (err) {
        res.status(422).json({ error: "Failed to fetch user", details: err.message });
    }
}

export const logout = async (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logout successful.' });
}

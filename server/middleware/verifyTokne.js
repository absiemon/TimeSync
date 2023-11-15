import jwt from 'jsonwebtoken';
import db from '../config/mySQL_DB.js'
const jwt_secret = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(200).json({ login_status: false, user: null});
    }
    try {
        jwt.verify(token, jwt_secret, {}, async (err, data) => {
            if (err) {
                return res.status(498).json({ error: "Error in verifying token. Invalid token" });
            }
            else {
                const id = data?.id;
                db.query('SELECT * FROM employees WHERE id=?', [id], (error, results) => {
                    if (error) {
                        return res.status(401).json({ error: 'Unauthorized access.' });
                    }
                    else {
                        const userData = results[0];
                        const response = {
                            id: userData.id,
                            emp_name: userData.emp_name,
                            email: userData.login_email,
                            role: userData.role,
                            emp_image: userData.emp_image,
                            time_stamp: userData.time_stamp
                        }
                        req.user = response;
                        next();
                    }
                })
            }
           
        })
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(200).json({ login_status: false, user: null});
        }
        return res.status(422).json({ error: "Cannot get the user", details: err.message });
    }

}

export default verifyToken;
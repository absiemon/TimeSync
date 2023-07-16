
import mysql from 'mysql'

// ---------- [DATABASE CONNECTION] ------------

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: "",
  database: 'timesync'
});
    
  db.connect((err)=>{
    if(err){
      console.log(err)
    }
    else{
      console.log("Database Connected")
    }
  })

  export default db;
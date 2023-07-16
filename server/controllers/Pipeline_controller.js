import db from '../config/mySQL_DB.js'
import fs from 'fs'

export const createPipeline = async (req, res) => {
    const {pipelineData, stages} = req.body;

    try {
        let insertedFileds = [];
        let query = 'INSERT INTO pipelines (';
        
        for (const [key, value] of Object.entries(pipelineData)) {
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
            console.log(result);
            for(let i=0; i<stages.length; i++) {
                db.query( `INSERT INTO stages (stage_name, probability, pipeline_id) VALUES (?, ?, ?)`, [stages[i].stage_name, stages[i].probability, result.insertId], (err, result) => {
                    if (err) throw err;
                    res.send(`Inserted ${result.affectedRows} row(s)`);
                })
            }
        })

    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Internal server error' });
    }
};

export const getAllPipeline = async (req, res) => {
    const {name} = req.query;
    try {
        const query = 'SELECT * FROM pipelines';

        if(name && name !== 'undefined'){
            db.query(query, (err, result) => {
                if (err) throw err;
                const ans = result.filter((user)=>{
                    return user.name.toLowerCase().includes(name.toLowerCase())
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

    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Internal server error' });
    }
}

export const getSinglePipeline = async (req, res) => {
    const id = req.params.id;
    try {
        const query = 'SELECT * FROM pipelines WHERE id = ?';
        db.query(query, [id], (err, result) => {
            if (err) throw err;
            res.send(result);
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
export const updatePipeline = async (req, res) => {
    const id = req.params.id;
    const fieldsToUpdate = req.body;

    try {
        let query = "UPDATE pipelines SET ";

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

export const deletePipeline = async (req, res) => {
    const id = req.params.id;

    try {
        const query = 'DELETE FROM pipelines WHERE id = ?';
        db.query(query, [id], (err, result) => {
            if (err) throw err;
            res.send(result);
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    } 
}


export const getStagesByPipelineId = async (req, res) => {
    const id = req.params.pipeline_id;
    try {
        const query = 'SELECT * FROM stages WHERE pipeline_id = ?';
        db.query(query, [id], (err, result) => {
            if (err) throw err;
            console.log(result)
            res.send(result);
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}


// export const getPipelineView = async (req, res) => {
//     const id = req.params.pipeline_id;
//     try {
//         const query = 'SELECT * FROM stages WHERE pipeline_id = ?';
//         db.query(query, [id], (err, result) => {
//             if (err) throw err;
//             let initialColumns = [];
//             for(let i=0; i<result.length; i++){
//                 db.query('SELECT * FROM deals WHERE stage_id = ?', [result[i].id], (err, result2)=>{
//                     if (err) throw err;
//                     const stageId = result[i].id
//                     let totalDealVal = 0;
//                     let cardIds = [];
//                     for(let i =0; i<result2.length; i++){
//                         cardIds.push(result2[i].id)
//                         totalDealVal += parseInt(result2[i].deal_value);
//                     }
//                     const obj = {
//                         id:stageId,
//                         title:{
//                             stageName: result[i].stage_name,
//                             price: totalDealVal
//                         },
//                         cardIds: cardIds
//                     }
//                     initialColumns.push(obj);
//                     console.log(initialColumns)
//                 })
//             }
//             res.send(initialColumns);
//         })

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// }

export const createStage = async (req, res) => {
    const fields = req.body;

    try {
        let insertedFileds = [];
        let query = 'INSERT INTO stages (';
        
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
            else res.send(`Inserted ${result.affectedRows} row(s)`);
        })

    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Internal server error' });
    }
};

export const updateStage = async (req, res) => {
    const id = req.params.stage_id;
    const fieldsToUpdate = req.body;

    try {
        let query = "UPDATE stages SET ";

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

export const getStage = async (req, res) => {
    const id = req.params.stage_id;
    try {
        const query = 'SELECT * FROM stages WHERE id = ?';
        db.query(query, [id], (err, result) => {
            if (err) throw err;
            res.send(result);
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const deleteStage = async (req, res) => {
    const id = req.params.card_id;

    try {
        const query = 'DELETE FROM stages WHERE id = ?';
        db.query(query, [id], (err, result) => {
            if (err) throw err;
            res.send(result);
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    } 
}

export const getPipelineView = async (req, res) => {
    const id = req.params.pipeline_id;
    try {
      const query = 'SELECT * FROM stages WHERE pipeline_id = ?';
      const result = await new Promise((resolve, reject) => {
        db.query(query, [id], (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      });
  
      const initialColumns = [];
  
      for (let i = 0; i < result.length; i++) {
        const stage = result[i];
        const result2 = await new Promise((resolve, reject) => {
          db.query('SELECT * FROM deals WHERE stage_id = ?', [stage.id], (err, result2) => {
            if (err) reject(err);
            resolve(result2);
          });
        });
  
        const totalDealVal = result2.reduce((total, deal) => total + parseInt(deal.deal_value), 0);
        const cardIds = result2.map(deal => deal.id.toString());
        const cardDeatils = result2.map(deal => deal);
        const stageId  = stage.id
  
        const obj = {
          id: stage.id.toString(),
          title: {
            stageName: stage.stage_name,
            price: totalDealVal
          },
          cardIds: cardIds,
          cardDeatils: cardDeatils
        };
  
        initialColumns.push(obj);
      }
  
      res.send(initialColumns);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };


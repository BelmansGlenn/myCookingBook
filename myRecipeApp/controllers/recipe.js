const sqlite3 = require('sqlite3').verbose();

// BACKEND FILE FOR MY DATABASES QUERIES

const addMeal = (data) => {
    let db = new sqlite3.Database('db/db.recipedatabase');
    
    db.run(`INSERT INTO recipes (idmeal) VALUES (?)`, [data.idMeal], function(err) {
        if (err) {
          return console.log(err);
        }
        // get the last insert id
        console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
    db.run(`DELETE FROM recipes WHERE recipe_id NOT IN (SELECT MAX(recipe_id) from recipes group by idmeal)`, function(err) {
      if (err) {
        return console.log(err);
      }
    })

    db.close();
  
  }


  const loadingMeal = (req, res) => {

    let sendData = {data: []};
  
    let db = new sqlite3.Database('db/db.recipedatabase', (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Connected to the recipe database.');
    });
     db.serialize(() => {
      db.each(`SELECT * FROM recipes`, (err, row) => {
        if (err) {
          console.error(err.message);
        }
        sendData.data.push(row);
  
      });
      // res.send(sendData)
    });
  
    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      res.send(sendData)
      console.log('Close the database connection.');
    });

  }

  const remMeal = (data) => {
    let db = new sqlite3.Database('db/db.recipedatabase');
    console.log(data.idMeal);
    // db.run(`INSERT INTO movie (title, url, type, year) VALUES ("terminator", "enroule.jpg", "film", "sdlfn")`, function(err) {
    db.run(`delete from recipes where idmeal = (?)`, [data.idMeal], function(err) {
        if (err) {
          return console.log(err);
        }
        // get the last insert id
    });
  
    
    db.close();
  }


  const updating = (data) => {
    let db = new sqlite3.Database('db/db.recipedatabase');
  
    let donnee = [[data.bool],[data.id.idMeal]];

    let sql = `UPDATE recipes SET isDone = ? WHERE idmeal = ?`;
  // db.run(`INSERT INTO movie (title, url, type, year) VALUES ("terminator", "enroule.jpg", "film", "sdlfn")`, function(err) {
  db.run(sql, donnee, function(err) {
      if (err) {
        return console.log(err);
      }
      // get the last insert id
  });
  
  db.close();
  }



//exports

exports.addMeal = addMeal;
exports.loadingMeal = loadingMeal;
exports.remMeal = remMeal;
exports.updating = updating;
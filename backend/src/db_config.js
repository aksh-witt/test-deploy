const mysql = require ('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'magic',
    database: 'indiandb'
});

connection.connect((err) =>{
    if(err) {
        throw err;
    }   else {
        console.log('conectado ai papai')
    }
});

module.exports = connection;
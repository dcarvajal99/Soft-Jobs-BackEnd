const {Pool} = require('pg');
const {format} = require('utils');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'Daxer_200K',
    database: 'softjobs',
    allowExitOnIdle: true,
});

const insertarUsuario = async ({email, password, rol, lenguaje}) => {
    try {
        const consulta = format('INSERT INTO usuarios (email, password, rol, lenguaje) VALUES ($1, $2, $3, $4)');
        const values = [email, password, rol, lenguaje];
        const resultado = await pool.query(consulta,values);
        return resultado;
        /*poner mensaje de exito*/
        



    }
    catch (error) {
        console.log(error);
    }  
};

module.exports = { insertarUsuario };


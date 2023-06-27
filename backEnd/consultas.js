const { Pool } = require('pg');
const format = require('pg-format');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'Daxer_PEGA_200K',
    database: 'softjobs',
    allowExitOnIdle: true,
});

const insertarUsuario = async ( email, password, rol, lenguage ) => {
    try {
        const formatedQuery = format('INSERT INTO usuarios VALUES (%s, %s, %s, %s)', email, password, rol, lenguage);
        const resultado = await pool.query(formatedQuery);
        if(resultado.rowCount === 1){
            return "Usuario creado con exito";
        }
        else{
            return "Error al crear usuario";
        }
    }
    catch (error) {
        if (error.code === '23505') {
            return "El usuario ya existe";
        }
        else if (error.code === '23502') {
            return "Datos incompletos";
        }
        else if (error.code === '22P02') {
            return "Datos incorrectos";
        }
        else {
            console.log(error);
            return "Error al crear usuario";
        }
    }
    

};

module.exports = { insertarUsuario };


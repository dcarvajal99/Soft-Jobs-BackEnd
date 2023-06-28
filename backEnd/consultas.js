const { Pool } = require('pg');
const format = require('pg-format');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'Daxer_200K',
    database: 'softjobs',
    allowExitOnIdle: true,
});

const insertarUsuario = async ( email, password, rol, lenguage ) => {
    try {
        const formatedQuery = format('INSERT INTO usuarios (email, password, rol, lenguage) VALUES (%L, %L, %L, %L)', email, password, rol, lenguage);
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

const verificarCredenciales = async (email, password) => {
    const consulta = "SELECT * FROM usuarios WHERE email = $1 AND password = $2"
    const values = [email, password]
    const { rowCount } = await pool.query(consulta, values)
    if (!rowCount) {
        throw { code: 404, message: "No se encontró ningún usuario con estas credenciales" };
    }
}
/* https://github.com/lorenzoch2/soft-jobs-back/blob/main/index.js */

module.exports = { insertarUsuario, verificarCredenciales };


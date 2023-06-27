const express = require('express');
const app = express();
const cors = require('cors');
const {insertarUsuario} = require('./consultas');

app.use(cors());
app.use(express.json());

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});

const middlewareValidarDatos = async (req, res, next) => {
    try {
        const { email, password, rol, lenguaje } = req.body;
        //validar data
        if ((email.length === 0 || email === undefined)
            && (password.length === 0 || password === undefined)
            && (rol.length === 0 || rol === undefined)
            && (lenguaje.length === 0 || lenguaje === undefined)) {
            return res.status(400).send('Datos incompletos');

        }
    }
    catch (error) {
        console.log(error);
    }
    next();
}

app.post('/usuarios', middlewareValidarDatos, async (req, res) => {
    try {
        const params = req.body;
        const resultado = await insertarUsuario(params);
        res.json(resultado);
    }
    catch (error) {
        console.log(error);
    }
});

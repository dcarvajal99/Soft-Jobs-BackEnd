const express = require('express');
const app = express();
const cors = require('cors');
const {insertarUsuario, verificarCredenciales} = require('./consultas');
const jwt = require('jsonwebtoken');


app.use(cors());
app.use(express.json());

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});

const middlewareValidarDatos = async (req, res, next) => {
    try {
        const { email, password, rol, lenguage } = req.body;
        if (email && password && rol && lenguage) {
            next();
        }
        else {
            res.status(401).json('Datos incompletos');
        }
    }
    catch (error) {
        console.log(error);
    }
};

app.post('/usuarios', middlewareValidarDatos, async (req, res) => {
    const { email, password, rol, lenguage } = req.body;
    const resultado = await insertarUsuario(email, password, rol, lenguage);
    res.json(resultado);
    
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        await verificarCredenciales(email, password);
        const token = jwt.sign({email}, 'secret');
        res.json({token});
    } catch (error) {
        if (error.code === 404) {
            res.status(404).json(error.message);
        }
        else {
            res.status(500).json(error.message);
        }
    }
});

app.get('/usuarios/:id', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; 
        const {id}  = req.params;
        console.log(token);
        const payload = jwt.verify(token, 'secret');
        const {email} = payload;
        await verificarCredenciales(email, password);
        console.log(email);
    } catch (error) {
        if (error.code === 401) {
            res.status(401).json('No autorizado');
        }
        else {
            res.status(500).json(error.message);
        }
    }
});







/* app.post('/usuarios', middlewareValidarDatos, async (req, res) => {

        const {email, password, rol, lenguage} = req.body;
        console.log({email, password, rol, lenguage});
        const resultado = await insertarUsuario(email, password, rol, lenguage);
        res.json(resultado);

});
 */
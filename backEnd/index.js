const express = require('express');
const app = express();
const cors = require('cors');
const {insertarUsuario, verificarCredenciales} = require('./consultas');
const jwt = require('jsonwebtoken');
require('dotenv').config();


app.use(cors());
app.use(express.json());

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
//middleware para verificar credenciales en el formulario
const middlewareVerificarCredencialesForm = async (req, res, next) => {
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

//middleware para verificar credenciales en el login
const middlewareVerificarCredencialesLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (email && password) {
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


//middleware para validar token
const middlewareValidarToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if(!token){
            res.status(401).json('sin token');
        }
        jwt.verify(token, process.env.SECRET_KEY,(err, user) => {
            if(err){
                res.status(401).json('token invalido');
            }
            req.email = user;
        next();
        });
    }
    catch (error) {
        if (error.code === 401) {
            res.status(401).json('No autorizado');
        }
        else {
            res.status(500).json(error.message);
        }
    }
};

//rutas

app.post('/usuarios', middlewareVerificarCredencialesForm, async (req, res) => {
    try {
        const { email, password, rol, lenguage } = req.body;
        const resultado = await insertarUsuario(email, password, rol, lenguage);
        res.json(resultado);
    } catch (error) {
        res.status(500).json(error.message);
    }    
});

app.post('/login', middlewareVerificarCredencialesLogin ,async (req, res) => {
    try {
        const { email, password} = req.body;
        const usuario = await verificarCredenciales(email, password);
        if (!usuario) {
            res.status(404).json('Usuario o contraseña incorrectos');
        }
        const token = jwt.sign(email, process.env.SECRET_KEY);
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

app.get('/usuarios/:id', middlewareValidarToken ,async (req, res) => {
    try {
        const {email} = req.email;
        const usuario = await verificarCredenciales(email);
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







/* app.post('/usuarios', middlewareVerificarCredencialesForm, async (req, res) => {

        const {email, password, rol, lenguage} = req.body;
        console.log({email, password, rol, lenguage});
        const resultado = await insertarUsuario(email, password, rol, lenguage);
        res.json(resultado);

});
 */
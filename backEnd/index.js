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



/* app.post('/usuarios', middlewareValidarDatos, async (req, res) => {

        const {email, password, rol, lenguage} = req.body;
        console.log({email, password, rol, lenguage});
        const resultado = await insertarUsuario(email, password, rol, lenguage);
        res.json(resultado);

});
 */
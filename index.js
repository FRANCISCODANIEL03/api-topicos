const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
require('dotenv').config()

const app = express();//creamos la instancia del servidor express

//middlewares
app.use(express.json());
app.use(cors());

//Iniciamos el servidor
const PORT = 3000;

app.listen(PORT, () => { console.log("Servidor corriendo en http://localhost:" + PORT); });

//conexion con mysql
const conection = mysql.createConnection({
    host: process.env.BD_HOST,
    user: process.env.BD_USER,
    password: process.env.BD_PASSWORD,
    port: process.env.BD_PORT,
    database: process.env.BD_DATABASE
});

conection.connect((err) => {
    if (err) {
        console.error(err.message || "No se pudo conectar a la base de datos");
    }
    else {
        console.log("Conectado a la base de datos");
    }
});
//obtener los datos de la BD
app.get("/", (req, res) => {
    conection.query("SELECT * FROM usuarios", (error, results) => {
        if (error) {
            res.status(500).json({
                message: error.message || "No se puede obtener datos en este momento" +
                    "para la tabla usuarios"
            });
        }
        else res.status(200).json(results);
    });
});
//insertar datos a la BD
app.post("/", (req, res) => {
    var { nombre } = req.body;
    if (nombre == "") {
        res.json({
            message: "Inserta un nombre",
            value: 2
        });
    } else {
        conection.query(`INSERT INTO usuarios  (nombre) VALUES (?)`, [nombre],
            (error, results) => {
                if (error) {
                    res.status(500).json({
                        message: error.message || "No se puede hacer la insercion de datos"
                    });
                } else {
                    res.status(200).json({
                        message: "Usuario insertado correctamente",
                        data: results,
                        value: 1
                    });
                }
            });
    }
});
//actualizar datos de la BD
app.patch("/", (req, res) => {
    const { id, nombre } = req.body;
    if (id == "" || nombre == "") {
        res.json({
            message: "Algun campo esta vacio",
            value: 2
        });
    } else {
        conection.query(`UPDATE usuarios SET nombre = ? WHERE id = ?`, [nombre, id], (error, results) => {
            if (error) {
                res.status(500).json({
                    message: error.message || "No se puede actualizar el usuario"
                });
            } else {
                res.status(200).json({
                    message: "Usuario actualizado correctamente",
                    value: 1,
                    data: results
                });
            }
        });
    }
});
//Eliminar datos de la BD
app.delete("/", (req, res) => {
    const { id } = req.body;
    if (id == "") {
        res.json({
            message: "Inserta un id",
            value: 2
        });
    } else {
        conection.query(`DELETE FROM usuarios WHERE id = ?`, [id], (error, results) => {
            if (error) {
                res.status(500).json({
                    message: error.message || "No se puede eliminar el usuario"
                });
            } else {
                res.status(200).json({
                    message: "Usuario eliminado correctamente",
                    value: 1,
                    data: results
                });
            }
        });
    }
});

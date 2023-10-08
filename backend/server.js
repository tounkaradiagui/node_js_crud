const express = require("express");
const cors = require('cors');
const nodemon = require('nodemon');
const mysql = require('mysql');
const {check, validationResult} = require('express-validator');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password : "",
    database: "university"
});

// get all data from table users
app.get('/', (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql,(err , data)=>{
        if(err) return res.json("Error");
        return res.json(data);
    })
});

app.post('/create',[
    check('nom', 'Le champ nom est obligatoire').not().isEmpty().isLength({min:4}),
    check('prenom', 'Le champ prenom est obligatoire').not().isEmpty().isLength({min:5}),
    check('email', 'Le champ email est obligatoire').not().isEmpty().isLength({min:8}).isEmail(),
    check('telephone', 'Le champ telephone est obligatoire').not().isEmpty().isLength({min:4}),
    check('role', 'Le champ role est obligatoire').not().isEmpty().isLength({min:4})
], (req, res) => {
    const sql = "INSERT INTO users (`nom`, `prenom`, `email`, `telephone`, `role`) VALUES (?)";
    const values = [
        req.body.nom,
        req.body.prenom,
        req.body.telephone,
        req.body.email,
        req.body.role
    ]    
    db.query(sql, [values], (err, data) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.json(errors);
        }else{
            if(err) return res.json("Error");
            return res.json(data);
        }
    })
});

app.get('/edit/:id', (req, res) => {
    const sql = "SELECT * FROM users WHERE id = ?";
    const id = req.params.id;

    db.query(sql, [id], (err , result) => {
        if(err) return res.json({Error:err});
        return res.json(result);
    })
});

app.put('/update/:id', (req, res) => {
    const sql = "update users set `nom` = ?, `prenom` = ?, `email` = ?, `telephone` = ?, `role` = ? where id = ?";
    const values = [
        req.body.nom,
        req.body.prenom,
        req.body.telephone,
        req.body.email,
        req.body.role
    ]
    
    const id = req.params.id;

    db.query(sql, [...values, id], (err, data) => {
        if(err) return res.json("Error");
        return res.json(data);
    })
});

app.delete('http://localhost:8080/users/:id', (req, res) => {
    const sql = "DELETE FROM users where id = ?";
    const id = req.params.id;

    db.query(sql, [id], (err , data) => {
        if(err) return res.json("Error");
        return res.json(data);
    })
});

app.listen(8080, () => {
    console.log("Server is running");
});

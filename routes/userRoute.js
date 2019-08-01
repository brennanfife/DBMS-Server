const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const connection = require("../config/db.js");
const passport = require("passport");


router.get("/login/google", passport.authenticate('google', {
    scope: ['profile', 'email']
}));


router.get("/login/google/redirect/", passport.authenticate('google'), (req, res) => {
    res.redirect('http://localhost:5000/profile');
});


router.post("/login", (req, res) => {
    let { email, password } = req.body;
    const findUserQuery = `CALL getUserByEmail('${email}')`;
    connection.query(findUserQuery, (err, row) => {
        console.log(row);
        if (row[0] === undefined || row[0].length == 0) {
            console.log("acn't find")
            res.json({ error: "We can't find a user with that email" });
            return;
        } else {
            bcrypt.compare(password, row[0][0].password, (err, result) => {
                if (err) throw err;
                if (result) console.log("Im in");
                else res.json({error: "Password does not match"}); 
            });
        }
    });
});

router.post("/register", (req, res) => {
    let { name, email, password, password2 } = req.body;
    let error;
    const checkUserExistQuery = `CALL getUserByEmail('${email}')`;
    connection.query(checkUserExistQuery, (err, row) => {
        console.log(row);
        if (err) throw err;
        if (password != password2) {
            error = { error: "Two passwords must match" };
        }
        if (password.length < 6) {
            error = { error: "Password cannot be shorter than 6 characters" };
        }
        if (!name || !email || !password || !password2) {
            error = { error: "You must fill all the fields" };
        }
        if (!(row[0] === undefined || row[0].length == 0)) {
            error = { error: "User with the same email already exist" };
        }
        if (error) {
            res.json(error);
            return;
        }
        bcrypt.genSalt(10, (err, salt) => {
            if (err) throw err;
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) throw err;
                password = hash;
                connection.query(
                    `CALL createUser ("${name}", "${email}", "${password}")`,
                    (err, rows) => {
                        if (err) throw err;
                    }
                );
                res.status(200).json({ message: "Register success" });
                return;
            });
        });
    });
});

module.exports = router;

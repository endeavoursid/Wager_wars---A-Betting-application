const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const jwt_key = "bets";
const User = require("../model/userModel");

// API for user signup
const Signup = async (req, resp) => {
    try {
        const { password } = req.body;
        let user = new User(req.body);
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);
        user.password = hashedPass;
        let result = await user.save();

        // Create a JWT token for the user
        jwt.sign({ user }, jwt_key, (err, token) => {
            if (err) {
                resp.status(500).send("Something went wrong");
            }
            resp.send({ user, auth: token });
        });
    } catch (e) {
        resp.status(500).send(e.message);
    }
}

// API for user login
const Login = async (req, resp) => {
    const { phone, password } = req.body;

    if (phone && password) {
        try {
            let user = await User.findOne({ phone });

            if (user) {
                const passwordIsCorrect = await bcrypt.compare(password, user.password);

                if (passwordIsCorrect) {
                    // Create a JWT token for the user
                    jwt.sign({ id: user._id }, jwt_key, (err, token) => {
                        if (err) {
                            resp.status(500).send("Something went wrong");
                        }
                        resp.send({ user, auth: token });
                    });
                } else {
                    resp.status(401).send("Incorrect password");
                }
            } else {
                resp.status(404).send("User not found");
            }
        } catch (error) {
            resp.status(500).send(error.message);
        }
    } else {
        resp.status(400).send("Phone and password are required");
    }
}

// API to get user information by ID
const GetUser = async (req, res) => {
    const id = req.params.id;

    try {
        let user = await User.findOne({ _id: id });

        if (user) {
            res.send(user);
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = { Signup, Login, GetUser };

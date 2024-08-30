const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
 // Get the token from the session
    const token = req.session.token;

    // If token doesn't exist, deny access
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, "your_jwt_secret_key"); // Replace "your_jwt_secret_key" with your actual secret key
        req.user = decoded; // Store the decoded user information in req.user

        // Proceed to the next middleware/route handler
        next();
    } catch (ex) {
        // If token verification fails, deny access
        return res.status(400).json({ message: "Invalid token." });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));

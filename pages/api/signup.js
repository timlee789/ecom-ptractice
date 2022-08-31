import User from "../../models/Users";
import db from "../../utils/db";
import bcrypts from 'bcrypt';

async function handler(req, res) {
    if(req.method !== 'POST') {
        return;
    }
    const { name, email, password } = req.body;
    if (
        !name ||
        !email ||
        !email.includes('@') ||
        !password ||
        password.trim().length < 5
    ) {
        res.status(422).json({
            message: 'Validation error',
        });
        return;
    }

    await db.connect();
    const existingUser = await User.findOne({ email: email});
    if (existUser) {
        res.status(422).json({ message: "User exists already"});
        await db.disconnect();
        return;
    }

    const newUser = new User({
        name,
        email,
        password: bcrypts.hashSync(password),
        isAdmin: false,
    });
    const user = await newUser.save();
    await db.disconnect();
    res.status(201).send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
    })
}
export default handler;
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { toast } from 'react-toastify';
import nodemailer from "nodemailer";

dotenv.config();

const jwt_secret = process.env.JWT_SECRET;

const app = express();
const port = 4000;
app.use(express.json());
app.use(cors());

app.set("view engine", "ejs");
app.use(express.urlencoded({extended: false}));

const mongoUrl = process.env.MONGO_URL;

mongoose
    .connect(mongoUrl, {
        useNewUrlParser: true,
    })
    .then(() => {
        console.log("Connected to database");
    })
    .catch((e) => console.log(e));

const NoteSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
  },
  {
    collection: "Notes",
  }
);
const UserDetailsSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    notes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note',
      },
    ],
  },
  {
    collection: "UserInfo",
  }
);

const Note = mongoose.model("Note", NoteSchema);
const User = mongoose.model("UserInfo", UserDetailsSchema);



app.post("/register", async(req,res) => {
    const { name, email, password, repeatPassword } = req.body;
    if (password !== repeatPassword) {
        res.send({ error: "Passwords don't match" });
    return toast.error("Passwords don't match");
    }
    const encryptedPassword = await bcryptjs.hash(password, 10);
    try {
        const oldUser = await User.findOne({ email });

        if (oldUser) {
            res.send({ error: "User already exists" });
            return toast.error("User already exists");
        }
        await User.create({
            name,
            email,
            password: encryptedPassword,
        });
        res.send({status: "ok"});
        toast.success("Registration successful. You can now log in.");
    }catch (error){
        res.send({status: "error"});
    }
});

app.post("/login", async(req,res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.json({ error: "User not found" });
    }
    if (await bcryptjs.compare(password, user.password)) {
        const token = jwt.sign({ email: user.email }, jwt_secret);

        if(res.status(201)) {
            return res.json({ status: "ok", data: token });
        } else {
            return res.json({ error: "error" });
        } 
    }
    res.json({ status: "error", error: "Invalid password" });
});

app.post("/app", async (req,res) => {
    const { token } = req.body;
    try {
        const user=jwt.verify(token, jwt_secret);
        const useremail = user.email;
        User.findOne({ email: useremail })
        .then((data) => {
            res.send({ status: "ok", data: data });
        })
        .catch((error) => {
            res.send({ status: "error", data: error });
        });
    } catch (error) {
        console.log(error);
    }
});


app.post("/addnote", async (req, res) => {
  const { email, title, content } = req.body;

  try {
    const user = await User.findOne({ email }).populate("notes");

    if (!user) {
      return res.status(400).json({ status: "error", error: "User not found" });
    }

    const newNote = new Note({
      title,
      content,
      user: user._id,
    });

    await newNote.save();

    user.notes.push(newNote._id);

    await user.save();
    
    return res.status(200).json({ status: "ok", notesId: newNote._id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", error: "Server error" });
  }
});

app.delete("/deletenote/:noteId", async (req, res) => {    
    const noteId = req.params.noteId;
    try {
    const result = await Note.findByIdAndRemove(noteId);

    if (!result) {
      return res.status(404).json({ status: 'error', error: 'Note not found' });
    }

    const user = await User.findOne({ email: req.body.email });
    user.notes.pull(noteId);
    await user.save();

    return res.json({ status: 'ok', message: 'Note deleted' });
  } catch (error) {
    return res.status(500).json({ status: 'error', error: 'Server error' });
  }
});

app.get("/notes/:noteId", async (req, res) => {
    const noteId = req.params.noteId; // Get the noteId from the request parameters

  try {
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.status(200).json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/forgotpassword", async (req, res) => {
    const { email } = req.body;
    try {
        const oldUser = await User.findOne({ email });
        if (!oldUser) {
            res.send({ error: "User not exists" });
            return toast.error("User not exists");
        }
        const secret = jwt_secret + oldUser.password;
        const token = jwt.sign({ email: oldUser.email, id: oldUser._id}, secret, {expiresIn: "5m"} );
        const link = `http://localhost:4000/resetpassword/${oldUser._id}/${token}`;
        const myEmail = process.env.EMAIL;
        const myPass = process.env.PASSWORD;
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: myEmail,
                pass: myPass,
            }
            });

        var mailOptions = {
        from: myEmail,
        to: email,
        subject: 'KeeperApp - changing password',
        text: link,
        };

        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
        });

        //console.log(link);
        return res.status(200).json({ message: "Check email." });
        
    } catch (error) {
        return console.log(error);
    }
});

app.get("/resetpassword/:id/:token", async (req, res) => {
    const {id, token} = req.params;
    const oldUser = await User.findOne({ _id: id });
        if (!oldUser) {
            res.send({ error: "User not exists" });
            return toast.error("User not exists");
        }
    const secret = jwt_secret + oldUser.password;
    try {
        const verify = jwt.verify(token, secret);
        res.render("index", {email: verify.email, status: "Not Verified"});
    }catch (error) {
        res.send("Not verified");
    }
});

app.post("/resetpassword/:id/:token", async (req, res) => {
    const {id, token} = req.params;
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword ) {
        res.send({ error: "Passwords don't match" });
    return toast.error("Passwords don't match");
    }
    const oldUser = await User.findOne({ _id: id });
        if (!oldUser) {
            res.send({ error: "User not exists" });
            return toast.error("User not exists");
        }
        
    const secret = jwt_secret + oldUser.password;
    try {
        const verify = jwt.verify(token, secret);
        const encryptedPassword = await bcryptjs.hash(password, 10);
        await User.updateOne({
            _id: id,

        }, {
            $set: {
                password: encryptedPassword,
            },
        });
        res.render("index", {email: verify.email, status: "Verified"})
        return toast.success("Password updated. You can now log in.");
        
    }catch (error) {
        res.send({ status: "Something went wrong" });
    }
});


app.listen(port, () => console.log(`Server is running on ${port}`));
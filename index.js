require("dotenv").config();
const express = require("express");
const connectDB = require("./database/db");
const User = require("./models/user.model");

const app = express();

const server = require("http").Server(app); // <--- this line wraps the app in a server instance
const io = require("socket.io")(server); // <--- this line adds socket.io functionality to the server

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
connectDB();

const port = process.env.PORT || 4545;

// create a new user
app.post("/users", async (req, res, next) => {
  try {
    const { name, slogan, party } = req.body;
    // validation
    if (!(name && slogan)) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    const existingUser = await User.findOne({
      name,
    });
    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
      });
    }
    const user = await User.create({
      name,
      slogan,
      party,
    });
    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

// get all users
app.get("/users", async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// send a message from the server to the client
app.put("/users/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(
      id,
      { $inc: { votes: 1 } },
      { new: true }
    );
    const users = await User.find();

    io.emit("candidate", users);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// receive a message from the client and in our case we are using postman to send the message
io.on("connection", async (socket) => {
  socket.on("vote", async (data) => {
    // validate data coming from the client side before updating the database
    if (!(data.name && data.slogan && data.party)) {
      throw new Error("Please enter all fields");
    }

    // check if the user already exists
    const existingUser = await User.findOne({
      name: data.name,
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    // create a new user
    const user = await User.create({
      name: data.name,
      slogan: data.slogan,
      party: data.party,
    });
      
        // get all users
      const users = await User.find();
      console.log(users);

    // send the new user to the server to be broadcasted to all connected clients
    //   io.emit("candidate", user);
      io.emit("candidate", users);
  });
});


// vote a user using the user id
io.on("connection", async (socket) => {
    socket.on("vote_user", async (data) => {
        // validate data coming from the client side before updating the database
        if (!(data.id)) {
            throw new Error("Please enter all fields");
        }

        // vote a user
        const user = await User.findByIdAndUpdate(
            data.id,
            { $inc: { votes: 1 } },
            { new: true }
        );

        // get all users
        const users = await User.find();
        console.log(users);

        // send the new user to the server to be broadcasted to all connected clients
        //   io.emit("candidate", user);
        io.emit("candidate", user);
    });

});




// socket.io error handler
io.on("error", (error) => {
    console.log("Error: ", error);
});


// 404 handler
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

// Error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

server.listen(port, () => console.log(`Server started on port ${port}`));

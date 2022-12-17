const User = require("././models/user.model")

const emittedVotes = (io) => {
    return async (req, res, next) => {
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
    };
};

module.exports = emittedVotes;
import User from "../models/user.model.js";
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        // Find all users except current user. $ne is not equal to.
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getUsersForSidebar controller, ", error);
        return res.status(500).json({ error: "Internal Server Error"});
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;
        
        const messages = await Message.find({
            $or: [
                {senderId: senderId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: senderId}
            ]
        })

        res.status(200).json(messages);

    } catch (error) {
        console.log("Error in getMessages controller, ", error);
        res.status(500).json({ error: "Internal Server Error"});
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(image) {
            // upload base64 image on cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;  // the cloudinary url which we will store in MongoDB
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,  // storing the cloudinary URL in MongoDB
        });

        await newMessage.save();

        // todo: socket.io
        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller, ", error.message);
        res.status(500).json({ error: "Internal Server Error"});
    }
}
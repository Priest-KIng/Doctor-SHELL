import mongoose from "mongoose"

const doctorSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        phoneNumber: {
            type: Number,
            default: "",
        },
        profilePic: {
            type: String,
            default: "",
        }
    },
    { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
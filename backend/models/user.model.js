import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
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
        dateOfBirth: {
            type: Number,
            default: "",
        },
        gender:[ {
            type: String,
            enum: ['Male', 'Female', 'Other'],
            required: true,
        }],
        address: [{
            city: {
                type: String,
                required: true,
            },
            state: {
                type: String,
                required: true,
            },
        }],
        medicalHistory: [
            {consition: {
                type: String,
                required: true,
            },
            diagnosisDate: {
                type: String,
                required: true,
            },
            patientStatus: {
                type: String,
                required: true,
            },}
        ],
        appointments: [
            {date: {
                type: Date,
                default: null,
            },
            reason: {
                type: String,
                default: "",
            },}
        ],
        adrDetectionSystem: [{
            type: Boolean,
            default: false,
        }],
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
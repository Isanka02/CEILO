import mongoose from 'mongoose';
import e from "express";
export const connectDB = async () => {

try { 
 await mongoose.connect("mongodb+srv://admin:uQgMwVABDW33Hg16@ceilo.y7c9bgq.mongodb.net/ceilo_db?appName=Ceilo");

 console.log('Connected to MongoDB');
} 
catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); //exit with failure
}
}

export default connectDB;
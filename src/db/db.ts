import mongoose from "mongoose";

export const connectToDatabase = async () => {
    try {
        const res = await mongoose.connect(`${process.env.DATABASE_URL}/${process.env.DATABASE_NAME}`)
        console.log(`Database sucessfully connected : `,res.connection.host)
        
    } catch (error) {
        console.log(error)
        throw error
    }

}
import mongoose from "mongoose"

const connectDB = async() => {
    // DBとの接続が成功した場合
    try {
        //URLの<Password>にパスワード、mongodb.net/ と ? の間にデータベース名を入力する
        await mongoose.connect("mongodb+srv://JackOguro:arai1019@cluster0.oqfkkqs.mongodb.net/test?retryWrites=true&w=majority")
        console.log("Success: Connected to MongoDB")
    // DBとの接続が失敗した場合
    } catch(err) {
        console.log("Failure: Unconnected to MongoDB")
        throw new Error()
    }
}

export default connectDB
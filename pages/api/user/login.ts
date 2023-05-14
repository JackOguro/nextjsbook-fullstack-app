// ログインする

import type { NextApiResponse } from "next"
// jsonwebtokenは、トークンを発行するjwt.sign()とログイン後のリクエスト時にトークンの有効性を検証するjwt.verify()をセットで使用する
import jwt from "jsonwebtoken"
import connectDB from "@/utils/database"
import { UserModel } from "@/utils/schemeMadels"
import { ExtendedNextApiRequestUser, SavedUserDataType, ResMessageType } from "@/utils/types"

const secret_key = "nextmarket"

const loginUser = async(req: ExtendedNextApiRequestUser, res: NextApiResponse<ResMessageType>) => {
    try {
        await connectDB()

        // UserModelに格納されているfindOne()がメールアドレスを目安にデータを探す
        const savedUserData: SavedUserDataType | null = await UserModel.findOne({email: req.body.email})

        console.log(savedUserData)

        // ユーザーデータが存在する場合の処理
        if(savedUserData) {
            // パスワードが正しい場合
            if(req.body.password === savedUserData.password) {
                
                // ペイロードとはトークンに含ませたいデータで、一般的にはユーザー名やメールアドレスを入れる
                const payload = {
                    email: req.body.email,
                }

                // jwt.sign()でトークンを発行するためにはカッコ内に３つの要素を入れる必要がある
                // jwt.sign(ペイロード, シークレットキー, 有効期限)
                // シークレットキーは、発行されたトークンの安全性を高めるために使用される
                // expiresInがトークンの有効期限を設定する場所、5m(5分間)、2d(2日間)など
                // トークンだけを持っていてもトークンは有効とされず、シークレットキーと組み合わせることで初めて有効と判定される
                // トークンを記述する場所はログインが成功した場合
                const token = jwt.sign(payload, secret_key, {expiresIn: "23h"})

                console.log(token)

                return res.status(200).json({message: "ログイン成功", token: token})
            // パスワードが存在しない場合
            } else {
                return res.status(400).json({message: "ログイン失敗：パスワードが間違っています"})
            }
        // ユーザーデータが存在しない場合の処理
        } else {
            return res.status(400).json({message: "ログイン失敗：ユーザー登録してください"})
        }
    } catch(err) {
        return res.status(400).json({message: "ログイン失敗"})
    }
}

export default loginUser
// ユーザーがログインしているかどうか判定する、自分で作成したデータのみ操作を制限する
// 作成、修正、削除処理はログインしているユーザーにだけ許可したいので、処理前にauth.tsxを通過させる

import type { NextApiResponse } from "next"
import jwt from "jsonwebtoken"
import { ExtendedNextApiRequestAuth, DecodedType, ResMessageType } from "./types"

const secret_key = "nextmarket"

// handlerとは何らかの働きをするもの(=function)を指すもの
const auth = (handler: Function) => {
    return async(req: ExtendedNextApiRequestAuth, res: NextApiResponse<ResMessageType>) => {

        // アイテムデータの作成、修正、削除など、formタグのmethodがPOSTの場合処理を行いたいので、methodがGETの場合処理は行わない
        if (req.method === "GET") {
            return handler(req, res)
        }

        // フロンドエンドがリクエストを送る際、まずLocal Storageからトークンを取り出した後、HTTP headersというところに格納しバックエンドに送る
        const token = await req.headers.authorization.split(" ")[1]

        // テスト用
        //const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhlbGxvQG1vbm90ZWluLmNvbSIsImlhdCI6MTY4NDA0NzM2NiwiZXhwIjoxNjg0MTMwMTY2fQ.kx1loM_KzfXbditxNYaFazkhWvwkhxZsr0vGyM19cfI"

        // トークンがない場合
        if(!token) {
            return res.status(401).json({message: "トークンがありません"})
        }

        // トークンが有効でない場合があるのでtry-catch文を使用する
        try {
            // ログイン後のリクエスト時にトークンの有効性を検証するjwt.verify()をセット
            const decoded = jwt.verify(token, secret_key)
            
            // console.log(decoded)

            req.body.email = (decoded as DecodedType).email

            // トークンが正しかった場合、req, resを返して処理を終了する
            return handler(req, res)
        } catch(err) {
            return res.status(401).json({message: "トークンが正しくないので、ログインしてください"})
        }
    }
}

export default auth
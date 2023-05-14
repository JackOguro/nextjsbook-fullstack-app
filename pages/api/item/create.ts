// アイテムを作成する

import type { NextApiResponse } from "next"
import connectDB from "../../../utils/database"
import { ItemModel } from "../../../utils/schemeMadels"
import auth from "../../../utils/auth"
import { ExtendedNextApiRequestItem, ResMessageType } from "@/utils/types"

// 一旦anyで代用
// req: フロントエンドから送られてきたリクエストの具体的な内容やデータ
// res: リクエストに対するバックエンド側からのレスポンス
const createItem = async(req: ExtendedNextApiRequestItem, res: NextApiResponse<ResMessageType>) => {
    try {
        await connectDB()

        // titleはinputのname属性と対応している
        // console.log(req.body)

        // ItemModelに格納されているcreate()がデータベースへの書き込みを行う
        await ItemModel.create(req.body)
    
        // フロントエンドからのリクエストは毎回必ず正しく処理されるとは限らず、失敗した処理にはエラーの種類に応じてそれぞれの数字が割り振られている
        // エラーを通知するのがstatus()になり、200は正常終了したことを意味する
        return res.status(200).json({message: "アイテム作成"})
    } catch(err) {

        // リクエストエラー全敗を表すステータスコード400
        return res.status(400).json({message: "アイテム作成失敗"})   
    }
}

export default auth(createItem)
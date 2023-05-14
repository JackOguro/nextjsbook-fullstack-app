// アイテムを削除する
// []を用いたファイルを1つのフォルダ内に1ファイルのみしか定義できないため
// 新たにdeleteフォルダを作成し、[id].tsxを作成する

import type { NextApiResponse } from "next"
// @ をつけることでパスを省略可能
import connectDB from "@/utils/database"
import { ItemModel } from "@/utils/schemeMadels"
import auth from "@/utils/auth"
import { ExtendedNextApiRequestItem, SavedItemDataType, ResMessageType } from "@/utils/types"

const deleteItem = async(req: ExtendedNextApiRequestItem, res: NextApiResponse<ResMessageType>) => {
    try {
        await connectDB()

        const singleItem: SavedItemDataType | null = await ItemModel.findById(req.query.id)

        if(!singleItem) return res.status(400).json({message: "アイテムが存在していないため削除失敗"})

        if (singleItem.email === req.body.email) {

            // ItemModelに格納されているdeleteOne()がデータを１つ削除することができる
            await ItemModel.deleteOne({_id: req.query.id})

            return res.status(200).json({message: "アイテム削除成功"})
        } else {
            throw new Error()
        }
    } catch(err) {
        return res.status(400).json({message: "アイテム削除失敗"})
    } 
}

export default auth(deleteItem)
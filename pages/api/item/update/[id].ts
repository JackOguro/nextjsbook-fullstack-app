// アイテムを修正する
// []を用いたファイルを1つのフォルダ内に1ファイルのみしか定義できないため
// 新たにupdateフォルダを作成し、[id].tsxを作成する

import type { NextApiResponse } from "next"
import connectDB from "../../../../utils/database"
import { ItemModel } from "../../../../utils/schemeMadels"
import auth from "../../../../utils/auth"
import { ExtendedNextApiRequestItem, SavedItemDataType, ResMessageType } from "@/utils/types"

const updateItem = async(req: ExtendedNextApiRequestItem, res: NextApiResponse<ResMessageType>) => {

    console.log(req)

    try {
        await connectDB()

        // URLで入力されたidと一致するアイテムデータを取得する
        const singleItem: SavedItemDataType | null = await ItemModel.findById(req.query.id)

        if(!singleItem) return res.status(400).json({message: "アイテムが存在していないため編集失敗"})

        // 保存してあるアイテムデータのメールアドレスとトークンから取得したメールアドレスが一致しているか判定する
        // req.body.email === decoded.email
        if (singleItem.email === req.body.email) {
        
            // ItemModelに格納されているupdateOne()がデータを１つ読み取ることができる
            // findByIdは_idを使うことを前提にしているが、updateOneはそうではないため指定する必要がある
            await ItemModel.updateOne({_id: req.query.id}, req.body)
        
            return res.status(200).json({message: "アイテム編集成功"})
        } else {
            throw new Error()
        }
    } catch(err) {
        return res.status(400).json({message: "アイテム編集失敗"})
    }
}

export default auth(updateItem)
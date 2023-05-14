// [id].jsを使うことで、一つのファイルを異なるURLに対して割り当てることができる
// [id].jsファイルは1つのフォルダ内に1つしか作ることができないですが、データを1つだけ読み取るケースに使用される
// []で挟まれていれば中の文字列はなんでも良い

import type { NextApiRequest, NextApiResponse } from "next"
import connectDB from "../../../utils/database"
import { ItemModel } from "../../../utils/schemeMadels"
import { SavedItemDataType, ResReadSingleType } from "@/utils/types"

const getSingleItem = async(req: NextApiRequest, res: NextApiResponse<ResReadSingleType>) => {
    try {
        await connectDB()

        // httpリクエストで送られてきたURL(http:localhost:3030/api/item/***)
        // console.log(req.query.id)
        
        // ItemModelに格納されているfindById()がデータを１つ読み取ることができる
        const singleItem: SavedItemDataType | null = await ItemModel.findById(req.query.id)

        if(!singleItem) return res.status(400).json({message: "アイテムが存在していないため読み取り失敗"})

        return res.status(200).json({message: "アイテム読み取り成功（シングル）", singleItem: singleItem})
    } catch(err) {
        return res.status(400).json({message: "アイテム読み取り失敗（シングル）"})
    }
}

export default getSingleItem
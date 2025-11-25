import mongoose, { Schema, Model } from 'mongoose'
import { ICollection } from '@/types'

const CollectionSchema = new Schema<ICollection>(
  {
    name: {
      type: String,
      required: [true, '请输入收藏夹名称'],
      trim: true,
      maxlength: [50, '名称最多50个字符'],
    },
    description: {
      type: String,
      maxlength: [200, '描述最多200个字符'],
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    cardIds: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

const Collection: Model<ICollection> =
  mongoose.models.Collection ||
  mongoose.model<ICollection>('Collection', CollectionSchema)

export default Collection

import mongoose, { Schema, Model } from 'mongoose'
import { ICard } from '@/types'

const CardSchema = new Schema<ICard>(
  {
    title: {
      type: String,
      required: [true, '请输入标题'],
      trim: true,
      maxlength: [100, '标题最多100个字符'],
    },
    content: {
      type: String,
      required: [true, '请输入内容'],
    },
    imageUrl: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (v: string[]) {
          return v.length <= 10
        },
        message: '标签最多10个',
      },
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

// 创建索引以支持全文搜索
CardSchema.index({ title: 'text', content: 'text', tags: 'text' })

const Card: Model<ICard> =
  mongoose.models.Card || mongoose.model<ICard>('Card', CardSchema)

export default Card

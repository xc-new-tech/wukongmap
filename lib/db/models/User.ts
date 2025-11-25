import mongoose, { Schema, Model } from 'mongoose'
import { IUser } from '@/types'

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, '请输入用户名'],
      unique: true,
      trim: true,
      minlength: [3, '用户名至少3个字符'],
      maxlength: [20, '用户名最多20个字符'],
    },
    email: {
      type: String,
      required: [true, '请输入邮箱'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, '请输入有效的邮箱地址'],
    },
    password: {
      type: String,
      required: [true, '请输入密码'],
      minlength: [6, '密码至少6个字符'],
    },
    avatar: {
      type: String,
      default: '',
    },
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
)

// 防止重复编译模型
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export default User

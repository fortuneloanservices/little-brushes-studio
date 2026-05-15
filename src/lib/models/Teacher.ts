import mongoose from 'mongoose';

export interface TeacherDocument extends mongoose.Document {
  fullName: string;
  email: string;
  phone?: string;
  specialization: string;
  experience: number;
  status: 'Active' | 'Inactive';
  classes: string[];
  isSenior: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TeacherSchema = new mongoose.Schema<TeacherDocument>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  specialization: { type: String, required: true },
  experience: { type: Number, required: true, default: 1 },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  classes: { type: [String], default: [] },
  isSenior: { type: Boolean, default: false },
}, {
  timestamps: true,
});

const TeacherModel = mongoose.models.Teacher as mongoose.Model<TeacherDocument>;
export default TeacherModel || mongoose.model<TeacherDocument>('Teacher', TeacherSchema);

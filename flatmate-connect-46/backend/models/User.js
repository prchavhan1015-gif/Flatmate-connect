import mongoose from 'mongoose';
const profileSchema = new mongoose.Schema({
 full_name:{type:String,default:''}, user_type:{type:String,default:'student'}, age:Number, gender:String, occupation:String, organization:String, phone:String, city:String, budget:Number, move_in_date:String, bio:String, food_preference:String, smoking:String, drinking:String, pets:String, sleep_schedule:String, cleanliness:String, interests:{type:[String],default:[]}, avatar_url:String, profile_completed:{type:Boolean,default:false}
},{timestamps:true,strict:true});
const schema = new mongoose.Schema({email:{type:String,required:true,unique:true,lowercase:true,trim:true},password:{type:String,required:true},profile:profileSchema},{timestamps:true});
schema.index({'profile.city':1}); schema.index({'profile.budget':1});
export default mongoose.model('User',schema);

import {Router} from 'express'; import User from '../models/User.js';
const router=Router();
const publicProfile=u=>({id:u._id,email:u.email,...u.profile.toObject()});
router.get('/',async(req,res)=>{try{const q={};if(req.query.city)q['profile.city']=req.query.city;if(req.query.maxBudget)q['profile.budget']={$lte:Number(req.query.maxBudget)};const users=await User.find(q).limit(100);res.json(users.map(publicProfile));}catch{res.status(500).json({message:'Unable to load profiles'});}});
router.get('/me',async(req,res)=>{const u=await User.findById(req.userId);res.json(u?publicProfile(u):null);});
router.put('/me',async(req,res)=>{try{const allowed=['full_name','user_type','age','gender','occupation','organization','phone','city','budget','move_in_date','bio','food_preference','smoking','drinking','pets','sleep_schedule','cleanliness','interests','avatar_url','profile_completed'];const patch={};for(const k of allowed)if(k in req.body)patch[`profile.${k}`]=req.body[k];const u=await User.findByIdAndUpdate(req.userId,{$set:patch},{new:true});res.json(publicProfile(u));}catch{res.status(400).json({message:'Unable to update profile'});}});
router.get('/:id',async(req,res)=>{try{const u=await User.findById(req.params.id);if(!u)return res.status(404).json({message:'Profile not found'});res.json(publicProfile(u));}catch{res.status(404).json({message:'Profile not found'});}});
export default router;

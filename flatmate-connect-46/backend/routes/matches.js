import { Router } from 'express';
import User from '../models/User.js';
const router = Router();
const weights = { city: 25, budget: 25, food_preference: 8, smoking: 8, drinking: 6, pets: 6, sleep_schedule: 8, cleanliness: 8, interests: 6 };
function score(a, b) {
  let points = 0, max = 0, reasons = [];
  const add = (field, value, reason) => { max += weights[field]; if (value) { points += weights[field]; reasons.push(reason); } };
  add('city', !!a.city && a.city.trim().toLowerCase() === (b.city||'').trim().toLowerCase(), 'Same city');
  const budgetA=Number(a.budget), budgetB=Number(b.budget); max+=weights.budget;
  if(budgetA>0&&budgetB>0){const ratio=Math.min(budgetA,budgetB)/Math.max(budgetA,budgetB);points+=weights.budget*ratio;if(ratio>=.85)reasons.push('Similar budget');}
  for(const f of ['food_preference','smoking','drinking','pets','sleep_schedule','cleanliness']) add(f, !!a[f]&&!!b[f]&&a[f].toLowerCase()===b[f].toLowerCase(), `${f.replaceAll('_',' ')} compatible`);
  max+=weights.interests;const ai=a.interests||[],bi=b.interests||[];if(ai.length&&bi.length){const overlap=ai.filter(x=>bi.some(y=>y.toLowerCase()===x.toLowerCase())).length;points+=weights.interests*(overlap/Math.max(ai.length,bi.length));if(overlap)reasons.push(`${overlap} shared interest${overlap>1?'s':''}`);}
  return {match:Math.round(max?points/max*100:0),reasons};
}
router.get('/', async(req,res)=>{try{const me=await User.findById(req.userId);if(!me)return res.status(404).json({message:'Profile not found'});const p=me.profile||{};const q={'_id':{$ne:me._id},'profile.profile_completed':true};if(req.query.city)q['profile.city']=new RegExp(req.query.city.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&'),'i');if(req.query.maxBudget)q['profile.budget']={$lte:Number(req.query.maxBudget)};const candidates=await User.find(q).limit(200);const results=candidates.map(u=>{const s=score(p,u.profile||{});return {id:u._id,email:u.email,...u.profile.toObject(),match:s.match,reasons:s.reasons};}).sort((x,y)=>y.match-x.match);res.json(results);}catch(e){console.error(e);res.status(500).json({message:'Unable to calculate matches'});}});
export default router;

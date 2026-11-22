import jwt from 'jsonwebtoken';
export function requireAuth(req,res,next){try{const h=req.headers.authorization||'';const token=h.startsWith('Bearer ')?h.slice(7):'';const decoded=jwt.verify(token,process.env.JWT_SECRET);req.userId=decoded.id;next();}catch{return res.status(401).json({message:'Authentication required'});}}

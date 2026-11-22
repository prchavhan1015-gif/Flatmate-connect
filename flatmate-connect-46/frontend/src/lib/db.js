// API client for the RoomMate Express/MongoDB backend.
const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'roommate_api_token';
const SESSION_KEY = 'roommate_api_session';
const listeners = new Set();
const read = (key) => { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } };
const saveSession = (session) => {
  if (session) { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); localStorage.setItem(TOKEN_KEY, session.access_token); }
  else { localStorage.removeItem(SESSION_KEY); localStorage.removeItem(TOKEN_KEY); }
};
const notify = (event, session) => listeners.forEach((cb) => cb(event, session));
const errorObject = (message) => ({ message, name: 'AuthError' });
async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) headers.Authorization = `Bearer ${token}`;
  if (options.body && typeof options.body !== 'string') { headers['Content-Type'] = 'application/json'; options = { ...options, body: JSON.stringify(options.body) }; }
  const res = await fetch(`${API}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
}
function sessionFrom(data) {
  return { access_token: data.token, refresh_token: data.token, token_type: 'bearer', expires_in: 604800, expires_at: Math.floor(Date.now()/1000)+604800,
    user: { id: data.user.id, email: data.user.email, aud: 'authenticated', role: 'authenticated', app_metadata: {}, user_metadata: {}, created_at: new Date().toISOString() } };
}
const auth = {
  async signUp({ email, password, options }) {
    try { const data = await request('/auth/signup', { method:'POST', body:{ email, password, fullName:options?.data?.full_name, userType:options?.data?.user_type } }); const session=sessionFrom(data); saveSession(session); notify('SIGNED_IN',session); return { data:{user:session.user,session},error:null }; }
    catch(e) { return { data:{user:null,session:null},error:errorObject(e.message) }; }
  },
  async signInWithPassword({email,password}) {
    try { const data=await request('/auth/login',{method:'POST',body:{email,password}});const session=sessionFrom(data);saveSession(session);notify('SIGNED_IN',session);return {data:{user:session.user,session},error:null}; }
    catch(e) { return {data:{user:null,session:null},error:errorObject(e.message)}; }
  },
  async signOut(){saveSession(null);notify('SIGNED_OUT',null);return {error:null};},
  async getSession(){return {data:{session:read(SESSION_KEY)},error:null};},
  onAuthStateChange(callback){listeners.add(callback);const onStorage=e=>{if(e.key===SESSION_KEY)callback('TOKEN_REFRESHED',read(SESSION_KEY));};window.addEventListener('storage',onStorage);return {data:{subscription:{unsubscribe(){listeners.delete(callback);window.removeEventListener('storage',onStorage);}}}};}
};
const profiles = {
  select(){return {eq(){return {async maybeSingle(){try{return {data:await request('/profiles/me'),error:null};}catch(e){return {data:null,error:errorObject(e.message)};}}}}};},
  async insert(row){try{await request('/profiles/me',{method:'PUT',body:row});return {error:null};}catch(e){return {error:errorObject(e.message)};}},
  update(patch){return {async eq(){try{await request('/profiles/me',{method:'PUT',body:patch});return {error:null};}catch(e){return {error:errorObject(e.message)};}}};}
};
const storage = {from(){return {async upload(_path,file){try{const dataUrl=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.readAsDataURL(file);});await request('/profiles/me',{method:'PUT',body:{avatar_url:dataUrl}});return {data:{path:dataUrl},error:null};}catch(e){return {data:null,error:errorObject(e.message)};}},async createSignedUrl(path){return {data:{signedUrl:path},error:null};}};}};
export const db = {auth,from(table){if(table!=='profiles')throw new Error(`Table ${table} isn't supported.`);return profiles;},storage};

export async function getMatches(filters={}) { const params=new URLSearchParams(filters); return request(`/matches?${params.toString()}`); }

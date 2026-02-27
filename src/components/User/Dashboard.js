import { useState, useEffect, useRef } from "react";

/* ─── MOCK DATA (replaced by Redux props in production) ─── */
const MOCK = {
  user: {
    name: "Ama Owusu",
    email: "ama@quickdiscount.gh",
    contact: "+233 55 123 4567",
    profile_pic: null,
    organizer_detail: true,
  },
  discounts: [
    { id:1, title:"Lagos Food Festival",    pct:30, end:"2025-04-15", start:"2025-03-15", loc:"Lagos, Nigeria",     img:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80", cats:["Food"],   org:"Taste Lagos",  likes:240, rating:4.8 },
    { id:2, title:"Tech Summit Accra",       pct:20, end:"2025-04-02", start:"2025-04-02", loc:"Accra, Ghana",      img:"https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80", cats:["Tech"],   org:"GhTech Hub",   likes:180, rating:4.6 },
    { id:3, title:"Nairobi Jazz Night",      pct:15, end:"2025-05-10", start:"2025-05-10", loc:"Nairobi, Kenya",    img:"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80", cats:["Music"],  org:"Jazz Kenya",   likes:310, rating:4.9 },
    { id:4, title:"Fitness Bootcamp GH",     pct:40, end:"2025-03-28", start:"2025-03-28", loc:"East Legon, Accra", img:"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80", cats:["Sports"], org:"FitGhana",     likes:88,  rating:4.4 },
    { id:5, title:"Abuja Furniture Fair",    pct:25, end:"2025-06-01", start:"2025-06-01", loc:"Abuja, Nigeria",    img:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80", cats:["Home"],   org:"FurnishNg",    likes:122, rating:4.2 },
    { id:6, title:"Cape Coast Street Food",  pct:10, end:"2025-04-20", start:"2025-04-05", loc:"Cape Coast, GH",    img:"https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600&q=80", cats:["Food"],   org:"CC Eats",      likes:67,  rating:3.9 },
  ],
  savedIds: new Set([1, 3]),
  notifications: [
    { id:1, msg:"Your order for Lagos Food Festival has been confirmed.", time:"2m ago",  read:false },
    { id:2, msg:"Fitness Bootcamp GH is 88% sold — grab your spot!",     time:"1h ago",  read:false },
    { id:3, msg:"Tech Summit Accra starts tomorrow. Don't forget!",       time:"5h ago",  read:true  },
    { id:4, msg:"Your profile was updated successfully.",                  time:"1d ago",  read:true  },
  ],
};

const fmtDate = s => s ? new Date(s).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) : "";
const fmtExpiry = s => {
  if (!s) return null;
  const d = Math.ceil((new Date(s) - Date.now()) / 86400000);
  if (d <= 0) return { label:"Expired", expired:true };
  return { label: d === 1 ? "1 day left" : `${d}d left`, expired:false };
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;1,500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-thumb{background:rgba(250,129,40,.2);border-radius:4px}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes shimmer{0%{background-position:-500px 0}100%{background-position:500px 0}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes avPulse{0%,100%{box-shadow:0 0 0 3px rgba(250,129,40,.2)}50%{box-shadow:0 0 0 7px rgba(250,129,40,.04)}}

.p{min-height:100vh;background:#0c0a07;color:#f2ede8;font-family:'Sora',sans-serif}
.inn{max-width:80%;margin:0 auto}

/* hero */
.hero{background:linear-gradient(155deg,#1a0e05 0%,#0c0a07 55%);border-bottom:1px solid rgba(255,255,255,.07);padding:30px 0 26px}
.hrow{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
.hleft{display:flex;align-items:center;gap:14px}
.aring{width:58px;height:58px;border-radius:50%;padding:2px;background:linear-gradient(135deg,#fa8128,rgba(250,129,40,.22));flex-shrink:0;animation:avPulse 3s ease-in-out infinite}
.av{width:100%;height:100%;border-radius:50%;background:rgba(255,255,255,.06) center/cover no-repeat;border:2px solid #0c0a07;display:flex;align-items:center;justify-content:center;overflow:hidden}
.avlt{font-size:20px;font-weight:700;color:#fa8128;font-family:'Playfair Display',serif}
.hgreet{font-size:11px;color:rgba(242,237,232,.35);letter-spacing:.04em;margin-bottom:2px}
.hname{font-family:'Playfair Display',serif;font-size:clamp(18px,2.6vw,23px);font-weight:600;color:#f2ede8;line-height:1.2;margin-bottom:3px}
.hemail{font-size:11.5px;color:rgba(242,237,232,.38)}

.orgbtn{display:inline-flex;align-items:center;gap:8px;padding:9px 18px;border-radius:10px;background:rgba(250,129,40,.1);border:1px solid rgba(250,129,40,.28);color:#fa8128;font-size:12.5px;font-weight:600;cursor:pointer;white-space:nowrap;font-family:'Sora',sans-serif;transition:background .18s,transform .14s,box-shadow .18s;text-decoration:none}
.orgbtn:hover{background:rgba(250,129,40,.2);transform:translateY(-2px);box-shadow:0 6px 20px rgba(250,129,40,.22)}
.orgbtn:active{transform:translateY(0)}

/* tab bar */
.tbo{position:sticky;top:0;z-index:20;background:rgba(12,10,7,.88);backdrop-filter:blur(16px);border-bottom:1px solid rgba(255,255,255,.07)}
.tbar{display:flex;overflow-x:auto;scrollbar-width:none}
.tbar::-webkit-scrollbar{display:none}
.tbtn{position:relative;flex-shrink:0;display:flex;align-items:center;gap:6px;padding:14px 18px 12px;font-size:12px;font-weight:400;letter-spacing:.03em;color:rgba(242,237,232,.45);background:none;border:none;cursor:pointer;font-family:'Sora',sans-serif;transition:color .16s;white-space:nowrap}
.tbtn:hover{color:rgba(242,237,232,.72)}
.tbtn.act{color:#fa8128;font-weight:600}
.tpip{position:absolute;bottom:0;left:18px;right:18px;height:2px;background:#fa8128;border-radius:2px 2px 0 0;animation:fadeIn .16s ease both}
.tbadge{padding:1px 6px;border-radius:10px;font-size:9.5px;font-weight:700;background:#fa8128;color:#fff;line-height:1.5}

/* content */
.content{padding:28px 0 72px}

/* grid */
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
@media(max-width:1200px){.grid{grid-template-columns:repeat(3,1fr)}}
@media(max-width:860px){.grid{grid-template-columns:repeat(2,1fr);gap:12px}}
@media(max-width:480px){.grid{grid-template-columns:1fr}}

/* card */
.card{display:flex;flex-direction:column;text-decoration:none;color:inherit;background:rgba(255,255,255,.034);border:1px solid rgba(255,255,255,.08);border-radius:12px;overflow:hidden;cursor:pointer;transition:border-color .2s,transform .22s,box-shadow .22s;animation:fadeUp .38s ease both;animation-fill-mode:both}
.card:hover{border-color:rgba(250,129,40,.35);transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.42),0 0 0 1px rgba(250,129,40,.07)}
.cimg{position:relative;height:178px;overflow:hidden;background:rgba(255,255,255,.04);flex-shrink:0}
.cimg img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .42s ease}
.card:hover .cimg img{transform:scale(1.06)}
.cfb{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:46px;background:linear-gradient(135deg,rgba(250,129,40,.07),rgba(0,0,0,.12))}
.cbadge{position:absolute;top:10px;left:10px;padding:3px 9px;border-radius:6px;background:#fa8128;color:#fff;font-size:11px;font-weight:700;letter-spacing:.03em}
.cexp{position:absolute;bottom:9px;right:9px;padding:3px 9px;border-radius:20px;font-size:10px;letter-spacing:.04em;backdrop-filter:blur(8px)}
.cexp.ok{background:rgba(14,12,8,.78);border:1px solid rgba(255,255,255,.1);color:rgba(242,237,232,.55)}
.cexp.ex{background:rgba(248,113,113,.82);border:1px solid rgba(248,113,113,.4);color:#fff}
.cheart{position:absolute;top:9px;right:9px;width:30px;height:30px;border-radius:50%;background:rgba(14,12,8,.72);border:1px solid rgba(255,255,255,.12);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;font-size:15px;cursor:pointer;transition:color .15s,transform .15s;color:rgba(242,237,232,.4)}
.cheart.sv{color:#fa8128}
.cheart:hover{color:#fa8128;transform:scale(1.18)}
.cbody{padding:12px 13px 11px;display:flex;flex-direction:column;gap:5px;flex:1}
.cats{display:flex;gap:4px;flex-wrap:wrap}
.cat{padding:2px 7px;border-radius:7px;font-size:9px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;background:rgba(250,129,40,.1);border:1px solid rgba(250,129,40,.16);color:#fa8128}
.ctitle{font-family:'Playfair Display',serif;font-size:14px;font-weight:600;color:#f2ede8;line-height:1.38;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;transition:color .18s}
.card:hover .ctitle{color:#fa8128}
.cmeta{display:flex;flex-direction:column;gap:3px}
.mrow{display:flex;align-items:center;gap:5px;font-size:11px;color:rgba(242,237,232,.35);overflow:hidden}
.mtxt{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cfoot{display:flex;align-items:center;justify-content:space-between;margin-top:auto;padding-top:8px;border-top:1px solid rgba(255,255,255,.07)}
.likes{display:flex;align-items:center;gap:4px;font-size:11px;color:rgba(242,237,232,.35)}
.stars{font-size:11px;color:rgba(242,237,232,.35)}

/* notifs */
.sh{display:flex;align-items:center;gap:10px;margin-bottom:20px}
.st{font-family:'Playfair Display',serif;font-size:18px;font-weight:600;color:#f2ede8}
.upill{padding:2px 9px;border-radius:10px;font-size:10px;font-weight:600;background:rgba(250,129,40,.12);border:1px solid rgba(250,129,40,.25);color:#fa8128}
.nlist{display:flex;flex-direction:column;gap:3px;max-width:620px}
.nrow{display:flex;align-items:flex-start;gap:12px;padding:13px 15px;border-radius:9px;border:1px solid transparent;transition:background .15s}
.nrow:hover{background:rgba(255,255,255,.03)}
.nrow.unr{background:rgba(250,129,40,.04);border-color:rgba(250,129,40,.1)}
.ndot{width:7px;height:7px;border-radius:50%;margin-top:6px;flex-shrink:0}
.ndot.u{background:#fa8128}
.ndot.r{border:1px solid rgba(255,255,255,.15)}
.nmsg{font-size:13px;line-height:1.5;margin-bottom:3px}
.nmsg.u{color:#f2ede8}
.nmsg.r{color:rgba(242,237,232,.52)}
.ntime{font-size:11px;color:rgba(242,237,232,.3)}

/* settings */
.sgrid{display:grid;grid-template-columns:160px 1fr;gap:40px;align-items:start}
@media(max-width:640px){.sgrid{grid-template-columns:1fr;gap:24px}}
.avcol{display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center}
.avedit{position:relative;width:92px;height:92px;border-radius:50%;overflow:hidden;border:2px solid rgba(250,129,40,.3);background:rgba(255,255,255,.05) center/cover no-repeat;display:flex;align-items:center;justify-content:center;cursor:pointer}
.avov{position:absolute;inset:0;background:rgba(0,0,0,.55);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;font-size:10px;color:#fff;opacity:0;transition:opacity .16s}
.avedit:hover .avov{opacity:1}
.avname{font-size:13px;font-weight:600;color:#f2ede8}
.aveml{font-size:11px;color:rgba(242,237,232,.35);word-break:break-all}
.sform{display:flex;flex-direction:column;gap:16px;max-width:420px}
.flbl{display:block;font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:rgba(242,237,232,.35);margin-bottom:6px}
.finp{width:100%;padding:10px 13px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:8px;color:#f2ede8;font-size:13px;font-family:'Sora',sans-serif;outline:none;transition:border-color .16s,box-shadow .16s}
.finp:focus{border-color:rgba(250,129,40,.45);box-shadow:0 0 0 3px rgba(250,129,40,.07)}
.finp.err{border-color:rgba(248,113,113,.5)}
.finp::placeholder{color:rgba(242,237,232,.28)}
.ferr{font-size:11px;color:#f87171;margin-top:4px}
.ffoot{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-top:4px}
.sbtn{display:inline-flex;align-items:center;gap:7px;padding:10px 24px;border-radius:9px;background:linear-gradient(135deg,#fa8128,#c05a0a);border:none;color:#fff;font-size:13px;font-weight:600;cursor:pointer;font-family:'Sora',sans-serif;box-shadow:0 4px 16px rgba(250,129,40,.25);transition:opacity .16s,transform .14s,box-shadow .16s}
.sbtn:hover:not(:disabled){opacity:.9;transform:translateY(-1px);box-shadow:0 8px 22px rgba(250,129,40,.32)}
.sbtn:disabled{opacity:.5;cursor:not-allowed}
.spin{width:12px;height:12px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;display:inline-block;animation:spin .65s linear infinite}

/* skeleton shimmer */
.shim{background:linear-gradient(90deg,rgba(255,255,255,.04)0%,rgba(255,255,255,.09)50%,rgba(255,255,255,.04)100%);background-size:500px 100%;animation:shimmer 1.5s linear infinite}

/* empty */
.empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:64px 20px;text-align:center;gap:8px}
.eico{font-size:40px;margin-bottom:6px}
.etit{font-family:'Playfair Display',serif;font-size:17px;font-weight:600;color:rgba(242,237,232,.55)}
.ebod{font-size:13px;color:rgba(242,237,232,.3);max-width:250px;line-height:1.55}

@media(max-width:1100px){.inn{max-width:92%}}
@media(max-width:700px){.inn{max-width:96%}}
@media(max-width:600px){.hero{padding:22px 0 20px}.orgbtn{width:100%;justify-content:center}}
`;

function DiscCard({ d, isSaved, onSave, idx }) {
  const exp = fmtExpiry(d.end);
  return (
    <a className="card" href={`/discounts/${d.id}`} style={{animationDelay:`${Math.min(idx*0.055,0.28)}s`}}>
      <div className="cimg">
        {d.img ? <img src={d.img} alt={d.title} loading="lazy" /> : <div className="cfb">🎟</div>}
        {d.pct && <div className="cbadge">−{d.pct}%</div>}
        {exp && <div className={`cexp ${exp.expired?"ex":"ok"}`}>{exp.label}</div>}
        <button className={`cheart${isSaved?" sv":""}`}
          onClick={e=>{e.preventDefault();e.stopPropagation();onSave(d.id);}}
          aria-label={isSaved?"Unsave":"Save"}
        >{isSaved?"♥":"♡"}</button>
      </div>
      <div className="cbody">
        <div className="cats">
          {d.cats?.slice(0,2).map(c=><span key={c} className="cat">{c}</span>)}
        </div>
        <div className="ctitle">{d.title}</div>
        <div className="cmeta">
          {d.org   && <div className="mrow"><span>👤</span><span className="mtxt">{d.org}</span></div>}
          {d.loc   && <div className="mrow"><span>📍</span><span className="mtxt">{d.loc}</span></div>}
          {d.start && <div className="mrow"><span>📅</span><span className="mtxt">{fmtDate(d.start)}</span></div>}
        </div>
        <div className="cfoot">
          <span className="likes">
            <svg viewBox="0 0 24 24" fill="rgba(250,129,40,.55)" width="13" height="13">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            {d.likes}
          </span>
          {d.rating>0 && <span className="stars">★ {d.rating.toFixed(1)}</span>}
        </div>
      </div>
    </a>
  );
}

function Empty({icon,title,body}) {
  return <div className="empty"><div className="eico">{icon}</div><div className="etit">{title}</div><div className="ebod">{body}</div></div>;
}

export default function UserDashboard(rawProps) {
  const user          = rawProps.user          ?? MOCK.user;
  const allDiscounts  = rawProps.discounts?.results ?? MOCK.discounts;
  const rawWishlist   = rawProps.wishlist       ?? null;
  const notifications = rawProps.notifications  ?? MOCK.notifications;
  const isOrganizer   = !!(user?.organizer_detail || rawProps.organizer);

  const [tab,       setTab]      = useState("discounts");
  const [greeting,  setGreeting] = useState("Welcome");
  const [savedIds,  setSavedIds] = useState(MOCK.savedIds);
  const [wishlist,  setWishlist] = useState([]);

  const [uName,     setUName]    = useState(user?.name    ?? "");
  const [uEmail,    setUEmail]   = useState(user?.email   ?? "");
  const [uPhone,    setUPhone]   = useState(user?.contact ?? "");
  const [preview,   setPreview]  = useState(user?.profile_pic ?? null);
  const [newFile,   setNewFile]  = useState(null);
  const [emailErr,  setEmailErr] = useState("");
  const [phoneErr,  setPhoneErr] = useState("");
  const [saveState, setSave]     = useState(null);
  const fileRef = useRef();

  const unread = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h<12?"Good morning":h<17?"Good afternoon":"Good evening");
  }, []);

  useEffect(() => {
    if (rawWishlist) {
      const urls = rawWishlist.map(w => w.discount);
      const wl   = allDiscounts.filter(d => urls.includes(d.url));
      setWishlist(wl);
      setSavedIds(new Set(wl.map(d=>d.id)));
    } else if (rawProps.getWishlist) rawProps.getWishlist();
  }, [rawWishlist]); // eslint-disable-line

  const toggleSave = id => setSavedIds(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n;});
  const savedItems = allDiscounts.filter(d => savedIds.has(d.id));

  const handleFile = e => { const f=e.target.files[0]; if(!f)return; setNewFile(f); setPreview(URL.createObjectURL(f)); };
  const handleSave = e => {
    e.preventDefault();
    if (emailErr||phoneErr) return;
    setSave("saving");
    if (rawProps.updateUser) {
      const fd=new FormData();
      fd.append("name",uName); fd.append("email",uEmail); fd.append("contact",uPhone);
      if (newFile) fd.append("profile_pic",newFile);
      rawProps.updateUser(fd);
    }
    setTimeout(()=>{setSave("saved"); setTimeout(()=>setSave(null),3000);}, 900);
  };

  const tabs = [
    {id:"discounts",     label:"My Discounts"},
    {id:"saved",         label:"Saved"},
    {id:"notifications", label:"Notifications", badge:unread||null},
    {id:"settings",      label:"Settings"},
  ];

  const avStyle = src => src ? {backgroundImage:`url(${src})`} : {};

  return (
    <div className="p">
      <style>{CSS}</style>

      {/* HERO */}
      <div className="hero">
        <div className="inn">
          <div className="hrow">
            <div className="hleft">
              <div className="aring">
                <div className="av" style={avStyle(preview || user?.profile_pic)}>
                  {!preview && !user?.profile_pic && <span className="avlt">{(user?.name??"U")[0].toUpperCase()}</span>}
                </div>
              </div>
              <div>
                <div className="hgreet">{greeting},</div>
                <div className="hname">{user?.name??"User"}</div>
                <div className="hemail">{user?.email}</div>
              </div>
            </div>

            {isOrganizer && (
              <a className="orgbtn" href="/organizer-dashboard">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                </svg>
                Organizer Dashboard
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="tbo">
        <div className="inn">
          <div className="tbar">
            {tabs.map(t => (
              <button key={t.id} className={`tbtn${tab===t.id?" act":""}`} onClick={()=>setTab(t.id)}>
                {t.label}
                {t.badge ? <span className="tbadge">{t.badge}</span> : null}
                {tab===t.id && <span className="tpip"/>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="inn">
        <div className="content" key={tab}>

          {tab==="discounts" && (
            allDiscounts.length===0
              ? <Empty icon="🎟" title="No discounts yet" body="Browse deals on the homepage." />
              : <div className="grid">{allDiscounts.map((d,i)=><DiscCard key={d.id} d={d} idx={i} isSaved={savedIds.has(d.id)} onSave={toggleSave}/>)}</div>
          )}

          {tab==="saved" && (
            savedItems.length===0
              ? <Empty icon="♥" title="Nothing saved yet" body="Tap the heart on any discount to save it here." />
              : <div className="grid">{savedItems.map((d,i)=><DiscCard key={d.id} d={d} idx={i} isSaved={true} onSave={toggleSave}/>)}</div>
          )}

          {tab==="notifications" && (
            <>
              <div className="sh">
                <div className="st">Notifications</div>
                {unread>0 && <span className="upill">{unread} unread</span>}
              </div>
              {notifications.length===0
                ? <Empty icon="🔔" title="All caught up" body="No notifications right now." />
                : <div className="nlist">
                    {notifications.map((n,i)=>(
                      <div key={n.id??i} className={`nrow${!n.read?" unr":""}`} style={{animation:`fadeUp .32s ${i*45}ms ease both`}}>
                        <div className={`ndot ${!n.read?"u":"r"}`}/>
                        <div>
                          <div className={`nmsg ${!n.read?"u":"r"}`}>{n.msg??n.message}</div>
                          <div className="ntime">{n.time??n.created_at??""}</div>
                        </div>
                      </div>
                    ))}
                  </div>
              }
            </>
          )}

          {tab==="settings" && (
            <div className="sgrid">
              <div className="avcol">
                <div className="avedit" style={avStyle(preview||user?.profile_pic)} onClick={()=>fileRef.current?.click()}>
                  {!preview && !user?.profile_pic && (
                    <span style={{fontSize:34,fontWeight:700,color:"#fa8128",fontFamily:"'Playfair Display',serif"}}>
                      {(user?.name??"U")[0].toUpperCase()}
                    </span>
                  )}
                  <div className="avov">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
                    Change
                  </div>
                </div>
                <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleFile}/>
                <div className="avname">{user?.name??"User"}</div>
                <div className="aveml">{user?.email}</div>
              </div>

              <form className="sform" onSubmit={handleSave}>
                <div>
                  <label className="flbl">Full Name</label>
                  <input className="finp" value={uName} onChange={e=>setUName(e.target.value)} placeholder="Your name"/>
                </div>
                <div>
                  <label className="flbl">Email</label>
                  <input className={`finp${emailErr?" err":""}`} type="email" value={uEmail}
                    onChange={e=>{setUEmail(e.target.value); setEmailErr(e.target.value&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value)?"Invalid email":"");}}
                    placeholder="you@email.com"/>
                  {emailErr && <div className="ferr">{emailErr}</div>}
                </div>
                <div>
                  <label className="flbl">Phone Number</label>
                  <input className={`finp${phoneErr?" err":""}`} value={uPhone}
                    onChange={e=>{setUPhone(e.target.value); setPhoneErr(e.target.value&&e.target.value.length<7?"Invalid number":"");}}
                    placeholder="+233 XX XXX XXXX"/>
                  {phoneErr && <div className="ferr">{phoneErr}</div>}
                </div>
                <div className="ffoot">
                  <button type="submit" className="sbtn" disabled={!!emailErr||!!phoneErr||saveState==="saving"}>
                    {saveState==="saving" ? <><span className="spin"/> Saving…</> : saveState==="saved" ? "✓ Saved!" : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
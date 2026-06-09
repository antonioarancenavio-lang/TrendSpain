import { useState, useMemo, useEffect } from "react";
import { supabase } from "./supabase.js";
import { TRENDS, FREE_LIMIT } from "./data.js";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/REEMPLAZA_CON_TU_LINK"; // Lo añadirás después
const PRECIO_MES = "9€";

const SECTORES = ["Todos","Food & Drink","Fitness","Salud","Tech","Retail","Servicios","Educación","Sostenibilidad"];
const SECTOR_ICON = { "Todos":"🌎","Food & Drink":"🍽️","Fitness":"💪","Salud":"🩺","Tech":"💻","Retail":"🛍️","Servicios":"🤝","Educación":"🎓","Sostenibilidad":"🌱" };
const POTENCIAL_VALS = ["Todos","Alta","Media","Baja"];
const DIFICULTAD_VALS = ["Todas","Fácil","Moderada","Difícil"];
const POT_STYLE = { Alta:{ bg:"#dcfce7", text:"#16a34a", dot:"#22c55e" }, Media:{ bg:"#fef9c3", text:"#ca8a04", dot:"#eab308" }, Baja:{ bg:"#fee2e2", text:"#dc2626", dot:"#ef4444" } };
const DIF_STYLE = { Fácil:{ bg:"#dbeafe", text:"#1d4ed8", dot:"#3b82f6" }, Moderada:{ bg:"#ede9fe", text:"#6d28d9", dot:"#8b5cf6" }, Difícil:{ bg:"#ffedd5", text:"#c2410c", dot:"#f97316" } };

// ─── SMALL COMPONENTS ────────────────────────────────────────────────────────
function Pill({ label, styleMap }) {
  const s = styleMap[label] || { bg:"#f3f4f6", text:"#374151", dot:"#9ca3af" };
  return (
    <span style={{ background:s.bg, color:s.text }} className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full">
      <span style={{ background:s.dot, width:6, height:6, borderRadius:"50%", display:"inline-block" }} />
      {label}
    </span>
  );
}

function XIcon({ size=16 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>;
}

// ─── AUTH MODAL ───────────────────────────────────────────────────────────────
function AuthModal({ onClose, onSuccess }) {
  const [mode, setMode] = useState("login"); // login | register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    setError(""); setMessage(""); setLoading(true);
    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage("✅ Cuenta creada. Revisa tu email para confirmar.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onSuccess();
        onClose();
      }
    } catch (e) {
      setError(e.message === "Invalid login credentials" ? "Email o contraseña incorrectos." : e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:60, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.5)", backdropFilter:"blur(4px)", padding:16 }}
      onClick={onClose}>
      <div style={{ background:"white", borderRadius:20, padding:28, width:"100%", maxWidth:400, boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <h2 style={{ fontSize:18, fontWeight:800, color:"#111827", margin:0 }}>
            {mode === "login" ? "Iniciar sesión" : "Crear cuenta gratis"}
          </h2>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"#9ca3af" }}><XIcon /></button>
        </div>

        {error && <div style={{ background:"#fee2e2", color:"#dc2626", padding:"10px 14px", borderRadius:10, fontSize:13, marginBottom:14 }}>{error}</div>}
        {message && <div style={{ background:"#dcfce7", color:"#16a34a", padding:"10px 14px", borderRadius:10, fontSize:13, marginBottom:14 }}>{message}</div>}

        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <input value={email} onChange={e => setEmail(e.target.value)}
            type="email" placeholder="tu@email.com"
            style={{ padding:"11px 14px", border:"1.5px solid #e5e7eb", borderRadius:10, fontSize:14, outline:"none" }}
            onFocus={e => e.target.style.borderColor="#6366f1"}
            onBlur={e => e.target.style.borderColor="#e5e7eb"} />
          <input value={password} onChange={e => setPassword(e.target.value)}
            type="password" placeholder="Contraseña (mínimo 6 caracteres)"
            style={{ padding:"11px 14px", border:"1.5px solid #e5e7eb", borderRadius:10, fontSize:14, outline:"none" }}
            onFocus={e => e.target.style.borderColor="#6366f1"}
            onBlur={e => e.target.style.borderColor="#e5e7eb"}
            onKeyDown={e => e.key === "Enter" && handleSubmit()} />
          <button onClick={handleSubmit} disabled={loading || !email || !password}
            style={{ padding:"12px", background: loading ? "#a5b4fc" : "#6366f1", color:"white", border:"none", borderRadius:10, fontSize:14, fontWeight:700, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Cargando..." : mode === "login" ? "Entrar" : "Crear cuenta"}
          </button>
        </div>

        <p style={{ textAlign:"center", fontSize:13, color:"#6b7280", marginTop:16 }}>
          {mode === "login" ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
          <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setMessage(""); }}
            style={{ color:"#6366f1", fontWeight:700, background:"none", border:"none", cursor:"pointer" }}>
            {mode === "login" ? "Regístrate gratis" : "Inicia sesión"}
          </button>
        </p>
      </div>
    </div>
  );
}

// ─── PAYWALL MODAL ────────────────────────────────────────────────────────────
function PaywallModal({ onClose, onLogin, isLoggedIn }) {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:60, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.5)", backdropFilter:"blur(4px)", padding:16 }}
      onClick={onClose}>
      <div style={{ background:"white", borderRadius:20, padding:28, width:"100%", maxWidth:400, textAlign:"center", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ fontSize:48, marginBottom:12 }}>🔒</div>
        <h2 style={{ fontSize:20, fontWeight:800, color:"#111827", marginBottom:8 }}>Contenido premium</h2>
        <p style={{ fontSize:14, color:"#6b7280", lineHeight:1.6, marginBottom:24 }}>
          Has visto las {FREE_LIMIT} oportunidades gratuitas. Suscríbete por solo <strong>{PRECIO_MES}/mes</strong> y accede a las {TRENDS.length} oportunidades con análisis completo.
        </p>

        <div style={{ background:"#f0f9ff", borderRadius:12, padding:16, marginBottom:20, textAlign:"left" }}>
          <p style={{ fontSize:12, fontWeight:700, color:"#374151", marginBottom:8 }}>✅ Incluye:</p>
          {["Acceso a las 24 oportunidades completas","Análisis de por qué funcionan en EE.UU.","Guía paso a paso para aplicarlo en España","Nuevas oportunidades cada mes","Cancela cuando quieras"].map((item, i) => (
            <p key={i} style={{ fontSize:13, color:"#4b5563", marginBottom:4 }}>• {item}</p>
          ))}
        </div>

        <a href={STRIPE_PAYMENT_LINK} target="_blank" rel="noopener noreferrer"
          style={{ display:"block", background:"#6366f1", color:"white", padding:"13px", borderRadius:12, fontSize:15, fontWeight:700, textDecoration:"none", marginBottom:12 }}>
          Suscribirme por {PRECIO_MES}/mes →
        </a>

        {!isLoggedIn && (
          <button onClick={() => { onClose(); onLogin(); }}
            style={{ background:"none", border:"1.5px solid #e5e7eb", color:"#374151", padding:"11px", borderRadius:12, fontSize:13, fontWeight:600, cursor:"pointer", width:"100%", marginBottom:10 }}>
            Ya tengo cuenta — Iniciar sesión
          </button>
        )}

        <button onClick={onClose} style={{ background:"none", border:"none", color:"#9ca3af", fontSize:13, cursor:"pointer" }}>
          Ahora no
        </button>
      </div>
    </div>
  );
}

// ─── DETAIL MODAL ─────────────────────────────────────────────────────────────
function DetailModal({ t, onClose }) {
  if (!t) return null;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:50, display:"flex", alignItems:"flex-end", justifyContent:"center", background:"rgba(0,0,0,0.45)", backdropFilter:"blur(2px)" }}
      onClick={onClose}>
      <div style={{ background:"white", width:"100%", maxWidth:560, borderRadius:"24px 24px 0 0", padding:"28px 24px 40px", overflowY:"auto", maxHeight:"90vh", boxShadow:"0 -8px 40px rgba(0,0,0,0.15)" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ width:40, height:4, background:"#e5e7eb", borderRadius:99, margin:"0 auto 20px" }} />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
          <div style={{ flex:1 }}>
            <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.08em", color:"#6366f1", textTransform:"uppercase", marginBottom:6 }}>{t.sector}</p>
            <h2 style={{ fontSize:20, fontWeight:800, color:"#111827", margin:0, lineHeight:1.25 }}>{t.emoji} {t.nombre}</h2>
          </div>
          <button onClick={onClose} style={{ marginLeft:12, padding:6, borderRadius:8, background:"#f3f4f6", border:"none", cursor:"pointer", color:"#6b7280", display:"flex" }}>
            <XIcon size={18} />
          </button>
        </div>
        <div style={{ display:"flex", gap:6, marginBottom:20 }}>
          <Pill label={t.potencial} styleMap={POT_STYLE} />
          <Pill label={t.dificultad} styleMap={DIF_STYLE} />
        </div>
        <p style={{ fontSize:14, color:"#4b5563", lineHeight:1.6, marginBottom:24 }}>{t.resumen}</p>
        {[
          { title:"🇺🇸 Por qué funciona en EE.UU.", content:t.por_que },
          { title:"🇪🇸 Cómo aplicarlo en España", content:t.como_aplicar },
        ].map(({ title, content }) => (
          <div key={title} style={{ marginBottom:20, padding:"16px", background:"#f9fafb", borderRadius:12 }}>
            <p style={{ fontSize:11, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>{title}</p>
            <p style={{ fontSize:13, color:"#4b5563", lineHeight:1.65, margin:0 }}>{content}</p>
          </div>
        ))}
        <div style={{ marginBottom:20 }}>
          <p style={{ fontSize:11, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>⚠️ Riesgos</p>
          {t.riesgos.map((r, i) => (
            <div key={i} style={{ display:"flex", gap:10, marginBottom:6 }}>
              <span style={{ color:"#f87171", fontWeight:700, flexShrink:0 }}>✕</span>
              <p style={{ fontSize:13, color:"#6b7280", margin:0, lineHeight:1.5 }}>{r}</p>
            </div>
          ))}
        </div>
        <div style={{ background:"#f0f9ff", borderRadius:12, padding:16 }}>
          <p style={{ fontSize:11, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>🚀 Primeros pasos</p>
          {t.pasos.map((p, i) => (
            <div key={i} style={{ display:"flex", gap:10, marginBottom:8 }}>
              <span style={{ background:"#6366f1", color:"white", fontWeight:700, fontSize:11, width:20, height:20, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{i+1}</span>
              <p style={{ fontSize:13, color:"#374151", margin:0, lineHeight:1.5 }}>{p}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── TREND CARD ───────────────────────────────────────────────────────────────
function TrendCard({ t, onClick, locked }) {
  return (
    <button onClick={() => onClick(t, locked)}
      style={{ textAlign:"left", width:"100%", background:"white", border:`1px solid ${locked ? "#e5e7eb" : "#e5e7eb"}`, borderRadius:16, padding:"20px", transition:"all 0.15s", cursor:"pointer", position:"relative", opacity: locked ? 0.75 : 1 }}
      onMouseEnter={e => { if(!locked) { e.currentTarget.style.borderColor="#6366f1"; e.currentTarget.style.boxShadow="0 4px 24px rgba(99,102,241,0.10)"; }}}
      onMouseLeave={e => { e.currentTarget.style.borderColor="#e5e7eb"; e.currentTarget.style.boxShadow="none"; }}>
      {locked && (
        <div style={{ position:"absolute", top:12, right:12, background:"#f3f4f6", borderRadius:99, padding:"3px 8px", fontSize:11, fontWeight:700, color:"#9ca3af" }}>
          🔒 Premium
        </div>
      )}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
        <div style={{ paddingRight: locked ? 70 : 0 }}>
          <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.08em", color:"#6366f1", textTransform:"uppercase", marginBottom:4 }}>{t.sector}</p>
          <h3 style={{ fontSize:15, fontWeight:700, color: locked ? "#9ca3af" : "#111827", lineHeight:1.3, margin:0 }}>{t.nombre}</h3>
        </div>
        <span style={{ fontSize:26, lineHeight:1, flexShrink:0, marginLeft:8, filter: locked ? "grayscale(1)" : "none" }}>{t.emoji}</span>
      </div>
      {locked ? (
        <p style={{ fontSize:13, color:"#d1d5db", lineHeight:1.5, margin:"0 0 14px 0" }}>Suscríbete para ver el análisis completo de esta oportunidad...</p>
      ) : (
        <p style={{ fontSize:13, color:"#6b7280", lineHeight:1.5, margin:"0 0 14px 0", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{t.resumen}</p>
      )}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
        <Pill label={t.potencial} styleMap={POT_STYLE} />
        <Pill label={t.dificultad} styleMap={DIF_STYLE} />
      </div>
    </button>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [isPro, setIsPro] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("Todos");
  const [potencial, setPotencial] = useState("Todos");
  const [dificultad, setDificultad] = useState("Todas");
  const [selected, setSelected] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Check auth on load
  useEffect(() => {
    if (!supabase) { setLoadingAuth(false); return; }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) checkProStatus(session.user.id);
      setLoadingAuth(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) checkProStatus(session.user.id);
      else setIsPro(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Check if user has active subscription in DB
  const checkProStatus = async (userId) => {
    if (!supabase) return;
    const { data } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", userId)
      .eq("status", "active")
      .single();
    setIsPro(!!data);
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null); setIsPro(false);
  };

  const handleCardClick = (t, locked) => {
    if (locked) { setShowPaywall(true); return; }
    setSelected(t);
  };

  const filtered = useMemo(() => {
    return TRENDS.filter(t => {
      const matchSector = sector === "Todos" || t.sector === sector;
      const matchPot = potencial === "Todos" || t.potencial === potencial;
      const matchDif = dificultad === "Todas" || t.dificultad === dificultad;
      const q = query.toLowerCase();
      const matchQ = !q || t.nombre.toLowerCase().includes(q) || t.sector.toLowerCase().includes(q) || t.resumen.toLowerCase().includes(q);
      return matchSector && matchPot && matchDif && matchQ;
    });
  }, [query, sector, potencial, dificultad]);

  const resetAll = () => { setQuery(""); setSector("Todos"); setPotencial("Todos"); setDificultad("Todas"); };
  const hasActiveFilters = potencial !== "Todos" || dificultad !== "Todas";

  if (loadingAuth) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f8f8fc" }}>
      <p style={{ color:"#6b7280", fontSize:14 }}>Cargando...</p>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#f8f8fc", fontFamily:"system-ui, -apple-system, sans-serif" }}>

      {/* Header */}
      <div style={{ background:"white", borderBottom:"1px solid #e5e7eb", padding:"20px 16px 16px" }}>
        <div style={{ maxWidth:640, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:22 }}>🌎</span>
              <div>
                <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", color:"#6366f1", textTransform:"uppercase", margin:0 }}>Radar de Oportunidades</p>
                <h1 style={{ fontSize:18, fontWeight:800, color:"#111827", margin:0 }}>TrendSpain</h1>
              </div>
            </div>
            {/* Auth button */}
            {user ? (
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                {isPro && <span style={{ background:"#fef9c3", color:"#ca8a04", fontSize:11, fontWeight:700, padding:"3px 8px", borderRadius:99 }}>⭐ Pro</span>}
                <button onClick={handleSignOut} style={{ fontSize:12, color:"#6b7280", background:"none", border:"1.5px solid #e5e7eb", borderRadius:8, padding:"6px 10px", cursor:"pointer", fontWeight:600 }}>
                  Salir
                </button>
              </div>
            ) : (
              <button onClick={() => setShowAuth(true)}
                style={{ fontSize:13, color:"white", background:"#6366f1", border:"none", borderRadius:8, padding:"8px 14px", cursor:"pointer", fontWeight:700 }}>
                Entrar
              </button>
            )}
          </div>

          {/* Freemium banner */}
          {!isPro && (
            <div style={{ background:"linear-gradient(135deg, #eef2ff, #f0f9ff)", border:"1px solid #c7d2fe", borderRadius:12, padding:"12px 14px", marginBottom:14, display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 }}>
              <p style={{ fontSize:12, color:"#3730a3", margin:0, lineHeight:1.4 }}>
                <strong>Plan gratuito:</strong> {FREE_LIMIT} oportunidades visibles · {TRENDS.length - FREE_LIMIT} bloqueadas
              </p>
              <button onClick={() => setShowPaywall(true)}
                style={{ background:"#6366f1", color:"white", border:"none", borderRadius:8, padding:"7px 12px", fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>
                Ver todo {PRECIO_MES}
              </button>
            </div>
          )}

          {/* Search */}
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#9ca3af" }}>🔍</span>
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Buscar oportunidad…"
              style={{ width:"100%", padding:"10px 36px 10px 36px", border:"1.5px solid #e5e7eb", borderRadius:12, fontSize:14, outline:"none", background:"#f9fafb", boxSizing:"border-box" }}
              onFocus={e => e.target.style.borderColor="#6366f1"}
              onBlur={e => e.target.style.borderColor="#e5e7eb"} />
            {query && (
              <button onClick={() => setQuery("")} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#9ca3af" }}>✕</button>
            )}
          </div>
        </div>
      </div>

      {/* Sector tabs */}
      <div style={{ background:"white", borderBottom:"1px solid #e5e7eb", overflowX:"auto" }}>
        <div style={{ display:"flex", padding:"0 16px", maxWidth:640, margin:"0 auto" }}>
          {SECTORES.map(s => (
            <button key={s} onClick={() => setSector(s)}
              style={{ padding:"12px 12px", fontSize:12, fontWeight:600, border:"none", background:"none", cursor:"pointer", whiteSpace:"nowrap", borderBottom: sector===s ? "2px solid #6366f1" : "2px solid transparent", color: sector===s ? "#6366f1" : "#6b7280" }}>
              {SECTOR_ICON[s]} {s}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:640, margin:"0 auto", padding:"16px" }}>
        {/* Filter bar */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
          <p style={{ fontSize:13, color:"#6b7280", margin:0 }}>
            <span style={{ fontWeight:700, color:"#111827" }}>{filtered.length}</span> oportunidades
            {!isPro && <span style={{ color:"#9ca3af" }}> · {FREE_LIMIT} gratis</span>}
          </p>
          <div style={{ display:"flex", gap:8 }}>
            {hasActiveFilters && (
              <button onClick={resetAll} style={{ fontSize:12, color:"#6366f1", fontWeight:600, background:"none", border:"none", cursor:"pointer" }}>Limpiar</button>
            )}
            <button onClick={() => setFiltersOpen(f => !f)}
              style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 12px", border:"1.5px solid", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer",
                borderColor: filtersOpen || hasActiveFilters ? "#6366f1" : "#e5e7eb",
                background: filtersOpen || hasActiveFilters ? "#eef2ff" : "white",
                color: filtersOpen || hasActiveFilters ? "#6366f1" : "#6b7280" }}>
              Filtros {filtersOpen ? "▲" : "▼"}
            </button>
          </div>
        </div>

        {filtersOpen && (
          <div style={{ background:"white", border:"1px solid #e5e7eb", borderRadius:14, padding:16, marginBottom:16, display:"flex", flexDirection:"column", gap:14 }}>
            <div>
              <p style={{ fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Potencial en España</p>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {POTENCIAL_VALS.map(o => (
                  <button key={o} onClick={() => setPotencial(o)}
                    style={{ padding:"5px 12px", borderRadius:99, fontSize:12, fontWeight:600, border:"1.5px solid", cursor:"pointer",
                      borderColor: potencial===o ? "#6366f1" : "#e5e7eb", background: potencial===o ? "#6366f1" : "white", color: potencial===o ? "white" : "#6b7280" }}>
                    {o}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Dificultad de entrada</p>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {DIFICULTAD_VALS.map(o => (
                  <button key={o} onClick={() => setDificultad(o)}
                    style={{ padding:"5px 12px", borderRadius:99, fontSize:12, fontWeight:600, border:"1.5px solid", cursor:"pointer",
                      borderColor: dificultad===o ? "#6366f1" : "#e5e7eb", background: dificultad===o ? "#6366f1" : "white", color: dificultad===o ? "white" : "#6b7280" }}>
                    {o}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Cards */}
        {filtered.length > 0 ? (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:12 }}>
            {filtered.map((t, i) => {
              const locked = !isPro && i >= FREE_LIMIT;
              return <TrendCard key={t.id} t={t} onClick={handleCardClick} locked={locked} />;
            })}
          </div>
        ) : (
          <div style={{ textAlign:"center", padding:"60px 0", color:"#9ca3af" }}>
            <p style={{ fontSize:40, marginBottom:12 }}>🔍</p>
            <p style={{ fontSize:15, fontWeight:600, color:"#374151" }}>Sin resultados</p>
            <p style={{ fontSize:13 }}>Prueba otra búsqueda o limpia los filtros</p>
            <button onClick={resetAll} style={{ marginTop:12, padding:"8px 20px", background:"#6366f1", color:"white", border:"none", borderRadius:99, fontSize:13, fontWeight:600, cursor:"pointer" }}>Ver todas</button>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={() => {}} />}
      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} onLogin={() => setShowAuth(true)} isLoggedIn={!!user} />}
      <DetailModal t={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

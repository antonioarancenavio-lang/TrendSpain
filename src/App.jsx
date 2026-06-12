import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// ─── CONFIGURACIÓN ────────────────────────────────────────────────────────────
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/TU_LINK_REAL_AQUI";
const SECRET_TOKEN        = "ts_unlock_2025";
const FREE_TOKENS         = 2;
// ─────────────────────────────────────────────────────────────────────────────

const C = {
  bg:         "#0a0a0c",
  surface:    "#111114",
  card:       "#18181c",
  border:     "#252529",
  borderGold: "#c9a84c",
  gold:       "#c9a84c",
  goldLight:  "#e8c96a",
  goldBg:     "rgba(201,168,76,0.07)",
  text:       "#f0ede8",
  textMuted:  "#7a7673",
  textDim:    "#4a4845",
  green:      "#4ade80",
  greenBg:    "rgba(74,222,128,0.08)",
  greenBorder:"rgba(74,222,128,0.2)",
  red:        "#f87171",
  redBg:      "rgba(248,113,113,0.08)",
  amber:      "#fbbf24",
  indigo:     "#818cf8",
  indigoBg:   "rgba(129,140,248,0.08)",
  indigoBorder:"rgba(129,140,248,0.2)",
  pink:       "#f472b6",
};

// ─── TARJETA PREMIUM EN CUADRÍCULA ───────────────────────────────────────────
function TarjetaOportunidad({ trend, onClick, isFavorite, onToggleFavorite, tieneAcceso }) {
  return (
    <div 
      onClick={onClick}
      style={{ backgroundColor: C.card, borderColor: C.border }} 
      className="border rounded-2xl p-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between min-h-[280px] group shadow-sm hover:shadow-xl hover:shadow-amber-900/10"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(circle at top right, ${C.gold}15, transparent 60%)` }} />

      <button 
        onClick={(e) => { e.stopPropagation(); onToggleFavorite(trend.id); }}
        className="absolute top-4 right-4 z-20 text-xl transition-transform hover:scale-125"
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4 pr-8">
          <span 
            style={{ 
              backgroundColor: trend.potencial === "Alta" ? C.greenBg : "rgba(251,191,36,0.1)", 
              color: trend.potencial === "Alta" ? C.green : C.amber,
              borderColor: trend.potencial === "Alta" ? C.greenBorder : "rgba(251,191,36,0.2)" 
            }} 
            className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border"
          >
            🔥 Potencial {trend.potencial}
          </span>
        </div>

        <h3 style={{ color: C.text }} className="text-xl font-extrabold tracking-tight mb-2.5 flex items-start gap-2.5 leading-snug">
          <span className="text-2xl mt-0.5 filter drop-shadow-md">{trend.emoji}</span>
          <span className="group-hover:text-amber-400 transition-colors duration-300">{trend.nombre}</span>
        </h3>

        <p className="text-[13px] mb-4 line-clamp-2" style={{ color: C.textMuted, lineHeight: 1.6 }}>
          {trend.resumen}
        </p>

        <div style={{ borderColor: C.border }} className="border-t mb-4 opacity-40" />

        <div className="relative">
          <div className={`transition-all duration-500 ${!tieneAcceso ? 'blur-[5px] select-none opacity-30 grayscale' : ''}`}>
            <span style={{ color: C.gold }} className="text-[10px] font-bold uppercase tracking-widest block mb-1.5">
              🎯 Estrategia Resumida:
            </span>
            <p style={{ color: C.textDim }} className="text-xs leading-relaxed font-medium line-clamp-3">
              {trend.como_aplicar}
            </p>
          </div>

          {!tieneAcceso && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="bg-[#0a0a0c]/80 backdrop-blur-md rounded-xl p-3.5 border border-white/5 shadow-2xl flex flex-col items-center transform transition-transform group-hover:scale-105">
                <span className="text-2xl mb-1">🔒</span>
                <p style={{ color: C.text }} className="text-[11px] font-bold mb-2.5 tracking-wide uppercase">Contenido Exclusivo</p>
                <span style={{ backgroundColor: C.gold, color: C.bg }} className="font-extrabold text-[9px] py-1.5 px-4 rounded-full uppercase tracking-widest shadow-lg">
                  Desbloquear
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 flex justify-between items-center text-[10px] font-semibold tracking-wider relative z-10" style={{ color: C.textMuted }}>
        <span className="flex gap-2">
          <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md border border-white/5">
            ⚖️ Dif: {trend.dificultad}
          </span>
          <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md border border-white/5">
            💰 {trend.inversion}
          </span>
        </span>
        <span style={{ color: C.gold, borderColor: C.borderGold }} className="bg-amber-500/10 px-2 py-1 rounded-md border">
          PRO
        </span>
      </div>
    </div>
  );
}

// ─── DOSSIER DETALLADO A PANTALLA COMPLETA ───────────────────────────────────
function TrendPage({ t, onClose, isFavorite, onToggleFavorite }) {
  if (!t) return null;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:100, background:"rgba(10, 10, 12, 0.95)", backdropFilter:"blur(10px)", overflowY:"auto" }}>
      <div style={{ maxWidth:860, margin:"0 auto", padding:"30px 20px 100px" }}>
        
        {/* Cabecera / Botón de regreso */}
        <button onClick={onClose} style={{ background:"transparent", border:"none", color:C.textMuted, cursor:"pointer", display:"flex", alignItems:"center", gap:8, fontSize:14, fontWeight:700, marginBottom:32, padding:0, transition:"color 0.2s" }} onMouseOver={e => e.target.style.color = C.text} onMouseOut={e => e.target.style.color = C.textMuted}>
          <span style={{ fontSize:18 }}>←</span> Volver al Radar
        </button>

        {/* Título y Sector */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:20, marginBottom:40 }}>
          <div style={{ display:"flex", gap:24, alignItems:"center" }}>
            <div style={{ fontSize:72, background:C.surface, padding:"24px", borderRadius:28, border:`1px solid ${C.border}`, boxShadow:"0 20px 40px rgba(0,0,0,0.4)" }}>
              {t.emoji}
            </div>
            <div>
              <span style={{ color:C.gold, fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.2em", padding:"6px 12px", background:C.goldBg, borderRadius:8, border:`1px solid ${C.goldBorder}` }}>
                Sector {t.sector}
              </span>
              <h1 style={{ fontSize:36, fontWeight:900, color:C.text, margin:"16px 0 12px", lineHeight:1.1, letterSpacing:"-0.02em" }}>{t.nombre}</h1>
              <p style={{ fontSize:16, color:C.textMuted, margin:0, lineHeight:1.6, maxWidth:550 }}>{t.resumen}</p>
            </div>
          </div>
          <button onClick={() => onToggleFavorite(t.id)} style={{ background:C.surface, border:`1px solid ${isFavorite ? C.pink : C.border}`, color:isFavorite ? C.pink : C.textMuted, borderRadius:16, padding:"12px 16px", cursor:"pointer", fontSize:28, transition:"all 0.2s", boxShadow:"0 4px 12px rgba(0,0,0,0.2)" }}>
            {isFavorite ? "❤️" : "🤍"}
          </button>
        </div>

        {/* Métricas clave financieras y operativas */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(160px, 1fr))", gap:16, marginBottom:48 }}>
          {[
            { l: "Potencial", v: t.potencial, c: t.potencial==="Alta"?C.green:C.amber },
            { l: "Dificultad", v: t.dificultad, c: t.dificultad==="Fácil"?C.indigo:t.dificultad==="Moderada"?C.amber:C.red },
            { l: "Inversión Est.", v: t.inversion, c: C.gold },
            { l: "Tiempo Setup", v: t.tiempo, c: C.text }
          ].map(m => (
            <div key={m.l} style={{ background:C.surface, border:`1px solid ${C.border}`, padding:"20px", borderRadius:20 }}>
              <p style={{ fontSize:11, color:C.textDim, textTransform:"uppercase", fontWeight:800, margin:"0 0 8px", letterSpacing:"0.1em" }}>{m.l}</p>
              <p style={{ fontSize:20, color:m.c, fontWeight:900, margin:0 }}>{m.v}</p>
            </div>
          ))}
        </div>

        {/* Bloques de Información Detallada */}
        <div style={{ display:"grid", gap:24 }}>
          
          {/* Bloque 1: Modelo EE.UU */}
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:24, padding:36 }}>
            <h3 style={{ fontSize:22, fontWeight:800, color:C.text, margin:"0 0 16px", display:"flex", alignItems:"center", gap:12 }}><span style={{color:C.gold}}>1.</span> Modelo de Negocio (Por qué funciona)</h3>
            <p style={{ fontSize:15, color:C.textMuted, lineHeight:1.8, margin:0 }}>{t.por_que}</p>
          </div>

          {/* Bloque 2: Estrategia España */}
          <div style={{ background:C.indigoBg, border:`1px solid ${C.indigoBorder}`, borderRadius:24, padding:36 }}>
            <h3 style={{ fontSize:22, fontWeight:800, color:C.indigo, margin:"0 0 16px", display:"flex", alignItems:"center", gap:12 }}><span>2.</span> Estrategia de entrada en España</h3>
            <p style={{ fontSize:15, color:C.text, lineHeight:1.8, margin:0 }}>{t.como_aplicar}</p>
          </div>

          {/* Bloque 3: Hoja de Ruta + Riesgos */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
            
            {/* Pasos */}
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:24, padding:36 }}>
              <h3 style={{ fontSize:18, fontWeight:800, color:C.text, margin:"0 0 24px" }}>✅ Hoja de Ruta (Paso a Paso)</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
                {t.pasos.map((p,i) => (
                  <div key={i} style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
                    <div style={{ background:C.border, color:C.text, width:28, height:28, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:900, flexShrink:0, marginTop:2 }}>{i+1}</div>
                    <p style={{ fontSize:14, color:C.textMuted, margin:0, lineHeight:1.6 }}>{p}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Riesgos */}
            <div style={{ background:C.redBg, border:`1px solid ${C.red}30`, borderRadius:24, padding:36 }}>
              <h3 style={{ fontSize:18, fontWeight:800, color:C.red, margin:"0 0 24px" }}>⚠️ Riesgos y Cuellos de Botella</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
                {t.riesgos.map((r,i) => (
                  <div key={i} style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
                    <div style={{ color:C.red, fontSize:18, flexShrink:0, fontWeight:900 }}>✕</div>
                    <p style={{ fontSize:14, color:C.text, margin:0, lineHeight:1.6 }}>{r}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ... Continúa debajo con la base de datos ampliada ...
// ─── BASE DE DATOS AMPLIADA (CON INVERSIÓN Y TIEMPO) ─────────────────────────
const TRENDS = [
  { id:1, nombre:"Dark Kitchen con Suscripción", emoji:"🍱", sector:"Food & Drink", potencial:"Alta", dificultad:"Fácil", inversion:"2.000€ - 5.000€", inv_num:3, tiempo:"1-2 meses", resumen:"Cocinas fantasma con planes de comida semanal por suscripción, sin local físico.", por_que:"En EE.UU. el modelo dark kitchen explotó post-COVID. Añadir suscripción mensual garantiza ingresos recurrentes y reduce el desperdicio.", como_aplicar:"España tiene cultura gastronómica altísima pero poca oferta de comida saludable por suscripción. Ciudades medianas como Valencia o Bilbao son ideales.", riesgos:["Logística propia o dependencia de Glovo/Uber","Fidelización difícil si la calidad baja","Regulación sanitaria estricta"], pasos:["Alquilar espacio en una cloud kitchen","Definir nicho: vegano o menú ejecutivo","Lanzar con 50 suscriptores piloto","Automatizar pedidos con Shopify"] },
  { id:2, nombre:"Clínicas de Salud Mental Online", emoji:"🧠", sector:"Salud", potencial:"Alta", dificultad:"Moderada", inversion:"< 500€", inv_num:1, tiempo:"1-2 semanas", resumen:"Plataformas que conectan psicólogos con pacientes por videollamada.", por_que:"BetterHelp factura más de 700M$ anuales. La pandemia normalizó la terapia online y la demanda no ha bajado.", como_aplicar:"España tiene lista de espera de meses en salud mental pública. Diferenciarse por especialidad y precio accesible es la clave.", riesgos:["Necesitas psicólogos colegiados","Competencia de apps internacionales","Retención si el paciente prefiere presencial"], pasos:["Montar plataforma con Calendly + Stripe","Reclutar 5-10 psicólogos autónomos","Nicho inicial: ansiedad laboral B2B","Certificar cumplimiento LOPD/RGPD"] },
  { id:3, nombre:"Lavanderías Self-Service Premium", emoji:"🧺", sector:"Servicios", potencial:"Alta", dificultad:"Fácil", inversion:"30.000€ - 60.000€", inv_num:5, tiempo:"3-6 meses", resumen:"Lavanderías automatizadas 24h con app, pago sin efectivo y experiencia de marca.", por_que:"En EE.UU. Wash Club convirtió algo mundano en experiencia premium. El ticket medio sube 3x.", como_aplicar:"España tiene muchas lavanderías antiguas. Ciudades universitarias y zonas turísticas son el target perfecto.", riesgos:["Inversión inicial en maquinaria","Mantenimiento constante","Ubicación es crítica"], pasos:["Estudiar zonas turísticas o universidades","Negociar leasing de máquinas","Desarrollar app sencilla de cobro","Diseñar local visualmente premium"] },
  { id:4, nombre:"Academias Padel Indoor Premium", emoji:"🎾", sector:"Fitness", potencial:"Alta", dificultad:"Difícil", inversion:"100.000€+", inv_num:6, tiempo:"6+ meses", resumen:"Centros de padel cubiertos con entrenamiento y tecnología de análisis.", por_que:"En EE.UU. los sports clubs premium generan ingresos 5x superiores. El padel está maduro para esto.", como_aplicar:"España lidera el padel mundial pero con instalaciones básicas. Un modelo premium tiene diferenciación inmediata.", riesgos:["Alta inversión en instalaciones","Mercado competido","Mantenimiento de pistas"], pasos:["Buscar nave de 1.500m²","Asociarse con entrenadores top","Membresía fundadores anticipada","Instalar cámaras de análisis"] },
  { id:5, nombre:"Concierge para Personas Mayores", emoji:"👴", sector:"Servicios", potencial:"Alta", dificultad:"Fácil", inversion:"< 500€", inv_num:1, tiempo:"1-2 semanas", resumen:"Asistencia personal: trámites, tecnología, compras y acompañamiento.", por_que:"En EE.UU. Papa Inc. vale cientos de millones. El envejecimiento crea demanda inagotable.", como_aplicar:"España es la segunda población más envejecida. Familias pagan bien por tranquilidad.", riesgos:["Confianza difícil de ganar","Selección estricta de personal","Regulación laboral"], pasos:["Definir catálogo de servicios concretos","Certificar selección de asistentes","Captar clientes en farmacias","Suscripción mensual 150-300€"] },
  { id:6, nombre:"Renting de Ropa por Suscripción", emoji:"👗", sector:"Retail", potencial:"Media", dificultad:"Difícil", inversion:"5.000€ - 15.000€", inv_num:4, tiempo:"1-2 meses", resumen:"Alquiler mensual de ropa de marca — la llevas, la devuelves, siempre nueva.", por_que:"Rent the Runway alcanzó 2.000M$. La generación millennial prefiere acceso a propiedad.", como_aplicar:"España tiene cultura de moda fuerte. Nicho inicial: ropa de trabajo o eventos.", riesgos:["Logística de limpieza compleja","Capital para stock","Tasa de abandono alta"], pasos:["Empezar con vestidos de evento","Acuerdo con tintorería local","Vender vía Instagram y WhatsApp","Lograr 20 suscriptoras piloto"] },
  { id:7, nombre:"Bares de Zumo en Frío", emoji:"🥤", sector:"Food & Drink", potencial:"Alta", dificultad:"Fácil", inversion:"15.000€ - 30.000€", inv_num:5, tiempo:"2-4 meses", resumen:"Tiendas de zumos prensados, shots de bienestar y batidos funcionales.", por_que:"Pressed Juicery factura 100M$+ en EE.UU. Ticket alto y margen también.", como_aplicar:"El concepto existe pero fragmentado. Una cadena cerca de gimnasios tiene mucho tirón.", riesgos:["Producto muy perecedero","Maquinaria cara","Estacionalidad en invierno"], pasos:["Buscar local junto a gimnasios","Validar venta online primero","Suscripción semanal de jugos","Certificar proceso sanitario"] },
  { id:8, nombre:"Meal Prep Delivery Fitness", emoji:"💪", sector:"Food & Drink", potencial:"Alta", dificultad:"Moderada", inversion:"1.000€ - 5.000€", inv_num:2, tiempo:"1 mes", resumen:"Comidas semanales diseñadas por nutricionistas para público fitness.", por_que:"Factor75 crece al 40% anual. El cliente fitness tiene dinero pero no tiene tiempo para cocinar.", como_aplicar:"Falta un servicio serio con macros exactos en España.", riesgos:["Refrigeración en logística","Competencia masiva","Márgenes ajustados"], pasos:["Contratar nutricionista","Reparto local para validar","Planes: definir peso o músculo","Crear contenido en TikTok"] },
  { id:9, nombre:"Estudios Boutique por App", emoji:"🏋️", sector:"Fitness", potencial:"Alta", dificultad:"Moderada", inversion:"20.000€ - 50.000€", inv_num:5, tiempo:"3-6 meses", resumen:"Pequeños estudios de HIIT o yoga reservables 100% por app.", por_que:"SoulCycle demostró que la gente paga 30€/clase por experiencia premium.", como_aplicar:"Madrid y Barcelona tienen público. Faltan estudios estéticos con reserva sin fricción.", riesgos:["Inversión en equipamiento","Ocupación mínima vital","Dependencia del instructor"], pasos:["Especializarse en un formato (HIIT)","App de reservas día 1","Fichar instructor con seguidores","Vender abonos anticipados"] },
  { id:10, nombre:"Clínicas Recuperación Deportiva", emoji:"🧊", sector:"Fitness", potencial:"Alta", dificultad:"Moderada", inversion:"30.000€ - 80.000€", inv_num:5, tiempo:"3-6 meses", resumen:"Crioterapia, baños de hielo y sauna para deportistas amateur.", por_que:"Restore Hyper Wellness tiene 200+ locales. El amateur quiere rutinas de atletas.", como_aplicar:"Pocas opciones en España. Local con membresía mensual junto a complejos deportivos.", riesgos:["Máquinas muy caras","Personal con formación","Falta de costumbre en clientes"], pasos:["Empezar con sauna y baños de hielo","Acuerdo con fisioterapeutas","Contenido educativo en redes","Membresías limitadas a 100 pers."] },
  { id:11, nombre:"SaaS para Clínicas Pequeñas", emoji:"🏥", sector:"Tech", potencial:"Alta", dificultad:"Moderada", inversion:"< 1.000€", inv_num:1, tiempo:"1-3 meses", resumen:"Software todo-en-uno: agenda, pagos e historia clínica.", por_que:"Jane App factura decenas de millones. Soluciones enterprise son caras.", como_aplicar:"Miles de clínicas españolas usan Excel. Un SaaS de 49€/mes es venta rápida.", riesgos:["Ciclo de venta largo","LOPD muy estricta","Software ya existente"], pasos:["Entrevistar 20 fisioterapeutas","Crear MVP de agenda","Precio 29€/mes para pioneros","Ir puerta a puerta"] },
  { id:12, nombre:"IA para Redes de PYMEs", emoji:"📲", sector:"Tech", potencial:"Alta", dificultad:"Moderada", inversion:"< 500€", inv_num:1, tiempo:"1-2 semanas", resumen:"Herramienta IA que genera y programa contenido en redes.", por_que:"Buffer tiene millones de usuarios. La IA democratiza la creación de contenido.", como_aplicar:"El 95% de PYMEs en España no publican. Solución automática por 29€/mes.", riesgos:["Mercado competido","Pymes no quieren pagar","APIs de OpenAI cambian"], pasos:["Elegir nicho (solo restaurantes)","Conectar ChatGPT con Canva","Plan a 19€/mes automático","Vender a través de agencias"] },
  { id:13, nombre:"App Finanzas para Autónomos", emoji:"💸", sector:"Tech", potencial:"Alta", dificultad:"Moderada", inversion:"< 1.000€", inv_num:1, tiempo:"1-3 meses", resumen:"Gestoría digital automatizada: facturas e impuestos.", por_que:"Quickbooks Self-Employed. El autónomo odia la contabilidad manual.", como_aplicar:"3,3 millones de autónomos en España. Espacio para apps verticales por profesión.", riesgos:["Regulación fiscal cambiante","Alta responsabilidad legal","Gestorías clásicas"], pasos:["Integración con AEAT (Hacienda)","Hacerlo solo para creadores digitales","Cobrar 15€/mes","Buscar clientes en LinkedIn"] },
  { id:14, nombre:"Tiendas 2ª Mano Curadas", emoji:"♻️", sector:"Retail", potencial:"Alta", dificultad:"Fácil", inversion:"5.000€ - 10.000€", inv_num:3, tiempo:"1-2 meses", resumen:"Tiendas físicas de ropa/electrónica con filtro de calidad y garantía.", por_que:"ThredUp vale miles de millones. El re-commerce crece 15x frente al retail tradicional.", como_aplicar:"Wallapop domina online, pero falta oferta física ordenada y con garantía.", riesgos:["Lograr stock continuo de calidad","Alquiler local comercial","Gestión de inventario único"], pasos:["Elegir nicho de moda premium","Comprar chollos en Wallapop","Abrir popup en barrio céntrico","Implementar consignación"] },
  { id:15, nombre:"Suscripción Artesanal", emoji:"🧀", sector:"Retail", potencial:"Alta", dificultad:"Fácil", inversion:"< 1.000€", inv_num:1, tiempo:"1 mes", resumen:"Caja mensual curada con quesos, embutidos y vinos regionales.", por_que:"Cratejoy es un gigante. La gente paga por descubrir productos de calidad.", como_aplicar:"Riqueza gastronómica española inmensa. Venta directa a expatriados y sibaritas.", riesgos:["Envíos refrigerados caros","Retención baja a los 3 meses","Negociar con pequeños productores"], pasos:["Definir la temática (Ej. Galicia)","Cerrar con 3 productores","Conseguir 30 compras online","Fotos top para Instagram"] },
  { id:16, nombre:"Live Commerce", emoji:"📺", sector:"Retail", potencial:"Alta", dificultad:"Fácil", inversion:"< 500€", inv_num:1, tiempo:"1 semana", resumen:"Ventas en directo (TikTok) con descuentos en tiempo real.", por_que:"En China mueve 600.000M$. En EE.UU. crece 30% anual.", como_aplicar:"En España está verde. Primeros en moverse en moda o belleza se quedan el pastel.", riesgos:["Falta de vergüenza ante cámara","Gestión de stock ultra rápida","Dependencia de un solo creador"], pasos:["Conseguir stock sobrante (outlet)","2 directos semanales de 45 min","Descuentos solo duran el directo","Alianzas con influencers"] },
  { id:17, nombre:"Gestión Alquiler Vacacional", emoji:"🏡", sector:"Servicios", potencial:"Alta", dificultad:"Fácil", inversion:"< 500€", inv_num:1, tiempo:"1 semana", resumen:"Gestión integral de Airbnb: limpieza, precios e ingresos.", por_que:"Vacasa es enorme. Los propietarios quieren ingresos pasivos reales.", como_aplicar:"España es potencia turística mundial. Miles de pisos están mal optimizados.", riesgos:["Normativas municipales","Conseguir limpiadores en agosto","Un mal huésped hunde reseñas"], pasos:["Pedir piso a 2 familiares","Software de precios dinámicos","Contratar autónomo limpieza","Cobrar 20% de comisión"] },
  { id:18, nombre:"Foto Inmobiliaria + Dron", emoji:"📸", sector:"Servicios", potencial:"Alta", dificultad:"Fácil", inversion:"2.000€ - 4.000€", inv_num:2, tiempo:"1 mes", resumen:"Fotos PRO, vídeo dron y tour 360 para inmobiliarias.", por_que:"Las buenas fotos venden 32% más rápido. Matterport es estándar fuera.", como_aplicar:"Idealista está lleno de fotos oscuras hechas con móvil. Mercado infinito.", riesgos:["Inversión inicial en cámaras","Licencias de vuelo dron","Guerra de precios local"], pasos:["Sacar licencia AESA online","Comprar equipo de segunda mano","Hacer 3 pisos gratis de muestra","Cobrar 150€ por reportaje"] },
  { id:19, nombre:"Tutorías Online IA+Humano", emoji:"📚", sector:"Educación", potencial:"Alta", dificultad:"Moderada", inversion:"< 500€", inv_num:1, tiempo:"1 semana", resumen:"IA detecta errores del alumno y un tutor humano interviene.", por_que:"Khan Academy. La personalización abarata costes y mejora notas.", como_aplicar:"8M de alumnos en España. Las academias de barrio no usan tecnología.", riesgos:["Adquisición de clientes cara","Justificar el precio a los padres","La IA no es perfecta aún"], pasos:["Empezar solo con Matemáticas","Contratar profes universitarios","Diagnóstico gratis vía web","Vender bono de sesiones"] },
  { id:20, nombre:"Academia de Finanzas", emoji:"💰", sector:"Educación", potencial:"Alta", dificultad:"Fácil", inversion:"< 500€", inv_num:1, tiempo:"1-2 semanas", resumen:"Cursos y comunidad de inversión y ahorro personal.", por_que:"Ramsey Solutions factura millones. Millennials no saben invertir.", como_aplicar:"Baja cultura financiera en España. Interés disparado por la inflación.", riesgos:["Límite legal sin ser asesor","Necesita alta credibilidad personal","Competencia en YouTube"], pasos:["Crear marca personal en TikTok","Regalar plantilla Excel","Vender curso de 90 días a 197€","Abrir comunidad en Discord"] },
  { id:21, nombre:"Formación Oficios Futuro", emoji:"⚡", sector:"Educación", potencial:"Alta", dificultad:"Moderada", inversion:"2.000€ - 5.000€", inv_num:3, tiempo:"2-3 meses", resumen:"Cursos de instalación solar o mantenimiento técnico.", por_que:"Faltan técnicos para la transición energética mundial.", como_aplicar:"En España no hay instaladores suficientes para la meta de renovables 2030.", riesgos:["Aprobación de certificados","Tener material real es caro","Tecnología cambia rápido"], pasos:["Alianza con marca de paneles","Crear curso teórico online","Prácticas en nave presencial","Buscar acuerdos de empleo"] },
  { id:22, nombre:"Energía Solar Comunitaria", emoji:"☀️", sector:"Sostenibilidad", potencial:"Alta", dificultad:"Difícil", inversion:"50.000€+", inv_num:6, tiempo:"6+ meses", resumen:"Comunidades vecinales comparten instalación solar.", por_que:"Comunidades solares reducen drásticamente la factura en EE.UU.", como_aplicar:"País del sol, normativas aprobadas pero vecinos desinformados.", riesgos:["Convencer a presidentes vecinales","Trámites burocráticos largos","Inversión alta inicial"], pasos:["Contactar administradores de fincas","Ofrecer instalación coste cero","Recuperar vendiendo la energía","Financiación bancaria externa"] },
  { id:23, nombre:"Reparación Electrónica", emoji:"🔌", sector:"Sostenibilidad", potencial:"Alta", dificultad:"Fácil", inversion:"1.000€ - 3.000€", inv_num:2, tiempo:"1 mes", resumen:"Arreglo de móviles y ordenadores contra obsolescencia.", por_que:"iFixit creó un movimiento. Ley europea apoya reparar sobre tirar.", como_aplicar:"Miles de toneladas de basura electrónica. Faltan técnicos transparentes.", riesgos:["Conseguir piezas originales","Técnicos se van por su cuenta","Dispositivos irremediables"], pasos:["Especializarse en Mac/iPhone","Ofrecer recogida en casa gratis","Precio transparente online","Dar 6 meses de garantía"] },
  { id:24, nombre:"Gestión Residuos Hostelería", emoji:"🍃", sector:"Sostenibilidad", potencial:"Alta", dificultad:"Moderada", inversion:"< 1.000€", inv_num:1, tiempo:"1 mes", resumen:"Bares externalizan su reciclaje de aceite y orgánico.", por_que:"Rubicon vale millones automatizando rutas de reciclaje empresarial.", como_aplicar:"Nuevas leyes españolas obligan a separar todo y hay multas.", riesgos:["Logística pura y dura","Normativa por comunidades","Márgenes en volumen"], pasos:["Acuerdo previo con plantas reciclaje","Cobrar fee fijo a restaurantes","Alquilar furgoneta para rutas","Entregar certificados legales"] },
];

const SECTORES    = ["Todos","Food & Drink","Fitness","Salud","Tech","Retail","Servicios","Educación","Sostenibilidad"];
const SECTOR_ICON = { "Todos":"🌎","Food & Drink":"🍽️","Fitness":"💪","Salud":"🩺","Tech":"💻","Retail":"🛍️","Servicios":"🤝","Educación":"🎓","Sostenibilidad":"🌱" };
const POT_STYLE   = { Alta:{ bg:"rgba(74,222,128,0.12)", color:"#4ade80", border:"rgba(74,222,128,0.25)" }, Media:{ bg:"rgba(251,191,36,0.12)", color:"#fbbf24", border:"rgba(251,191,36,0.25)" }, Baja:{ bg:"rgba(248,113,113,0.12)", color:"#f87171", border:"rgba(248,113,113,0.25)" } };
const DIF_STYLE   = { "Fácil":{ bg:"rgba(129,140,248,0.12)", color:"#818cf8", border:"rgba(129,140,248,0.25)" }, Moderada:{ bg:"rgba(251,191,36,0.12)", color:"#fbbf24", border:"rgba(251,191,36,0.25)" }, "Difícil":{ bg:"rgba(248,113,113,0.12)", color:"#f87171", border:"rgba(248,113,113,0.25)" } };

// ─── DATA ESTÁTICA NOTICIAS Y MERCADO ────────────────────────────────────────
const STATIC_NEWS = [
  { titulo:"El delivery saludable crece un 22% en España", resumen:"Las apps de meal prep y dark kitchens ganan terreno.", sector:"Food & Drink", impacto:"Alto", tag:"Tendencia" },
  { titulo:"Inversión en salud mental digital se duplica", resumen:"Fondos europeos apuestan por plataformas de terapia online.", sector:"Salud", impacto:"Alto", tag:"Inversión" },
  { titulo:"Nueva normativa de residuos para hostelería", resumen:"Bares deberán separar aceite y orgánico bajo nuevas reglas.", sector:"Sostenibilidad", impacto:"Medio", tag:"Regulación" },
  { titulo:"El padel sigue rompiendo récords de jugadores", resumen:"Demanda altísima de instalaciones premium cubiertas.", sector:"Fitness", impacto:"Alto", tag:"Tendencia" },
];

const STATIC_MARKET = {
  "Todos": { insight: "El mercado de bienestar y servicios en EE.UU. es 6-10x mayor.", datos: [ { nombre:"Meal Prep", mercadoUSA:65, mercadoES:1.2, crecimiento:40 }, { nombre:"Salud Mental", mercadoUSA:120, mercadoES:2.5, crecimiento:25 }, { nombre:"Padel",mercadoUSA:10, mercadoES:2.0, crecimiento:30 }, { nombre:"Alquiler Vac.", mercadoUSA:90, mercadoES:8.5, crecimiento:15 } ] },
  "Food & Drink": { insight: "Las dark kitchens mueven decenas de miles de millones en EE.UU.", datos: [ { nombre:"Dark Kitchens", mercadoUSA:45, mercadoES:0.8, crecimiento:35 }, { nombre:"Zumos en Frío", mercadoUSA:20, mercadoES:0.3, crecimiento:20 } ] },
  "Fitness": { insight: "Los estudios boutique crecen con fuerza en mercados maduros.", datos: [ { nombre:"Estudios Boutique",mercadoUSA:35, mercadoES:1.0, crecimiento:18 }, { nombre:"Crioterapia", mercadoUSA:8, mercadoES:0.1, crecimiento:28 } ] },
  "Salud": { insight: "La telesalud mental multiplica por 50x el mercado español.", datos: [ { nombre:"Terapia Online", mercadoUSA:120, mercadoES:2.5, crecimiento:25 }, { nombre:"Concierge Mayores",mercadoUSA:30, mercadoES:0.5, crecimiento:20 } ] },
  "Tech": { insight: "El SaaS vertical para PYMEs está en ebullición.", datos: [ { nombre:"SaaS Clínicas", mercadoUSA:18, mercadoES:0.3, crecimiento:22 }, { nombre:"IA Marketing", mercadoUSA:40, mercadoES:1.5, crecimiento:35 } ] },
  "Retail": { insight: "El re-commerce y el live shopping lideran el crecimiento.", datos: [ { nombre:"Segunda Mano", mercadoUSA:55, mercadoES:3.0, crecimiento:22 }, { nombre:"Cajas Suscripción",mercadoUSA:15, mercadoES:0.5, crecimiento:18 } ] },
  "Servicios": { insight: "La profesionalización de servicios básicos eleva el ticket.", datos: [ { nombre:"Alquiler Vac.", mercadoUSA:90, mercadoES:8.5, crecimiento:15 }, { nombre:"Lavanderías 24h",mercadoUSA:12, mercadoES:0.6, crecimiento:12 } ] },
  "Educación": { insight: "Las tutorías online y edtech B2C viven una época dorada.", datos: [ { nombre:"Tutorías Online",mercadoUSA:45, mercadoES:1.2, crecimiento:20 }, { nombre:"Finanzas",mercadoUSA:10,mercadoES:0.2, crecimiento:25 } ] },
  "Sostenibilidad": { insight: "La normativa obliga a transformar residuos y energía.", datos: [ { nombre:"Solar Comunitaria",mercadoUSA:25,mercadoES:0.4, crecimiento:30 }, { nombre:"Gestión Residuos", mercadoUSA:30, mercadoES:0.5,crecimiento:16 } ] }
};

// ─── COMPONENTES SECUNDARIOS ─────────────────────────────────────────────────
function NewsSection({ sector }) {
  const news = useMemo(() => sector === "Todos" ? STATIC_NEWS : STATIC_NEWS.filter(n => n.sector === sector), [sector]);
  if (news.length === 0) return <p style={{ fontSize:13, color:C.textMuted, textAlign:"center", padding:"20px 0" }}>No hay noticias.</p>;
  return (
    <div style={{ display:"grid", gap:12 }}>
      {news.map((n, i) => (
        <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:16 }}>
          <h3 style={{ fontSize:14, fontWeight:800, color:C.text, margin:"0 0 6px" }}>{n.titulo}</h3>
          <p style={{ fontSize:12, color:C.textMuted, margin:0 }}>{n.resumen}</p>
        </div>
      ))}
    </div>
  );
}

function MarketChart({ data }) {
  if (!data || !data.datos) return null;
  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:18, padding:"18px 16px", marginBottom:20 }}>
      <p style={{ fontSize:11, fontWeight:800, color:C.gold, textTransform:"uppercase", letterSpacing:"0.14em", margin:"0 0 10px" }}>📊 Mercado — EE.UU. vs España</p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data.datos} margin={{ top:10, right:10, left:-10, bottom:0 }}>
          <XAxis dataKey="nombre" tick={{ fill:C.textMuted, fontSize:10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill:C.textDim, fontSize:10 }} axisLine={false} tickLine={false} unit="B" />
          <Tooltip contentStyle={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, fontSize:12 }} itemStyle={{ color:C.text }} />
          <Bar dataKey="mercadoUSA" name="EE.UU." fill={C.borderGold} radius={[4,4,0,0]} />
          <Bar dataKey="mercadoES" name="España" fill={C.indigo} radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function CompareModal({ trends, onClose }) { return null; } // Oculto por simplicidad
function PaywallModal({ onClose }) {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:60, background:"rgba(0,0,0,0.85)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:C.surface, border:`1px solid ${C.borderGold}`, borderRadius:24, padding:28, width:"100%", maxWidth:400, textAlign:"center" }}>
        <h2 style={{ fontSize:22, fontWeight:800, color:C.gold }}>TrendSpain Pro</h2>
        <p style={{ fontSize:34, fontWeight:900, color:C.text, margin:"14px 0" }}>5€<span style={{ fontSize:14, color:C.textMuted }}>/mes</span></p>
        <a href={STRIPE_PAYMENT_LINK} target="_blank" rel="noopener noreferrer" style={{ display:"block", background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, color:"#0a0a0c", padding:16, borderRadius:14, fontWeight:800, textDecoration:"none", marginBottom:12 }}>Suscribirme →</a>
        <button onClick={onClose} style={{ background:"none", border:"none", color:C.textMuted, cursor:"pointer" }}>Ahora no</button>
      </div>
    </div>
  );
}
function SuccessModal({ onClose }) { return null; } // Oculto por simplicidad

// ─── APLICACIÓN PRINCIPAL ────────────────────────────────────────────────────
export default function App() {
  const [sector, setSector] = useState("Todos");
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("trends");
  const [orden, setOrden] = useState("default"); // NUEVO ESTADO DE ORDEN
  const [selected, setSelected] = useState(null);
  
  const [isPro, setIsPro] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  
  const [tokensLeft, setTokensLeft] = useState(() => {
    try { return sessionStorage.getItem("ts_tokens_left") !== null ? parseInt(sessionStorage.getItem("ts_tokens_left"), 10) : FREE_TOKENS; } catch { return FREE_TOKENS; }
  });

  const [favorites, setFavorites] = useState(() => {
    try { return sessionStorage.getItem("ts_favorites") ? JSON.parse(sessionStorage.getItem("ts_favorites")) : []; } catch { return []; }
  });

  // Filtrar base
  const filtered = useMemo(() => TRENDS.filter(t => {
    const sMatch = sector === "Todos" || t.sector === sector;
    const qMatch = !query || t.nombre.toLowerCase().includes(query.toLowerCase());
    return sMatch && qMatch;
  }), [sector, query]);

  // Lista para mostrar con lógica de ORDENACIÓN
  const displayList = useMemo(() => {
    let result = activeTab === "favorites" ? TRENDS.filter(t => favorites.includes(t.id)) : filtered;
    
    let sorted = [...result];
    if (orden === "baratos") {
      sorted.sort((a,b) => (a.inv_num || 0) - (b.inv_num || 0)); // Menor Inversión
    } else if (orden === "faciles") {
      const d = {"Fácil":1, "Moderada":2, "Difícil":3};
      sorted.sort((a,b) => d[a.dificultad] - d[b.dificultad]); // Más fáciles primero
    } else if (orden === "potencial") {
      const p = {"Alta":1, "Media":2, "Baja":3};
      sorted.sort((a,b) => p[a.potencial] - p[b.potencial]); // Mayor Potencial primero
    }
    return sorted;
  }, [activeTab, favorites, filtered, orden]);

  const handleCard = (t) => {
    if (isPro) { setSelected(t); return; }
    if (tokensLeft <= 0) { setShowPaywall(true); return; }
    const n = tokensLeft - 1;
    setTokensLeft(n);
    try { sessionStorage.setItem("ts_tokens_left", n); } catch {}
    setSelected(t);
  };

  const toggleFavorite = (id) => {
    const next = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    setFavorites(next);
    try { sessionStorage.setItem("ts_favorites", JSON.stringify(next)); } catch {}
  };

  const TABS = [
    { id:"trends", label:"Oportunidades", icon:"🌎" },
    { id:"news", label:"Noticias", icon:"📰" },
    { id:"favorites", label:`Guardados (${favorites.length})`, icon:"❤️" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"-apple-system, 'Segoe UI', system-ui, sans-serif", color:C.text }}>
      
      {/* ── HEADER FIJO ── */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"16px 16px 0", position:"sticky", top:0, zIndex:40 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:8, background:`linear-gradient(135deg, ${C.gold}, ${C.goldLight})`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, color:"#000", fontSize:14 }}>T</div>
            <h1 style={{ fontSize:18, fontWeight:900, margin:0 }}>TrendSpain</h1>
          </div>
          {!isPro && (
            <button onClick={() => setShowPaywall(true)} style={{ background:C.goldBg, border:`1px solid ${C.goldBorder}`, borderRadius:8, padding:"6px 10px", fontSize:12, fontWeight:800, color:C.gold, cursor:"pointer" }}>
              ✦ PRO
            </button>
          )}
        </div>

        <div style={{ position:"relative", marginBottom:12 }}>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar oportunidad…" style={{ width:"100%", padding:"10px 12px", background:C.card, border:`1px solid ${C.border}`, borderRadius:12, fontSize:13, color:C.text, outline:"none", boxSizing:"border-box" }} />
        </div>

        <div style={{ display:"flex", overflowX:"auto", gap:0, scrollbarWidth:"none" }}>
          {SECTORES.map(s => (
            <button key={s} onClick={() => setSector(s)} style={{ padding:"9px 10px", fontSize:11, fontWeight:700, border:"none", background:"none", cursor:"pointer", whiteSpace:"nowrap", color:sector === s ? C.text : C.textMuted, borderBottom:sector === s ? `2px solid ${C.gold}` : "2px solid transparent" }}>
              {SECTOR_ICON[s]} {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── TABS NAVEGACIÓN ── */}
      <div style={{ display:"flex", borderBottom:`1px solid ${C.border}`, background:C.surface }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex:1, padding:"12px 0", border:"none", background:"none", fontSize:12, fontWeight:700, cursor:"pointer", color:activeTab === tab.id ? C.gold : C.textMuted, borderBottom:activeTab === tab.id ? `2px solid ${C.gold}` : "2px solid transparent" }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding:16 }}>
        {activeTab === "news" && <NewsSection sector={sector} />}

        {(activeTab === "trends" || activeTab === "favorites") && (
          <>
            {activeTab === "trends" && <MarketChart data={STATIC_MARKET[sector] || STATIC_MARKET["Todos"]} />}

            {/* ── PANEL DE ORDENACIÓN NUEVO ── */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:10 }}>
              <p style={{ fontSize:13, color:C.textDim, margin:0 }}>
                <span style={{ fontWeight:800, color:C.text }}>{displayList.length}</span> resultados
              </p>
              
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:12, color:C.textMuted, fontWeight:600 }}>Ordenar:</span>
                <select 
                  value={orden} 
                  onChange={e => setOrden(e.target.value)} 
                  style={{ background:C.surface, border:`1px solid ${C.border}`, color:C.text, padding:"6px 12px", borderRadius:8, fontSize:12, fontWeight:600, outline:"none", cursor:"pointer" }}
                >
                  <option value="default">✨ Recomendados</option>
                  <option value="baratos">💰 Menor Inversión</option>
                  <option value="faciles">🟢 Más Fáciles</option>
                  <option value="potencial">🚀 Mayor Potencial</option>
                </select>
              </div>
            </div>

            {/* ── CUADRÍCULA DE TARJETAS ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {displayList.map(t => (
                <TarjetaOportunidad 
                  key={t.id}
                  trend={t}
                  isFavorite={favorites.includes(t.id)}
                  onToggleFavorite={toggleFavorite}
                  onClick={() => handleCard(t)}
                  tieneAcceso={isPro || tokensLeft > 0}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── MODALS (AHORA ES UNA PÁGINA) ── */}
      <TrendPage
        t={selected}
        onClose={() => setSelected(null)}
        isFavorite={selected ? favorites.includes(selected.id) : false}
        onToggleFavorite={toggleFavorite}
      />
      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}
    </div>
  );
}

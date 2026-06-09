import { useState, useMemo, useEffect, useRef } from "react";

// ─── CONFIGURACIÓN ────────────────────────────────────────────────────────────
// TODO: Reemplaza esta URL con tu link real de Stripe
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/TU_LINK_REAL_AQUI";
// Token secreto que Stripe añade a la URL de retorno tras el pago exitoso
const SECRET_TOKEN = "ts_unlock_2025";
// Cuántas fichas gratis tiene un usuario antes de pagar
const FREE_TOKENS = 2;
// Cuántas preguntas de IA gratis tiene un usuario
const FREE_AI_QUESTIONS = 1;
// ─────────────────────────────────────────────────────────────────────────────

const C = {
  bg:         "#0d0d0f",
  surface:    "#161618",
  card:       "#1c1c1f",
  border:     "#2a2a2e",
  borderGold: "#c9a84c",
  gold:       "#c9a84c",
  goldLight:  "#f0d080",
  goldBg:     "rgba(201,168,76,0.08)",
  text:       "#f0ede8",
  textMuted:  "#8a8680",
  textDim:    "#5a5855",
  indigo:     "#818cf8",
  indigoBg:   "rgba(129,140,248,0.1)",
  green:      "#4ade80",
  greenBg:    "rgba(74,222,128,0.1)",
  red:        "#f87171",
  redBg:      "rgba(248,113,113,0.1)",
  amber:      "#fbbf24",
  amberBg:    "rgba(251,191,36,0.1)",
};

const TRENDS = [
  { id:1,  nombre:"Dark Kitchen con Suscripción",       emoji:"🍱", sector:"Food & Drink",   potencial:"Alta",  dificultad:"Fácil",    resumen:"Cocinas fantasma con planes de comida semanal por suscripción, sin local físico.", por_que:"En EE.UU. el modelo dark kitchen explotó post-COVID. Añadir suscripción mensual garantiza ingresos recurrentes y reduce el desperdicio.", como_aplicar:"España tiene cultura gastronómica altísima pero poca oferta de comida saludable por suscripción. Ciudades medianas como Valencia o Bilbao son ideales.", riesgos:["Logística propia o dependencia de Glovo/Uber","Fidelización difícil si la calidad baja","Regulación sanitaria estricta"], pasos:["Alquilar espacio en una cloud kitchen","Definir nicho: vegano, mediterráneo o menú ejecutivo","Lanzar con 50 suscriptores piloto","Automatizar pedidos con Shopify"] },
  { id:2,  nombre:"Clínicas de Salud Mental Online",    emoji:"🧠", sector:"Salud",           potencial:"Alta",  dificultad:"Moderada", resumen:"Plataformas que conectan psicólogos con pacientes por videollamada.", por_que:"BetterHelp factura más de 700M$ anuales. La pandemia normalizó la terapia online y la demanda no ha bajado.", como_aplicar:"España tiene lista de espera de meses en salud mental pública. Diferenciarse por especialidad y precio accesible es la clave.", riesgos:["Necesitas psicólogos colegiados","Competencia de apps internacionales","Retención si el paciente prefiere presencial"], pasos:["Montar plataforma con Calendly + Stripe + Zoom","Reclutar 5-10 psicólogos autónomos","Nicho inicial: ansiedad laboral B2B","Certificar cumplimiento LOPD/RGPD"] },
  { id:3,  nombre:"Lavanderías Self-Service Premium",   emoji:"🧺", sector:"Servicios",       potencial:"Alta",  dificultad:"Fácil",    resumen:"Lavanderías automatizadas 24h con app, pago sin efectivo y experiencia de marca cuidada.", por_que:"En EE.UU. Wash Club convirtió algo mundano en experiencia premium. El ticket medio sube 3x.", como_aplicar:"España tiene muchas lavanderías antiguas sin renovar. Ciudades universitarias y zonas turísticas son el target perfecto.", riesgos:["Inversión inicial en maquinaria (30-60k€)","Mantenimiento constante","Ubicación es crítica"], pasos:["Estudiar zonas universitarias o turísticas","Negociar leasing de máquinas","Desarrollar app sencilla","Diseñar local con identidad visual"] },
  { id:4,  nombre:"Academias de Padel Indoor Premium",  emoji:"🎾", sector:"Fitness",         potencial:"Alta",  dificultad:"Difícil",  resumen:"Centros de padel cubiertos con entrenamiento personalizado y tecnología de análisis.", por_que:"El padel explotó en España pero el modelo de negocio es anticuado. En EE.UU. los sports clubs premium generan ingresos 5x superiores.", como_aplicar:"España lidera el padel mundial con 6M de jugadores pero instalaciones básicas. Un modelo premium con membresía tiene enorme diferenciación.", riesgos:["Alta inversión en instalaciones cubiertas","Mercado competido en grandes ciudades","Estacionalidad si no es indoor"], pasos:["Buscar nave de 1.500m² en ciudad mediana","Asociarse con entrenadores locales","Membresía fundadores con descuento","Cámaras de análisis de juego"] },
  { id:5,  nombre:"Concierge para Personas Mayores",    emoji:"👴", sector:"Servicios",       potencial:"Alta",  dificultad:"Fácil",    resumen:"Asistencia personal para mayores: médicos, trámites, compras, tecnología y acompañamiento.", por_que:"En EE.UU. Papa Inc. vale cientos de millones. El envejecimiento crea demanda creciente e inagotable.", como_aplicar:"España tiene la segunda población más envejecida de Europa. Familias que no pueden cuidar a sus mayores pagan bien por tranquilidad.", riesgos:["Confianza difícil de ganar","Personal muy bien seleccionado","Regulación laboral específica"], pasos:["Definir catálogo de servicios concretos","Certificar selección de asistentes","Captar clientes por médicos y farmacias","Suscripción mensual 150-300€"] },
  { id:6,  nombre:"Renting de Ropa por Suscripción",    emoji:"👗", sector:"Retail",          potencial:"Media", dificultad:"Difícil",  resumen:"Alquiler mensual de ropa de marca — la llevas, la devuelves, siempre ropa nueva.", por_que:"Rent the Runway alcanzó 2.000M$ de valoración. La generación millennial prefiere acceso a propiedad.", como_aplicar:"España tiene cultura de moda fuerte. Nicho inicial: ropa de trabajo para mujeres profesionales.", riesgos:["Logística de limpieza compleja","Capital para stock inicial","Tasa de abandono alta"], pasos:["Empezar con nicho específico (vestidos de evento)","Acuerdo con tintorería local","Instagram + WhatsApp para empezar","30-50 prendas y 20 suscriptoras piloto"] },
  { id:7,  nombre:"Bares de Zumo en Frío",              emoji:"🥤", sector:"Food & Drink",   potencial:"Alta",  dificultad:"Fácil",    resumen:"Tiendas de zumos prensados en frío, shots de bienestar y batidos funcionales.", por_que:"Pressed Juicery factura 100M$+ en EE.UU. Ticket alto y margen también.", como_aplicar:"En España el concepto existe fragmentado. Una cadena de 3-5 locales en zonas fitness tiene enorme diferenciación.", riesgos:["Producto perecedero (vida 3-5 días)","Maquinaria cara (15-30k€)","Estacionalidad en invierno"], pasos:["Ubicaciones cerca de gimnasios","Venta online para validar","Suscripción semanal de jugos","Certificar proceso APPCC"] },
  { id:8,  nombre:"Meal Prep Delivery Fitness",         emoji:"💪", sector:"Food & Drink",   potencial:"Alta",  dificultad:"Moderada", resumen:"Comidas semanales listas para calentar, diseñadas por nutricionistas, para el público fitness.", por_que:"Factor75 y Trifecta crecen 40% anual. El cliente fitness quiere comer bien sin cocinar.", como_aplicar:"Mercado fitness español enorme. Falta un servicio de meal prep serio con macros calculados.", riesgos:["Logística de refrigeración compleja","Competencia de grandes marcas","Márgenes ajustados"], pasos:["Contratar nutricionista","Reparto local para empezar","3 planes: perder peso, ganar músculo, mantenimiento","Instagram y TikTok como canal"] },
  { id:9,  nombre:"Estudios Boutique por App",          emoji:"🏋️", sector:"Fitness",        potencial:"Alta",  dificultad:"Moderada", resumen:"Pequeños estudios de HIIT, yoga o pilates reservables 100% por app.", por_que:"SoulCycle y Orangetheory: la gente paga 30-40$/clase si la experiencia es premium.", como_aplicar:"España tiene pocos estudios boutique con experiencia de marca. Barcelona, Madrid o Málaga tienen público dispuesto a pagar.", riesgos:["Inversión en equipamiento","Ocupación mínima para rentabilidad","Fidelización depende del instructor"], pasos:["Especializarse en un solo formato","App de reservas desde día 1","Instructor con seguidores propios","Membresías fundadoras"] },
  { id:10, nombre:"Clínicas de Recuperación Deportiva", emoji:"🧊", sector:"Fitness",        potencial:"Alta",  dificultad:"Moderada", resumen:"Centros con crioterapia, baños de hielo y sauna para deportistas amateur.", por_que:"Restore Hyper Wellness tiene más de 200 locales. El deportista amateur quiere las herramientas de los profesionales.", como_aplicar:"En España pocas opciones accesibles. Una clínica cerca de zonas deportivas con membresía mensual tiene diferenciación clara.", riesgos:["Equipamiento muy caro","Personal con formación","Mercado en fase educativa"], pasos:["Empezar con baños de hielo y sauna","Ubicarse junto a gimnasio","Acuerdo con fisioterapeutas","Contenido educativo en redes"] },
  { id:11, nombre:"SaaS para Clínicas Pequeñas",        emoji:"🏥", sector:"Tech",           potencial:"Alta",  dificultad:"Moderada", resumen:"Software todo-en-uno para clínicas: agenda, pagos e historia clínica.", por_que:"Jane App factura decenas de millones. Las clínicas pequeñas no pueden pagar soluciones enterprise.", como_aplicar:"Miles de clínicas en España usan Excel o WhatsApp. Un SaaS a 49-99€/mes con soporte en español tiene mercado inmediato.", riesgos:["Ciclo de venta largo","LOPD en datos de salud","Competencia de Mindbody"], pasos:["Elegir un único tipo de clínica","Entrevistar 20 fisioterapeutas","MVP en 3 meses","Precio 29€/mes para los primeros 50"] },
  { id:12, nombre:"IA para Redes de PYMEs",             emoji:"📲", sector:"Tech",           potencial:"Alta",  dificultad:"Moderada", resumen:"Herramienta que genera y programa contenido en redes sociales para pequeños negocios.", por_que:"Buffer tiene millones de usuarios. La IA permite generar contenido de calidad automáticamente.", como_aplicar:"El 95% de PYMEs españolas tienen redes abandonadas. Una herramienta específica por sector en español tiene ventaja.", riesgos:["Mercado muy competido","Diferenciación difícil","PYMEs con presupuesto limitado"], pasos:["Elegir sector específico (restaurantes)","MVP con generación + programación","Precio 19-39€/mes","Agencias como revendedores"] },
  { id:13, nombre:"App de Finanzas para Autónomos",     emoji:"💸", sector:"Tech",           potencial:"Alta",  dificultad:"Moderada", resumen:"Gestoría digital: facturas, IVA, IRPF y declaraciones automáticas.", por_que:"Quickbooks Self-Employed tiene millones de usuarios. El autónomo odia gestionar su contabilidad.", como_aplicar:"España tiene 3,3 millones de autónomos. Hay espacio para actores especializados por sector.", riesgos:["Regulación fiscal cambia","Responsabilidad legal","Competencia de gestorías"], pasos:["Elegir nicho por sector","Integración con AEAT","Precio 15-29€/mes","Comunidades de freelancers en LinkedIn"] },
  { id:14, nombre:"Tiendas de Segunda Mano Curadas",    emoji:"♻️", sector:"Retail",         potencial:"Alta",  dificultad:"Fácil",    resumen:"Tiendas físicas de ropa o electrónica de segunda mano con curaduría y garantía.", por_que:"ThredUp y Poshmark valen miles de millones. La compra de segunda mano creció 15x en la última década.", como_aplicar:"Wallapop domina online pero hay escasa oferta física curada. Una tienda especializada con garantía tiene diferenciación enorme.", riesgos:["Aprovisionamiento de calidad","Gestión de inventario compleja","Local prime encarece"], pasos:["Elegir categoría específica","Comprar en Wallapop y revender","Local en mercado para validar","Sistema de consignación"] },
  { id:15, nombre:"Suscripción de Productos Artesanales",emoji:"🧀",sector:"Retail",         potencial:"Alta",  dificultad:"Fácil",    resumen:"Caja mensual curada con productos artesanales: quesos, embutidos, aceites, vinos.", por_que:"Cratejoy ha generado miles de negocios de cajas. El consumidor quiere descubrir productos únicos.", como_aplicar:"España tiene una riqueza artesanal única. Una caja DOP curada por región tiene demanda local y en la diáspora.", riesgos:["Logística de temperatura","Retención cae si se repite","Negociación con productores pequeños"], pasos:["Definir temática por región o tipo","30 suscriptores para validar","Fotografía profesional","Grupos de foodies en Facebook"] },
  { id:16, nombre:"Live Commerce (Ventas en Directo)",   emoji:"📺", sector:"Retail",         potencial:"Alta",  dificultad:"Fácil",    resumen:"Ventas en directo por Instagram o TikTok con descuentos exclusivos en tiempo real.", por_que:"En China mueve 600.000M$. En EE.UU. supera 50.000M$ y crece 30% anual.", como_aplicar:"En España el live commerce está en fase inicial. Quien domine TikTok ahora tiene ventaja de primer movimiento.", riesgos:["Requiere comodidad ante cámara","Gestión de stock en tiempo real","Algoritmos pueden cambiar"], pasos:["TikTok para jóvenes, Instagram para adultos","2 directos semanales de 45 min","10-15 productos con descuento exclusivo","Colaborar con otro creador"] },
  { id:17, nombre:"Gestión de Alquiler Vacacional",      emoji:"🏡", sector:"Servicios",     potencial:"Alta",  dificultad:"Fácil",    resumen:"Gestión integral de pisos de Airbnb: check-in, limpieza, precios dinámicos y atención.", por_que:"Vacasa vale 500M$+. El propietario quiere ingresos sin trabajo. La gestión profesional sube ocupación y precio.", como_aplicar:"España es el segundo destino turístico mundial. Millones de pisos en Airbnb están mal gestionados.", riesgos:["Regulación cambia por ciudad","Personal difícil en temporada","Un mal huésped arruina la relación"], pasos:["Empezar con 5-10 propiedades de conocidos","Software: Hostaway o Lodgify","Acuerdo con empresa de limpieza","Pricing dinámico con PriceLabs"] },
  { id:18, nombre:"Fotografía Inmobiliaria con Dron",    emoji:"📸", sector:"Servicios",     potencial:"Alta",  dificultad:"Fácil",    resumen:"Fotografía profesional, vídeo con dron y tour virtual 360° para inmobiliarias.", por_que:"Las inmobiliarias con fotografía profesional venden un 32% más rápido. Matterport lidera con millones de propiedades.", como_aplicar:"La mayoría de fotos en Idealista son pésimas. Una empresa especializada a 150-400€ por propiedad tiene demanda inmediata.", riesgos:["Equipo y dron con coste inicial","Licencia AESA","Hay que fidelizar a la inmobiliaria"], pasos:["Licencia en AESA","Cámara full-frame + dron DJI","Suscripción a Matterport","Visitar inmobiliarias con portfolio"] },
  { id:19, nombre:"Tutorías Online IA + Humano",         emoji:"📚", sector:"Educación",     potencial:"Alta",  dificultad:"Moderada", resumen:"La IA detecta lagunas del alumno y un tutor humano las trabaja en sesiones personalizadas.", por_que:"Khan Academy y Varsity Tutors tienen millones de usuarios. IA + humano tiene resultados superiores.", como_aplicar:"España tiene 8M de estudiantes de ESO. El mercado de academias es enorme pero poco tecnificado.", riesgos:["Captación costosa","Resultados difíciles de atribuir","Competencia de Smartick"], pasos:["Empezar con Matemáticas de ESO","Tutores universitarios a 12-18€/hora","Diagnóstico inicial gratuito","Grupos de padres en WhatsApp"] },
  { id:20, nombre:"Academia de Finanzas Personales",     emoji:"💰", sector:"Educación",     potencial:"Alta",  dificultad:"Fácil",    resumen:"Cursos y comunidad para gestionar dinero, invertir y planificar la jubilación.", por_que:"Ramsey Solutions genera más de 300M$. La educación financiera tiene demanda masiva entre millennials.", como_aplicar:"España tiene cultura financiera muy baja. Un programa de 90 días a 197-497€ con comunidad tiene propuesta clara.", riesgos:["No puedes asesorar sin licencia CNMV","Credibilidad del instructor fundamental","YouTube compite directamente"], pasos:["Contenido gratuito 6 meses primero","Curso 90 días: presupuesto → ahorro → inversión","Diferenciarse de asesoramiento","Comunidad Discord"] },
  { id:21, nombre:"Formación en Oficios del Futuro",     emoji:"⚡", sector:"Educación",     potencial:"Alta",  dificultad:"Moderada", resumen:"Cursos certificados para instaladores de paneles solares y técnicos de la transición energética.", por_que:"Con la transición energética faltan cientos de miles de técnicos. Las empresas pagan formación porque no encuentran profesionales.", como_aplicar:"España tiene objetivo de 74% de renovables en 2030. Faltan instaladores cualificados.", riesgos:["Certificaciones lentas","Contenido técnico requiere expertos","Cambio tecnológico rápido"], pasos:["Alianza con fabricante de paneles","80% presencial en instalaciones reales","B2B primero","Subvenciones del SEPE"] },
  { id:22, nombre:"Energía Solar Comunitaria",           emoji:"☀️", sector:"Sostenibilidad",potencial:"Alta",  dificultad:"Difícil",  resumen:"Comunidades de propietarios que comparten instalación solar y reparten el ahorro.", por_que:"En EE.UU. las solar communities han reducido la factura de millones de hogares.", como_aplicar:"España tiene 2.800 horas de sol y facturas muy altas. La normativa ya lo permite. Falta el intermediario.", riesgos:["Aprobación de comunidad lenta","Inversión inicial alta","Trámites con distribuidoras complejos"], pasos:["Especializarse en autoconsumo comunitario","Acuerdo con instalador solar","Modelo 0€ entrada con cuota < ahorro","Administradores de fincas como canal"] },
  { id:23, nombre:"Reparación de Electrónica",           emoji:"🔌", sector:"Sostenibilidad",potencial:"Alta",  dificultad:"Fácil",    resumen:"Servicio de reparación de móviles y electrodomésticos contra la obsolescencia programada.", por_que:"iFixit ha construido un movimiento en torno al derecho a reparar. La normativa europea obliga a facilitar piezas.", como_aplicar:"España desecha 900.000 toneladas de residuos electrónicos al año. Precio transparente + garantía + recogida a domicilio.", riesgos:["Técnicos cualificados difíciles de retener","Proveedores de piezas no fiables","Fabricantes que dificultan el acceso"], pasos:["Empezar con móviles y portátiles","Certificarse como SAT de 2-3 marcas","Recogida a domicilio","Precio fijo online antes de confirmar"] },
  { id:24, nombre:"Gestión de Residuos para Hostelería", emoji:"🍃", sector:"Sostenibilidad",potencial:"Alta",  dificultad:"Moderada", resumen:"Ayuda a bares y restaurantes a separar y valorizar residuos cumpliendo normativa.", por_que:"Rubicon gestiona residuos de miles de restaurantes. La normativa obliga pero nadie sabe cómo cumplirla.", como_aplicar:"Nueva normativa obliga a gestionar aceite, orgánico y envases. Servicio todo incluido a 50-150€/mes.", riesgos:["Logística de recogida","Regulación varía por comunidad","Margen ajustado"], pasos:["Estudiar normativa local","Empezar con recogida de aceite","Acuerdo con gestores autorizados","Puerta a puerta en polígonos de hostelería"] },
];

const SECTORES = ["Todos","Food & Drink","Fitness","Salud","Tech","Retail","Servicios","Educación","Sostenibilidad"];
const SECTOR_ICON = {"Todos":"🌎","Food & Drink":"🍽️","Fitness":"💪","Salud":"🩺","Tech":"💻","Retail":"🛍️","Servicios":"🤝","Educación":"🎓","Sostenibilidad":"🌱"};
const POT_STYLE  = { Alta:{ bg:"rgba(74,222,128,0.12)",  color:"#4ade80" }, Media:{ bg:"rgba(251,191,36,0.12)", color:"#fbbf24" }, Baja:{ bg:"rgba(248,113,113,0.12)", color:"#f87171" } };
const DIF_STYLE  = { "Fácil":{ bg:"rgba(129,140,248,0.12)", color:"#818cf8" }, Moderada:{ bg:"rgba(251,191,36,0.12)", color:"#fbbf24" }, "Difícil":{ bg:"rgba(248,113,113,0.12)", color:"#f87171" } };

const Pill = ({ label, map }) => {
  const s = map[label] || { bg:"rgba(255,255,255,0.05)", color:"#8a8680" };
  return (
    <span style={{ background:s.bg, color:s.color, fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:99, display:"inline-block" }}>
      {label}
    </span>
  );
};

// ── AI CHAT ──────────────────────────────────────────────────────────────────
function AIChat({ trend, isPro, aiQuestionsLeft, onUseAiQuestion, onPaywall }) {
  const [input, setInput]     = useState("");
  const [messages, setMessages] = useState([
    { role:"assistant", content:`Hola, soy tu analista de mercado IA. Estoy especializado en **${trend.nombre}** y en cómo llevarlo a España. ¿Qué quieres saber?` }
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, loading]);

  const canAsk = isPro || aiQuestionsLeft > 0;

  const send = async () => {
    if (!input.trim() || loading) return;
    if (!canAsk) { onPaywall(); return; }

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role:"user", content:userMsg }]);
    if (!isPro) onUseAiQuestion();
    setLoading(true);

    try {
      const systemPrompt = `Eres un analista experto en tendencias de negocio entre EE.UU. y España. El usuario está analizando esta oportunidad:

Nombre: ${trend.nombre}
Sector: ${trend.sector}
Resumen: ${trend.resumen}
Por qué funciona en EE.UU.: ${trend.por_que}
Cómo aplicarlo en España: ${trend.como_aplicar}
Riesgos: ${trend.riesgos.join(", ")}
Primeros pasos: ${trend.pasos.join(", ")}

Responde de forma concisa, práctica y directa. Máximo 3 párrafos. En español. Usa datos reales cuando los conozcas.`;

      const history = messages.map(m => ({ role:m.role, content:m.content }));
      history.push({ role:"user", content:userMsg });

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "content-type":"application/json", "anthropic-version":"2023-06-01" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: history,
        }),
      });

      const data = await res.json();
      const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("") || "No pude obtener respuesta. Inténtalo de nuevo.";
      setMessages(prev => [...prev, { role:"assistant", content:text }]);
    } catch {
      setMessages(prev => [...prev, { role:"assistant", content:"Error de conexión. Inténtalo de nuevo." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ borderTop:`1px solid ${C.border}`, marginTop:20, paddingTop:20 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:16 }}>🤖</span>
          <p style={{ fontSize:12, fontWeight:700, color:C.gold, margin:0, textTransform:"uppercase", letterSpacing:"0.08em" }}>Analista IA</p>
        </div>
        {!isPro && (
          <span style={{ fontSize:11, color:aiQuestionsLeft > 0 ? C.amber : C.red, fontWeight:600 }}>
            {aiQuestionsLeft > 0 ? `${aiQuestionsLeft} pregunta gratis` : "Sin preguntas gratuitas"}
          </span>
        )}
      </div>

      <div style={{ background:C.bg, borderRadius:12, padding:14, marginBottom:12, maxHeight:280, overflowY:"auto", display:"flex", flexDirection:"column", gap:10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display:"flex", justifyContent:m.role==="user" ? "flex-end" : "flex-start" }}>
            <div style={{
              background: m.role==="user" ? `linear-gradient(135deg,${C.gold},${C.goldLight})` : C.card,
              color: m.role==="user" ? "#0d0d0f" : C.text,
              padding:"10px 14px", borderRadius:12, maxWidth:"85%", fontSize:13, lineHeight:1.6,
              fontWeight: m.role==="user" ? 600 : 400,
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display:"flex", justifyContent:"flex-start" }}>
            <div style={{ background:C.card, padding:"10px 16px", borderRadius:12, color:C.textMuted, fontSize:13 }}>
              ✦ Analizando...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {canAsk ? (
        <div style={{ display:"flex", gap:8 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder={isPro ? "Pregunta lo que quieras..." : "1 pregunta gratis — escribe aquí"}
            style={{ flex:1, background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", fontSize:13, color:C.text, outline:"none" }}
          />
          <button onClick={send} disabled={loading || !input.trim()}
            style={{ background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, border:"none", borderRadius:10, padding:"10px 16px", cursor:"pointer", fontSize:16, opacity:loading||!input.trim() ? 0.5 : 1 }}>
            ➤
          </button>
        </div>
      ) : (
        <button onClick={onPaywall}
          style={{ width:"100%", background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, border:"none", borderRadius:12, padding:14, fontSize:14, fontWeight:700, cursor:"pointer", color:"#0d0d0f" }}>
          🔓 Hazte Pro para preguntas ilimitadas — 5€/mes
        </button>
      )}
    </div>
  );
}

// ── PAYWALL MODAL ─────────────────────────────────────────────────────────────
function PaywallModal({ onClose }) {
  const successUrl = typeof window !== "undefined"
    ? `${window.location.origin}${window.location.pathname}?token=${SECRET_TOKEN}`
    : "";
  const url = `${STRIPE_PAYMENT_LINK}?success_url=${encodeURIComponent(successUrl)}`;

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:60, background:"rgba(0,0,0,0.8)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background:C.surface, border:`1px solid ${C.borderGold}`, borderRadius:24, padding:28, width:"100%", maxWidth:400, textAlign:"center", boxShadow:`0 0 60px rgba(201,168,76,0.15)` }}>
        <div style={{ fontSize:52, marginBottom:8 }}>✦</div>
        <h2 style={{ fontSize:22, fontWeight:800, color:C.gold, margin:"0 0 6px" }}>TrendSpain Pro</h2>
        <p style={{ fontSize:14, color:C.textMuted, lineHeight:1.6, margin:"0 0 4px" }}>Accede a todo sin límites</p>
        <p style={{ fontSize:32, fontWeight:800, color:C.text, margin:"14px 0" }}>
          5€<span style={{ fontSize:14, fontWeight:400, color:C.textMuted }}>/mes</span>
        </p>
        <div style={{ background:C.card, borderRadius:14, padding:16, marginBottom:20, textAlign:"left" }}>
          {[
            "✦ 24 oportunidades de negocio completas",
            "✦ Análisis profundo por qué funciona en EE.UU.",
            "✦ Plan paso a paso adaptado a España",
            "✦ Chat con IA analista ilimitado",
            "✦ Nuevas oportunidades cada mes",
            "✦ Cancela cuando quieras",
          ].map((item, i) => (
            <p key={i} style={{ fontSize:13, color:C.text, margin:"0 0 8px", fontWeight:500 }}>{item}</p>
          ))}
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer"
          style={{ display:"block", background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, color:"#0d0d0f", padding:16, borderRadius:14, fontSize:16, fontWeight:800, textDecoration:"none", marginBottom:10 }}>
          Suscribirme — 5€/mes →
        </a>
        <p style={{ fontSize:11, color:C.textDim, margin:"0 0 10px" }}>Pago seguro con Stripe · Cancela cuando quieras</p>
        <button onClick={onClose} style={{ background:"none", border:"none", color:C.textMuted, fontSize:13, cursor:"pointer" }}>Ahora no</button>
      </div>
    </div>
  );
}

// ── SUCCESS MODAL ─────────────────────────────────────────────────────────────
function SuccessModal({ onClose }) {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:70, background:"rgba(0,0,0,0.85)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:C.surface, border:`1px solid ${C.borderGold}`, borderRadius:24, padding:32, width:"100%", maxWidth:360, textAlign:"center", boxShadow:`0 0 80px rgba(201,168,76,0.2)` }}>
        <div style={{ fontSize:56, marginBottom:12 }}>🎉</div>
        <h2 style={{ fontSize:22, fontWeight:800, color:C.gold, margin:"0 0 8px" }}>¡Bienvenido a Pro!</h2>
        <p style={{ fontSize:14, color:C.textMuted, lineHeight:1.6, margin:"0 0 20px" }}>Ya tienes acceso completo a las 24 oportunidades y al chat con IA.</p>
        <button onClick={onClose}
          style={{ width:"100%", background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, color:"#0d0d0f", border:"none", borderRadius:14, padding:16, fontSize:16, fontWeight:800, cursor:"pointer" }}>
          Explorar ahora →
        </button>
      </div>
    </div>
  );
}

// ── TREND MODAL ───────────────────────────────────────────────────────────────
function TrendModal({ t, onClose, isPro, aiQuestionsLeft, onUseAiQuestion, onPaywall }) {
  if (!t) return null;
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:50, background:"rgba(0,0,0,0.75)", display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background:C.surface, width:"100%", maxWidth:600, borderRadius:"20px 20px 0 0", padding:"20px 20px 40px", overflowY:"auto", maxHeight:"92vh", border:`1px solid ${C.border}`, borderBottom:"none" }}>
        <div style={{ width:36, height:4, background:C.border, borderRadius:99, margin:"0 auto 20px" }} />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
          <div style={{ flex:1 }}>
            <p style={{ fontSize:10, fontWeight:700, color:C.gold, textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 4px" }}>{t.sector}</p>
            <h2 style={{ fontSize:20, fontWeight:800, color:C.text, margin:0, lineHeight:1.2 }}>{t.emoji} {t.nombre}</h2>
          </div>
          <button onClick={onClose} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:8, padding:"6px 10px", cursor:"pointer", fontSize:14, color:C.textMuted, marginLeft:10 }}>✕</button>
        </div>

        <div style={{ display:"flex", gap:6, marginBottom:16 }}>
          <Pill label={t.potencial} map={POT_STYLE} />
          <Pill label={t.dificultad} map={DIF_STYLE} />
        </div>

        <p style={{ fontSize:13, color:C.textMuted, lineHeight:1.7, marginBottom:18 }}>{t.resumen}</p>

        {[
          { title:"🇺🇸 Por qué funciona en EE.UU.", content:t.por_que },
          { title:"🇪🇸 Cómo aplicarlo en España",  content:t.como_aplicar },
        ].map(({ title, content }) => (
          <div key={title} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:16, marginBottom:12 }}>
            <p style={{ fontSize:10, fontWeight:700, color:C.gold, textTransform:"uppercase", letterSpacing:"0.08em", margin:"0 0 8px" }}>{title}</p>
            <p style={{ fontSize:13, color:C.text, lineHeight:1.7, margin:0 }}>{content}</p>
          </div>
        ))}

        <div style={{ marginBottom:14 }}>
          <p style={{ fontSize:10, fontWeight:700, color:C.red, textTransform:"uppercase", letterSpacing:"0.08em", margin:"0 0 10px" }}>⚠ Riesgos</p>
          {t.riesgos.map((r, i) => (
            <div key={i} style={{ display:"flex", gap:10, marginBottom:7 }}>
              <span style={{ color:C.red, fontSize:12, marginTop:2 }}>✕</span>
              <p style={{ fontSize:13, color:C.textMuted, margin:0, lineHeight:1.5 }}>{r}</p>
            </div>
          ))}
        </div>

        <div style={{ background:C.goldBg, border:`1px solid rgba(201,168,76,0.2)`, borderRadius:12, padding:16, marginBottom:4 }}>
          <p style={{ fontSize:10, fontWeight:700, color:C.gold, textTransform:"uppercase", letterSpacing:"0.08em", margin:"0 0 10px" }}>✦ Primeros pasos</p>
          {t.pasos.map((p, i) => (
            <div key={i} style={{ display:"flex", gap:10, marginBottom:9 }}>
              <span style={{ background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, color:"#0d0d0f", fontWeight:800, fontSize:11, width:22, height:22, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{i+1}</span>
              <p style={{ fontSize:13, color:C.text, margin:0, lineHeight:1.5 }}>{p}</p>
            </div>
          ))}
        </div>

        <AIChat
          trend={t}
          isPro={isPro}
          aiQuestionsLeft={aiQuestionsLeft}
          onUseAiQuestion={onUseAiQuestion}
          onPaywall={onPaywall}
        />
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [sector, setSector]   = useState("Todos");
  const [query, setQuery]     = useState("");
  const [selected, setSelected] = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isPro, setIsPro]     = useState(false);
  const [tokensLeft, setTokensLeft] = useState(() => {
    try { const s = sessionStorage.getItem("ts_tokens_left"); return s !== null ? parseInt(s) : FREE_TOKENS; } catch { return FREE_TOKENS; }
  });
  const [aiQuestionsLeft, setAiQuestionsLeft] = useState(() => {
    try { const s = sessionStorage.getItem("ts_ai_left"); return s !== null ? parseInt(s) : FREE_AI_QUESTIONS; } catch { return FREE_AI_QUESTIONS; }
  });

  useEffect(() => {
    const params    = new URLSearchParams(window.location.search);
    const urlToken  = params.get("token");
    const savedToken = sessionStorage.getItem("ts_pro_token");
    if (urlToken === SECRET_TOKEN || savedToken === SECRET_TOKEN) {
      setIsPro(true);
      if (urlToken === SECRET_TOKEN) {
        sessionStorage.setItem("ts_pro_token", SECRET_TOKEN);
        setShowSuccess(true);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  const filtered = useMemo(() => TRENDS.filter(t => {
    const ms = sector === "Todos" || t.sector === sector;
    const mq = !query || t.nombre.toLowerCase().includes(query.toLowerCase()) || t.resumen.toLowerCase().includes(query.toLowerCase());
    return ms && mq;
  }), [sector, query]);

  const handleCard = (t) => {
    if (isPro) { setSelected(t); return; }
    if (tokensLeft <= 0) { setShowPaywall(true); return; }
    const n = tokensLeft - 1;
    setTokensLeft(n);
    try { sessionStorage.setItem("ts_tokens_left", n); } catch {}
    setSelected(t);
  };

  const handleUseAiQuestion = () => {
    const n = Math.max(0, aiQuestionsLeft - 1);
    setAiQuestionsLeft(n);
    try { sessionStorage.setItem("ts_ai_left", n); } catch {}
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"system-ui,-apple-system,sans-serif", color:C.text }}>

      {/* ── HEADER ── */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"18px 16px 0", position:"sticky", top:0, zIndex:40 }}>
        <div style={{ maxWidth:680, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:36, height:36, background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🌎</div>
              <div>
                <p style={{ fontSize:9, fontWeight:700, color:C.gold, textTransform:"uppercase", letterSpacing:"0.12em", margin:0 }}>Radar de Oportunidades</p>
                <h1 style={{ fontSize:20, fontWeight:800, color:C.text, margin:0, letterSpacing:"-0.02em" }}>TrendSpain</h1>
              </div>
            </div>
            {isPro
              ? <span style={{ background:C.greenBg, color:C.green, fontSize:12, fontWeight:700, padding:"6px 14px", borderRadius:99, border:`1px solid rgba(74,222,128,0.2)` }}>✦ Pro activo</span>
              : <button onClick={() => setShowPaywall(true)} style={{ background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, color:"#0d0d0f", border:"none", borderRadius:10, padding:"9px 16px", fontSize:12, fontWeight:800, cursor:"pointer" }}>
                  ✦ Pro — 5€/mes
                </button>
            }
          </div>
          <p style={{ fontSize:12, color:C.textDim, margin:"0 0 14px 48px" }}>Negocios que triunfan en EE.UU. y aún no han llegado a España</p>

          {/* Freemium banner */}
          {!isPro && (
            <div style={{ background:tokensLeft>0 ? C.goldBg : C.redBg, border:`1px solid ${tokensLeft>0 ? "rgba(201,168,76,0.25)" : "rgba(248,113,113,0.25)"}`, borderRadius:12, padding:"10px 14px", marginBottom:14, display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 }}>
              <div>
                <p style={{ fontSize:12, color:tokensLeft>0 ? C.gold : C.red, margin:0, fontWeight:700 }}>
                  {tokensLeft>0 ? `✦ ${tokensLeft} ficha${tokensLeft!==1?"s":""} gratis disponible${tokensLeft!==1?"s":""}` : "✕ Sin fichas gratuitas"}
                </p>
                <p style={{ fontSize:11, color:C.textMuted, margin:"2px 0 0" }}>
                  {tokensLeft>0 ? "Cada ficha abre el análisis completo de 1 negocio" : "Hazte Pro para acceso ilimitado + IA analista"}
                </p>
              </div>
              <button onClick={() => setShowPaywall(true)} style={{ background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, color:"#0d0d0f", border:"none", borderRadius:8, padding:"7px 14px", fontSize:11, fontWeight:800, cursor:"pointer", whiteSpace:"nowrap" }}>
                Ver todo
              </button>
            </div>
          )}

          {/* Search */}
          <div style={{ position:"relative", marginBottom:14 }}>
            <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:C.textDim, fontSize:14 }}>🔍</span>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar oportunidad…"
              style={{ width:"100%", padding:"10px 12px 10px 36px", background:C.card, border:`1px solid ${C.border}`, borderRadius:12, fontSize:14, color:C.text, outline:"none", boxSizing:"border-box" }} />
          </div>

          {/* Sector tabs */}
          <div style={{ display:"flex", overflowX:"auto", gap:0, scrollbarWidth:"none" }}>
            {SECTORES.map(s => (
              <button key={s} onClick={() => setSector(s)}
                style={{ padding:"10px 11px", fontSize:11, fontWeight:600, border:"none", background:"none", cursor:"pointer", whiteSpace:"nowrap",
                  borderBottom: sector===s ? `2px solid ${C.gold}` : "2px solid transparent",
                  color: sector===s ? C.gold : C.textMuted }}>
                {SECTOR_ICON[s]} {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CARDS ── */}
      <div style={{ maxWidth:680, margin:"0 auto", padding:16 }}>
        <p style={{ fontSize:12, color:C.textDim, marginBottom:14 }}>
          <span style={{ fontWeight:700, color:C.text }}>{filtered.length}</span> oportunidades
          {!isPro && tokensLeft > 0 && <> · <span style={{ color:C.gold }}>✦ {tokensLeft} ficha{tokensLeft!==1?"s":""}</span></>}
          {!isPro && tokensLeft === 0 && <> · <span style={{ color:C.red }}>sin fichas — <span style={{ cursor:"pointer", textDecoration:"underline" }} onClick={() => setShowPaywall(true)}>hazte Pro</span></span></>}
        </p>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))", gap:12 }}>
          {filtered.map(t => {
            const locked = !isPro && tokensLeft === 0;
            return (
              <button key={t.id} onClick={() => handleCard(t)}
                style={{ textAlign:"left", background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:18, cursor:"pointer", transition:"all 0.2s", position:"relative", opacity:locked?0.6:1 }}
                onMouseEnter={e => { if(!locked){ e.currentTarget.style.borderColor=C.borderGold; e.currentTarget.style.boxShadow=`0 4px 24px rgba(201,168,76,0.08)`; }}}
                onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.boxShadow="none"; }}>

                {!isPro && (
                  <div style={{ position:"absolute", top:12, right:12, background:locked?C.redBg:C.goldBg, borderRadius:99, padding:"2px 9px", fontSize:10, fontWeight:700, color:locked?C.red:C.gold, border:`1px solid ${locked?"rgba(248,113,113,0.2)":"rgba(201,168,76,0.2)"}` }}>
                    {locked ? "🔒 Pro" : "✦ -1 ficha"}
                  </div>
                )}

                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                  <div style={{ paddingRight:60 }}>
                    <p style={{ fontSize:9, fontWeight:700, color:C.gold, textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 4px" }}>{t.sector}</p>
                    <h3 style={{ fontSize:15, fontWeight:700, color:C.text, margin:0, lineHeight:1.3 }}>{t.nombre}</h3>
                  </div>
                  <span style={{ fontSize:26, flexShrink:0 }}>{t.emoji}</span>
                </div>

                <p style={{ fontSize:12, color:C.textMuted, lineHeight:1.6, margin:"0 0 14px", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{t.resumen}</p>

                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  <Pill label={t.potencial} map={POT_STYLE} />
                  <Pill label={t.dificultad} map={DIF_STYLE} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── MODALS ── */}
      <TrendModal
        t={selected}
        onClose={() => setSelected(null)}
        isPro={isPro}
        aiQuestionsLeft={aiQuestionsLeft}
        onUseAiQuestion={handleUseAiQuestion}
        onPaywall={() => { setSelected(null); setShowPaywall(true); }}
      />
      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}
      {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}
    </div>
  );
}


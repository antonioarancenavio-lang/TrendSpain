import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

// ─── CONFIGURACIÓN ────────────────────────────────────────────────────────────
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/TU_LINK_REAL_AQUI";
const SECRET_TOKEN        = "ts_unlock_2025";
const FREE_TOKENS         = 2;
// ─────────────────────────────────────────────────────────────────────────────

const C = {
  bg:         "#0a0a0c",
  surface:    "#111114",
  card:       "#18181c",
  cardHover:  "#1e1e23",
  border:     "#252529",
  borderGold: "#c9a84c",
  gold:       "#c9a84c",
  goldLight:  "#e8c96a",
  goldBg:     "rgba(201,168,76,0.07)",
  goldBorder: "rgba(201,168,76,0.2)",
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

function TarjetaOportunidad({ trend }) {
  // Ajustamos la lógica con tus variables reales del inicio del archivo
  const tokensGratis = 0; // Cambia a 0 para ver cómo se bloquean, o usa tu estado dinámico
  const haPagado = false;

  // Si es premium y no se ha pagado ni quedan tokens, se bloquea
  const tieneAcceso = !trend.isPremium || haPagado || tokensGratis > 0;
  const stripeLink = "https://buy.stripe.com/TU_LINK_REAL_AQUI";

  return (
    <div 
      style={{ backgroundColor: C.card, borderColor: C.border }} 
      className="border rounded-2xl p-5 text-white relative overflow-hidden transition-all duration-200 hover:translate-y-[-2px] flex flex-col justify-between min-h-[260px] shadow-lg"
    >
      <div>
        {/* Cabecera sutil: Inversión y Tiempo */}
        <div className="flex justify-between items-center mb-3 text-[11px]">
          <span 
            style={{ color: C.gold }} 
            className="font-bold uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded"
          >
            {trend.inversion || "Bajo Coste"}
          </span>
          {trend.tiempo && (
            <span style={{ color: C.textMuted }} className="flex items-center gap-1 opacity-80">
              ⏱️ {trend.tiempo}
            </span>
          )}
        </div>

        {/* Título fino con su Emoji */}
        <h3 style={{ color: C.text }} className="text-lg font-bold tracking-tight mb-1 flex items-center gap-1.5">
          <span className="text-xl">{trend.emoji || "💡"}</span>
          <span>{trend.nombre}</span>
        </h3>

        {/* Subtítulo de herramientas */}
        <p className="text-xs mb-3" style={{ color: C.textMuted }}>
          <span className="font-semibold" style={{ color: C.goldLight }}>Herramientas:</span> {trend.herramientas}
        </p>

        {/* Línea divisoria muy fina */}
        <div style={{ borderColor: C.border }} className="border-t my-2 opacity-30" />

        {/* Contenido / Plan de acción con Paywall */}
        <div className="relative mt-2">
          <div className={`transition-all duration-300 ${!tieneAcceso ? 'blur-[5px] select-none pointer-events-none opacity-10' : ''}`}>
            <span style={{ color: C.gold }} className="text-[11px] font-bold uppercase tracking-wider block mb-1">
              🎯 Plan de Acción:
            </span>
            <p style={{ color: C.textMuted }} className="text-xs leading-relaxed font-normal">
              {trend.estrategia}
            </p>
          </div>

          {/* Capa de Bloqueo Premium */}
          {!tieneAcceso && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center bg-black/40 backdrop-blur-[3px] rounded-xl">
              <span className="text-xl mb-1">🔒</span>
              <p style={{ color: C.text }} className="text-xs font-bold mb-2 tracking-tight">
                Contenido exclusivo PRO
              </p>
              <a 
                href={stripeLink}
                style={{ backgroundColor: C.gold, color: C.bg }}
                className="font-bold text-[10px] py-1.5 px-4 rounded-full transition-transform hover:scale-105 shadow-md uppercase tracking-wider"
              >
                Desbloquear
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Pie de tarjeta estético para cuadrar espacios */}
      <div className="mt-4 flex justify-between items-center text-[10px] opacity-60" style={{ color: C.textMuted }}>
        <span>TrendSpain PRO</span>
        <span style={{ color: C.gold }}>⭐</span>
      </div>
    </div>
  );
}
const TRENDS = [
  { id:1,  nombre:"Dark Kitchen con Suscripción",        emoji:"🍱", sector:"Food & Drink",    potencial:"Alta",  dificultad:"Fácil",    resumen:"Cocinas fantasma con planes de comida semanal por suscripción, sin local físico.", por_que:"En EE.UU. el modelo dark kitchen explotó post-COVID. Añadir suscripción mensual garantiza ingresos recurrentes y reduce el desperdicio.", como_aplicar:"España tiene cultura gastronómica altísima pero poca oferta de comida saludable por suscripción. Ciudades medianas como Valencia o Bilbao son ideales.", riesgos:["Logística propia o dependencia de Glovo/Uber","Fidelización difícil si la calidad baja","Regulación sanitaria estricta"], pasos:["Alquilar espacio en una cloud kitchen","Definir nicho: vegano, mediterráneo o menú ejecutivo","Lanzar con 50 suscriptores piloto","Automatizar pedidos con Shopify"] },
  { id:2,  nombre:"Clínicas de Salud Mental Online",     emoji:"🧠", sector:"Salud",            potencial:"Alta",  dificultad:"Moderada", resumen:"Plataformas que conectan psicólogos con pacientes por videollamada.", por_que:"BetterHelp factura más de 700M$ anuales. La pandemia normalizó la terapia online y la demanda no ha bajado.", como_aplicar:"España tiene lista de espera de meses en salud mental pública. Diferenciarse por especialidad y precio accesible es la clave.", riesgos:["Necesitas psicólogos colegiados","Competencia de apps internacionales","Retención si el paciente prefiere presencial"], pasos:["Montar plataforma con Calendly + Stripe + Zoom","Reclutar 5-10 psicólogos autónomos","Nicho inicial: ansiedad laboral B2B","Certificar cumplimiento LOPD/RGPD"] },
  { id:3,  nombre:"Lavanderías Self-Service Premium",    emoji:"🧺", sector:"Servicios",        potencial:"Alta",  dificultad:"Fácil",    resumen:"Lavanderías automatizadas 24h con app, pago sin efectivo y experiencia de marca cuidada.", por_que:"En EE.UU. Wash Club convirtió algo mundano en experiencia premium. El ticket medio sube 3x.", como_aplicar:"España tiene muchas lavanderías antiguas sin renovar. Ciudades universitarias y zonas turísticas son el target perfecto.", riesgos:["Inversión inicial en maquinaria (30-60k€)","Mantenimiento constante","Ubicación es crítica"], pasos:["Estudiar zonas universitarias o turísticas","Negociar leasing de máquinas","Desarrollar app sencilla","Diseñar local con identidad visual"] },
  { id:4,  nombre:"Academias de Padel Indoor Premium",   emoji:"🎾", sector:"Fitness",          potencial:"Alta",  dificultad:"Difícil",  resumen:"Centros de padel cubiertos con entrenamiento personalizado y tecnología de análisis.", por_que:"El padel explotó en España pero el modelo de negocio es anticuado. En EE.UU. los sports clubs premium generan ingresos 5x superiores.", como_aplicar:"España lidera el padel mundial con 6M de jugadores pero instalaciones básicas. Un modelo premium con membresía tiene enorme diferenciación.", riesgos:["Alta inversión en instalaciones cubiertas","Mercado competido en grandes ciudades","Estacionalidad si no es indoor"], pasos:["Buscar nave de 1.500m² en ciudad mediana","Asociarse con entrenadores locales","Membresía fundadores con descuento","Cámaras de análisis de juego"] },
  { id:5,  nombre:"Concierge para Personas Mayores",     emoji:"👴", sector:"Servicios",        potencial:"Alta",  dificultad:"Fácil",    resumen:"Asistencia personal para mayores: médicos, trámites, compras, tecnología y acompañamiento.", por_que:"En EE.UU. Papa Inc. vale cientos de millones. El envejecimiento crea demanda creciente e inagotable.", como_aplicar:"España tiene la segunda población más envejecida de Europa. Familias que no pueden cuidar a sus mayores pagan bien por tranquilidad.", riesgos:["Confianza difícil de ganar","Personal muy bien seleccionado","Regulación laboral específica"], pasos:["Definir catálogo de servicios concretos","Certificar selección de asistentes","Captar clientes por médicos y farmacias","Suscripción mensual 150-300€"] },
  { id:6,  nombre:"Renting de Ropa por Suscripción",     emoji:"👗", sector:"Retail",           potencial:"Media", dificultad:"Difícil",  resumen:"Alquiler mensual de ropa de marca — la llevas, la devuelves, siempre ropa nueva.", por_que:"Rent the Runway alcanzó 2.000M$ de valoración. La generación millennial prefiere acceso a propiedad.", como_aplicar:"España tiene cultura de moda fuerte. Nicho inicial: ropa de trabajo para mujeres profesionales.", riesgos:["Logística de limpieza compleja","Capital para stock inicial","Tasa de abandono alta"], pasos:["Empezar con nicho específico (vestidos de evento)","Acuerdo con tintorería local","Instagram + WhatsApp para empezar","30-50 prendas y 20 suscriptoras piloto"] },
  { id:7,  nombre:"Bares de Zumo en Frío",               emoji:"🥤", sector:"Food & Drink",    potencial:"Alta",  dificultad:"Fácil",    resumen:"Tiendas de zumos prensados en frío, shots de bienestar y batidos funcionales.", por_que:"Pressed Juicery factura 100M$+ en EE.UU. Ticket alto y margen también.", como_aplicar:"En España el concepto existe fragmentado. Una cadena de 3-5 locales en zonas fitness tiene enorme diferenciación.", riesgos:["Producto perecedero (vida 3-5 días)","Maquinaria cara (15-30k€)","Estacionalidad en invierno"], pasos:["Ubicaciones cerca de gimnasios","Venta online para validar","Suscripción semanal de jugos","Certificar proceso APPCC"] },
  { id:8,  nombre:"Meal Prep Delivery Fitness",          emoji:"💪", sector:"Food & Drink",    potencial:"Alta",  dificultad:"Moderada", resumen:"Comidas semanales listas para calentar, diseñadas por nutricionistas, para el público fitness.", por_que:"Factor75 y Trifecta crecen 40% anual. El cliente fitness quiere comer bien sin cocinar.", como_aplicar:"Mercado fitness español enorme. Falta un servicio de meal prep serio con macros calculados.", riesgos:["Logística de refrigeración compleja","Competencia de grandes marcas","Márgenes ajustados"], pasos:["Contratar nutricionista","Reparto local para empezar","3 planes: perder peso, ganar músculo, mantenimiento","Instagram y TikTok como canal"] },
  { id:9,  nombre:"Estudios Boutique por App",           emoji:"🏋️", sector:"Fitness",         potencial:"Alta",  dificultad:"Moderada", resumen:"Pequeños estudios de HIIT, yoga o pilates reservables 100% por app.", por_que:"SoulCycle y Orangetheory: la gente paga 30-40$/clase si la experiencia es premium.", como_aplicar:"España tiene pocos estudios boutique con experiencia de marca. Barcelona, Madrid o Málaga tienen público dispuesto a pagar.", riesgos:["Inversión en equipamiento","Ocupación mínima para rentabilidad","Fidelización depende del instructor"], pasos:["Especializarse en un solo formato","App de reservas desde día 1","Instructor con seguidores propios","Membresías fundadoras"] },
  { id:10, nombre:"Clínicas de Recuperación Deportiva",  emoji:"🧊", sector:"Fitness",         potencial:"Alta",  dificultad:"Moderada", resumen:"Centros con crioterapia, baños de hielo y sauna para deportistas amateur.", por_que:"Restore Hyper Wellness tiene más de 200 locales. El deportista amateur quiere las herramientas de los profesionales.", como_aplicar:"En España pocas opciones accesibles. Una clínica cerca de zonas deportivas con membresía mensual tiene diferenciación clara.", riesgos:["Equipamiento muy caro","Personal con formación","Mercado en fase educativa"], pasos:["Empezar con baños de hielo y sauna","Ubicarse junto a gimnasio","Acuerdo con fisioterapeutas","Contenido educativo en redes"] },
  { id:11, nombre:"SaaS para Clínicas Pequeñas",         emoji:"🏥", sector:"Tech",            potencial:"Alta",  dificultad:"Moderada", resumen:"Software todo-en-uno para clínicas: agenda, pagos e historia clínica.", por_que:"Jane App factura decenas de millones. Las clínicas pequeñas no pueden pagar soluciones enterprise.", como_aplicar:"Miles de clínicas en España usan Excel o WhatsApp. Un SaaS a 49-99€/mes con soporte en español tiene mercado inmediato.", riesgos:["Ciclo de venta largo","LOPD en datos de salud","Competencia de Mindbody"], pasos:["Elegir un único tipo de clínica","Entrevistar 20 fisioterapeutas","MVP en 3 meses","Precio 29€/mes para los primeros 50"] },
  { id:12, nombre:"IA para Redes de PYMEs",              emoji:"📲", sector:"Tech",            potencial:"Alta",  dificultad:"Moderada", resumen:"Herramienta que genera y programa contenido en redes sociales para pequeños negocios.", por_que:"Buffer tiene millones de usuarios. La IA permite generar contenido de calidad automáticamente.", como_aplicar:"El 95% de PYMEs españolas tienen redes abandonadas. Una herramienta específica por sector en español tiene ventaja.", riesgos:["Mercado muy competido","Diferenciación difícil","PYMEs con presupuesto limitado"], pasos:["Elegir sector específico (restaurantes)","MVP con generación + programación","Precio 19-39€/mes","Agencias como revendedores"] },
  { id:13, nombre:"App de Finanzas para Autónomos",      emoji:"💸", sector:"Tech",            potencial:"Alta",  dificultad:"Moderada", resumen:"Gestoría digital: facturas, IVA, IRPF y declaraciones automáticas.", por_que:"Quickbooks Self-Employed tiene millones de usuarios. El autónomo odia gestionar su contabilidad.", como_aplicar:"España tiene 3,3 millones de autónomos. Hay espacio para actores especializados por sector.", riesgos:["Regulación fiscal cambia","Responsabilidad legal","Competencia de gestorías"], pasos:["Elegir nicho por sector","Integración con AEAT","Precio 15-29€/mes","Comunidades de freelancers en LinkedIn"] },
  { id:14, nombre:"Tiendas de Segunda Mano Curadas",     emoji:"♻️", sector:"Retail",          potencial:"Alta",  dificultad:"Fácil",    resumen:"Tiendas físicas de ropa o electrónica de segunda mano con curaduría y garantía.", por_que:"ThredUp y Poshmark valen miles de millones. La compra de segunda mano creció 15x en la última década.", como_aplicar:"Wallapop domina online pero hay escasa oferta física curada. Una tienda especializada con garantía tiene diferenciación enorme.", riesgos:["Aprovisionamiento de calidad","Gestión de inventario compleja","Local prime encarece"], pasos:["Elegir categoría específica","Comprar en Wallapop y revender","Local en mercado para validar","Sistema de consignación"] },
  { id:15, nombre:"Suscripción de Productos Artesanales",emoji:"🧀", sector:"Retail",          potencial:"Alta",  dificultad:"Fácil",    resumen:"Caja mensual curada con productos artesanales: quesos, embutidos, aceites, vinos.", por_que:"Cratejoy ha generado miles de negocios de cajas. El consumidor quiere descubrir productos únicos.", como_aplicar:"España tiene una riqueza artesanal única. Una caja DOP curada por región tiene demanda local y en la diáspora.", riesgos:["Logística de temperatura","Retención cae si se repite","Negociación con productores pequeños"], pasos:["Definir temática por región o tipo","30 suscriptores para validar","Fotografía profesional","Grupos de foodies en Facebook"] },
  { id:16, nombre:"Live Commerce (Ventas en Directo)",    emoji:"📺", sector:"Retail",          potencial:"Alta",  dificultad:"Fácil",    resumen:"Ventas en directo por Instagram o TikTok con descuentos exclusivos en tiempo real.", por_que:"En China mueve 600.000M$. En EE.UU. supera 50.000M$ y crece 30% anual.", como_aplicar:"En España el live commerce está en fase inicial. Quien domine TikTok ahora tiene ventaja de primer movimiento.", riesgos:["Requiere comodidad ante cámara","Gestión de stock en tiempo real","Algoritmos pueden cambiar"], pasos:["TikTok para jóvenes, Instagram para adultos","2 directos semanales de 45 min","10-15 productos con descuento exclusivo","Colaborar con otro creador"] },
  { id:17, nombre:"Gestión de Alquiler Vacacional",       emoji:"🏡", sector:"Servicios",      potencial:"Alta",  dificultad:"Fácil",    resumen:"Gestión integral de pisos de Airbnb: check-in, limpieza, precios dinámicos y atención.", por_que:"Vacasa vale 500M$+. El propietario quiere ingresos sin trabajo. La gestión profesional sube ocupación y precio.", como_aplicar:"España es el segundo destino turístico mundial. Millones de pisos en Airbnb están mal gestionados.", riesgos:["Regulación cambia por ciudad","Personal difícil en temporada","Un mal huésped arruina la relación"], pasos:["Empezar con 5-10 propiedades de conocidos","Software: Hostaway o Lodgify","Acuerdo con empresa de limpieza","Pricing dinámico con PriceLabs"] },
  { id:18, nombre:"Fotografía Inmobiliaria con Dron",     emoji:"📸", sector:"Servicios",      potencial:"Alta",  dificultad:"Fácil",    resumen:"Fotografía profesional, vídeo con dron y tour virtual 360° para inmobiliarias.", por_que:"Las inmobiliarias con fotografía profesional venden un 32% más rápido. Matterport lidera con millones de propiedades.", como_aplicar:"La mayoría de fotos en Idealista son pésimas. Una empresa especializada a 150-400€ por propiedad tiene demanda inmediata.", riesgos:["Equipo y dron con coste inicial","Licencia AESA","Hay que fidelizar a la inmobiliaria"], pasos:["Licencia en AESA","Cámara full-frame + dron DJI","Suscripción a Matterport","Visitar inmobiliarias con portfolio"] },
  { id:19, nombre:"Tutorías Online IA + Humano",          emoji:"📚", sector:"Educación",      potencial:"Alta",  dificultad:"Moderada", resumen:"La IA detecta lagunas del alumno y un tutor humano las trabaja en sesiones personalizadas.", por_que:"Khan Academy y Varsity Tutors tienen millones de usuarios. IA + humano tiene resultados superiores.", como_aplicar:"España tiene 8M de estudiantes de ESO. El mercado de academias es enorme pero poco tecnificado.", riesgos:["Captación costosa","Resultados difíciles de atribuir","Competencia de Smartick"], pasos:["Empezar con Matemáticas de ESO","Tutores universitarios a 12-18€/hora","Diagnóstico inicial gratuito","Grupos de padres en WhatsApp"] },
  { id:20, nombre:"Academia de Finanzas Personales",      emoji:"💰", sector:"Educación",      potencial:"Alta",  dificultad:"Fácil",    resumen:"Cursos y comunidad para gestionar dinero, invertir y planificar la jubilación.", por_que:"Ramsey Solutions genera más de 300M$. La educación financiera tiene demanda masiva entre millennials.", como_aplicar:"España tiene cultura financiera muy baja. Un programa de 90 días a 197-497€ con comunidad tiene propuesta clara.", riesgos:["No puedes asesorar sin licencia CNMV","Credibilidad del instructor fundamental","YouTube compite directamente"], pasos:["Contenido gratuito 6 meses primero","Curso 90 días: presupuesto → ahorro → inversión","Diferenciarse de asesoramiento","Comunidad Discord"] },
  { id:21, nombre:"Formación en Oficios del Futuro",      emoji:"⚡", sector:"Educación",      potencial:"Alta",  dificultad:"Moderada", resumen:"Cursos certificados para instaladores de paneles solares y técnicos de la transición energética.", por_que:"Con la transición energética faltan cientos de miles de técnicos. Las empresas pagan formación porque no encuentran profesionales.", como_aplicar:"España tiene objetivo de 74% de renovables en 2030. Faltan instaladores cualificados.", riesgos:["Certificaciones lentas","Contenido técnico requiere expertos","Cambio tecnológico rápido"], pasos:["Alianza con fabricante de paneles","80% presencial en instalaciones reales","B2B primero","Subvenciones del SEPE"] },
  { id:22, nombre:"Energía Solar Comunitaria",            emoji:"☀️", sector:"Sostenibilidad", potencial:"Alta",  dificultad:"Difícil",  resumen:"Comunidades de propietarios que comparten instalación solar y reparten el ahorro.", por_que:"En EE.UU. las solar communities han reducido la factura de millones de hogares.", como_aplicar:"España tiene 2.800 horas de sol y facturas muy altas. La normativa ya lo permite. Falta el intermediario.", riesgos:["Aprobación de comunidad lenta","Inversión inicial alta","Trámites con distribuidoras complejos"], pasos:["Especializarse en autoconsumo comunitario","Acuerdo con instalador solar","Modelo 0€ entrada con cuota < ahorro","Administradores de fincas como canal"] },
  { id:23, nombre:"Reparación de Electrónica",            emoji:"🔌", sector:"Sostenibilidad", potencial:"Alta",  dificultad:"Fácil",    resumen:"Servicio de reparación de móviles y electrodomésticos contra la obsolescencia programada.", por_que:"iFixit ha construido un movimiento en torno al derecho a reparar. La normativa europea obliga a facilitar piezas.", como_aplicar:"España desecha 900.000 toneladas de residuos electrónicos al año. Precio transparente + garantía + recogida a domicilio.", riesgos:["Técnicos cualificados difíciles de retener","Proveedores de piezas no fiables","Fabricantes que dificultan el acceso"], pasos:["Empezar con móviles y portátiles","Certificarse como SAT de 2-3 marcas","Recogida a domicilio","Precio fijo online antes de confirmar"] },
  { id:24, nombre:"Gestión de Residuos para Hostelería",  emoji:"🍃", sector:"Sostenibilidad", potencial:"Alta",  dificultad:"Moderada", resumen:"Ayuda a bares y restaurantes a separar y valorizar residuos cumpliendo normativa.", por_que:"Rubicon gestiona residuos de miles de restaurantes. La normativa obliga pero nadie sabe cómo cumplirla.", como_aplicar:"Nueva normativa obliga a gestionar aceite, orgánico y envases. Servicio todo incluido a 50-150€/mes.", riesgos:["Logística de recogida","Regulación varía por comunidad","Margen ajustado"], pasos:["Estudiar normativa local","Empezar con recogida de aceite","Acuerdo con gestores autorizados","Puerta a puerta en polígonos de hostelería"] },
];

const SECTORES    = ["Todos","Food & Drink","Fitness","Salud","Tech","Retail","Servicios","Educación","Sostenibilidad"];
const SECTOR_ICON = { "Todos":"🌎","Food & Drink":"🍽️","Fitness":"💪","Salud":"🩺","Tech":"💻","Retail":"🛍️","Servicios":"🤝","Educación":"🎓","Sostenibilidad":"🌱" };
const POT_STYLE   = { Alta:{ bg:"rgba(74,222,128,0.12)", color:"#4ade80", border:"rgba(74,222,128,0.25)" }, Media:{ bg:"rgba(251,191,36,0.12)", color:"#fbbf24", border:"rgba(251,191,36,0.25)" }, Baja:{ bg:"rgba(248,113,113,0.12)", color:"#f87171", border:"rgba(248,113,113,0.25)" } };
const DIF_STYLE   = { "Fácil":{ bg:"rgba(129,140,248,0.12)", color:"#818cf8", border:"rgba(129,140,248,0.25)" }, Moderada:{ bg:"rgba(251,191,36,0.12)", color:"#fbbf24", border:"rgba(251,191,36,0.25)" }, "Difícil":{ bg:"rgba(248,113,113,0.12)", color:"#f87171", border:"rgba(248,113,113,0.25)" } };

// ─── DATOS ESTÁTICOS: NOTICIAS ──────────────────────────────────────────────
// Datos fijos de ejemplo. Sustituye por fuentes propias / actualízalos manualmente.
const STATIC_NEWS = [
  { titulo:"El delivery saludable crece un 22% en España", resumen:"Las apps de meal prep y dark kitchens ganan terreno frente a la comida rápida tradicional.", sector:"Food & Drink", impacto:"Alto", tag:"Tendencia" },
  { titulo:"Inversión en salud mental digital se duplica", resumen:"Fondos europeos apuestan por plataformas de terapia online ante la saturación pública.", sector:"Salud", impacto:"Alto", tag:"Inversión" },
  { titulo:"Nueva normativa de residuos para hostelería", resumen:"Bares y restaurantes deberán separar aceite y orgánico bajo nuevas reglas autonómicas.", sector:"Sostenibilidad", impacto:"Medio", tag:"Regulación" },
  { titulo:"El padel sigue rompiendo récords de jugadores", resumen:"España supera los 6 millones de jugadores activos, con demanda de instalaciones premium.", sector:"Fitness", impacto:"Alto", tag:"Tendencia" },
  { titulo:"Autónomos buscan alternativas digitales a gestorías", resumen:"Crece el interés por apps de facturación e IVA automatizado entre freelancers.", sector:"Tech", impacto:"Medio", tag:"Startup" },
  { titulo:"El alquiler vacacional profesional gana cuota", resumen:"Más propietarios externalizan la gestión de pisos turísticos a empresas especializadas.", sector:"Servicios", impacto:"Medio", tag:"Tendencia" },
  { titulo:"Auge de la segunda mano física con garantía", resumen:"Tiendas curadas de ropa y electrónica de segunda mano se multiplican en grandes ciudades.", sector:"Retail", impacto:"Medio", tag:"Tendencia" },
  { titulo:"Formación en energías renovables, gran demanda", resumen:"Faltan miles de instaladores cualificados para cumplir los objetivos de renovables 2030.", sector:"Educación", impacto:"Alto", tag:"Oportunidad" },
];

// ─── DATOS ESTÁTICOS: RADAR DE MERCADO ───────────────────────────────────────
// Datos fijos de ejemplo (en miles de millones, EE.UU. en $ y España en €).
// Sustituye por cifras reales / actualízalas manualmente cuando lo necesites.
const STATIC_MARKET = {
  "Todos": {
    insight: "El mercado de bienestar y servicios personales en EE.UU. es 6-10x mayor que en España.",
    datos: [
      { nombre:"Meal Prep",       mercadoUSA:65,  mercadoES:1.2, crecimiento:40 },
      { nombre:"Salud Mental",    mercadoUSA:120, mercadoES:2.5, crecimiento:25 },
      { nombre:"Fitness Boutique",mercadoUSA:35,  mercadoES:1.0, crecimiento:18 },
      { nombre:"Alquiler Vac.",   mercadoUSA:90,  mercadoES:8.5, crecimiento:15 },
      { nombre:"Segunda Mano",    mercadoUSA:55,  mercadoES:3.0, crecimiento:22 },
    ],
  },
  "Food & Drink": {
    insight: "Las dark kitchens y bares de zumo en frío mueven decenas de miles de millones en EE.UU.",
    datos: [
      { nombre:"Dark Kitchens",   mercadoUSA:45, mercadoES:0.8, crecimiento:35 },
      { nombre:"Zumos en Frío",   mercadoUSA:20, mercadoES:0.3, crecimiento:20 },
      { nombre:"Meal Prep",       mercadoUSA:65, mercadoES:1.2, crecimiento:40 },
      { nombre:"Cajas Gourmet",   mercadoUSA:12, mercadoES:0.4, crecimiento:15 },
      { nombre:"Comida Vegana",   mercadoUSA:30, mercadoES:0.6, crecimiento:18 },
    ],
  },
  "Fitness": {
    insight: "Los estudios boutique y la recuperación deportiva crecen con fuerza en mercados maduros.",
    datos: [
      { nombre:"Estudios Boutique",mercadoUSA:35, mercadoES:1.0, crecimiento:18 },
      { nombre:"Crioterapia",      mercadoUSA:8,  mercadoES:0.1, crecimiento:28 },
      { nombre:"Padel Indoor",     mercadoUSA:5,  mercadoES:0.7, crecimiento:30 },
      { nombre:"Apps Fitness",     mercadoUSA:25, mercadoES:0.5, crecimiento:22 },
      { nombre:"Wellness Clubs",   mercadoUSA:40, mercadoES:1.5, crecimiento:16 },
    ],
  },
  "Salud": {
    insight: "La telesalud mental en EE.UU. multiplica por 50x el tamaño del mercado español.",
    datos: [
      { nombre:"Terapia Online",  mercadoUSA:120, mercadoES:2.5, crecimiento:25 },
      { nombre:"Concierge Mayores",mercadoUSA:30, mercadoES:0.5, crecimiento:20 },
      { nombre:"Telemedicina",    mercadoUSA:85,  mercadoES:3.0, crecimiento:18 },
      { nombre:"Apps Bienestar",  mercadoUSA:22,  mercadoES:0.6, crecimiento:24 },
      { nombre:"Nutrición Online",mercadoUSA:15,  mercadoES:0.4, crecimiento:19 },
    ],
  },
  "Tech": {
    insight: "El SaaS vertical para PYMEs y autónomos en España aún está muy poco explotado.",
    datos: [
      { nombre:"SaaS Clínicas",   mercadoUSA:18, mercadoES:0.3, crecimiento:22 },
      { nombre:"IA Marketing",    mercadoUSA:40, mercadoES:0.8, crecimiento:35 },
      { nombre:"Fintech Autón.",  mercadoUSA:25, mercadoES:0.6, crecimiento:20 },
      { nombre:"Software Reservas",mercadoUSA:12,mercadoES:0.3, crecimiento:17 },
      { nombre:"Herramientas IA", mercadoUSA:55, mercadoES:1.2, crecimiento:40 },
    ],
  },
  "Retail": {
    insight: "El live commerce y la moda circular crecen mucho más rápido en EE.UU. y China.",
    datos: [
      { nombre:"Live Commerce",   mercadoUSA:50, mercadoES:0.3, crecimiento:30 },
      { nombre:"Renting de Ropa", mercadoUSA:7,  mercadoES:0.1, crecimiento:14 },
      { nombre:"Segunda Mano",    mercadoUSA:55, mercadoES:3.0, crecimiento:22 },
      { nombre:"Cajas Suscripción",mercadoUSA:15,mercadoES:0.4, crecimiento:16 },
      { nombre:"E-commerce Nicho",mercadoUSA:35, mercadoES:1.5, crecimiento:18 },
    ],
  },
  "Servicios": {
    insight: "La gestión profesional de propiedades y servicios para mayores tiene amplio margen de crecimiento.",
    datos: [
      { nombre:"Alquiler Vac.",   mercadoUSA:90, mercadoES:8.5, crecimiento:15 },
      { nombre:"Concierge Mayores",mercadoUSA:30,mercadoES:0.5, crecimiento:20 },
      { nombre:"Lavanderías Premium",mercadoUSA:10,mercadoES:0.2, crecimiento:12 },
      { nombre:"Fotografía Inmob.",mercadoUSA:6, mercadoES:0.15,crecimiento:14 },
      { nombre:"Limpieza On-Demand",mercadoUSA:20,mercadoES:0.6, crecimiento:17 },
    ],
  },
  "Educación": {
    insight: "La educación financiera y la formación técnica especializada tienen demanda creciente.",
    datos: [
      { nombre:"Finanzas Personales",mercadoUSA:18,mercadoES:0.2,crecimiento:25 },
      { nombre:"Tutorías IA+Humano",mercadoUSA:30, mercadoES:0.6,crecimiento:22 },
      { nombre:"Formación Renovables",mercadoUSA:14,mercadoES:0.3,crecimiento:28 },
      { nombre:"E-learning B2B",  mercadoUSA:45,  mercadoES:1.0, crecimiento:20 },
      { nombre:"Certificaciones", mercadoUSA:22,  mercadoES:0.4, crecimiento:17 },
    ],
  },
  "Sostenibilidad": {
    insight: "La energía solar comunitaria y la reparación de electrónica responden a una demanda regulatoria creciente.",
    datos: [
      { nombre:"Solar Comunitaria",mercadoUSA:25,mercadoES:0.4, crecimiento:30 },
      { nombre:"Reparación Electr.",mercadoUSA:10,mercadoES:0.2,crecimiento:18 },
      { nombre:"Gestión Residuos", mercadoUSA:30, mercadoES:0.5,crecimiento:16 },
      { nombre:"Economía Circular",mercadoUSA:40, mercadoES:1.0,crecimiento:20 },
      { nombre:"Energía Limpia",   mercadoUSA:60, mercadoES:2.5,crecimiento:22 },
    ],
  },
};

const Pill = ({ label, map }) => {
  const s = map[label] || { bg:"rgba(255,255,255,0.05)", color:"#8a8680", border:"rgba(255,255,255,0.1)" };
  return (
    <span style={{ background:s.bg, color:s.color, border:`1px solid ${s.border}`, fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:99, display:"inline-block", letterSpacing:"0.02em" }}>
      {label}
    </span>
  );
};

// ─── NOTICIAS (datos estáticos) ───────────────────────────────────────────────
function NewsSection({ sector }) {
  const news = useMemo(() => {
    return sector === "Todos" ? STATIC_NEWS : STATIC_NEWS.filter(n => n.sector === sector);
  }, [sector]);

  const IMP = {
    Alto:  { color:"#4ade80", bg:"rgba(74,222,128,0.1)",   border:"rgba(74,222,128,0.2)"  },
    Medio: { color:"#fbbf24", bg:"rgba(251,191,36,0.1)",   border:"rgba(251,191,36,0.2)"  },
    Bajo:  { color:"#818cf8", bg:"rgba(129,140,248,0.1)",  border:"rgba(129,140,248,0.2)" },
  };

  return (
    <div style={{ marginBottom:24 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
        <div style={{ width:32, height:32, background:"rgba(244,114,182,0.12)", border:"1px solid rgba(244,114,182,0.2)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>📰</div>
        <div>
          <p style={{ fontSize:9, fontWeight:800, color:C.pink, textTransform:"uppercase", letterSpacing:"0.14em", margin:0 }}>Señales del mercado</p>
          <p style={{ fontSize:13, fontWeight:700, color:C.text, margin:0 }}>Noticias & Tendencias</p>
        </div>
      </div>

      {news.length === 0 && (
        <div style={{ background:C.card, border:`1px dashed ${C.border}`, borderRadius:16, padding:"28px 20px", textAlign:"center" }}>
          <p style={{ fontSize:28, margin:"0 0 8px" }}>📰</p>
          <p style={{ fontSize:14, color:C.textMuted, margin:0 }}>No hay noticias para este sector todavía</p>
        </div>
      )}

      {news.length > 0 && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(270px, 1fr))", gap:10 }}>
          {news.map((n, i) => {
            const imp = IMP[n.impacto] || IMP.Medio;
            return (
              <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"14px 16px", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg, ${imp.color}44, transparent)` }} />
                <div style={{ display:"flex", gap:8, marginBottom:8, alignItems:"flex-start" }}>
                  <span style={{ background:imp.bg, color:imp.color, border:`1px solid ${imp.border}`, fontSize:10, fontWeight:800, padding:"2px 8px", borderRadius:99, whiteSpace:"nowrap", letterSpacing:"0.04em" }}>{n.impacto}</span>
                  <span style={{ background:"rgba(255,255,255,0.04)", color:C.textMuted, fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:99, border:`1px solid ${C.border}` }}>{n.tag}</span>
                </div>
                <p style={{ fontSize:13, fontWeight:700, color:C.text, margin:"0 0 6px", lineHeight:1.4 }}>{n.titulo}</p>
                <p style={{ fontSize:12, color:C.textMuted, margin:0, lineHeight:1.6 }}>{n.resumen}</p>
                <p style={{ fontSize:10, color:C.textDim, margin:"10px 0 0", fontWeight:600 }}>{n.sector}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── COMPARADOR (sin IA) ───────────────────────────────────────────────────────
function CompareModal({ trends, onClose }) {
  const [a, setA] = useState(trends[0]?.id || null);
  const [b, setB] = useState(trends[1]?.id || null);

  const tA = trends.find(t => t.id === a);
  const tB = trends.find(t => t.id === b);

  const Field = ({ label, val }) => (
    <div style={{ padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>
      <p style={{ fontSize:10, fontWeight:800, color:C.textDim, textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 4px" }}>{label}</p>
      <p style={{ fontSize:13, color:C.text, margin:0, lineHeight:1.5 }}>{val}</p>
    </div>
  );

  return (
    <div style={{ position:"fixed", inset:0, zIndex:55, background:"rgba(0,0,0,0.82)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:20, width:"100%", maxWidth:720, maxHeight:"90vh", overflowY:"auto", padding:"24px 20px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div>
            <p style={{ fontSize:9, fontWeight:800, color:C.indigo, textTransform:"uppercase", letterSpacing:"0.14em", margin:0 }}>Comparador</p>
            <h2 style={{ fontSize:18, fontWeight:800, color:C.text, margin:0 }}>⚖️ Comparador de oportunidades</h2>
          </div>
          <button onClick={onClose} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:8, padding:"6px 12px", cursor:"pointer", fontSize:13, color:C.textMuted }}>✕ Cerrar</button>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
          {[{ label:"Oportunidad A", val:a, set:setA, color:C.gold }, { label:"Oportunidad B", val:b, set:setB, color:C.indigo }].map(({ label, val, set, color }) => (
            <div key={label}>
              <p style={{ fontSize:10, fontWeight:800, color, textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 6px" }}>{label}</p>
              <select value={val || ""} onChange={e => set(Number(e.target.value))}
                style={{ width:"100%", background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 12px", fontSize:13, color:C.text, cursor:"pointer" }}>
                {trends.map(t => <option key={t.id} value={t.id}>{t.emoji} {t.nombre}</option>)}
              </select>
            </div>
          ))}
        </div>

        {tA && tB && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:0 }}>
            <div style={{ background:C.card, border:`1px solid ${C.borderGold}`, borderRadius:"14px 0 0 14px", padding:"14px 16px" }}>
              <p style={{ fontSize:22, margin:"0 0 6px" }}>{tA.emoji}</p>
              <p style={{ fontSize:13, fontWeight:800, color:C.text, margin:"0 0 10px", lineHeight:1.3 }}>{tA.nombre}</p>
              <Field label="Sector" val={tA.sector} />
              <Field label="Potencial" val={tA.potencial} />
              <Field label="Dificultad" val={tA.dificultad} />
              <Field label="Resumen" val={tA.resumen} />
            </div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"0 12px", background:C.bg }}>
              <div style={{ background:`linear-gradient(135deg, ${C.gold}, ${C.indigo})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", fontSize:18, fontWeight:900 }}>VS</div>
            </div>
            <div style={{ background:C.card, border:`1px solid ${C.indigoBorder}`, borderRadius:"0 14px 14px 0", padding:"14px 16px" }}>
              <p style={{ fontSize:22, margin:"0 0 6px" }}>{tB.emoji}</p>
              <p style={{ fontSize:13, fontWeight:800, color:C.text, margin:"0 0 10px", lineHeight:1.3 }}>{tB.nombre}</p>
              <Field label="Sector" val={tB.sector} />
              <Field label="Potencial" val={tB.potencial} />
              <Field label="Dificultad" val={tB.dificultad} />
              <Field label="Resumen" val={tB.resumen} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MARKET CHART (datos estáticos) ───────────────────────────────────────────
function MarketChart({ sector }) {
  const data = STATIC_MARKET[sector] || STATIC_MARKET["Todos"];

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", fontSize:12 }}>
        <p style={{ color:C.gold, fontWeight:700, margin:"0 0 6px" }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color:p.color, margin:"2px 0" }}>{p.name}: <strong>{p.value}B{p.name.includes("EE.UU") ? "$" : "€"}</strong></p>
        ))}
      </div>
    );
  };

  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:18, padding:"18px 16px", marginBottom:20, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg, ${C.gold}55, transparent)` }} />
      <div style={{ marginBottom:4 }}>
        <p style={{ fontSize:9, fontWeight:800, color:C.gold, textTransform:"uppercase", letterSpacing:"0.14em", margin:"0 0 2px" }}>📊 Radar de Mercado — EE.UU. vs España</p>
        <p style={{ fontSize:11, color:C.textMuted, margin:0 }}>Brecha de capital entre ambos mercados</p>
      </div>

      <div style={{ background:C.indigoBg, border:`1px solid ${C.indigoBorder}`, borderRadius:10, padding:"8px 14px", marginBottom:14, marginTop:12 }}>
        <p style={{ fontSize:12, color:C.indigo, margin:0, fontWeight:600 }}>✦ {data.insight}</p>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data.datos} margin={{ top:10, right:10, left:-10, bottom:0 }} barGap={4}>
          <XAxis dataKey="nombre" tick={{ fill:C.textMuted, fontSize:10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill:C.textDim, fontSize:10 }} axisLine={false} tickLine={false} unit="B" />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="mercadoUSA" name="EE.UU." radius={[4,4,0,0]} maxBarSize={28}>
            {data.datos.map((_, i) => <Cell key={i} fill={C.gold} opacity={0.85} />)}
          </Bar>
          <Bar dataKey="mercadoES" name="España" radius={[4,4,0,0]} maxBarSize={28}>
            {data.datos.map((_, i) => <Cell key={i} fill={C.indigo} opacity={0.75} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display:"flex", gap:16, justifyContent:"center", marginTop:6 }}>
        {[{ color:C.gold, label:"EE.UU. (miles de millones $)" }, { color:C.indigo, label:"España (miles de millones €)" }].map(({ color, label }) => (
          <div key={label} style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:8, height:8, borderRadius:2, background:color }} />
            <span style={{ fontSize:10, color:C.textMuted }}>{label}</span>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:6, marginTop:12, overflowX:"auto" }}>
        {data.datos.map((d, i) => (
          <div key={i} style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:10, padding:"6px 10px", textAlign:"center", flexShrink:0 }}>
            <p style={{ fontSize:10, color:C.textMuted, margin:"0 0 2px" }}>{d.nombre}</p>
            <p style={{ fontSize:13, fontWeight:800, color:C.green, margin:0 }}>+{d.crecimiento}%</p>
            <p style={{ fontSize:9, color:C.textDim, margin:0 }}>crecimiento USA</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PAYWALL ──────────────────────────────────────────────────────────────────
function PaywallModal({ onClose }) {
  const successUrl = typeof window !== "undefined"
    ? `${window.location.origin}${window.location.pathname}?token=${SECRET_TOKEN}` : "";
  const url = `${STRIPE_PAYMENT_LINK}?success_url=${encodeURIComponent(successUrl)}`;
  const features = [
    "✦ 24 oportunidades de negocio completas",
    "✦ Radar de mercado y noticias",
    "✦ Comparador de oportunidades",
    "✦ Cancela cuando quieras",
  ];
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:60, background:"rgba(0,0,0,0.85)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background:C.surface, border:`1px solid ${C.borderGold}`, borderRadius:24, padding:28, width:"100%", maxWidth:400, textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:8 }}>✦</div>
        <h2 style={{ fontSize:22, fontWeight:800, color:C.gold, margin:"0 0 4px" }}>TrendSpain Pro</h2>
        <p style={{ fontSize:13, color:C.textMuted, lineHeight:1.6, margin:"0 0 4px" }}>Todo el poder del radar, sin límites</p>
        <p style={{ fontSize:34, fontWeight:900, color:C.text, margin:"14px 0" }}>5€<span style={{ fontSize:14, fontWeight:400, color:C.textMuted }}>/mes</span></p>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:16, marginBottom:20, textAlign:"left" }}>
          {features.map((item, i) => (
            <p key={i} style={{ fontSize:13, color:C.text, margin:"0 0 8px", fontWeight:500 }}>{item}</p>
          ))}
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer"
          style={{ display:"block", background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, color:"#0a0a0c", padding:16, borderRadius:14, fontSize:16, fontWeight:800, textDecoration:"none", marginBottom:8 }}>
          Suscribirme — 5€/mes →
        </a>
        <p style={{ fontSize:11, color:C.textDim, margin:"0 0 10px" }}>Pago seguro · Cancela cuando quieras</p>
        <button onClick={onClose} style={{ background:"none", border:"none", color:C.textMuted, fontSize:13, cursor:"pointer" }}>Ahora no</button>
      </div>
    </div>
  );
}

// ─── SUCCESS MODAL ────────────────────────────────────────────────────────────
function SuccessModal({ onClose }) {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:70, background:"rgba(0,0,0,0.9)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:C.surface, border:`1px solid ${C.borderGold}`, borderRadius:24, padding:32, width:"100%", maxWidth:360, textAlign:"center" }}>
        <div style={{ fontSize:52, marginBottom:12 }}>🎉</div>
        <h2 style={{ fontSize:22, fontWeight:800, color:C.gold, margin:"0 0 8px" }}>¡Bienvenido a Pro!</h2>
        <p style={{ fontSize:13, color:C.textMuted, lineHeight:1.6, margin:"0 0 20px" }}>Ya tienes acceso completo al radar, noticias y comparador.</p>
        <button onClick={onClose} style={{ width:"100%", background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, color:"#0a0a0c", border:"none", borderRadius:14, padding:16, fontSize:16, fontWeight:800, cursor:"pointer" }}>
          Explorar ahora →
        </button>
      </div>
    </div>
  );
}

// ─── TREND MODAL ──────────────────────────────────────────────────────────────
function TrendModal({ t, onClose, isFavorite, onToggleFavorite }) {
  if (!t) return null;
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:50, background:"rgba(0,0,0,0.8)", display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background:C.surface, width:"100%", maxWidth:620, borderRadius:"22px 22px 0 0", padding:"20px 20px 40px", overflowY:"auto", maxHeight:"92vh", border:`1px solid ${C.border}`, borderBottom:"none" }}>
        <div style={{ width:32, height:3, background:C.border, borderRadius:99, margin:"0 auto 22px" }} />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
          <div style={{ flex:1 }}>
            <p style={{ fontSize:9, fontWeight:800, color:C.gold, textTransform:"uppercase", letterSpacing:"0.14em", margin:"0 0 4px" }}>{t.sector}</p>
            <h2 style={{ fontSize:20, fontWeight:800, color:C.text, margin:0, lineHeight:1.2 }}>{t.emoji} {t.nombre}</h2>
          </div>
          <div style={{ display:"flex", gap:8, marginLeft:10 }}>
            <button onClick={() => onToggleFavorite(t.id)}
              style={{ background: isFavorite ? "rgba(248,113,113,0.15)" : C.card, border:`1px solid ${isFavorite ? "rgba(248,113,113,0.3)" : C.border}`, borderRadius:8, padding:"6px 10px", cursor:"pointer", fontSize:16, transition:"all 0.15s" }}
              title={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}>
              {isFavorite ? "❤️" : "🤍"}
            </button>
            <button onClick={onClose} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:8, padding:"6px 10px", cursor:"pointer", fontSize:13, color:C.textMuted }}>✕</button>
          </div>
        </div>

        <div style={{ display:"flex", gap:6, marginBottom:16 }}>
          <Pill label={t.potencial} map={POT_STYLE} />
          <Pill label={t.dificultad} map={DIF_STYLE} />
        </div>

        <p style={{ fontSize:13, color:C.textMuted, lineHeight:1.75, marginBottom:18 }}>{t.resumen}</p>

        {[
          { title:"🇺🇸 Por qué funciona en EE.UU.", content:t.por_que, border:C.goldBorder, bg:C.goldBg, color:C.gold },
          { title:"🇪🇸 Cómo aplicarlo en España",  content:t.como_aplicar, border:C.indigoBorder, bg:C.indigoBg, color:C.indigo },
        ].map(({ title, content, border, bg, color }) => (
          <div key={title} style={{ background:bg, border:`1px solid ${border}`, borderRadius:14, padding:16, marginBottom:12 }}>
            <p style={{ fontSize:9, fontWeight:800, color, textTransform:"uppercase", letterSpacing:"0.12em", margin:"0 0 8px" }}>{title}</p>
            <p style={{ fontSize:13, color:C.text, lineHeight:1.75, margin:0 }}>{content}</p>
          </div>
        ))}

        <div style={{ marginBottom:14 }}>
          <p style={{ fontSize:9, fontWeight:800, color:C.red, textTransform:"uppercase", letterSpacing:"0.12em", margin:"0 0 10px" }}>⚠ Riesgos</p>
          {t.riesgos.map((r, i) => (
            <div key={i} style={{ display:"flex", gap:10, marginBottom:8, alignItems:"flex-start" }}>
              <span style={{ color:C.red, fontSize:11, marginTop:3, flexShrink:0 }}>✕</span>
              <p style={{ fontSize:13, color:C.textMuted, margin:0, lineHeight:1.6 }}>{r}</p>
            </div>
          ))}
        </div>

        <div style={{ background:C.goldBg, border:`1px solid ${C.goldBorder}`, borderRadius:14, padding:16, marginBottom:4 }}>
          <p style={{ fontSize:9, fontWeight:800, color:C.gold, textTransform:"uppercase", letterSpacing:"0.12em", margin:"0 0 12px" }}>✦ Primeros pasos</p>
          {t.pasos.map((p, i) => (
            <div key={i} style={{ display:"flex", gap:10, marginBottom:10, alignItems:"flex-start" }}>
              <span style={{ background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, color:"#0a0a0c", fontWeight:900, fontSize:10, width:22, height:22, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>{i+1}</span>
              <p style={{ fontSize:13, color:C.text, margin:0, lineHeight:1.6 }}>{p}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [sector, setSector]           = useState("Todos");
  const [query, setQuery]             = useState("");
  const [selected, setSelected]       = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [isPro, setIsPro]             = useState(false);
  const [activeTab, setActiveTab]     = useState("trends"); // "trends" | "news" | "favorites"
  const [favorites, setFavorites]     = useState(() => {
    try { const s = sessionStorage.getItem("ts_favorites"); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const [tokensLeft, setTokensLeft] = useState(() => {
    try { const s = sessionStorage.getItem("ts_tokens_left"); return s !== null ? parseInt(s) : FREE_TOKENS; } catch { return FREE_TOKENS; }
  });

  const filtered = useMemo(() => TRENDS.filter(t => {
    const ms = sector === "Todos" || t.sector === sector;
    const mq = !query || t.nombre.toLowerCase().includes(query.toLowerCase()) || t.resumen.toLowerCase().includes(query.toLowerCase());
    return ms && mq;
  }), [sector, query]);

  const favoriteTrends = useMemo(() => TRENDS.filter(t => favorites.includes(t.id)), [favorites]);

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

  // Activación de Pro vía token en URL/sessionStorage
  useState(() => {
    try {
      const params     = new URLSearchParams(window.location.search);
      const urlToken   = params.get("token");
      const savedToken = sessionStorage.getItem("ts_pro_token");
      if (urlToken === SECRET_TOKEN || savedToken === SECRET_TOKEN) {
        setIsPro(true);
        if (urlToken === SECRET_TOKEN) {
          sessionStorage.setItem("ts_pro_token", SECRET_TOKEN);
          setShowSuccess(true);
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    } catch {}
  });

  const displayList = activeTab === "favorites" ? favoriteTrends : filtered;

  const TABS = [
    { id:"trends",    label:"Oportunidades", icon:"🌎" },
    { id:"news",      label:"Noticias",      icon:"📰" },
    { id:"favorites", label:`Guardados${favorites.length > 0 ? ` (${favorites.length})` : ""}`, icon:"❤️" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"-apple-system, 'Segoe UI', system-ui, sans-serif", color:C.text }}>

      {/* ── HEADER ── */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"16px 16px 0", position:"sticky", top:0, zIndex:40 }}>
        <div style={{ maxWidth:700, margin:"0 auto" }}>

          {/* Top row */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:38, height:38, background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, borderRadius:11, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>🌎</div>
              <div>
                <p style={{ fontSize:9, fontWeight:800, color:C.gold, textTransform:"uppercase", letterSpacing:"0.16em", margin:0 }}>Radar de Oportunidades</p>
                <h1 style={{ fontSize:21, fontWeight:900, color:C.text, margin:0, letterSpacing:"-0.03em" }}>TrendSpain</h1>
              </div>
            </div>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <button onClick={() => setShowCompare(true)}
                style={{ background:C.indigoBg, border:`1px solid ${C.indigoBorder}`, borderRadius:10, padding:"8px 12px", cursor:"pointer", fontSize:12, color:C.indigo, fontWeight:800 }}>
                ⚖️ Comparar
              </button>
              {isPro
                ? <span style={{ background:C.greenBg, color:C.green, fontSize:12, fontWeight:800, padding:"7px 14px", borderRadius:99, border:`1px solid ${C.greenBorder}` }}>✦ Pro</span>
                : <button onClick={() => setShowPaywall(true)} style={{ background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, color:"#0a0a0c", border:"none", borderRadius:10, padding:"9px 16px", fontSize:12, fontWeight:800, cursor:"pointer" }}>✦ Pro — 5€</button>
              }
            </div>
          </div>

          <p style={{ fontSize:11, color:C.textDim, margin:"0 0 12px 50px" }}>Negocios que triunfan en EE.UU. y aún no han llegado a España</p>

          {!isPro && (
            <div style={{ background:tokensLeft > 0 ? C.goldBg : C.redBg, border:`1px solid ${tokensLeft > 0 ? C.goldBorder : "rgba(248,113,113,0.2)"}`, borderRadius:12, padding:"9px 14px", marginBottom:12, display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 }}>
              <p style={{ fontSize:12, color:tokensLeft > 0 ? C.gold : C.red, margin:0, fontWeight:700 }}>
                {tokensLeft > 0 ? `✦ ${tokensLeft} ficha${tokensLeft !== 1 ? "s" : ""} gratis` : "✕ Sin fichas — hazte Pro"}
              </p>
              <button onClick={() => setShowPaywall(true)} style={{ background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, color:"#0a0a0c", border:"none", borderRadius:8, padding:"6px 12px", fontSize:11, fontWeight:800, cursor:"pointer" }}>Ver todo</button>
            </div>
          )}

          {/* Search */}
          <div style={{ position:"relative", marginBottom:12 }}>
            <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:C.textDim, fontSize:13 }}>🔍</span>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar oportunidad…"
              style={{ width:"100%", padding:"10px 12px 10px 34px", background:C.card, border:`1px solid ${C.border}`, borderRadius:12, fontSize:13, color:C.text, outline:"none", boxSizing:"border-box" }} />
          </div>

          {/* Sector tabs */}
          <div style={{ display:"flex", overflowX:"auto", gap:0, scrollbarWidth:"none", marginBottom:0 }}>
            {SECTORES.map(s => (
              <button key={s} onClick={() => setSector(s)}
                style={{ padding:"9px 10px", fontSize:11, fontWeight:700, border:"none", background:"none", cursor:"pointer", whiteSpace:"nowrap",
                  borderBottom: sector === s ? `2px solid ${C.gold}` : "2px solid transparent",
                  color: sector === s ? C.gold : C.textMuted, letterSpacing:"0.01em" }}>
                {SECTOR_ICON[s]} {s}
              </button>
            ))}
          </div>

          {/* Main tabs */}
          <div style={{ display:"flex", gap:0, borderTop:`1px solid ${C.border}`, marginTop:0 }}>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{ flex:1, padding:"10px 8px", fontSize:12, fontWeight:700, border:"none", background:"none", cursor:"pointer",
                  borderBottom: activeTab === tab.id ? `2px solid ${C.gold}` : "2px solid transparent",
                  color: activeTab === tab.id ? C.gold : C.textMuted, letterSpacing:"0.02em" }}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ maxWidth:700, margin:"0 auto", padding:16 }}>

        {/* Tab: Noticias */}
        {activeTab === "news" && (
          <NewsSection sector={sector} />
        )}

        {/* Tab: Oportunidades / Favoritos */}
        {(activeTab === "trends" || activeTab === "favorites") && (
          <>
            {activeTab === "trends" && <MarketChart sector={sector} />}

              })}
            {activeTab === "trends" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {Object.keys(STATIC_MARKET || {}).map((categoriaKey) => {
                const categoria = STATIC_MARKET[categoriaKey];
                return (categoria.datos || []).map((item, index) => (
                  <TarjetaOportunidad 
                    key={`${categoriaKey}-${index}`}
                    trend={{
                      nombre: item.nombre,
                      emoji: index % 2 === 0 ? "🚀" : "💡",
                      isPremium: true,
                      inversion: "Bajo Coste (<300€)",
                      tiempo: "1-3 días",
                      herramientas: "No-Code / Redes",
                      estrategia: `Plan para España: Valida ${item.nombre} montando una landing page. El mercado en USA ya factura ${item.mercadoUSA}M, mientras que en España el volumen actual es de ${item.mercadoES}M con un crecimiento del ${item.crecimiento}%.`
                    }}
                  />
                ));
              })}
            </div>
          )}
            </div>
          )}
            {activeTab === "favorites" && favorites.length === 0 && (
              <div style={{ textAlign:"center", padding:"40px 20px" }}>
                <p style={{ fontSize:32, margin:"0 0 12px" }}>🤍</p>
                <p style={{ fontSize:15, fontWeight:700, color:C.text, margin:"0 0 6px" }}>Sin guardados todavía</p>
                <p style={{ fontSize:13, color:C.textMuted, margin:0 }}>Abre cualquier oportunidad y pulsa el corazón para guardarla</p>
              </div>
            )}

            {displayList.length > 0 && (
              <>
                <p style={{ fontSize:12, color:C.textDim, marginBottom:12 }}>
                  <span style={{ fontWeight:700, color:C.text }}>{displayList.length}</span> oportunidades
                  {!isPro && tokensLeft > 0 && <> · <span style={{ color:C.gold }}>✦ {tokensLeft} ficha{tokensLeft !== 1 ? "s" : ""}</span></>}
                </p>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(290px, 1fr))", gap:12 }}>
                  {displayList.map(t => {
                    const locked = !isPro && tokensLeft === 0;
                    const fav    = favorites.includes(t.id);
                    return (
                      <button key={t.id} onClick={() => handleCard(t)}
                        style={{ textAlign:"left", background:C.card, border:`1px solid ${fav ? "rgba(248,113,113,0.3)" : C.border}`, borderRadius:18, padding:18, cursor:"pointer", position:"relative", opacity:locked ? 0.55 : 1, transition:"border-color 0.15s" }}
                        onMouseEnter={e => { if (!locked) e.currentTarget.style.borderColor = C.borderGold; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = fav ? "rgba(248,113,113,0.3)" : C.border; }}>

                        <div style={{ position:"absolute", top:0, left:16, right:16, height:1, background:`linear-gradient(90deg, ${C.gold}33, transparent)`, borderRadius:1 }} />

                        <div style={{ position:"absolute", top:12, right:12, display:"flex", gap:6 }}>
                          {fav && <span style={{ fontSize:12 }}>❤️</span>}
                          {!isPro && (
                            <span style={{ background:locked ? C.redBg : C.goldBg, borderRadius:99, padding:"2px 8px", fontSize:10, fontWeight:800, color:locked ? C.red : C.gold, border:`1px solid ${locked ? "rgba(248,113,113,0.2)" : C.goldBorder}` }}>
                              {locked ? "🔒" : "−1"}
                            </span>
                          )}
                        </div>

                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                          <div style={{ paddingRight:56 }}>
                            <p style={{ fontSize:9, fontWeight:800, color:C.gold, textTransform:"uppercase", letterSpacing:"0.12em", margin:"0 0 4px" }}>{t.sector}</p>
                            <h3 style={{ fontSize:15, fontWeight:800, color:C.text, margin:0, lineHeight:1.3 }}>{t.nombre}</h3>
                          </div>
                          <span style={{ fontSize:26, flexShrink:0 }}>{t.emoji}</span>
                        </div>
                        <p style={{ fontSize:12, color:C.textMuted, lineHeight:1.65, margin:"0 0 14px", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{t.resumen}</p>
                        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                          <Pill label={t.potencial} map={POT_STYLE} />
                          <Pill label={t.dificultad} map={DIF_STYLE} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* ── MODALS ── */}
      <TrendModal
        t={selected}
        onClose={() => setSelected(null)}
        isFavorite={selected ? favorites.includes(selected.id) : false}
        onToggleFavorite={toggleFavorite}
      />
      {showCompare  && <CompareModal trends={TRENDS} onClose={() => setShowCompare(false)} />}
      {showPaywall  && <PaywallModal onClose={() => setShowPaywall(false)} />}
      {showSuccess  && <SuccessModal onClose={() => setShowSuccess(false)} />}
    </div>
  );
}

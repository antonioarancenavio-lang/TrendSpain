import { useState, useMemo } from "react";

const STRIPE_LINK = "https://buy.stripe.com/test_dRm00i4029Q361o65sfnO00";
const FREE_LIMIT = 4;

const TRENDS = [
  { id:1, nombre:"Dark Kitchen con Suscripción", emoji:"🍱", sector:"Food & Drink", potencial:"Alta", dificultad:"Fácil", resumen:"Cocinas fantasma con planes de comida semanal por suscripción, sin local físico.", por_que:"En EE.UU. el modelo dark kitchen explotó post-COVID. Añadir suscripción mensual garantiza ingresos recurrentes y reduce el desperdicio.", como_aplicar:"España tiene cultura gastronómica altísima pero poca oferta de comida saludable por suscripción. Ciudades medianas como Valencia o Bilbao son ideales.", riesgos:["Logística propia o dependencia de Glovo/Uber","Fidelización difícil si la calidad baja","Regulación sanitaria estricta"], pasos:["Alquilar espacio en una cloud kitchen","Definir nicho: vegano, mediterráneo o menú ejecutivo","Lanzar con 50 suscriptores piloto","Automatizar pedidos con Shopify"] },
  { id:2, nombre:"Clínicas de Salud Mental Online", emoji:"🧠", sector:"Salud", potencial:"Alta", dificultad:"Moderada", resumen:"Plataformas que conectan psicólogos con pacientes por videollamada.", por_que:"BetterHelp factura más de 700M$ anuales. La pandemia normalizó la terapia online y la demanda no ha bajado.", como_aplicar:"España tiene lista de espera de meses en salud mental pública. Diferenciarse por especialidad y precio accesible es la clave.", riesgos:["Necesitas psicólogos colegiados","Competencia de apps internacionales","Retención si el paciente prefiere presencial"], pasos:["Montar plataforma con Calendly + Stripe + Zoom","Reclutar 5-10 psicólogos autónomos","Nicho inicial: ansiedad laboral B2B","Certificar cumplimiento LOPD/RGPD"] },
  { id:3, nombre:"Lavanderías Self-Service Premium", emoji:"🧺", sector:"Servicios", potencial:"Alta", dificultad:"Fácil", resumen:"Lavanderías automatizadas 24h con app, pago sin efectivo y experiencia de marca cuidada.", por_que:"En EE.UU. Wash Club convirtió algo mundano en experiencia premium. El ticket medio sube 3x.", como_aplicar:"España tiene muchas lavanderías antiguas sin renovar. Ciudades universitarias y zonas turísticas son el target perfecto.", riesgos:["Inversión inicial en maquinaria (30-60k€)","Mantenimiento constante","Ubicación es crítica"], pasos:["Estudiar zonas universitarias o turísticas","Negociar leasing de máquinas","Desarrollar app sencilla","Diseñar local con identidad visual"] },
  { id:4, nombre:"Academias de Padel Indoor Premium", emoji:"🎾", sector:"Fitness", potencial:"Alta", dificultad:"Difícil", resumen:"Centros de padel cubiertos con entrenamiento personalizado y tecnología de análisis.", por_que:"El padel explotó en España pero el modelo de negocio es anticuado. En EE.UU. los sports clubs premium generan ingresos 5x superiores.", como_aplicar:"España lidera el padel mundial con 6M de jugadores pero instalaciones básicas. Un modelo premium con membresía tiene enorme diferenciación.", riesgos:["Alta inversión en instalaciones cubiertas","Mercado competido en grandes ciudades","Estacionalidad si no es indoor"], pasos:["Buscar nave de 1.500m² en ciudad mediana","Asociarse con entrenadores locales","Membresía fundadores con descuento","Cámaras de análisis de juego"] },
  { id:5, nombre:"Concierge para Personas Mayores", emoji:"👴", sector:"Servicios", potencial:"Alta", dificultad:"Fácil", resumen:"Asistencia personal para mayores: médicos, trámites, compras, tecnología y acompañamiento.", por_que:"En EE.UU. Papa Inc. vale cientos de millones. El envejecimiento crea demanda creciente e inagotable.", como_aplicar:"España tiene la segunda población más envejecida de Europa. Familias que no pueden cuidar a sus mayores pagan bien por tranquilidad.", riesgos:["Confianza difícil de ganar","Personal muy bien seleccionado","Regulación laboral específica"], pasos:["Definir catálogo de servicios concretos","Certificar selección de asistentes","Captar clientes por médicos y farmacias","Suscripción mensual 150-300€"] },
  { id:6, nombre:"Renting de Ropa por Suscripción", emoji:"👗", sector:"Retail", potencial:"Media", dificultad:"Difícil", resumen:"Alquiler mensual de ropa de marca — la llevas, la devuelves, siempre ropa nueva.", por_que:"Rent the Runway alcanzó 2.000M$ de valoración. La generación millennial prefiere acceso a propiedad.", como_aplicar:"España tiene cultura de moda fuerte. Nicho inicial: ropa de trabajo para mujeres profesionales.", riesgos:["Logística de limpieza compleja","Capital para stock inicial","Tasa de abandono alta"], pasos:["Empezar con nicho específico (vestidos de evento)","Acuerdo con tintorería local","Instagram + WhatsApp para empezar","30-50 prendas y 20 suscriptoras piloto"] },
  { id:7, nombre:"Bares de Zumo en Frío", emoji:"🥤", sector:"Food & Drink", potencial:"Alta", dificultad:"Fácil", resumen:"Tiendas de zumos prensados en frío, shots de bienestar y batidos funcionales.", por_que:"Pressed Juicery factura 100M$+ en EE.UU. Ticket alto y margen también.", como_aplicar:"En España el concepto existe fragmentado. Una cadena de 3-5 locales en zonas fitness tiene enorme diferenciación.", riesgos:["Producto perecedero (vida 3-5 días)","Maquinaria cara (15-30k€)","Estacionalidad en invierno"], pasos:["Ubicaciones cerca de gimnasios","Venta online para validar","Suscripción semanal de jugos","Certificar proceso APPCC"] },
  { id:8, nombre:"Meal Prep Delivery Fitness", emoji:"💪", sector:"Food & Drink", potencial:"Alta", dificultad:"Moderada", resumen:"Comidas semanales listas para calentar, diseñadas por nutricionistas, para el público fitness.", por_que:"Factor75 y Trifecta crecen 40% anual. El cliente fitness quiere comer bien sin cocinar.", como_aplicar:"Mercado fitness español enorme. Falta un servicio de meal prep serio con macros calculados.", riesgos:["Logística de refrigeración compleja","Competencia de grandes marcas","Márgenes ajustados"], pasos:["Contratar nutricionista","Reparto local para empezar","3 planes: perder peso, ganar músculo, mantenimiento","Instagram y TikTok como canal"] },
  { id:9, nombre:"Estudios Boutique por App", emoji:"🏋️", sector:"Fitness", potencial:"Alta", dificultad:"Moderada", resumen:"Pequeños estudios de HIIT, yoga o pilates reservables 100% por app.", por_que:"SoulCycle y Orangetheory: la gente paga 30-40$/clase si la experiencia es premium.", como_aplicar:"España tiene pocos estudios boutique con experiencia de marca. Barcelona, Madrid o Málaga tienen público dispuesto a pagar.", riesgos:["Inversión en equipamiento","Ocupación mínima para rentabilidad","Fidelización depende del instructor"], pasos:["Especializarse en un solo formato","App de reservas desde día 1","Instructor con seguidores propios","Membresías fundadoras"] },
  { id:10, nombre:"Clínicas de Recuperación Deportiva", emoji:"🧊", sector:"Fitness", potencial:"Alta", dificultad:"Moderada", resumen:"Centros con crioterapia, baños de hielo y sauna para deportistas amateur.", por_que:"Restore Hyper Wellness tiene más de 200 locales. El deportista amateur quiere las herramientas de los profesionales.", como_aplicar:"En España pocas opciones accesibles. Una clínica cerca de zonas deportivas con membresía mensual tiene diferenciación clara.", riesgos:["Equipamiento muy caro","Personal con formación","Mercado en fase educativa"], pasos:["Empezar con baños de hielo y sauna","Ubicarse junto a gimnasio","Acuerdo con fisioterapeutas","Contenido educativo en redes"] },
  { id:11, nombre:"SaaS para Clínicas Pequeñas", emoji:"🏥", sector:"Tech", potencial:"Alta", dificultad:"Moderada", resumen:"Software todo-en-uno para clínicas: agenda, pagos e historia clínica.", por_que:"Jane App factura decenas de millones. Las clínicas pequeñas no pueden pagar soluciones enterprise.", como_aplicar:"Miles de clínicas en España usan Excel o WhatsApp. Un SaaS a 49-99€/mes con soporte en español tiene mercado inmediato.", riesgos:["Ciclo de venta largo","LOPD en datos de salud","Competencia de Mindbody"], pasos:["Elegir un único tipo de clínica","Entrevistar 20 fisioterapeutas","MVP en 3 meses","Precio 29€/mes para los primeros 50"] },
  { id:12, nombre:"IA para Redes de PYMEs", emoji:"📲", sector:"Tech", potencial:"Alta", dificultad:"Moderada", resumen:"Herramienta que genera y programa contenido en redes sociales para pequeños negocios.", por_que:"Buffer tiene millones de usuarios. La IA permite generar contenido de calidad automáticamente.", como_aplicar:"El 95% de PYMEs españolas tienen redes abandonadas. Una herramienta específica por sector en español tiene ventaja.", riesgos:["Mercado muy competido","Diferenciación difícil","PYMEs con presupuesto limitado"], pasos:["Elegir sector específico (restaurantes)","MVP con generación + programación","Precio 19-39€/mes","Agencias como revendedores"] },
  { id:13, nombre:"App de Finanzas para Autónomos", emoji:"💸", sector:"Tech", potencial:"Alta", dificultad:"Moderada", resumen:"Gestoría digital: facturas, IVA, IRPF y declaraciones automáticas.", por_que:"Quickbooks Self-Employed tiene millones de usuarios. El autónomo odia gestionar su contabilidad.", como_aplicar:"España tiene 3,3 millones de autónomos. Hay espacio para actores especializados por sector.", riesgos:["Regulación fiscal cambia","Responsabilidad legal","Competencia de gestorías"], pasos:["Elegir nicho por sector","Integración con AEAT","Precio 15-29€/mes","Comunidades de freelancers en LinkedIn"] },
  { id:14, nombre:"Tiendas de Segunda Mano Curadas", emoji:"♻️", sector:"Retail", potencial:"Alta", dificultad:"Fácil", resumen:"Tiendas físicas de ropa o electrónica de segunda mano con curaduría y garantía.", por_que:"ThredUp y Poshmark valen miles de millones. La compra de segunda mano creció 15x en la última década.", como_aplicar:"Wallapop domina online pero hay escasa oferta física curada. Una tienda especializada con garantía tiene diferenciación enorme.", riesgos:["Aprovisionamiento de calidad","Gestión de inventario compleja","Local prime encarece"], pasos:["Elegir categoría específica","Comprar en Wallapop y revender","Local en mercado para validar","Sistema de consignación"] },
  { id:15, nombre:"Suscripción de Productos Artesanales", emoji:"🧀", sector:"Retail", potencial:"Alta", dificultad:"Fácil", resumen:"Caja mensual curada con productos artesanales: quesos, embutidos, aceites, vinos.", por_que:"Cratejoy ha generado miles de negocios de cajas. El consumidor quiere descubrir productos únicos.", como_aplicar:"España tiene una riqueza artesanal única. Una caja DOP curada por región tiene demanda local y en la diáspora.", riesgos:["Logística de temperatura","Retención cae si se repite","Negociación con productores pequeños"], pasos:["Definir temática por región o tipo","30 suscriptores para validar","Fotografía profesional","Grupos de foodies en Facebook"] },
  { id:16, nombre:"Live Commerce (Ventas en Directo)", emoji:"📺", sector:"Retail", potencial:"Alta", dificultad:"Fácil", resumen:"Ventas en directo por Instagram o TikTok con descuentos exclusivos en tiempo real.", por_que:"En China mueve 600.000M$. En EE.UU. supera 50.000M$ y crece 30% anual.", como_aplicar:"En España el live commerce está en fase inicial. Quien domine TikTok ahora tiene ventaja de primer movimiento.", riesgos:["Requiere comodidad ante cámara","Gestión de stock en tiempo real","Algoritmos pueden cambiar"], pasos:["TikTok para jóvenes, Instagram para adultos","2 directos semanales de 45 min","10-15 productos con descuento exclusivo","Colaborar con otro creador"] },
  { id:17, nombre:"Gestión de Alquiler Vacacional", emoji:"🏡", sector:"Servicios", potencial:"Alta", dificultad:"Fácil", resumen:"Gestión integral de pisos de Airbnb: check-in, limpieza, precios dinámicos y atención.", por_que:"Vacasa vale 500M$+. El propietario quiere ingresos sin trabajo. La gestión profesional sube ocupación y precio.", como_aplicar:"España es el segundo destino turístico mundial. Millones de pisos en Airbnb están mal gestionados.", riesgos:["Regulación cambia por ciudad","Personal difícil en temporada","Un mal huésped arruina la relación"], pasos:["Empezar con 5-10 propiedades de conocidos","Software: Hostaway o Lodgify","Acuerdo con empresa de limpieza","Pricing dinámico con PriceLabs"] },
  { id:18, nombre:"Fotografía Inmobiliaria con Dron", emoji:"📸", sector:"Servicios", potencial:"Alta", dificultad:"Fácil", resumen:"Fotografía profesional, vídeo con dron y tour virtual 360° para inmobiliarias.", por_que:"Las inmobiliarias con fotografía profesional venden un 32% más rápido. Matterport lidera con millones de propiedades.", como_aplicar:"La mayoría de fotos en Idealista son pésimas. Una empresa especializada a 150-400€ por propiedad tiene demanda inmediata.", riesgos:["Equipo y dron con coste inicial","Licencia AESA","Hay que fidelizar a la inmobiliaria"], pasos:["Licencia en AESA","Cámara full-frame + dron DJI","Suscripción a Matterport","Visitar inmobiliarias con portfolio"] },
  { id:19, nombre:"Tutorías Online IA + Humano", emoji:"📚", sector:"Educación", potencial:"Alta", dificultad:"Moderada", resumen:"La IA detecta lagunas del alumno y un tutor humano las trabaja en sesiones personalizadas.", por_que:"Khan Academy y Varsity Tutors tienen millones de usuarios. IA + humano tiene resultados superiores.", como_aplicar:"España tiene 8M de estudiantes de ESO. El mercado de academias es enorme pero poco tecnificado.", riesgos:["Captación costosa","Resultados difíciles de atribuir","Competencia de Smartick"], pasos:["Empezar con Matemáticas de ESO","Tutores universitarios a 12-18€/hora","Diagnóstico inicial gratuito","Grupos de padres en WhatsApp"] },
  { id:20, nombre:"Academia de Finanzas Personales", emoji:"💰", sector:"Educación", potencial:"Alta", dificultad:"Fácil", resumen:"Cursos y comunidad para gestionar dinero, invertir y planificar la jubilación.", por_que:"Ramsey Solutions genera más de 300M$. La educación financiera tiene demanda masiva entre millennials.", como_aplicar:"España tiene cultura financiera muy baja. Un programa de 90 días a 197-497€ con comunidad tiene propuesta clara.", riesgos:["No puedes asesorar sin licencia CNMV","Credibilidad del instructor fundamental","YouTube compite directamente"], pasos:["Contenido gratuito 6 meses primero","Curso 90 días: presupuesto → ahorro → inversión","Diferenciarse de asesoramiento","Comunidad Discord"] },
  { id:21, nombre:"Formación en Oficios del Futuro", emoji:"⚡", sector:"Educación", potencial:"Alta", dificultad:"Moderada", resumen:"Cursos certificados para instaladores de paneles solares y técnicos de la transición energética.", por_que:"Con la transición energética faltan cientos de miles de técnicos. Las empresas pagan formación porque no encuentran profesionales.", como_aplicar:"España tiene objetivo de 74% de renovables en 2030. Faltan instaladores cualificados.", riesgos:["Certificaciones lentas","Contenido técnico requiere expertos","Cambio tecnológico rápido"], pasos:["Alianza con fabricante de paneles","80% presencial en instalaciones reales","B2B primero","Subvenciones del SEPE"] },
  { id:22, nombre:"Energía Solar Comunitaria", emoji:"☀️", sector:"Sostenibilidad", potencial:"Alta", dificultad:"Difícil", resumen:"Comunidades de propietarios que comparten instalación solar y reparten el ahorro.", por_que:"En EE.UU. las solar communities han reducido la factura de millones de hogares.", como_aplicar:"España tiene 2.800 horas de sol y facturas muy altas. La normativa ya lo permite. Falta el intermediario.", riesgos:["Aprobación de comunidad lenta","Inversión inicial alta","Trámites con distribuidoras complejos"], pasos:["Especializarse en autoconsumo comunitario","Acuerdo con instalador solar","Modelo 0€ entrada con cuota < ahorro","Administradores de fincas como canal"] },
  { id:23, nombre:"Reparación de Electrónica", emoji:"🔌", sector:"Sostenibilidad", potencial:"Alta", dificultad:"Fácil", resumen:"Servicio de reparación de móviles y electrodomésticos contra la obsolescencia programada.", por_que:"iFixit ha construido un movimiento en torno al derecho a reparar. La normativa europea obliga a facilitar piezas.", como_aplicar:"España desecha 900.000 toneladas de residuos electrónicos al año. Precio transparente + garantía + recogida a domicilio.", riesgos:["Técnicos cualificados difíciles de retener","Proveedores de piezas no fiables","Fabricantes que dificultan el acceso"], pasos:["Empezar con móviles y portátiles","Certificarse como SAT de 2-3 marcas","Recogida a domicilio","Precio fijo online antes de confirmar"] },
  { id:24, nombre:"Gestión de Residuos para Hostelería", emoji:"🍃", sector:"Sostenibilidad", potencial:"Alta", dificultad:"Moderada", resumen:"Ayuda a bares y restaurantes a separar y valorizar residuos cumpliendo normativa.", por_que:"Rubicon gestiona residuos de miles de restaurantes. La normativa obliga pero nadie sabe cómo cumplirla.", como_aplicar:"Nueva normativa obliga a gestionar aceite, orgánico y envases. Servicio todo incluido a 50-150€/mes.", riesgos:["Logística de recogida","Regulación varía por comunidad","Margen ajustado"], pasos:["Estudiar normativa local","Empezar con recogida de aceite","Acuerdo con gestores autorizados","Puerta a puerta en polígonos de hostelería"] },
];

const SECTORES = ["Todos","Food & Drink","Fitness","Salud","Tech","Retail","Servicios","Educación","Sostenibilidad"];
const SECTOR_ICON = {"Todos":"🌎","Food & Drink":"🍽️","Fitness":"💪","Salud":"🩺","Tech":"💻","Retail":"🛍️","Servicios":"🤝","Educación":"🎓","Sostenibilidad":"🌱"};
const POT = {Alta:{bg:"#dcfce7",text:"#16a34a",dot:"#22c55e"},Media:{bg:"#fef9c3",text:"#ca8a04",dot:"#eab308"},Baja:{bg:"#fee2e2",text:"#dc2626",dot:"#ef4444"}};
const DIF = {Fácil:{bg:"#dbeafe",text:"#1d4ed8",dot:"#3b82f6"},Moderada:{bg:"#ede9fe",text:"#6d28d9",dot:"#8b5cf6"},Difícil:{bg:"#ffedd5",text:"#c2410c",dot:"#f97316"}};

function Pill({label,map}){
  const s=map[label]||{bg:"#f3f4f6",text:"#374151",dot:"#9ca3af"};
  return <span style={{background:s.bg,color:s.text,display:"inline-flex",alignItems:"center",gap:5,fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:99}}><span style={{background:s.dot,width:6,height:6,borderRadius:"50%",display:"inline-block"}}/>{label}</span>;
}

function PaywallModal({onClose}){
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:60,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"white",borderRadius:20,padding:28,width:"100%",maxWidth:400,textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:12}}>🔒</div>
        <h2 style={{fontSize:20,fontWeight:800,color:"#111827",margin:"0 0 8px"}}>Contenido Premium</h2>
        <p style={{fontSize:14,color:"#6b7280",lineHeight:1.6,margin:"0 0 20px"}}>
          Has visto las {FREE_LIMIT} oportunidades gratuitas.<br/>
          Suscríbete por solo <strong>5€/mes</strong> y accede a las {TRENDS.length} oportunidades con análisis completo.
        </p>
        <div style={{background:"#f0f9ff",borderRadius:12,padding:16,marginBottom:20,textAlign:"left"}}>
          <p style={{fontSize:12,fontWeight:700,color:"#374151",margin:"0 0 8px"}}>✅ Incluye:</p>
          {["Acceso a las 24 oportunidades completas","Por qué funciona en EE.UU.","Cómo aplicarlo paso a paso en España","Análisis de riesgos detallado","Nuevas oportunidades cada mes","Cancela cuando quieras"].map((item,i)=>(
            <p key={i} style={{fontSize:13,color:"#4b5563",margin:"0 0 4px"}}>• {item}</p>
          ))}
        </div>
        <a href={STRIPE_LINK} target="_blank" rel="noopener noreferrer"
          style={{display:"block",background:"#6366f1",color:"white",padding:14,borderRadius:12,fontSize:15,fontWeight:700,textDecoration:"none",marginBottom:10}}>
          Suscribirme por 5€/mes →
        </a>
        <button onClick={onClose} style={{background:"none",border:"none",color:"#9ca3af",fontSize:13,cursor:"pointer"}}>Ahora no</button>
      </div>
    </div>
  );
}

function Modal({t,onClose,onPaywall}){
  if(!t)return null;
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:50,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"white",width:"100%",maxWidth:560,borderRadius:"20px 20px 0 0",padding:"24px 20px 40px",overflowY:"auto",maxHeight:"88vh"}}>
        <div style={{width:36,height:4,background:"#e5e7eb",borderRadius:99,margin:"0 auto 18px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
          <div style={{flex:1}}>
            <p style={{fontSize:10,fontWeight:700,color:"#6366f1",textTransform:"uppercase",letterSpacing:"0.08em",margin:"0 0 4px"}}>{t.sector}</p>
            <h2 style={{fontSize:19,fontWeight:800,color:"#111827",margin:0}}>{t.emoji} {t.nombre}</h2>
          </div>
          <button onClick={onClose} style={{background:"#f3f4f6",border:"none",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:16,color:"#6b7280",marginLeft:10}}>✕</button>
        </div>
        <div style={{display:"flex",gap:6,marginBottom:16}}><Pill label={t.potencial} map={POT}/><Pill label={t.dificultad} map={DIF}/></div>
        <p style={{fontSize:13,color:"#4b5563",lineHeight:1.6,marginBottom:18}}>{t.resumen}</p>
        {[{title:"🇺🇸 Por qué funciona en EE.UU.",content:t.por_que},{title:"🇪🇸 Cómo aplicarlo en España",content:t.como_aplicar}].map(({title,content})=>(
          <div key={title} style={{background:"#f9fafb",borderRadius:12,padding:14,marginBottom:14}}>
            <p style={{fontSize:10,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:"0.07em",margin:"0 0 6px"}}>{title}</p>
            <p style={{fontSize:13,color:"#4b5563",lineHeight:1.6,margin:0}}>{content}</p>
          </div>
        ))}
        <div style={{marginBottom:14}}>
          <p style={{fontSize:10,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:"0.07em",margin:"0 0 8px"}}>⚠️ Riesgos</p>
          {t.riesgos.map((r,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:5}}><span style={{color:"#f87171",fontWeight:700}}>✕</span><p style={{fontSize:13,color:"#6b7280",margin:0,lineHeight:1.5}}>{r}</p></div>)}
        </div>
        <div style={{background:"#f0f9ff",borderRadius:12,padding:14}}>
          <p style={{fontSize:10,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:"0.07em",margin:"0 0 8px"}}>🚀 Primeros pasos</p>
          {t.pasos.map((p,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:7}}><span style={{background:"#6366f1",color:"white",fontWeight:700,fontSize:11,width:20,height:20,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{i+1}</span><p style={{fontSize:13,color:"#374151",margin:0,lineHeight:1.5}}>{p}</p></div>)}
        </div>
        <button onClick={()=>{onClose();onPaywall();}} style={{width:"100%",background:"#6366f1",color:"white",border:"none",borderRadius:12,padding:13,fontSize:14,fontWeight:700,cursor:"pointer",marginTop:16}}>
          🔓 Ver las {TRENDS.length} oportunidades — 5€/mes
        </button>
      </div>
    </div>
  );
}

export default function App(){
  const [sector,setSector]=useState("Todos");
  const [query,setQuery]=useState("");
  const [selected,setSelected]=useState(null);
  const [showPaywall,setShowPaywall]=useState(false);

  const filtered=useMemo(()=>TRENDS.filter(t=>{
    const ms=sector==="Todos"||t.sector===sector;
    const mq=!query||t.nombre.toLowerCase().includes(query.toLowerCase())||t.resumen.toLowerCase().includes(query.toLowerCase());
    return ms&&mq;
  }),[sector,query]);

  const handleCard=(t,idx)=>{
    if(idx>=FREE_LIMIT){setShowPaywall(true);return;}
    setSelected(t);
  };

  return(
    <div style={{minHeight:"100vh",background:"#f8f8fc",fontFamily:"system-ui,-apple-system,sans-serif"}}>
      {/* Header */}
      <div style={{background:"white",borderBottom:"1px solid #e5e7eb",padding:"20px 16px 0"}}>
        <div style={{maxWidth:640,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:24}}>🌎</span>
              <div>
                <p style={{fontSize:10,fontWeight:700,color:"#6366f1",textTransform:"uppercase",letterSpacing:"0.1em",margin:0}}>Radar de Oportunidades</p>
                <h1 style={{fontSize:20,fontWeight:800,color:"#111827",margin:0}}>TrendSpain</h1>
              </div>
            </div>
            <button onClick={()=>setShowPaywall(true)}
              style={{background:"#6366f1",color:"white",border:"none",borderRadius:10,padding:"8px 14px",fontSize:12,fontWeight:700,cursor:"pointer"}}>
              🔓 Pro — 5€/mes
            </button>
          </div>
          <p style={{fontSize:12,color:"#9ca3af",margin:"0 0 14px 34px"}}>Negocios que triunfan en EE.UU. y aún no han llegado a España</p>

          {/* Freemium banner */}
          <div style={{background:"linear-gradient(135deg,#eef2ff,#f0f9ff)",border:"1px solid #c7d2fe",borderRadius:12,padding:"10px 14px",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
            <p style={{fontSize:12,color:"#3730a3",margin:0,lineHeight:1.4}}>
              <strong>Gratis:</strong> primeras {FREE_LIMIT} oportunidades · <strong>{TRENDS.length-FREE_LIMIT} bloqueadas</strong>
            </p>
            <button onClick={()=>setShowPaywall(true)}
              style={{background:"#6366f1",color:"white",border:"none",borderRadius:8,padding:"6px 12px",fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>
              Ver todo
            </button>
          </div>

          <div style={{position:"relative",marginBottom:14}}>
            <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#9ca3af"}}>🔍</span>
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar oportunidad…"
              style={{width:"100%",padding:"10px 12px 10px 36px",border:"1.5px solid #e5e7eb",borderRadius:12,fontSize:14,outline:"none",background:"#f9fafb",boxSizing:"border-box"}}/>
          </div>
          <div style={{display:"flex",overflowX:"auto"}}>
            {SECTORES.map(s=>(
              <button key={s} onClick={()=>setSector(s)}
                style={{padding:"10px 12px",fontSize:12,fontWeight:600,border:"none",background:"none",cursor:"pointer",whiteSpace:"nowrap",
                  borderBottom:sector===s?"2.5px solid #6366f1":"2.5px solid transparent",
                  color:sector===s?"#6366f1":"#6b7280"}}>
                {SECTOR_ICON[s]} {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards */}
      <div style={{maxWidth:640,margin:"0 auto",padding:16}}>
        <p style={{fontSize:13,color:"#9ca3af",marginBottom:12}}>
          <span style={{fontWeight:700,color:"#111827"}}>{filtered.length}</span> oportunidades · 
          <span style={{color:"#6366f1",fontWeight:600}}> {FREE_LIMIT} gratis</span>
        </p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
          {filtered.map((t,i)=>{
            const locked=i>=FREE_LIMIT;
            return(
              <button key={t.id} onClick={()=>handleCard(t,i)}
                style={{textAlign:"left",background:"white",border:`1px solid ${locked?"#e5e7eb":"#e5e7eb"}`,borderRadius:14,padding:18,cursor:"pointer",transition:"all 0.15s",opacity:locked?0.8:1,position:"relative"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=locked?"#e5e7eb":"#6366f1";e.currentTarget.style.boxShadow=locked?"none":"0 4px 20px rgba(99,102,241,0.1)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="#e5e7eb";e.currentTarget.style.boxShadow="none";}}>
                {locked&&<div style={{position:"absolute",top:10,right:10,background:"#f3f4f6",borderRadius:99,padding:"2px 8px",fontSize:10,fontWeight:700,color:"#9ca3af"}}>🔒 Pro</div>}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div style={{paddingRight:locked?50:0}}>
                    <p style={{fontSize:10,fontWeight:700,color:"#6366f1",textTransform:"uppercase",letterSpacing:"0.08em",margin:"0 0 3px"}}>{t.sector}</p>
                    <h3 style={{fontSize:14,fontWeight:700,color:locked?"#9ca3af":"#111827",margin:0,lineHeight:1.3}}>{t.nombre}</h3>
                  </div>
                  <span style={{fontSize:24,flexShrink:0,marginLeft:8,filter:locked?"grayscale(1)":"none"}}>{t.emoji}</span>
                </div>
                {locked
                  ?<p style={{fontSize:12,color:"#d1d5db",lineHeight:1.5,margin:"0 0 12px"}}>Suscríbete para ver el análisis completo...</p>
                  :<p style={{fontSize:12,color:"#6b7280",lineHeight:1.5,margin:"0 0 12px",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{t.resumen}</p>
                }
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  <Pill label={t.potencial} map={POT}/>
                  <Pill label={t.dificultad} map={DIF}/>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <Modal t={selected} onClose={()=>setSelected(null)} onPaywall={()=>setShowPaywall(true)}/>
      {showPaywall&&<PaywallModal onClose={()=>setShowPaywall(false)}/>}
    </div>
  );
}

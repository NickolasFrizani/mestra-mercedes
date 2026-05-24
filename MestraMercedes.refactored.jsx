import { useState, useEffect } from "react";

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [particles, setParticles] = useState([]);
  const [visible, setVisible] = useState({});
  const [form, setForm] = useState({ name:"",phone:"",email:"",birth:"",service:"",date:"",time:"" });

  useEffect(() => {
    setParticles(Array.from({length:35},(_,i)=>({
      id:i, x:Math.random()*100, size:Math.random()*3+1,
      delay:Math.random()*10, dur:Math.random()*12+8, op:Math.random()*0.5+0.15
    })));
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if(e.isIntersecting) setVisible(v=>({...v,[e.target.id]:true})); });
    }, {threshold:0.12});
    document.querySelectorAll("[data-obs]").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const V = id => visible[id] ? {opacity:1,transform:"translateY(0)"} : {opacity:0,transform:"translateY(40px)"};
  const T = "all .7s ease";

  const services = [
    {icon:"✦",name:"Reiki",desc:"Harmonização dos chacras e desbloqueio dos canais de energia vital para restaurar equilíbrio físico e emocional.",tags:["Alívio de dores","Redução do estresse","Equilíbrio emocional"]},
    {icon:"◈",name:"Radiestesia",desc:"Uso de pêndulos para diagnóstico energético profundo e orientação espiritual personalizada.",tags:["Diagnóstico energético","Orientação espiritual","Limpeza de ambientes"]},
    {icon:"☯",name:"Feng Shui",desc:"Harmonização de espaços para atrair abundância, saúde e prosperidade para sua vida.",tags:["Harmonia no lar","Atração de prosperidade","Bem-estar familiar"]},
    {icon:"∞",name:"Numerologia",desc:"Decodificação do mapa numerológico para revelar seu propósito e caminhos de evolução.",tags:["Autoconhecimento","Clareza de propósito","Decisões assertivas"]},
    {icon:"◉",name:"Limpeza Energética",desc:"Remoção de energias densas e bloqueios que impedem seu crescimento e felicidade.",tags:["Leveza interior","Proteção energética","Renovação espiritual"]},
    {icon:"✧",name:"Consultoria Espiritual",desc:"Sessão completa integrando todas as terapias para uma transformação profunda e duradoura.",tags:["Visão holística","Plano personalizado","Acompanhamento"]},
  ];

  const testimonials = [
    {name:"Ana Lima",city:"São Paulo",text:"Depois da sessão com a Mestra Mercedes minha vida mudou completamente. Sentia um bloqueio enorme no amor e após o Reiki conheci meu parceiro em 3 semanas!"},
    {name:"Carlos Mendes",city:"Campinas",text:"A limpeza energética foi transformadora. Meu negócio estava parado há 2 anos, e após a consultoria, em 1 mês triplicou o faturamento."},
    {name:"Patricia Souza",city:"Santos",text:"A Numerologia revelou meu propósito de vida. Mudei de carreira e hoje vivo com muito mais felicidade e propósito verdadeiro."},
    {name:"Roberto Silva",city:"Rio de Janeiro",text:"Sofria com ansiedade há anos. Após 3 sessões de Reiki com a Mestra Mercedes, encontrei uma paz que nunca havia experimentado."},
  ];

  const times = ["09:00","10:00","11:00","14:00","15:00","16:00","17:00","18:00"];

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r=>setTimeout(r,2000));
    setLoading(false); setSubmitted(true);
  };

  const openWA = () => {
    window.open("https://wa.me/5511999999999?text="+encodeURIComponent("Olá Mestra Mercedes! Gostaria de agendar uma consulta. 🙏✨"),"_blank");
  };

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({behavior:"smooth"});

  const inp = "inp";
  const gold = s => ({...s, color:"#d4af37"});

  return (
    <div style={{fontFamily:"'Georgia',serif",background:"#080612",minHeight:"100vh",overflowX:"hidden",color:"#f8f3e8"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&display=swap');
        *{box-sizing:border-box}
        @keyframes floatUp{0%{opacity:0;transform:translateY(0)}10%{opacity:1}90%{opacity:.6}100%{transform:translateY(-100vh) translateX(15px);opacity:0}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes glow{0%,100%{box-shadow:0 0 20px rgba(212,175,55,.2),0 0 50px rgba(212,175,55,.06)}50%{box-shadow:0 0 40px rgba(212,175,55,.45),0 0 100px rgba(212,175,55,.12)}}
        @keyframes spinS{to{transform:rotate(360deg)}}
        @keyframes spinR{to{transform:rotate(-360deg)}}
        @keyframes pulseE{0%,100%{transform:scale(1);opacity:.35}50%{transform:scale(1.06);opacity:.8}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes ripple{0%{transform:scale(.8);opacity:.6}100%{transform:scale(2.6);opacity:0}}
        @keyframes spinBtn{to{transform:rotate(360deg)}}
        .pt{position:absolute;border-radius:50%;background:radial-gradient(circle,#d4af37,#f0e68c66);animation:floatUp linear infinite;pointer-events:none}
        .sh{background:linear-gradient(90deg,#d4af37,#f8f0c8,#d4af37,#c9a227,#f8efb8,#d4af37);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 3.5s linear infinite}
        .gw{animation:glow 3s ease-in-out infinite}
        .sp{animation:spinS 28s linear infinite}
        .sr{animation:spinR 18s linear infinite}
        .pe{animation:pulseE 5s ease-in-out infinite}
        .rg{position:absolute;border-radius:50%;border:1px solid rgba(212,175,55,.18);animation:ripple 3.5s ease-out infinite;pointer-events:none}
        .cd{transition:all .4s cubic-bezier(.4,0,.2,1)}
        .cd:hover{transform:translateY(-6px);box-shadow:0 20px 55px rgba(212,175,55,.15)}
        .bg{background:linear-gradient(135deg,#d4af37 0%,#f0cc5a 50%,#c9a227 100%);color:#1a1208;border:none;cursor:pointer;font-family:'Cormorant Garamond','Georgia',serif;transition:all .3s;letter-spacing:.04em;font-weight:600}
        .bg:hover{transform:translateY(-2px);box-shadow:0 10px 38px rgba(212,175,55,.42);filter:brightness(1.08)}
        .bg:disabled{opacity:.45;transform:none;cursor:not-allowed}
        .bo{background:transparent;border:1px solid rgba(212,175,55,.45);color:#d4af37;cursor:pointer;font-family:'Cormorant Garamond','Georgia',serif;transition:all .3s}
        .bo:hover{background:rgba(212,175,55,.07);border-color:#d4af37;transform:translateY(-1px)}
        .gl{background:rgba(255,255,255,.033);backdrop-filter:blur(20px);border:1px solid rgba(212,175,55,.12)}
        .inp{background:rgba(255,255,255,.05);border:1px solid rgba(212,175,55,.2);color:#f8f3e8;outline:none;font-family:'Cormorant Garamond','Georgia',serif;transition:all .3s;width:100%;padding:.85rem 1rem;border-radius:6px;font-size:1rem}
        .inp:focus{border-color:#d4af37;box-shadow:0 0 0 3px rgba(212,175,55,.1)}
        .inp::placeholder{color:rgba(248,243,232,.32)}
        select.inp option{background:#120d24;color:#f8f3e8}
        .dv{width:70px;height:1px;background:linear-gradient(90deg,transparent,#d4af37,transparent);margin:0 auto}
        .nl{color:rgba(248,243,232,.62);cursor:pointer;font-size:.87rem;letter-spacing:.07em;transition:color .3s;font-family:inherit;background:none;border:none}
        .nl:hover{color:#d4af37}
        @media(max-width:768px){
          .g2{grid-template-columns:1fr!important}
          .g3{grid-template-columns:1fr!important}
          .g4{grid-template-columns:repeat(2,1fr)!important}
          .hi{display:none!important}
          .ht{font-size:2.1rem!important}
          .st{font-size:1.85rem!important}
        }
      `}</style>

      {/* Particles */}
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"}}>
        {particles.map(p=>(
          <div key={p.id} className="pt" style={{left:`${p.x}%`,bottom:"-4px",width:p.size+"px",height:p.size+"px",animationDelay:p.delay+"s",animationDuration:p.dur+"s",opacity:p.op,boxShadow:`0 0 ${p.size*2}px rgba(212,175,55,.65)`}} />
        ))}
      </div>

      {/* NAV */}
      <nav className="gl" style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"1rem 2rem"}}>
        <div style={{maxWidth:1200,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div onClick={()=>scrollTo("hero")} style={{cursor:"pointer"}}>
            <div className="sh" style={{fontSize:"1.3rem",fontWeight:700,letterSpacing:".07em"}}>✦ Mercedes Miagawa</div>
            <div style={{color:"rgba(212,175,55,.5)",fontSize:".66rem",letterSpacing:".2em",textTransform:"uppercase"}}>Terapeuta Energética</div>
          </div>
          <div style={{display:"flex",gap:"1.8rem",alignItems:"center"}}>
            {[["Serviços","services"],["Sobre","about"],["Depoimentos","testimonials"]].map(([l,id])=>(
              <button key={id} className="nl" onClick={()=>scrollTo(id)}>{l}</button>
            ))}
            <button className="bg" style={{padding:".55rem 1.5rem",borderRadius:4,fontSize:".83rem"}} onClick={()=>setModalOpen(true)}>Agendar</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero" style={{minHeight:"100vh",display:"flex",alignItems:"center",padding:"6rem 2rem 4rem",position:"relative"}}>
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",opacity:.04,overflow:"hidden",pointerEvents:"none"}}>
          <div className="sp" style={{width:800,height:800,border:"1px solid #d4af37",borderRadius:"50%",position:"absolute"}} />
          <div className="sr" style={{width:580,height:580,border:"1px solid #d4af37",position:"absolute",transform:"rotate(45deg)"}} />
          <div className="sp" style={{width:380,height:380,border:"1px solid #d4af37",borderRadius:"50%",position:"absolute"}} />
        </div>
        <div className="pe" style={{position:"absolute",top:"12%",left:"4%",width:480,height:480,background:"radial-gradient(circle,rgba(212,175,55,.055) 0%,transparent 70%)",borderRadius:"50%",pointerEvents:"none"}} />
        <div className="pe" style={{position:"absolute",bottom:"12%",right:"4%",width:340,height:340,background:"radial-gradient(circle,rgba(130,80,200,.045) 0%,transparent 70%)",borderRadius:"50%",animationDelay:"2.5s",pointerEvents:"none"}} />

        <div style={{maxWidth:1200,margin:"0 auto",width:"100%",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4rem",alignItems:"center"}} className="g2">
          <div style={{animation:"fadeUp 1s ease both"}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:".5rem",background:"rgba(212,175,55,.07)",border:"1px solid rgba(212,175,55,.22)",borderRadius:100,padding:".4rem 1.1rem",marginBottom:"1.5rem"}}>
              <span style={{color:"#d4af37",fontSize:".75rem"}}>✦</span>
              <span style={{color:"#d4af37",fontSize:".72rem",letterSpacing:".15em",textTransform:"uppercase"}}>Terapeuta Energética Certificada</span>
            </div>
            <h1 className="ht" style={{fontSize:"2.9rem",fontWeight:700,lineHeight:1.2,color:"#f8f3e8",marginBottom:"1.5rem"}}>
              Libere seus <span className="sh">bloqueios energéticos</span> e transforme sua vida
            </h1>
            <p style={{color:"rgba(248,243,232,.65)",fontSize:"1.03rem",lineHeight:1.9,marginBottom:"2.5rem",fontWeight:300,fontStyle:"italic"}}>
              Há mais de 20 anos guiando pessoas na jornada de cura, equilíbrio e expansão espiritual. Sua transformação começa aqui.
            </p>
            <div style={{display:"flex",gap:"1rem",flexWrap:"wrap"}}>
              <button className="bg" style={{padding:"1rem 2.5rem",borderRadius:4,fontSize:"1rem"}} onClick={()=>setModalOpen(true)}>✦ Agendar Consulta</button>
              <button className="bo" style={{padding:"1rem 2rem",borderRadius:4,fontSize:".93rem"}} onClick={openWA}>WhatsApp</button>
            </div>
            <div style={{display:"flex",gap:"2.5rem",marginTop:"3rem",paddingTop:"2rem",borderTop:"1px solid rgba(212,175,55,.1)"}}>
              {[["500+","Vidas Transformadas"],["20+","Anos de Experiência"],["6","Especialidades"]].map(([n,l])=>(
                <div key={l}>
                  <div className="sh" style={{fontSize:"1.65rem",fontWeight:700}}>{n}</div>
                  <div style={{color:"rgba(248,243,232,.42)",fontSize:".76rem"}}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hi" style={{display:"flex",justifyContent:"center",position:"relative",animation:"fadeUp 1s ease .3s both"}}>
            <div style={{position:"relative",width:320}}>
              {[0,1,2].map(i=>(
                <div key={i} className="rg" style={{width:250+i*65+"px",height:250+i*65+"px",top:-(i*32)+"px",left:-(i*32)+"px",animationDelay:i*0.9+"s"}} />
              ))}
              <div className="gw" style={{borderRadius:12,overflow:"hidden",position:"relative",zIndex:1}}>
                <img src="/photos/photo2.jpg" alt="Mestra Mercedes com cartas de tarô e radiestesia" style={{width:"100%",display:"block",filter:"brightness(1.03)"}} />
                <div style={{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(transparent,rgba(8,6,18,.88))",padding:"1.8rem 1.4rem 1.3rem"}}>
                  <div style={{color:"#d4af37",fontSize:"1rem",fontWeight:600}}>Mestra Mercedes Miagawa</div>
                  <div style={{color:"rgba(248,243,232,.6)",fontSize:".79rem"}}>Terapeuta Energética & Mestra em Reiki</div>
                </div>
              </div>
              <div className="gl" style={{position:"absolute",top:"1.5rem",right:"-1rem",padding:".75rem 1rem",borderRadius:8,textAlign:"center",zIndex:2,animation:"fadeUp 1s ease .8s both"}}>
                <div style={{color:"#d4af37",fontSize:"1.2rem"}}>★★★★★</div>
                <div style={{color:"rgba(248,243,232,.65)",fontSize:".7rem"}}>+500 avaliações</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PAIN */}
      <section style={{padding:"5rem 2rem",background:"linear-gradient(180deg,#080612,#0d0920)"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div id="pain" data-obs style={{textAlign:"center",marginBottom:"3.5rem",...V("pain"),transition:T}}>
            <div className="dv" style={{marginBottom:"1.5rem"}} />
            <h2 className="st" style={{fontSize:"2.2rem",color:"#f8f3e8",fontWeight:600}}>Você se identifica com <span className="sh">alguma dessas situações?</span></h2>
          </div>
          <div id="pain-g" data-obs style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"1.4rem",...V("pain-g"),transition:T+" .12s"}} className="g2">
            {[["💫","Ansiedade e estresse constantes","Seu corpo e mente vivem em alerta, sem conseguir descansar de verdade?"],
              ["🌑","Cansaço sem explicação","Dorme bem mas acorda exausto? Pode ser bloqueio energético impedindo sua vitalidade."],
              ["🔒","Bloqueios financeiros ou amorosos","Por mais que tente, as coisas não fluem no amor, nos relacionamentos ou no dinheiro?"],
              ["🧭","Sensação de estar perdido","Falta de propósito, direção ou clareza sobre o que fazer com sua vida?"]
            ].map(([ic,t,d])=>(
              <div key={t} className="gl cd" style={{padding:"1.8rem",borderRadius:12,display:"flex",gap:"1.3rem",alignItems:"flex-start"}}>
                <span style={{fontSize:"1.9rem",flexShrink:0}}>{ic}</span>
                <div>
                  <div style={{color:"#f8f3e8",fontSize:"1.03rem",fontWeight:600,marginBottom:".4rem"}}>{t}</div>
                  <div style={{color:"rgba(248,243,232,.55)",fontSize:".86rem",lineHeight:1.7}}>{d}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{textAlign:"center",marginTop:"3rem"}}>
            <p style={{color:"rgba(248,243,232,.62)",fontSize:"1rem",fontStyle:"italic",marginBottom:"1.4rem"}}>Se você respondeu sim, as terapias energéticas podem transformar sua vida.</p>
            <button className="bg" style={{padding:"1rem 3rem",borderRadius:4,fontSize:"1rem"}} onClick={()=>setModalOpen(true)}>Quero me transformar agora ✦</button>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{padding:"6rem 2rem",background:"#080612"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div id="svc" data-obs style={{textAlign:"center",marginBottom:"4rem",...V("svc"),transition:T}}>
            <div className="dv" style={{marginBottom:"1.5rem"}} />
            <h2 className="st" style={{fontSize:"2.2rem",color:"#f8f3e8",fontWeight:600,marginBottom:".7rem"}}>Terapias <span className="sh">Transformadoras</span></h2>
            <p style={{color:"rgba(248,243,232,.52)",fontSize:".98rem",fontStyle:"italic"}}>Cada sessão é única e personalizada para o que sua alma precisa</p>
          </div>
          <div id="svc-g" data-obs style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1.4rem",...V("svc-g"),transition:T+" .1s"}} className="g3">
            {services.map(s=>(
              <div key={s.name} className="gl cd" style={{padding:"1.8rem",borderRadius:12,position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,#d4af37,transparent)"}} />
                <div style={{color:"#d4af37",fontSize:"1.7rem",marginBottom:".9rem"}}>{s.icon}</div>
                <h3 style={{color:"#f8f3e8",fontSize:"1.15rem",fontWeight:600,marginBottom:".5rem"}}>{s.name}</h3>
                <p style={{color:"rgba(248,243,232,.55)",fontSize:".86rem",lineHeight:1.7,marginBottom:"1.1rem"}}>{s.desc}</p>
                <ul style={{listStyle:"none",padding:0,margin:"0 0 1.3rem",display:"flex",flexDirection:"column",gap:".3rem"}}>
                  {s.tags.map(t=>(
                    <li key={t} style={{color:"rgba(248,243,232,.62)",fontSize:".81rem",display:"flex",alignItems:"center",gap:".4rem"}}>
                      <span style={{color:"#d4af37"}}>✦</span>{t}
                    </li>
                  ))}
                </ul>
                <button className="bo" style={{width:"100%",padding:".68rem",borderRadius:4,fontSize:".81rem"}} onClick={()=>{setForm(f=>({...f,service:s.name}));setModalOpen(true);}}>
                  Agendar {s.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{padding:"6rem 2rem",background:"linear-gradient(180deg,#0d0920,#080612)"}}>
        <div style={{maxWidth:1200,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"5rem",alignItems:"center"}} className="g2">
          <div id="abt-i" data-obs style={{position:"relative",...V("abt-i"),transition:T}}>
            <div style={{position:"absolute",top:-18,left:-18,width:"calc(100% + 36px)",height:"calc(100% + 36px)",border:"1px solid rgba(212,175,55,.07)",borderRadius:16,pointerEvents:"none"}} />
            <div className="gw" style={{borderRadius:12,overflow:"hidden"}}>
              <img src="/photos/photo1.jpg" alt="Mestra Mercedes Miagawa terapeuta energética" style={{width:"100%",display:"block"}} />
            </div>
            <div className="gl" style={{position:"absolute",bottom:"2rem",right:"-1.8rem",padding:"1.2rem 1.4rem",borderRadius:12,maxWidth:185}}>
              <div className="sh" style={{fontSize:"1.7rem",fontWeight:700}}>20+</div>
              <div style={{color:"rgba(248,243,232,.6)",fontSize:".8rem"}}>anos transformando vidas com amor e sabedoria</div>
            </div>
          </div>
          <div id="abt-t" data-obs style={{...V("abt-t"),transition:T+" .15s"}}>
            <div className="dv" style={{margin:"0 0 1.5rem 0"}} />
            <h2 className="st" style={{fontSize:"2.2rem",color:"#f8f3e8",fontWeight:600,marginBottom:"1.2rem"}}>Conheça a <span className="sh">Mestra Mercedes</span></h2>
            <p style={{color:"rgba(248,243,232,.7)",fontSize:".98rem",lineHeight:1.9,marginBottom:"1.1rem",fontStyle:"italic"}}>
              Com mais de 20 anos de experiência em terapias energéticas, Mestra Mercedes Miagawa dedica sua vida a ajudar pessoas a encontrarem equilíbrio, cura e propósito.
            </p>
            <p style={{color:"rgba(248,243,232,.55)",fontSize:".9rem",lineHeight:1.9,marginBottom:"1.8rem"}}>
              Mestra em Reiki nível III, especialista em Radiestesia e Feng Shui, e profunda conhecedora de Numerologia, ela integra o conhecimento ancestral com técnicas modernas para criar sessões únicas e transformadoras.
            </p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".65rem",marginBottom:"1.8rem"}}>
              {["Reiki Mestre III","Feng Shui Avançado","Radiestesia","Numerologia","Limpeza Energética","Consultora Espiritual"].map(c=>(
                <div key={c} style={{display:"flex",alignItems:"center",gap:".45rem"}}>
                  <span style={{color:"#d4af37",fontSize:".85rem"}}>◈</span>
                  <span style={{color:"rgba(248,243,232,.62)",fontSize:".81rem"}}>{c}</span>
                </div>
              ))}
            </div>
            <button className="bg" style={{padding:"1rem 2.5rem",borderRadius:4,fontSize:".93rem"}} onClick={()=>setModalOpen(true)}>✦ Agendar com Mercedes</button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{padding:"6rem 2rem",background:"#080612"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <div id="how" data-obs style={{textAlign:"center",marginBottom:"4rem",...V("how"),transition:T}}>
            <div className="dv" style={{marginBottom:"1.5rem"}} />
            <h2 className="st" style={{fontSize:"2.2rem",color:"#f8f3e8",fontWeight:600}}>Como <span className="sh">funciona?</span></h2>
          </div>
          <div id="how-s" data-obs style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1.5rem",...V("how-s"),transition:T+" .1s"}} className="g4">
            {[["01","Escolha","Selecione a terapia ideal"],["02","Agende","Escolha data e horário"],["03","Confirme","Receba por email e WhatsApp"],["04","Transforme","Viva sua transformação"]].map(([n,t,d],i)=>(
              <div key={n} style={{textAlign:"center",position:"relative"}}>
                {i<3 && <div style={{position:"absolute",top:32,left:"58%",right:"-8%",height:1,background:"linear-gradient(90deg,#d4af37,transparent)",pointerEvents:"none"}} />}
                <div className="gw" style={{width:64,height:64,borderRadius:"50%",background:"rgba(212,175,55,.07)",border:"1px solid rgba(212,175,55,.32)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 1.2rem"}}>
                  <span className="sh" style={{fontSize:"1.05rem",fontWeight:700}}>{n}</span>
                </div>
                <div style={{color:"#f8f3e8",fontSize:".97rem",fontWeight:600,marginBottom:".5rem"}}>{t}</div>
                <div style={{color:"rgba(248,243,232,.48)",fontSize:".8rem",lineHeight:1.6}}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" style={{padding:"6rem 2rem",background:"linear-gradient(180deg,#0d0920,#080612)"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div id="test" data-obs style={{textAlign:"center",marginBottom:"4rem",...V("test"),transition:T}}>
            <div className="dv" style={{marginBottom:"1.5rem"}} />
            <h2 className="st" style={{fontSize:"2.2rem",color:"#f8f3e8",fontWeight:600}}>Vidas <span className="sh">Transformadas</span></h2>
          </div>
          <div id="test-g" data-obs style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"1.4rem",...V("test-g"),transition:T+" .1s"}} className="g2">
            {testimonials.map((t,i)=>(
              <div key={i} className="gl cd" style={{padding:"1.8rem",borderRadius:12}}>
                <div style={{color:"#d4af37",fontSize:"1.05rem",letterSpacing:2,marginBottom:".9rem"}}>★★★★★</div>
                <p style={{color:"rgba(248,243,232,.75)",fontSize:".9rem",lineHeight:1.8,fontStyle:"italic",marginBottom:"1.3rem"}}>"{t.text}"</p>
                <div style={{display:"flex",alignItems:"center",gap:".9rem"}}>
                  <div style={{width:42,height:42,borderRadius:"50%",background:"linear-gradient(135deg,#d4af37,#8b6914)",display:"flex",alignItems:"center",justifyContent:"center",color:"#1a1208",fontWeight:700,fontSize:"1.05rem",flexShrink:0}}>{t.name[0]}</div>
                  <div>
                    <div style={{color:"#f8f3e8",fontWeight:600,fontSize:".86rem"}}>{t.name}</div>
                    <div style={{color:"rgba(248,243,232,.42)",fontSize:".76rem"}}>{t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:"6rem 2rem",background:"#080612",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at center,rgba(212,175,55,.045) 0%,transparent 70%)",pointerEvents:"none"}} />
        <div style={{position:"relative",maxWidth:680,margin:"0 auto"}}>
          <div className="dv" style={{marginBottom:"2rem"}} />
          <h2 style={{fontSize:"2.5rem",color:"#f8f3e8",fontWeight:700,marginBottom:"1.4rem",lineHeight:1.3}}>Sua jornada de <span className="sh">transformação</span> começa agora</h2>
          <p style={{color:"rgba(248,243,232,.58)",fontSize:".98rem",fontStyle:"italic",marginBottom:"3rem",lineHeight:1.9}}>Não espere mais para viver a vida que você merece. Agende sua sessão.</p>
          <div style={{display:"flex",gap:"1rem",justifyContent:"center",flexWrap:"wrap"}}>
            <button className="bg" style={{padding:"1.1rem 2.8rem",borderRadius:4,fontSize:"1rem"}} onClick={()=>setModalOpen(true)}>✦ Agendar minha transformação</button>
            <button className="bo" style={{padding:"1.1rem 2.3rem",borderRadius:4,fontSize:".95rem"}} onClick={openWA}>WhatsApp</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="gl" style={{padding:"2.5rem 2rem",textAlign:"center",borderTop:"1px solid rgba(212,175,55,.1)"}}>
        <div className="sh" style={{fontSize:"1.1rem",fontWeight:600,marginBottom:".45rem"}}>✦ Mestra Mercedes Miagawa</div>
        <div style={{color:"rgba(248,243,232,.35)",fontSize:".76rem",letterSpacing:".07em"}}>mercedesmiagawa@gmail.com · Terapias Energéticas & Cura Holística</div>
        <div style={{marginTop:".65rem",color:"rgba(248,243,232,.22)",fontSize:".7rem"}}>© 2025 Mestra Mercedes Miagawa · Todos os direitos reservados</div>
      </footer>

      {/* BOOKING MODAL */}
      {modalOpen && (
        <div style={{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"}}>
          <div onClick={()=>{setModalOpen(false);setSubmitted(false);setStep(1);}} style={{position:"absolute",inset:0,background:"rgba(8,6,18,.93)",backdropFilter:"blur(10px)"}} />
          <div className="gl" style={{position:"relative",zIndex:1,width:"100%",maxWidth:510,borderRadius:16,padding:"2.4rem",maxHeight:"90vh",overflowY:"auto",border:"1px solid rgba(212,175,55,.26)",animation:"fadeUp .4s ease"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,#d4af37,transparent)",borderRadius:"16px 16px 0 0"}} />
            <button onClick={()=>{setModalOpen(false);setSubmitted(false);setStep(1);}} style={{position:"absolute",top:"1.1rem",right:"1.1rem",background:"none",border:"1px solid rgba(212,175,55,.22)",color:"rgba(248,243,232,.48)",cursor:"pointer",borderRadius:"50%",width:28,height:28,fontSize:".9rem",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>×</button>

            {!submitted ? (
              <>
                <h3 className="sh" style={{fontSize:"1.5rem",fontWeight:700,marginBottom:".35rem"}}>✦ Agendar Consulta</h3>
                <p style={{color:"rgba(248,243,232,.42)",fontSize:".83rem",marginBottom:"1.7rem"}}>Preencha seus dados para confirmar o agendamento</p>
                <div style={{display:"flex",gap:".4rem",marginBottom:"1.8rem"}}>
                  {[1,2].map(s=><div key={s} style={{flex:1,height:3,borderRadius:3,background:step>=s?"linear-gradient(90deg,#d4af37,#f0cc5a)":"rgba(212,175,55,.16)",transition:"background .4s"}} />)}
                </div>

                {step===1 && (
                  <div style={{display:"flex",flexDirection:"column",gap:"1rem",animation:"fadeUp .3s ease"}}>
                    <div style={{color:"#f8f3e8",fontSize:".97rem",fontWeight:600,marginBottom:".2rem"}}>Seus dados</div>
                    {[["name","Nome completo","text","Seu nome completo"],["email","E-mail","email","seu@email.com"],["phone","WhatsApp","tel","(11) 99999-9999"],["birth","Data de Nascimento","date",""]].map(([f,l,t,p])=>(
                      <div key={f}>
                        <label style={{color:"rgba(248,243,232,.62)",fontSize:".81rem",display:"block",marginBottom:".32rem"}}>{l} *</label>
                        <input type={t} placeholder={p} value={form[f]} onChange={e=>setForm(prev=>({...prev,[f]:e.target.value}))} className="inp" />
                      </div>
                    ))}
                    <button className="bg" style={{padding:".95rem",borderRadius:6,fontSize:".93rem",marginTop:".2rem"}} onClick={()=>setStep(2)} disabled={!form.name||!form.email||!form.phone}>Continuar →</button>
                  </div>
                )}

                {step===2 && (
                  <div style={{display:"flex",flexDirection:"column",gap:"1rem",animation:"fadeUp .3s ease"}}>
                    <div style={{color:"#f8f3e8",fontSize:".97rem",fontWeight:600,marginBottom:".2rem"}}>Escolha sua sessão</div>
                    <div>
                      <label style={{color:"rgba(248,243,232,.62)",fontSize:".81rem",display:"block",marginBottom:".32rem"}}>Tipo de Terapia *</label>
                      <select value={form.service} onChange={e=>setForm(f=>({...f,service:e.target.value}))} className="inp">
                        <option value="">Selecione uma terapia</option>
                        {services.map(s=><option key={s.name} value={s.name}>{s.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{color:"rgba(248,243,232,.62)",fontSize:".81rem",display:"block",marginBottom:".32rem"}}>Data *</label>
                      <input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} className="inp" min={new Date().toISOString().split("T")[0]} />
                    </div>
                    <div>
                      <label style={{color:"rgba(248,243,232,.62)",fontSize:".81rem",display:"block",marginBottom:".65rem"}}>Horário *</label>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:".38rem"}}>
                        {times.map(t=>(
                          <button key={t} onClick={()=>setForm(f=>({...f,time:t}))} style={{padding:".52rem",borderRadius:6,fontSize:".8rem",cursor:"pointer",fontFamily:"inherit",background:form.time===t?"linear-gradient(135deg,#d4af37,#f0cc5a)":"rgba(255,255,255,.04)",color:form.time===t?"#1a1208":"rgba(248,243,232,.62)",border:form.time===t?"none":"1px solid rgba(212,175,55,.16)",transition:"all .18s",fontWeight:form.time===t?600:400}}>{t}</button>
                        ))}
                      </div>
                    </div>
                    <div style={{display:"flex",gap:".65rem",marginTop:".2rem"}}>
                      <button className="bo" style={{flex:1,padding:".95rem",borderRadius:6,fontSize:".88rem"}} onClick={()=>setStep(1)}>← Voltar</button>
                      <button className="bg" style={{flex:2,padding:".95rem",borderRadius:6,fontSize:".9rem",display:"flex",alignItems:"center",justifyContent:"center",gap:".45rem"}} onClick={handleSubmit} disabled={!form.service||!form.date||!form.time||loading}>
                        {loading ? (<><div style={{width:15,height:15,border:"2px solid rgba(26,18,8,.28)",borderTop:"2px solid #1a1208",borderRadius:"50%",animation:"spinBtn .7s linear infinite"}} />Confirmando...</>) : "✦ Confirmar"}
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div style={{textAlign:"center",padding:"1.8rem 0",animation:"fadeUp .4s ease"}}>
                <div style={{fontSize:"3.2rem",marginBottom:".9rem"}}>✨</div>
                <h3 className="sh" style={{fontSize:"1.6rem",fontWeight:700,marginBottom:".9rem"}}>Agendamento Confirmado!</h3>
                <p style={{color:"rgba(248,243,232,.68)",lineHeight:1.8,marginBottom:".4rem",fontSize:".92rem"}}>
                  Olá <strong style={{color:"#f8f3e8"}}>{form.name}</strong>! Sua consulta de <strong style={{color:"#d4af37"}}>{form.service}</strong>
                </p>
                <p style={{color:"rgba(248,243,232,.68)",fontSize:".92rem",marginBottom:".35rem"}}>foi agendada para <strong style={{color:"#d4af37"}}>{form.date}</strong> às <strong style={{color:"#d4af37"}}>{form.time}</strong></p>
                <p style={{color:"rgba(248,243,232,.42)",fontSize:".8rem",marginBottom:"2.2rem",fontStyle:"italic"}}>Confirmação enviada para {form.email}</p>
                <div style={{display:"flex",flexDirection:"column",gap:".55rem"}}>
                  <button className="bg" style={{padding:".95rem",borderRadius:6,fontSize:".88rem"}} onClick={openWA}>Confirmar no WhatsApp</button>
                  <button className="bo" style={{padding:".82rem",borderRadius:6,fontSize:".84rem"}} onClick={()=>{setModalOpen(false);setSubmitted(false);setStep(1);setForm({name:"",phone:"",email:"",birth:"",service:"",date:"",time:""});}}>Fechar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* WhatsApp FAB */}
      <button onClick={openWA} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.12)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"} style={{position:"fixed",bottom:"2rem",right:"2rem",width:54,height:54,borderRadius:"50%",background:"linear-gradient(135deg,#25D366,#128C7E)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:150,boxShadow:"0 4px 18px rgba(37,211,102,.38)",transition:"all .3s"}}>
        <svg viewBox="0 0 24 24" fill="white" width="25" height="25"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
      </button>
    </div>
  );
}

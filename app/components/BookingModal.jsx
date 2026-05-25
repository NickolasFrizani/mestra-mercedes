"use client";
import { useState } from "react";
import { services, availableTimes } from "../../lib/data";

export default function BookingModal({ onClose, initialService = "" }) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    birth: "",
    service: initialService,
    date: "",
    time: "",
  });

  const handleSubmit = async () => {
    setLoading(true);
    // TODO: substituir por envio real (n8n webhook, email, Google Calendar API)
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    setSubmitted(true);
  };

  const reset = () => {
    setStep(1);
    setSubmitted(false);
    onClose();
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div onClick={reset} style={{ position: "absolute", inset: 0, background: "rgba(8,6,18,.93)", backdropFilter: "blur(10px)" }} />
      <div className="gl" style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 510, borderRadius: 16, padding: "2.4rem", maxHeight: "90vh", overflowY: "auto", border: "1px solid rgba(212,175,55,.26)", animation: "fadeUp .4s ease" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,#d4af37,transparent)", borderRadius: "16px 16px 0 0" }} />
        <button onClick={reset} style={{ position: "absolute", top: "1.1rem", right: "1.1rem", background: "none", border: "1px solid rgba(212,175,55,.22)", color: "rgba(248,243,232,.48)", cursor: "pointer", borderRadius: "50%", width: 28, height: 28, fontSize: ".9rem", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>×</button>

        {!submitted ? (
          <>
            <h3 className="sh" style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: ".35rem" }}>✦ Agendar Consulta</h3>
            <p style={{ color: "rgba(248,243,232,.42)", fontSize: ".83rem", marginBottom: "1.7rem" }}>
              Preencha seus dados para confirmar o agendamento
            </p>
            <div style={{ display: "flex", gap: ".4rem", marginBottom: "1.8rem" }}>
              {[1, 2].map((s) => (
                <div key={s} style={{ flex: 1, height: 3, borderRadius: 3, background: step >= s ? "linear-gradient(90deg,#d4af37,#f0cc5a)" : "rgba(212,175,55,.16)", transition: "background .4s" }} />
              ))}
            </div>

            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", animation: "fadeUp .3s ease" }}>
                <div style={{ color: "#f8f3e8", fontSize: ".97rem", fontWeight: 600, marginBottom: ".2rem" }}>
                  Seus dados
                </div>
                {[
                  ["name", "Nome completo", "text", "Seu nome completo"],
                  ["email", "E-mail", "email", "seu@email.com"],
                  ["phone", "WhatsApp", "tel", "(11) 99999-9999"],
                  ["birth", "Data de Nascimento", "date", ""],
                ].map(([f, l, t, p]) => (
                  <div key={f}>
                    <label style={{ color: "rgba(248,243,232,.62)", fontSize: ".81rem", display: "block", marginBottom: ".32rem" }}>
                      {l} *
                    </label>
                    <input
                      type={t}
                      placeholder={p}
                      value={form[f]}
                      onChange={(e) => setForm((prev) => ({ ...prev, [f]: e.target.value }))}
                      className="inp"
                    />
                  </div>
                ))}
                <button
                  className="bg"
                  style={{ padding: ".95rem", borderRadius: 6, fontSize: ".93rem", marginTop: ".2rem" }}
                  onClick={() => setStep(2)}
                  disabled={!form.name || !form.email || !form.phone}
                >
                  Continuar →
                </button>
              </div>
            )}

            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", animation: "fadeUp .3s ease" }}>
                <div style={{ color: "#f8f3e8", fontSize: ".97rem", fontWeight: 600, marginBottom: ".2rem" }}>
                  Escolha sua sessão
                </div>
                <div>
                  <label style={{ color: "rgba(248,243,232,.62)", fontSize: ".81rem", display: "block", marginBottom: ".32rem" }}>
                    Tipo de Terapia *
                  </label>
                  <select
                    value={form.service}
                    onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))}
                    className="inp"
                  >
                    <option value="">Selecione uma terapia</option>
                    {services.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ color: "rgba(248,243,232,.62)", fontSize: ".81rem", display: "block", marginBottom: ".32rem" }}>
                    Data *
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className="inp"
                    min={todayStr}
                  />
                </div>
                <div>
                  <label style={{ color: "rgba(248,243,232,.62)", fontSize: ".81rem", display: "block", marginBottom: ".65rem" }}>
                    Horário *
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: ".38rem" }}>
                    {availableTimes.map((t) => (
                      <button
                        key={t}
                        onClick={() => setForm((f) => ({ ...f, time: t }))}
                        style={{
                          padding: ".52rem",
                          borderRadius: 6,
                          fontSize: ".8rem",
                          cursor: "pointer",
                          fontFamily: "inherit",
                          background: form.time === t ? "linear-gradient(135deg,#d4af37,#f0cc5a)" : "rgba(255,255,255,.04)",
                          color: form.time === t ? "#1a1208" : "rgba(248,243,232,.62)",
                          border: form.time === t ? "none" : "1px solid rgba(212,175,55,.16)",
                          transition: "all .18s",
                          fontWeight: form.time === t ? 600 : 400,
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: ".65rem", marginTop: ".2rem" }}>
                  <button className="bo" style={{ flex: 1, padding: ".95rem", borderRadius: 6, fontSize: ".88rem" }} onClick={() => setStep(1)}>
                    ← Voltar
                  </button>
                  <button
                    className="bg"
                    style={{ flex: 2, padding: ".95rem", borderRadius: 6, fontSize: ".9rem", display: "flex", alignItems: "center", justifyContent: "center", gap: ".45rem" }}
                    onClick={handleSubmit}
                    disabled={!form.service || !form.date || !form.time || loading}
                  >
                    {loading ? (
                      <>
                        <div style={{ width: 15, height: 15, border: "2px solid rgba(26,18,8,.28)", borderTop: "2px solid #1a1208", borderRadius: "50%", animation: "spinBtn .7s linear infinite" }} />
                        Confirmando...
                      </>
                    ) : (
                      "✦ Confirmar"
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "1.8rem 0", animation: "fadeUp .4s ease" }}>
            <div style={{ fontSize: "3.2rem", marginBottom: ".9rem" }}>✨</div>
            <h3 className="sh" style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: ".9rem" }}>
              Agendamento Confirmado!
            </h3>
            <p style={{ color: "rgba(248,243,232,.68)", lineHeight: 1.8, marginBottom: ".4rem", fontSize: ".92rem" }}>
              Olá <strong style={{ color: "#f8f3e8" }}>{form.name}</strong>! Sua consulta de{" "}
              <strong style={{ color: "#d4af37" }}>{form.service}</strong>
            </p>
            <p style={{ color: "rgba(248,243,232,.68)", fontSize: ".92rem", marginBottom: ".35rem" }}>
              foi agendada para <strong style={{ color: "#d4af37" }}>{form.date}</strong> às{" "}
              <strong style={{ color: "#d4af37" }}>{form.time}</strong>
            </p>
            <p style={{ color: "rgba(248,243,232,.45)", fontSize: ".83rem", marginTop: "1.5rem", fontStyle: "italic" }}>
              Você receberá uma confirmação por email e WhatsApp em breve.
            </p>
            <button
              className="bg"
              style={{ padding: ".95rem 2rem", borderRadius: 6, fontSize: ".9rem", marginTop: "1.8rem" }}
              onClick={reset}
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

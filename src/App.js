import { useState } from "react";

const stations = [
  { name: "Gare du Mans", city: "Sarthe · TGV", places: 24, type: "Parc couvert", affluence: "Faible (12 vélos)", services: "Consignes, pompe", level: "low", dot: { left: "22%", top: "48%" }, count: 12 },
  { name: "Gare de Tours", city: "Indre-et-Loire · TER + TGV", places: 18, type: "Espace quai", affluence: "Modérée (27 vélos)", services: "Surveillance, réparation", level: "mid", dot: { left: "50%", top: "35%" }, count: 27 },
  { name: "Paris Montparnasse", city: "Paris · TGV + Intercités", places: 6, type: "Consignes sécurisées", affluence: "Élevée (41 vélos)", services: "Consignes payantes", level: "high", dot: { left: "72%", top: "55%" }, count: 41 },
  { name: "Gare d'Angers", city: "Maine-et-Loire · TGV + TER", places: 30, type: "Parc extérieur", affluence: "Faible (8 vélos)", services: "Surveillance, pompe", level: "low", dot: { left: "38%", top: "68%" }, count: 8 },
];

const affluenceData = {
  "Le Mans":      [1,1,2,4,10,18,15,11,8,7,9,12,14,10,9,19,25,20,13,9,6,4,2,1],
  "Tours":        [2,2,3,5,12,20,18,13,9,8,11,14,16,12,11,22,28,23,15,10,7,5,3,2],
  "Montparnasse": [3,3,5,8,18,30,27,20,14,12,16,20,24,18,16,35,41,36,25,16,11,8,5,3],
  "Angers":       [2,1,1,3,8,14,12,9,7,6,8,10,12,9,8,16,22,18,12,8,6,4,3,2],
};

const conseils = {
  "Angers": "Meilleur créneau : avant 8h ou après 19h. Pic entre 17h et 18h.",
  "Le Mans": "Créneau idéal : entre 9h et 15h. Évitez 17h–18h.",
  "Tours": "Préférez le matin avant 9h. Forte affluence en soirée.",
  "Montparnasse": "Gare très chargée. Créneau le moins chargé : avant 7h.",
};

const dotColor = { low: "#27ae60", mid: "#e67e22", high: "#c0392b" };
const badgeStyle = {
  low: { background: "#eafaf1", color: "#1e8449" },
  mid: { background: "#fef5e7", color: "#a04000" },
  high: { background: "#fdedec", color: "#922b21" },
};
const badgeLabel = { low: "Faible", mid: "Modérée", high: "Élevée" };
const HOURS = [6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];

const s = {
  app: { maxWidth: 390, margin: "0 auto", fontFamily: "system-ui, sans-serif", color: "#1a1a1a" },
  header: { background: "#c0392b", color: "white", padding: "14px 16px 12px", borderRadius: "12px 12px 0 0" },
  h1: { fontSize: 17, fontWeight: 500, margin: 0 },
  subtitle: { fontSize: 12, opacity: 0.85, marginTop: 2 },
  searchBar: { background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "8px 12px", marginTop: 10, fontSize: 13, color: "white", display: "flex", alignItems: "center", gap: 8 },
  tabs: { display: "flex", borderBottom: "0.5px solid #e0e0e0", background: "white" },
  tab: (active) => ({ flex: 1, padding: "10px 0", fontSize: 13, textAlign: "center", color: active ? "#c0392b" : "#888", cursor: "pointer", borderBottom: active ? "2px solid #c0392b" : "2px solid transparent", fontWeight: active ? 500 : 400, transition: "all 0.15s" }),
  mapArea: { background: "#dce8dc", height: 200, position: "relative", overflow: "hidden", borderBottom: "0.5px solid #e0e0e0" },
  dot: (color) => ({ position: "absolute", cursor: "pointer", transform: "translate(-50%, -50%)", textAlign: "center" }),
  dotCircle: (color) => ({ width: 28, height: 28, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "white", fontWeight: 500, border: "2px solid white", margin: "0 auto" }),
  dotLabel: { fontSize: 10, marginTop: 3, fontWeight: 500, whiteSpace: "nowrap", color: "#1a1a1a" },
  legend: { display: "flex", gap: 10, padding: "10px 12px", fontSize: 11, color: "#888", alignItems: "center" },
  legendDot: (color) => ({ width: 10, height: 10, borderRadius: "50%", background: color, display: "inline-block", marginRight: 3 }),
  panel: { background: "#f5f5f5", borderRadius: 12, padding: 14, margin: "8px 12px" },
  panelTitle: { fontSize: 13, fontWeight: 500, marginBottom: 10 },
  infoRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "0.5px solid #e0e0e0" },
  infoLabel: { fontSize: 13, color: "#888" },
  infoVal: { fontSize: 13, fontWeight: 500 },
  stationList: { padding: "0 12px" },
  sectionTitle: { fontSize: 12, color: "#888", padding: "12px 0 6px", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5 },
  card: (selected) => ({ background: "white", border: selected ? "1.5px solid #c0392b" : "0.5px solid #e0e0e0", borderRadius: 12, padding: "12px 14px", marginBottom: 8, cursor: "pointer" }),
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  cardName: { fontSize: 15, fontWeight: 500 },
  cardCity: { fontSize: 12, color: "#888", marginTop: 2 },
  badge: (level) => ({ fontSize: 11, padding: "3px 8px", borderRadius: 20, fontWeight: 500, ...badgeStyle[level] }),
  cardDetails: { display: "flex", gap: 16, marginTop: 10, paddingTop: 10, borderTop: "0.5px solid #e0e0e0" },
  detailItem: { fontSize: 12, color: "#888", display: "flex", alignItems: "center", gap: 4 },
  chip: (active) => ({ display: "inline-block", background: active ? "#c0392b" : "white", border: active ? "0.5px solid #c0392b" : "0.5px solid #e0e0e0", borderRadius: 20, padding: "4px 10px", fontSize: 12, color: active ? "white" : "#888", margin: "3px 3px 0 0", cursor: "pointer" }),
  barRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6 },
  barHour: { fontSize: 11, color: "#888", width: 30 },
  barVal: { fontSize: 11, color: "#888" },
  btn: { width: "calc(100% - 24px)", margin: "12px 12px 0", background: "#c0392b", color: "white", border: "none", borderRadius: 8, padding: 12, fontSize: 14, fontWeight: 500, cursor: "pointer" },
};

export default function App() {
  const [tab, setTab] = useState("carte");
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [affStation, setAffStation] = useState("Angers");

  const shortName = (name) => name.replace("Gare du ", "").replace("Gare de ", "").replace("Gare d'", "").replace("Paris ", "");

  const renderChart = (stationKey) => {
    const data = affluenceData[stationKey];
    const max = Math.max(...data);
    return HOURS.map(h => {
      const val = data[h];
      const pct = Math.round((val / max) * 160);
      const color = val > max * 0.7 ? "#c0392b" : val > max * 0.4 ? "#e67e22" : "#27ae60";
      return (
        <div key={h} style={s.barRow}>
          <span style={s.barHour}>{h}h</span>
          <div style={{ height: 18, width: pct, background: color, borderRadius: 3, minWidth: 4 }} />
          <span style={s.barVal}>{val}</span>
        </div>
      );
    });
  };

  return (
    <div style={s.app}>
      <div style={s.header}>
        <h1 style={s.h1}>Vélo & Train</h1>
        <p style={s.subtitle}>Espaces vélo en gare — CIM SNCF</p>
        <div style={s.searchBar}>
          <span>🔍</span>
          <span>Rechercher une gare...</span>
        </div>
      </div>

      <div style={s.tabs}>
        {["carte", "gares", "affluence"].map(t => (
          <div key={t} style={s.tab(tab === t)} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </div>
        ))}
      </div>

      {tab === "carte" && (
        <div>
          <div style={s.mapArea}>
            <svg width="100%" height="100%" viewBox="0 0 380 200">
              <rect width="380" height="200" fill="#dce8dc" />
              <path d="M0 100 Q80 80 160 110 Q240 135 320 95 Q350 85 380 90" stroke="#b0c8b0" strokeWidth="2" fill="none" />
              <path d="M60 0 Q70 50 80 100 Q90 150 100 200" stroke="#b0c8b0" strokeWidth="1.5" fill="none" />
              <path d="M200 0 Q210 60 200 120 Q190 160 210 200" stroke="#b0c8b0" strokeWidth="1.5" fill="none" />
              <text x="10" y="190" fontSize="10" fill="#9ab89a">Carte simulée — prototype</text>
            </svg>
            {stations.map((st, i) => (
              <div key={i} style={{ ...s.dot(), position: "absolute", left: st.dot.left, top: st.dot.top, transform: "translate(-50%,-50%)", cursor: "pointer", textAlign: "center" }} onClick={() => setSelectedStation(i)}>
                <div style={s.dotCircle(dotColor[st.level])}>{st.count}</div>
                <div style={s.dotLabel}>{shortName(st.name)}</div>
              </div>
            ))}
          </div>
          <div style={s.legend}>
            {[["#27ae60","Faible"],["#e67e22","Modérée"],["#c0392b","Élevée"]].map(([c,l]) => (
              <span key={l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={s.legendDot(c)} />{l}
              </span>
            ))}
          </div>
          {selectedStation !== null && (
            <div style={s.panel}>
              <div style={s.panelTitle}>{stations[selectedStation].name}</div>
              {[
                ["Places vélo disponibles", stations[selectedStation].places + " places"],
                ["Type d'espace", stations[selectedStation].type],
                ["Affluence actuelle", stations[selectedStation].affluence],
                ["Services", stations[selectedStation].services],
              ].map(([label, val], i, arr) => (
                <div key={label} style={{ ...s.infoRow, borderBottom: i === arr.length-1 ? "none" : "0.5px solid #e0e0e0" }}>
                  <span style={s.infoLabel}>{label}</span>
                  <span style={s.infoVal}>{val}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "gares" && (
        <div style={s.stationList}>
          <div style={s.sectionTitle}>Gares sur votre ligne</div>
          {stations.map((st, i) => (
            <div key={i} style={s.card(selectedCard === i)} onClick={() => setSelectedCard(i)}>
              <div style={s.cardTop}>
                <div>
                  <div style={s.cardName}>{st.name}</div>
                  <div style={s.cardCity}>{st.city}</div>
                </div>
                <span style={s.badge(st.level)}>{badgeLabel[st.level]}</span>
              </div>
              <div style={s.cardDetails}>
                <div style={s.detailItem}>🚲 <strong>{st.places}</strong> places</div>
                <div style={s.detailItem}>🔒 {st.services.split(",")[0]}</div>
                <div style={s.detailItem}>{st.level === "high" ? "🔴 Saturé" : "⚪ Ouvert"}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "affluence" && (
        <div style={s.stationList}>
          <div style={s.sectionTitle}>Prévision d'affluence — aujourd'hui</div>
          <div style={{ marginBottom: 12 }}>
            {["Angers","Le Mans","Tours","Montparnasse"].map(name => (
              <span key={name} style={s.chip(affStation === name)} onClick={() => setAffStation(name)}>{name}</span>
            ))}
          </div>
          <div style={{ ...s.panel, margin: "0 0 8px" }}>
            <div style={s.panelTitle}>
              {affStation === "Montparnasse" ? "Paris Montparnasse" : "Gare de " + affStation}
            </div>
            {renderChart(affStation)}
          </div>
          <div style={{ ...s.panel, margin: 0 }}>
            <div style={s.panelTitle}>Conseil</div>
            <p style={{ fontSize: 13, color: "#888", lineHeight: 1.5 }}>{conseils[affStation]}</p>
          </div>
          <button style={s.btn}>Voir les trains disponibles →</button>
        </div>
      )}
    </div>
  );
}

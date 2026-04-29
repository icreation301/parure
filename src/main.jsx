import { createRoot } from 'react-dom/client'
import { useState, useEffect } from 'react'

// ─── Auth (メモリ内ストア) ─────────────────────────────────────────────────────
const _store = { users: {}, session: null };

const getUsers = () => _store.users;
const saveUsers = (users) => { _store.users = users; };
const getSession = () => _store.session;
const saveSession = (user) => { _store.session = user; };
const clearSession = () => { _store.session = null; };

function AuthScreen({ onLogin }) {
const [mode, setMode] = useState(“login”);
const [step, setStep] = useState(1); // register: step1=account, step2=profile
const [form, setForm] = useState({
name: “”, password: “”, confirm: “”,
birthdate: “”, height: “”, weight: “”,
hairLength: “”, personalColor: “”, skeletonType: “”,
});
const [errors, setErrors] = useState({});
const [loading, setLoading] = useState(false);
const [done, setDone] = useState(false);

const set = (k) => (e) => setForm((f) => ({ …f, [k]: e.target.value }));
const setVal = (k, v) => setForm((f) => ({ …f, [k]: v }));

const validateStep1 = () => {
const e = {};
if (!form.name.trim() || form.name.length < 2) e.name = “2文字以上で入力してください”;
if (form.password.length < 4) e.password = “パスワードは4文字以上にしてください”;
if (form.password !== form.confirm) e.confirm = “パスワードが一致しません”;
return e;
};

const validateStep2 = () => {
const e = {};
if (!form.birthdate) e.birthdate = “生年月日を入力してください”;
if (!form.height || isNaN(form.height)) e.height = “身長を入力してください”;
if (!form.weight || isNaN(form.weight)) e.weight = “体重を入力してください”;
if (!form.hairLength) e.hairLength = “髪の長さを選んでください”;
if (!form.personalColor) e.personalColor = “パーソナルカラーを選んでください”;
if (!form.skeletonType) e.skeletonType = “骨格タイプを選んでください”;
return e;
};

const handleNext = () => {
const e = validateStep1();
setErrors(e);
if (Object.keys(e).length > 0) return;
const users = getUsers();
if (users[form.name]) { setErrors({ name: “このユーザー名はすでに使われています” }); return; }
setStep(2);
};

const handleRegister = () => {
const e = validateStep2();
setErrors(e);
if (Object.keys(e).length > 0) return;
setLoading(true);
setTimeout(() => {
setLoading(false);
const users = getUsers();
const profile = { birthdate: form.birthdate, height: form.height, weight: form.weight, hairLength: form.hairLength, personalColor: form.personalColor, skeletonType: form.skeletonType };
users[form.name] = { password: form.password, profile, createdAt: Date.now() };
saveUsers(users);
setDone(true);
}, 800);
};

const handleLogin = () => {
const e = {};
if (!form.name.trim()) e.name = “ユーザー名を入力してください”;
if (!form.password) e.password = “パスワードを入力してください”;
setErrors(e);
if (Object.keys(e).length > 0) return;
setLoading(true);
setTimeout(() => {
setLoading(false);
const users = getUsers();
const u = users[form.name];
if (!u || u.password !== form.password) { setErrors({ password: “ユーザー名またはパスワードが違います” }); return; }
const user = { name: form.name, profile: u.profile || {} };
saveSession(user);
onLogin(user);
}, 800);
};

const handleStartAfterRegister = () => {
const users = getUsers();
const profile = users[form.name]?.profile || {};
const user = { name: form.name, profile };
saveSession(user);
onLogin(user);
};

const inp = (key) => ({
width: “100%”, padding: “13px 16px”, borderRadius: “14px”,
border: errors[key] ? “2px solid #e74c3c” : “2px solid #f0f0f0”,
fontSize: “14px”, outline: “none”, background: “#fafafa”,
color: “#2a2a2a”, fontFamily: “‘Noto Sans JP’, sans-serif”,
});

const HAIR_OPTIONS = [“ショート”, “ミディアム”, “ロング”, “ベリーロング”];
const PC_OPTIONS = [
{ label: “春（イエベ春）”, value: “spring”, color: “#ffe0b2”, desc: “明るく暖かみのある色が得意” },
{ label: “夏（ブルベ夏）”, value: “summer”, color: “#e1f5fe”, desc: “柔らかく涼しげな色が得意” },
{ label: “秋（イエベ秋）”, value: “autumn”, color: “#d7ccc8”, desc: “深みのある温かい色が得意” },
{ label: “冬（ブルベ冬）”, value: “winter”, color: “#e8eaf6”, desc: “はっきりとした鮮やかな色が得意” },
];

if (done) {
return (
<div style={overlayStyle}>
<div style={{ textAlign: “center”, padding: “80px 24px 40px” }}>
<div style={{ fontSize: “64px”, marginBottom: “20px” }}>🎉</div>
<div style={{ fontFamily: “‘Playfair Display’, serif”, fontSize: “26px”, fontWeight: “700”, marginBottom: “10px” }}>登録完了！</div>
<p style={{ color: “#888”, fontSize: “14px”, marginBottom: “32px”, lineHeight: “1.8” }}>
ようこそ、<strong style={{ color: “#9b59b6” }}>{form.name}</strong> さん！<br />
あなたのプロフィールを元に<br />パーソナライズされたコーデを提案します✨
</p>
<button onClick={handleStartAfterRegister} style={btnStyle}>アプリをはじめる →</button>
</div>
</div>
);
}

return (
<div style={{ …overlayStyle, overflowY: “auto” }}>
<style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Noto+Sans+JP:wght@400;500;700&display=swap'); @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} } input:focus { border-color: #9b59b6 !important; background: white !important; } * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>

```
  <div style={{
    background: "linear-gradient(135deg, #667eea 0%, #9b59b6 60%, #e91e63 100%)",
    padding: "48px 20px 36px", textAlign: "center", borderRadius: "0 0 36px 36px",
  }}>
    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "34px", fontWeight: "700", color: "white", letterSpacing: "-1px" }}>
      Parure
    </div>
    <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px", marginTop: "6px" }}>あなただけのファッションAI</div>
  </div>

  <div style={{ padding: "24px", animation: "fadeUp 0.4s ease" }}>
    {/* Tab */}
    <div style={{ display: "flex", background: "#f0f0f0", borderRadius: "14px", padding: "4px", marginBottom: "24px" }}>
      {["login", "register"].map((m) => (
        <button key={m} onClick={() => { setMode(m); setStep(1); setErrors({}); setForm({ name: "", password: "", confirm: "", birthdate: "", height: "", weight: "", hairLength: "", personalColor: "", skeletonType: "" }); }} style={{
          flex: 1, padding: "10px", border: "none", borderRadius: "11px",
          fontWeight: "700", fontSize: "14px", cursor: "pointer", transition: "all 0.2s",
          background: mode === m ? "white" : "transparent",
          color: mode === m ? "#9b59b6" : "#aaa",
          boxShadow: mode === m ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
          fontFamily: "'Noto Sans JP', sans-serif",
        }}>
          {m === "login" ? "ログイン" : "新規登録"}
        </button>
      ))}
    </div>

    {/* LOGIN */}
    {mode === "login" && (
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <div>
          <input placeholder="ユーザー名" value={form.name} onChange={set("name")} style={inp("name")} />
          {errors.name && <div style={errStyle}>{errors.name}</div>}
        </div>
        <div>
          <input placeholder="パスワード" type="password" value={form.password} onChange={set("password")} style={inp("password")} />
          {errors.password && <div style={errStyle}>{errors.password}</div>}
        </div>
        <button onClick={handleLogin} disabled={loading} style={{ ...btnStyle, opacity: loading ? 0.75 : 1 }}>
          {loading ? "処理中…" : "ログイン"}
        </button>
      </div>
    )}

    {/* REGISTER STEP 1 */}
    {mode === "register" && step === 1 && (
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ fontSize: "12px", color: "#aaa", textAlign: "center", marginBottom: "4px" }}>ステップ 1 / 2　アカウント情報</div>
        <div>
          <input placeholder="ユーザー名（2文字以上）" value={form.name} onChange={set("name")} style={inp("name")} />
          {errors.name && <div style={errStyle}>{errors.name}</div>}
        </div>
        <div>
          <input placeholder="パスワード（4文字以上）" type="password" value={form.password} onChange={set("password")} style={inp("password")} />
          {errors.password && <div style={errStyle}>{errors.password}</div>}
        </div>
        <div>
          <input placeholder="パスワード（確認）" type="password" value={form.confirm} onChange={set("confirm")} style={inp("confirm")} />
          {errors.confirm && <div style={errStyle}>{errors.confirm}</div>}
        </div>
        <button onClick={handleNext} style={btnStyle}>次へ → プロフィール入力</button>
      </div>
    )}

    {/* REGISTER STEP 2 */}
    {mode === "register" && step === 2 && (
      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        <div style={{ fontSize: "12px", color: "#aaa", textAlign: "center" }}>ステップ 2 / 2　あなたのプロフィール</div>

        {/* 生年月日 */}
        <div>
          <label style={{ fontSize: "12px", fontWeight: "700", color: "#555", display: "block", marginBottom: "6px" }}>🎂 生年月日</label>
          <input type="date" value={form.birthdate} onChange={set("birthdate")} style={inp("birthdate")} />
          {errors.birthdate && <div style={errStyle}>{errors.birthdate}</div>}
        </div>

        {/* 身長・体重 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <div>
            <label style={{ fontSize: "12px", fontWeight: "700", color: "#555", display: "block", marginBottom: "6px" }}>📏 身長 (cm)</label>
            <input type="number" placeholder="例: 158" value={form.height} onChange={set("height")} style={inp("height")} />
            {errors.height && <div style={errStyle}>{errors.height}</div>}
          </div>
          <div>
            <label style={{ fontSize: "12px", fontWeight: "700", color: "#555", display: "block", marginBottom: "6px" }}>⚖️ 体重 (kg)</label>
            <input type="number" placeholder="例: 52" value={form.weight} onChange={set("weight")} style={inp("weight")} />
            {errors.weight && <div style={errStyle}>{errors.weight}</div>}
          </div>
        </div>

        {/* 髪の長さ */}
        <div>
          <label style={{ fontSize: "12px", fontWeight: "700", color: "#555", display: "block", marginBottom: "8px" }}>💇 髪の長さ</label>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {HAIR_OPTIONS.map(h => (
              <button key={h} onClick={() => setVal("hairLength", h)} style={{
                padding: "8px 16px", borderRadius: "20px", border: "2px solid",
                borderColor: form.hairLength === h ? "#9b59b6" : "#e0e0e0",
                background: form.hairLength === h ? "#f5f0ff" : "white",
                color: form.hairLength === h ? "#9b59b6" : "#666",
                fontWeight: "600", fontSize: "13px", cursor: "pointer",
                fontFamily: "'Noto Sans JP', sans-serif", transition: "all 0.15s",
              }}>{h}</button>
            ))}
          </div>
          {errors.hairLength && <div style={errStyle}>{errors.hairLength}</div>}
        </div>

        {/* パーソナルカラー */}
        <div>
          <label style={{ fontSize: "12px", fontWeight: "700", color: "#555", display: "block", marginBottom: "8px" }}>🎨 パーソナルカラー</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {PC_OPTIONS.map(pc => (
              <button key={pc.value} onClick={() => setVal("personalColor", pc.value)} style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "12px 14px", borderRadius: "14px", border: "2px solid",
                borderColor: form.personalColor === pc.value ? "#9b59b6" : "#e0e0e0",
                background: form.personalColor === pc.value ? "#f5f0ff" : "white",
                cursor: "pointer", textAlign: "left", fontFamily: "'Noto Sans JP', sans-serif",
                transition: "all 0.15s",
              }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: pc.color, flexShrink: 0, border: "1px solid #ddd" }} />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: form.personalColor === pc.value ? "#9b59b6" : "#333" }}>{pc.label}</div>
                  <div style={{ fontSize: "11px", color: "#999", marginTop: "2px" }}>{pc.desc}</div>
                </div>
              </button>
            ))}
          </div>
          {errors.personalColor && <div style={errStyle}>{errors.personalColor}</div>}
        </div>

        {/* 骨格タイプ */}
        <div>
          <label style={{ fontSize: "12px", fontWeight: "700", color: "#555", display: "block", marginBottom: "8px" }}>🦴 骨格タイプ</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { value: "straight", label: "ストレート", desc: "筋肉質・立体的・上重心。シンプルできちんとした服が得意", icon: "▲" },
              { value: "wave",     label: "ウェーブ",   desc: "華奢・曲線的・下重心。柔らかくふんわりした服が得意",   icon: "〜" },
              { value: "natural",  label: "ナチュラル", desc: "骨や関節が目立つ・フレーム感。ゆるめの服が得意",       icon: "◇" },
            ].map(sk => (
              <button key={sk.value} onClick={() => setVal("skeletonType", sk.value)} style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "12px 14px", borderRadius: "14px", border: "2px solid",
                borderColor: form.skeletonType === sk.value ? "#667eea" : "#e0e0e0",
                background: form.skeletonType === sk.value ? "#eef0ff" : "white",
                cursor: "pointer", textAlign: "left", fontFamily: "'Noto Sans JP', sans-serif",
                transition: "all 0.15s",
              }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0,
                  background: form.skeletonType === sk.value ? "#667eea" : "#f0f0f0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "16px", color: form.skeletonType === sk.value ? "white" : "#aaa",
                  fontWeight: "700", transition: "all 0.15s",
                }}>{sk.icon}</div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: form.skeletonType === sk.value ? "#667eea" : "#333" }}>{sk.label}</div>
                  <div style={{ fontSize: "11px", color: "#999", marginTop: "2px" }}>{sk.desc}</div>
                </div>
              </button>
            ))}
          </div>
          {errors.skeletonType && <div style={errStyle}>{errors.skeletonType}</div>}
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => setStep(1)} style={{
            padding: "14px", borderRadius: "14px", border: "2px solid #e0e0e0",
            background: "white", color: "#888", fontWeight: "700", cursor: "pointer",
            fontFamily: "'Noto Sans JP', sans-serif", fontSize: "14px",
          }}>← 戻る</button>
          <button onClick={handleRegister} disabled={loading} style={{ ...btnStyle, flex: 1, opacity: loading ? 0.75 : 1 }}>
            {loading ? "登録中…" : "アカウントを作成"}
          </button>
        </div>
      </div>
    )}

    <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "20px 0" }}>
      <div style={{ flex: 1, height: "1px", background: "#eee" }} />
      <span style={{ fontSize: "12px", color: "#bbb" }}>または</span>
      <div style={{ flex: 1, height: "1px", background: "#eee" }} />
    </div>

    <button onClick={() => { saveSession({ name: "ゲスト", isGuest: true }); onLogin({ name: "ゲスト", isGuest: true }); }} style={{
      width: "100%", padding: "13px", borderRadius: "14px",
      border: "2px solid #e0e0e0", background: "#fafafa",
      color: "#888", fontSize: "14px", fontWeight: "600",
      cursor: "pointer", fontFamily: "'Noto Sans JP', sans-serif",
    }}>
      👤 ゲストとして続ける
    </button>
    <p style={{ textAlign: "center", fontSize: "11px", color: "#ccc", marginTop: "8px" }}>
      ゲストはデータが保存されません
    </p>
  </div>
</div>
```

);
}

const overlayStyle = {
fontFamily: “‘Noto Sans JP’, sans-serif”,
background: “white”,
minHeight: “100vh”,
maxWidth: “430px”,
margin: “0 auto”,
};

const btnStyle = {
width: “100%”,
padding: “15px”,
borderRadius: “14px”,
border: “none”,
background: “linear-gradient(135deg, #667eea, #9b59b6)”,
color: “white”,
fontSize: “15px”,
fontWeight: “700”,
cursor: “pointer”,
fontFamily: “‘Noto Sans JP’, sans-serif”,
boxShadow: “0 4px 20px rgba(155,89,182,0.4)”,
};

const errStyle = {
color: “#e74c3c”,
fontSize: “11px”,
marginTop: “4px”,
paddingLeft: “4px”,
};

const TABS = [“コーデ提案”, “クローゼット”, “トレンド”, “ショップ”, “マイページ”];

const SAMPLE_ITEMS = [
{ id: 1, name: “白Tシャツ”, category: “トップス”, color: “#f5f5f5”, emoji: “👕”, tags: [“カジュアル”, “ベーシック”] },
{ id: 2, name: “デニムジャケット”, category: “アウター”, color: “#4a6fa5”, emoji: “🧥”, tags: [“カジュアル”, “デニム”] },
{ id: 3, name: “ブラックスキニー”, category: “ボトムス”, color: “#1a1a1a”, emoji: “👖”, tags: [“カジュアル”, “モード”] },
{ id: 4, name: “フローラルワンピース”, category: “ワンピース”, color: “#e8a0bf”, emoji: “👗”, tags: [“フェミニン”, “春夏”] },
{ id: 5, name: “白スニーカー”, category: “シューズ”, color: “#ffffff”, emoji: “👟”, tags: [“カジュアル”, “スポーツ”] },
{ id: 6, name: “レザートート”, category: “バッグ”, color: “#8B5E3C”, emoji: “👜”, tags: [“きれいめ”, “通勤”] },
{ id: 7, name: “ストライプシャツ”, category: “トップス”, color: “#d0e8f5”, emoji: “👔”, tags: [“きれいめ”, “オフィス”] },
{ id: 8, name: “プリーツスカート”, category: “ボトムス”, color: “#c9a0dc”, emoji: “👗”, tags: [“フェミニン”, “きれいめ”] },
];

const TRENDS = [
{ id: 1, title: “ゆるシルエット”, desc: “オーバーサイズのアイテムで今季トレンドを取り入れて”, tag: “2026SS”, color: “#f0e6d3”, icon: “🌿” },
{ id: 2, title: “モノトーンコーデ”, desc: “白・黒・グレーでまとめたスタイリッシュな着こなし”, tag: “定番”, color: “#e8e8e8”, icon: “🖤” },
{ id: 3, title: “デニムonデニム”, desc: “同素材の重ね着がおしゃれ上級者の証”, tag: “人気急上昇”, color: “#dce8f5”, icon: “✨” },
{ id: 4, title: “バイオレットカラー”, desc: “今季注目のパープル系カラーで個性を演出”, tag: “2026SS”, color: “#ede0f5”, icon: “💜” },
{ id: 5, title: “レイヤードスタイル”, desc: “重ね着でボリュームと深みを出す着こなし術”, tag: “秋冬先取り”, color: “#f5ede0”, icon: “🍂” },
{ id: 6, title: “Y2Kリバイバル”, desc: “2000年代テイストで今どきにアップデート”, tag: “トレンド”, color: “#fce4ec”, icon: “⭐” },
];

const COORD_SUGGESTIONS = [
{
id: 1,
title: “カフェデート風”,
items: [“白の半袖Tシャツ”, “プリーツスカート”, “白スニーカー”, “レザートート”],
mood: “フェミニン”,
color: “#fce4ec”,
tip: “スカートとバッグのトーンを合わせてまとまり感UP”,
},
{
id: 2,
title: “休日カジュアル”,
items: [“長袖デニムジャケット”, “白の半袖Tシャツ”, “ブラックスキニー”, “白スニーカー”],
mood: “カジュアル”,
color: “#e3f2fd”,
tip: “デニム×黒で引き締まったカジュアルスタイル”,
},
{
id: 3,
title: “オフィスきれいめ”,
items: [“長袖ストライプシャツ”, “プリーツスカート”, “レザートート”],
mood: “きれいめ”,
color: “#e8f5e9”,
tip: “ストライプ×プリーツで上品な印象に”,
},
];

const WEATHER = { temp: “22°C”, desc: “晴れ”, icon: “☀️”, advice: “日差しが強いので薄手の羽織を持参して” };

function WeatherBadge() {
return (
<div style={{
background: “linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)”,
borderRadius: “16px”,
padding: “12px 18px”,
display: “flex”,
alignItems: “center”,
gap: “10px”,
marginBottom: “20px”,
boxShadow: “0 4px 15px rgba(252,182,159,0.3)”,
}}>
<span style={{ fontSize: “28px” }}>{WEATHER.icon}</span>
<div>
<div style={{ fontFamily: “‘Playfair Display’, serif”, fontSize: “20px”, fontWeight: “700”, color: “#5d3a1a” }}>
{WEATHER.temp} {WEATHER.desc}
</div>
<div style={{ fontSize: “12px”, color: “#8B5E3C”, marginTop: “2px” }}>{WEATHER.advice}</div>
</div>
</div>
);
}

// クローゼットにあるか名前で部分一致チェック
function isInCloset(itemName, closetItems = []) {
const n = itemName.replace(/（半袖|長袖|七分袖|ノースリーブ|半袖|長袖）/g, “”).toLowerCase();
return closetItems.some(c => {
const cn = c.name.toLowerCase();
// アイテム名が3文字以上共通する部分を含むか
return cn.includes(n) || n.includes(cn) ||
n.split(/[・\s]/).some(word => word.length >= 3 && cn.includes(word));
});
}

function ItemTag({ label, inCloset }) {
return inCloset ? (
<span style={{
background: “rgba(255,255,255,0.85)”, borderRadius: “12px”,
padding: “4px 10px”, fontSize: “11px”, color: “#2a7a2a”, fontWeight: “600”,
border: “1.5px solid rgba(60,180,60,0.4)”,
display: “inline-flex”, alignItems: “center”, gap: “3px”,
}}>✓ {label}</span>
) : (
<span style={{
background: “rgba(255,220,180,0.7)”, borderRadius: “12px”,
padding: “4px 10px”, fontSize: “11px”, color: “#a05010”, fontWeight: “600”,
border: “1.5px solid rgba(220,140,60,0.5)”,
display: “inline-flex”, alignItems: “center”, gap: “3px”,
}}>+ {label}</span>
);
}

function ClosetLegend() {
return (
<div style={{ display: “flex”, gap: “10px”, marginBottom: “10px”, flexWrap: “wrap” }}>
<span style={{ fontSize: “11px”, color: “#2a7a2a”, display: “flex”, alignItems: “center”, gap: “4px” }}>
<span style={{ background: “rgba(255,255,255,0.85)”, border: “1.5px solid rgba(60,180,60,0.4)”, borderRadius: “8px”, padding: “2px 8px”, fontWeight: “600” }}>✓ アイテム</span>
クローゼットにあり
</span>
<span style={{ fontSize: “11px”, color: “#a05010”, display: “flex”, alignItems: “center”, gap: “4px” }}>
<span style={{ background: “rgba(255,220,180,0.7)”, border: “1.5px solid rgba(220,140,60,0.5)”, borderRadius: “8px”, padding: “2px 8px”, fontWeight: “600” }}>+ アイテム</span>
要購入
</span>
</div>
);
}

function CoordCard({ coord, onLike, liked, user, closetItems }) {
return (
<div style={{
background: coord.color,
borderRadius: “20px”,
padding: “20px”,
marginBottom: “16px”,
position: “relative”,
boxShadow: “0 4px 20px rgba(0,0,0,0.08)”,
transition: “transform 0.2s”,
cursor: “pointer”,
}}
onMouseEnter={e => e.currentTarget.style.transform = “translateY(-3px)”}
onMouseLeave={e => e.currentTarget.style.transform = “translateY(0)”}
>
{/* タイトル行 */}
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “flex-start”, marginBottom: “12px” }}>
<div>
<span style={{
background: “rgba(255,255,255,0.7)”, borderRadius: “20px”,
padding: “3px 12px”, fontSize: “11px”, fontWeight: “600”, color: “#555”,
}}>{coord.mood}</span>
<h3 style={{ fontFamily: “‘Playfair Display’, serif”, fontSize: “20px”, margin: “8px 0 0”, color: “#2a2a2a” }}>
{coord.title}
</h3>
</div>
<button onClick={() => onLike(coord.id)} style={{
background: “none”, border: “none”, fontSize: “24px”, cursor: “pointer”,
transition: “transform 0.2s”, transform: liked ? “scale(1.2)” : “scale(1)”,
}}>
{liked ? “❤️” : “🤍”}
</button>
</div>

```
  {/* アバター＋アイテム横並び */}
  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "12px" }}>
    <div style={{ flexShrink: 0, background: "rgba(255,255,255,0.45)", borderRadius: "14px", padding: "6px" }}>
      <FashionAvatar profile={user?.profile} coordItems={coord.items} cardColor={coord.color} />
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: "11px", fontWeight: "700", color: "#888", marginBottom: "6px" }}>コーデアイテム</div>
      <ClosetLegend />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {coord.items.map((item, i) => (
          <ItemTag key={i} label={item} inCloset={isInCloset(item, closetItems)} />
        ))}
      </div>
    </div>
  </div>

  <div style={{
    background: "rgba(255,255,255,0.6)", borderRadius: "12px",
    padding: "10px 14px", fontSize: "12px", color: "#555",
    display: "flex", alignItems: "center", gap: "6px",
  }}>
    <span>💡</span> {coord.tip}
  </div>
</div>
```

);
}

// ─── パーソナルカラーから肌・髪色を決定 ─────────────────────────────────────
const SKIN_TONES = {
spring: “#f5c8a0”,  // 明るい黄み肌
summer: “#f0c8c0”,  // ピンクがかった白肌
autumn: “#d4956a”,  // 健康的な黄み肌
winter: “#f8dac8”,  // 明るく透明感のある肌
};
const HAIR_COLORS_MAP = {
spring: “#c8903c”,   // 明るいブラウン
summer: “#8B6F6F”,   // アッシュブラウン
autumn: “#5a3820”,   // ダークブラウン
winter: “#1a1a1a”,   // ブラックorダークネイビー
};
const HAIR_LENGTH_PROPS = {
ショート: { len: 20, waviness: 0 },
ミディアム: { len: 60, waviness: 1 },
ロング: { len: 110, waviness: 2 },
ベリーロング: { len: 150, waviness: 2 },
};

// アイテム名からコーデカラーを推定
function guessColorFromItem(itemName) {
const map = [
{ keys: [“白”,“ホワイト”,“アイボリー”,“クリーム”], color: “#f5f5f0” },
{ keys: [“黒”,“ブラック”,“ダーク”], color: “#2a2a2a” },
{ keys: [“ネイビー”,“紺”], color: “#1a3a6e” },
{ keys: [“ブルー”,“青”,“デニム”,“ジーンズ”], color: “#4a7fc1” },
{ keys: [“レッド”,“赤”,“バーガンディ”], color: “#c0392b” },
{ keys: [“ピンク”,“コーラル”,“ローズ”,“サーモン”,“ピーチ”], color: “#f4a0b0” },
{ keys: [“パープル”,“紫”,“ラベンダー”,“バイオレット”], color: “#9b6dc0” },
{ keys: [“グリーン”,“緑”,“カーキ”,“オリーブ”,“セージ”], color: “#6a9e6a” },
{ keys: [“イエロー”,“黄”,“マスタード”,“レモン”], color: “#e8c840” },
{ keys: [“オレンジ”,“テラコッタ”], color: “#e07840” },
{ keys: [“ブラウン”,“茶”,“チョコ”,“キャラメル”], color: “#8B5E3C” },
{ keys: [“ベージュ”,“キャメル”,“ヌード”,“サンド”], color: “#c8a878” },
{ keys: [“グレー”,“灰”], color: “#909090” },
];
const lower = itemName;
for (const { keys, color } of map) {
if (keys.some(k => lower.includes(k))) return color;
}
return “#c0c0c0”;
}

// アイテム名からシルエット種別を推定
function guessItemType(itemName) {
if (/ワンピース|ドレス/.test(itemName)) return “dress”;
if (/スカート|フレア|プリーツ|マキシ/.test(itemName)) return “skirt”;
if (/コート|ジャケット|アウター|ブルゾン|カーディガン|ニット/.test(itemName)) return “outer”;
if (/パンツ|デニム|スキニー|ジーンズ|ボトム|スラックス/.test(itemName)) return “pants”;
if (/シューズ|スニーカー|パンプス|ブーツ|サンダル|靴/.test(itemName)) return “shoes”;
if (/バッグ|トート|ショルダー|クラッチ|リュック/.test(itemName)) return “bag”;
return “top”;
}

function FashionAvatar({ profile, coordItems, cardColor }) {
const pc      = profile?.personalColor || “spring”;
const hairLen = profile?.hairLength    || “ミディアム”;
const height  = parseFloat(profile?.height) || 158;
const weight  = parseFloat(profile?.weight) || 52;

const skinColor = SKIN_TONES[pc];
const hairColor = HAIR_COLORS_MAP[pc];

const types = (coordItems || []).map(item => ({
type:  guessItemType(item),
color: guessColorFromItem(item),
}));

const topItem   = types.find(t => t.type === “top”);
const outerItem = types.find(t => t.type === “outer”);
const btmItem   = types.find(t => t.type === “pants” || t.type === “skirt”);
const dressItem = types.find(t => t.type === “dress”);
const shoeItem  = types.find(t => t.type === “shoes”);
const bagItem   = types.find(t => t.type === “bag”);

const topColor  = outerItem?.color || topItem?.color || “#d8d0c8”;
const btmColor  = btmItem?.color ?? dressItem?.color ?? “#5a7090”;
const shoeColor = shoeItem?.color || “#3a3028”;
const hasDress  = !!dressItem && !btmItem;
const isSkirt   = btmItem?.type === “skirt”;
const hasOuter  = !!outerItem;

// ── 身長 → 脚の長さスケール ──────────────────────────────
// 150cm → legScale=0.88 / 158cm → 1.0 / 168cm → 1.12 / 175cm → 1.20
const legScale = Math.max(0.80, Math.min(1.30, (height - 158) * 0.014 + 1.0));

// ── BMI → 体幅スケール ──────────────────────────────────
const bmi = weight / ((height / 100) ** 2);
// BMI<17 → slim(0.82), 17-19 → 0.88, 19-22 → 1.0, 22-26 → 1.10, 26+ → 1.20
const bodyScale = bmi < 17 ? 0.82 : bmi < 19 ? 0.88 : bmi < 22 ? 1.0 : bmi < 26 ? 1.10 : 1.20;

// ── 座標定義 viewBox 80×300 ──────────────────────────────
const x = 40;

// 頭（固定）
const hY = 16, hRx = 10, hRy = 12;

// 首
const nkT = hY + hRy - 1, nkB = nkT + 9;
const nkW = 4;

// 肩（体幅スケール適用）
const shY = nkB + 1;
const shW = Math.round(18 * bodyScale);

// バスト・ウエスト・ヒップ（体幅スケール）
const buW = Math.round(13 * bodyScale);
const waW = Math.round(9  * bodyScale);
const hiW = Math.round(15 * bodyScale);

// 各Y座標（脚スケール適用。上半身は固定、下半身だけ伸縮）
const buY = shY + 18;
const waY = buY + 18;
const hiY = waY + 14;
const crY = hiY + 7;
const knY = crY + Math.round(44 * legScale);
const anY = knY + Math.round(46 * legScale);
const grY = anY + Math.round(14 * legScale);
const knW = 6, anW = 3;

const lc = “rgba(30,20,10,0.50)”;
const sw = 0.8;
const shadowColor = “rgba(0,0,0,0.10)”;

// ── 髪パス ───────────────────────────────────────────────
const hairLengths = { ショート: 0, ミディアム: 42, ロング: 85, ベリーロング: 130 };
const hLen = hairLengths[hairLen] ?? 42;

const hairTop = `M${x-hRx-1} ${hY-2} Q${x-hRx-3} ${hY-hRy-3} ${x} ${hY-hRy-4} Q${x+hRx+3} ${hY-hRy-3} ${x+hRx+1} ${hY-2} Z`;

const hairSideL = hLen > 0
? `M${x-hRx} ${hY+2} Q${x-hRx-6} ${hY+hLen*0.45} ${x-hRx-4} ${hY+hLen} Q${x-hRx-1} ${hY+hLen+5} ${x-hRx+5} ${hY+hLen} Q${x-hRx-1} ${hY+hLen*0.45} ${x-hRx+2} ${hY+2} Z`
: null;
const hairSideR = hLen > 0
? `M${x+hRx} ${hY+2} Q${x+hRx+6} ${hY+hLen*0.45} ${x+hRx+4} ${hY+hLen} Q${x+hRx+1} ${hY+hLen+5} ${x+hRx-5} ${hY+hLen} Q${x+hRx+1} ${hY+hLen*0.45} ${x+hRx-2} ${hY+2} Z`
: null;

// ── 服のパス ─────────────────────────────────────────────

// ボディ全体の塗りつぶし（肌色・インナー透け防止の下地）
const bodyBase = `M${x-nkW} ${nkB} C${x-shW} ${shY-2} ${x-buW-2} ${buY-4} ${x-waW} ${waY} L${x-waW} ${waY} L${x+waW} ${waY} C${x+buW+2} ${buY-4} ${x+shW} ${shY-2} ${x+nkW} ${nkB} Z`;

// トップス（衿元〜裾・前身頃のみ・シンプルに）
const topFill = `M${x-nkW} ${nkB+2} L${x-shW} ${shY+1} C${x-buW-2} ${buY-4} ${x-waW} ${waY-6} ${x-waW} ${waY} L${x+waW} ${waY} C${x+waW} ${waY-6} ${x+buW+2} ${buY-4} ${x+shW} ${shY+1} L${x+nkW} ${nkB+2} Q${x} ${nkB} ${x-nkW} ${nkB+2} Z`;

// 袖の長さを判定
const isNoSleeve    = (coordItems || []).some(i => /ノースリーブ|キャミ|チューブ/.test(i));
const isShortSleeve = !isNoSleeve && (coordItems || []).some(i => /半袖|Tシャツ/.test(i) && !/長袖|七分袖/.test(i));
const isSevenSleeve = !isNoSleeve && !isShortSleeve && (coordItems || []).some(i => /七分袖/.test(i));

const sleeveEndY = isNoSleeve ? shY + 2
: isShortSleeve ? shY + 14
: isSevenSleeve ? shY + 30
: waY;

const sleeveL = isNoSleeve ? null : `M${x-shW} ${shY+1} C${x-shW-5} ${shY+4} ${x-shW-7} ${sleeveEndY-4} ${x-shW-5} ${sleeveEndY} L${x-shW-1} ${sleeveEndY+1} C${x-shW} ${sleeveEndY-2} ${x-shW} ${shY+5} ${x-shW+2} ${shY+3} Z`;
const sleeveR = isNoSleeve ? null : `M${x+shW} ${shY+1} C${x+shW+5} ${shY+4} ${x+shW+7} ${sleeveEndY-4} ${x+shW+5} ${sleeveEndY} L${x+shW+1} ${sleeveEndY+1} C${x+shW} ${sleeveEndY-2} ${x+shW} ${shY+5} ${x+shW-2} ${shY+3} Z`;

// アウター本体（インナーを完全に覆う・不透明）
const outerBody = `M${x-nkW-1} ${nkB+1} L${x-shW-3} ${shY} C${x-buW-5} ${buY-3} ${x-waW-3} ${waY-4} ${x-waW-2} ${waY+22} L${x+waW+2} ${waY+22} C${x+waW+3} ${waY-4} ${x+buW+5} ${buY-3} ${x+shW+3} ${shY} L${x+nkW+1} ${nkB+1} Q${x} ${nkB-1} ${x-nkW-1} ${nkB+1} Z`;

// アウター袖（大きめ・インナー袖を完全カバー）
const outerSleeveL = `M${x-shW-3} ${shY} C${x-shW-10} ${shY+6} ${x-shW-13} ${buY+6} ${x-shW-10} ${waY+10} L${x-shW-4} ${waY+13} C${x-shW-4} ${buY+4} ${x-shW-2} ${shY+7} ${x-shW+1} ${shY+3} Z`;
const outerSleeveR = `M${x+shW+3} ${shY} C${x+shW+10} ${shY+6} ${x+shW+13} ${buY+6} ${x+shW+10} ${waY+10} L${x+shW+4} ${waY+13} C${x+shW+4} ${buY+4} ${x+shW+2} ${shY+7} ${x+shW-1} ${shY+3} Z`;

// スカート（シンプルAライン）
const skirtFill = `M${x-waW-1} ${waY} L${x-hiW-12} ${anY-6} L${x+hiW+12} ${anY-6} L${x+waW+1} ${waY} Z`;
const skirtHem = `M${x-hiW-12} ${anY-6} Q${x} ${anY} ${x+hiW+12} ${anY-6}`;

// ワンピース（肩〜Aライン裾）
const dressFill = `M${x-nkW} ${nkB+2} L${x-shW} ${shY+1} C${x-buW-2} ${buY-4} ${x-waW} ${waY-6} ${x-hiW-12} ${anY-6} L${x+hiW+12} ${anY-6} C${x+waW} ${waY-6} ${x+buW+2} ${buY-4} ${x+shW} ${shY+1} L${x+nkW} ${nkB+2} Q${x} ${nkB} ${x-nkW} ${nkB+2} Z`;
const dressHem = `M${x-hiW-12} ${anY-6} Q${x} ${anY} ${x+hiW+12} ${anY-6}`;

// パンツ（左右まとめてシルエットとして描く・透け防止）
// ヒップ〜足首をひとつの閉じたパスで
const pantsBase = `M${x-waW} ${waY} L${x-hiW} ${hiY} C${x-hiW} ${hiY+6} ${x-anW-5} ${anY-8} ${x-anW-4} ${anY} L${x+anW+4} ${anY} C${x+anW+5} ${anY-8} ${x+hiW} ${hiY+6} ${x+hiW} ${hiY} L${x+waW} ${waY} Z`;
// 股の割れ目線
const pantsSeam = `M${x} ${waY} C${x} ${hiY+4} ${x} ${crY+6} ${x-1} ${anY}`;
// 裾ライン（左右）
const pantsHemL = `M${x-anW-4} ${anY} Q${x-2} ${anY+2} ${x-1} ${anY}`;
const pantsHemR = `M${x+anW+4} ${anY} Q${x+2} ${anY+2} ${x+1} ${anY}`;

// 靴（ポインテッドトゥ＋ヒール形状）
const shoeLPath = [
`M${x-anW-3} ${anY}`,
`Q${x-anW-5} ${anY+4} ${x-anW-11} ${grY-4}`,  // 爪先へ
`Q${x-anW-12} ${grY} ${x-3} ${grY}`,             // 爪先底
`L${x-2} ${anY+4}`,                              // インソール前
`L${x-2} ${grY-4}`,                              // ヒール前面
`L${x-anW-4} ${grY-4}`,                          // ヒール底
`L${x-anW-4} ${anY} Z`,                          // ヒール後面
].join(” “);
const shoeRPath = [
`M${x+anW+3} ${anY}`,
`Q${x+anW+5} ${anY+4} ${x+anW+11} ${grY-4}`,
`Q${x+anW+12} ${grY} ${x+3} ${grY}`,
`L${x+2} ${anY+4}`,
`L${x+2} ${grY-4}`,
`L${x+anW+4} ${grY-4}`,
`L${x+anW+4} ${anY} Z`,
].join(” “);

// バッグ（ショルダー形状）
const bagPath = bagItem
? `M${x+shW+5} ${waY+4} L${x+shW+17} ${waY+4} Q${x+shW+19} ${waY+4} ${x+shW+19} ${waY+6} L${x+shW+19} ${waY+22} Q${x+shW+19} ${waY+24} ${x+shW+17} ${waY+24} L${x+shW+5} ${waY+24} Q${x+shW+3} ${waY+24} ${x+shW+3} ${waY+22} L${x+shW+3} ${waY+6} Q${x+shW+3} ${waY+4} ${x+shW+5} ${waY+4} Z`
: null;
const bagStrap = bagItem
? `M${x+shW} ${shY+10} C${x+shW+2} ${buY} ${x+shW+3} ${waY} ${x+shW+5} ${waY+4}`
: null;

const totalH = grY + 10;

return (
<svg viewBox={`0 0 80 ${totalH}`} width=“95” height={Math.min(330, Math.max(250, totalH))}
style={{ display: “block” }}>

```
  {/* 背景 */}
  <rect width="80" height={totalH} fill={cardColor} opacity="0.28" rx="10" />

  {/* ── 髪（サイド） ── */}
  {hairSideL && <path d={hairSideL} fill={hairColor} opacity="0.88" />}
  {hairSideR && <path d={hairSideR} fill={hairColor} opacity="0.88" />}

  {/* ── 肌下地（透け防止）── */}
  <path d={bodyBase} fill={skinColor} />

  {/* ── 服のシルエット ── */}
  {hasDress ? (
    <>
      <path d={sleeveL} fill={btmColor} stroke={lc} strokeWidth={sw} />
      <path d={sleeveR} fill={btmColor} stroke={lc} strokeWidth={sw} />
      <path d={dressFill} fill={btmColor} stroke={lc} strokeWidth={sw} />
      <path d={dressHem} stroke={lc} strokeWidth={sw+0.2} fill="none" opacity="0.4" />
    </>
  ) : isSkirt ? (
    <>
      <path d={sleeveL} fill={topColor} stroke={lc} strokeWidth={sw} />
      <path d={sleeveR} fill={topColor} stroke={lc} strokeWidth={sw} />
      <path d={topFill} fill={topColor} stroke={lc} strokeWidth={sw} />
      {/* スカート下地（インナー透け防止）*/}
      <path d={skirtFill} fill={btmColor} />
      <path d={skirtFill} fill="none" stroke={lc} strokeWidth={sw} />
      <path d={skirtHem} stroke={lc} strokeWidth={sw+0.2} fill="none" opacity="0.4" />
      <rect x={x-waW-1} y={waY-2} width={(waW+1)*2} height={5} rx={2}
        fill={btmColor} stroke={lc} strokeWidth={sw} />
    </>
  ) : (
    <>
      {/* パンツ（一体のシルエット）*/}
      <path d={pantsBase} fill={btmColor} stroke={lc} strokeWidth={sw} />
      <path d={pantsSeam} stroke={lc} strokeWidth={0.6} fill="none" opacity="0.5" />
      <path d={pantsHemL} stroke={lc} strokeWidth={0.6} fill="none" opacity="0.4" />
      <path d={pantsHemR} stroke={lc} strokeWidth={0.6} fill="none" opacity="0.4" />
      {/* トップス（パンツの上に重ねて透け防止）*/}
      <path d={topFill} fill={topColor} />
      <path d={sleeveL} fill={topColor} />
      <path d={sleeveR} fill={topColor} />
      <path d={topFill} fill="none" stroke={lc} strokeWidth={sw} />
      <path d={sleeveL} fill="none" stroke={lc} strokeWidth={sw} />
      <path d={sleeveR} fill="none" stroke={lc} strokeWidth={sw} />
      <path d={`M${x-waW} ${waY} L${x+waW} ${waY}`} stroke={lc} strokeWidth={sw} fill="none" />
    </>
  )}

  {/* ── アウター（インナーを完全に覆う）── */}
  {hasOuter && (
    <>
      {/* 塗り（不透明）先にfill、次にstroke */}
      <path d={outerSleeveL} fill={outerItem.color} />
      <path d={outerSleeveR} fill={outerItem.color} />
      <path d={outerBody} fill={outerItem.color} />
      <path d={outerSleeveL} fill="none" stroke={lc} strokeWidth={sw} />
      <path d={outerSleeveR} fill="none" stroke={lc} strokeWidth={sw} />
      <path d={outerBody} fill="none" stroke={lc} strokeWidth={sw} />
      <line x1={x} y1={nkB+4} x2={x} y2={waY+20} stroke={lc} strokeWidth={0.6} opacity="0.5" />
    </>
  )}

  {/* ── バッグ ── */}
  {bagItem && bagPath && (
    <>
      <path d={bagStrap} stroke={lc} strokeWidth={0.8} fill="none" />
      <path d={bagPath} fill={bagItem.color} stroke={lc} strokeWidth={sw} />
      {/* バッグのポケットライン */}
      <line x1={x+shW+5} y1={waY+14} x2={x+shW+19} y2={waY+14}
        stroke={lc} strokeWidth={0.5} opacity="0.5" />
    </>
  )}

  {/* ── 靴 ── */}
  <path d={shoeLPath} fill={shoeColor} stroke={lc} strokeWidth={sw} />
  <path d={shoeRPath} fill={shoeColor} stroke={lc} strokeWidth={sw} />
  {/* 靴のハイライト */}
  <path d={`M${x-anW-10} ${grY-5} Q${x-anW-7} ${grY-6} ${x-anW-4} ${grY-5}`}
    stroke="rgba(255,255,255,0.4)" strokeWidth={0.8} fill="none" />
  <path d={`M${x+anW+10} ${grY-5} Q${x+anW+7} ${grY-6} ${x+anW+4} ${grY-5}`}
    stroke="rgba(255,255,255,0.4)" strokeWidth={0.8} fill="none" />

  {/* ── 首（自然な台形）── */}
  <path d={`M${x-nkW+1} ${nkT} L${x-nkW} ${nkB} L${x+nkW} ${nkB} L${x+nkW-1} ${nkT} Z`}
    fill={skinColor} stroke={lc} strokeWidth={sw*0.6} />

  {/* ── ボディラインのシェーディング ── */}
  <path d={`M${x-shW+2} ${shY} C${x-buW-2} ${buY-2} ${x-waW} ${waY-4} ${x-waW} ${waY}`}
    stroke="rgba(0,0,0,0.08)" strokeWidth={2.5} fill="none" />
  <path d={`M${x+shW-2} ${shY} C${x+buW+2} ${buY-2} ${x+waW} ${waY-4} ${x+waW} ${waY}`}
    stroke="rgba(0,0,0,0.08)" strokeWidth={2.5} fill="none" />

  {/* ── 頭（輪郭のみ）── */}
  <ellipse cx={x} cy={hY} rx={hRx} ry={hRy} fill={skinColor} stroke={lc} strokeWidth={sw} />

  {/* ── 髪（上部）── */}
  <path d={hairTop} fill={hairColor} stroke={lc} strokeWidth={sw} />

  {/* 身長ラベル */}
  <text x={x} y={totalH - 1} textAnchor="middle" fontSize="5.5" fill="rgba(0,0,0,0.25)"
    fontFamily="sans-serif">{height}cm</text>
</svg>
```

);
}

const PC_COLORS = {
spring: “明るく暖かみのあるイエベ春カラー（コーラル、ピーチ、アイボリー、キャメルなど）が似合う”,
summer: “柔らかく涼しげなブルベ夏カラー（ラベンダー、ペールブルー、ローズグレーなど）が似合う”,
autumn: “深みのある温かいイエベ秋カラー（テラコッタ、カーキ、マスタード、ブラウンなど）が似合う”,
winter: “はっきりしたブルベ冬カラー（ロイヤルブルー、バーガンディ、ピュアホワイト、ブラックなど）が似合う”,
};
const PC_LABEL = { spring: “イエベ春”, summer: “ブルベ夏”, autumn: “イエベ秋”, winter: “ブルベ冬” };
const HAIR_LABEL = { ショート: “ショートヘア”, ミディアム: “ミディアムヘア”, ロング: “ロングヘア”, ベリーロング: “ベリーロング” };

const SITUATIONS = [“デート”, “オフィス”, “カジュアルお出かけ”, “友達とランチ”, “買い物”, “旅行”, “特別なディナー”, “スポーツ・アウトドア”];
const WEATHERS = [
{ label: “☀️ 晴れ”, value: “晴れ、気温22度”, temp: “22°C” },
{ label: “🌤 曇り”, value: “曇り、気温18度”, temp: “18°C” },
{ label: “🌧 雨”, value: “雨、気温16度”, temp: “16°C” },
{ label: “❄️ 寒い”, value: “晴れ、気温8度の寒い日”, temp: “8°C” },
{ label: “🔥 暑い”, value: “晴れ、気温32度の猛暑日”, temp: “32°C” },
];

const DEMO_RESULTS = [
{
title: “春色カフェデート”,
mood: “フェミニン”,
items: [“コーラルピンクの半袖ブラウス”, “アイボリーのフレアスカート”, “ベージュのサンダル”, “ミニカゴバッグ”],
colorPoint: “イエベ春の得意なコーラルピンクをトップスに取り入れ、アイボリーで明るくまとめました。肌のツヤ感が引き立つ配色です。”,
tip: “158cmの身長を活かすためスカート丈はひざ下10cmが◎。バッグは小ぶりにして視線を上に引き上げて。”,
reason: “身長158cm・イエベ春タイプに最適な明るいトーンのコーデです。ロングヘアとフレアスカートの組み合わせでエレガントな印象に。”
},
{
title: “こなれカジュアル”,
mood: “カジュアル”,
items: [“キャメルの長袖ニットトップス”, “ホワイトデニム”, “スニーカー”, “ショルダーバッグ”],
colorPoint: “イエベ春の得意なキャメルをメインカラーに。ホワイトデニムで軽やかさをプラスした春らしいコーデ。”,
tip: “ニットをデニムにタックインするとウエスト位置が高く見えてスタイルアップ。スニーカーは白でまとめてすっきりと。”,
reason: “体型のバランスを整えるタックインスタイルが◎。キャメルはイエベ春の肌色を明るく見せる得意カラーです。”
},
{
title: “上品ランチスタイル”,
mood: “きれいめ”,
items: [“ピーチの半袖シャツワンピース”, “ヌードパンプス”, “チェーンバッグ”],
colorPoint: “ピーチカラーはイエベ春の最得意色。ワンピース1枚でコーデが完成し、きれいめな印象を簡単に演出できます。”,
tip: “ヌードパンプスで足を長く見せて。チェーンバッグがドレスアップ効果を高め、ランチにぴったりの上品さに。”,
reason: “ワンピースは身長158cmのバランスをよく見せるシルエット。ロングヘアとの相性も抜群です。”
}
];

function AICoordSection({ user, closetItems }) {
const [situation, setSituation] = useState(“デート”);
const [weather, setWeather] = useState(WEATHERS[0]);
const [results, setResults] = useState(DEMO_RESULTS);
const [loading, setLoading] = useState(false);
const [activePattern, setActivePattern] = useState(0);
const [isDemo, setIsDemo] = useState(true);

const profile = user?.profile;
const hasProfile = profile && profile.height && profile.personalColor;

const buildPrompt = () => {
const age = profile?.birthdate
? Math.floor((Date.now() - new Date(profile.birthdate)) / (365.25 * 24 * 3600 * 1000))
: null;

```
const profileDesc = hasProfile
  ? `【ユーザー情報】
```

- 年齢: ${age}歳
- 身長: ${profile.height}cm / 体重: ${profile.weight}kg
- 髪の長さ: ${HAIR_LABEL[profile.hairLength] || profile.hairLength}
- パーソナルカラー: ${PC_LABEL[profile.personalColor]}（${PC_COLORS[profile.personalColor]}）
- 骨格タイプ: ${{ straight: “ストレート（シンプルでフィット感のある服が得意）”, wave: “ウェーブ（ふんわり柔らか・レイヤードが得意）”, natural: “ナチュラル（ゆったり・オーバーサイズが得意）” }[profile.skeletonType] || profile.skeletonType}`
  : “【ユーザー情報】未登録（一般的な提案をしてください）”;
  
  return `${profileDesc}
  【天気・気温】${weather.value}
  【シチュエーション】${situation || “カジュアルなお出かけ”}

上記の情報を元に、このユーザーに最適なコーデを3パターン提案してください。
必ず以下のJSON形式のみで返答してください（他のテキスト一切不要）:
[
{
“title”: “コーデ名”,
“mood”: “雰囲気タグ”,
“items”: [“アイテム1（必ず半袖・長袖・ノースリーブなど袖の長さを明記）”, “アイテム2”, “アイテム3”],
“colorPoint”: “パーソナルカラーを活かしたポイント”,
“tip”: “スタイリングのコツ”,
“reason”: “このユーザーのプロフィールに合う理由（身長・体型・パーソナルカラーを踏まえて）”
}
]
※itemsのトップス・ワンピース・アウターには必ず「半袖」「長袖」「七分袖」「ノースリーブ」のいずれかを含めること`;
};

const handleGenerate = async () => {
setLoading(true);
setResults(null);
setActivePattern(0);
setIsDemo(false);
try {
const response = await fetch(“https://api.anthropic.com/v1/messages”, {
method: “POST”,
headers: { “Content-Type”: “application/json” },
body: JSON.stringify({
model: “claude-sonnet-4-20250514”,
max_tokens: 1500,
system: “あなたはプロのパーソナルスタイリストです。ユーザーの体型・パーソナルカラー・髪型を深く理解し、その人に本当に似合うコーデを提案します。必ずJSON形式のみで返答してください。”,
messages: [{ role: “user”, content: buildPrompt() }],
}),
});
const data = await response.json();
const text = data.content?.find(b => b.type === “text”)?.text || “[]”;
const clean = text.replace(/`json|`/g, “”).trim();
const parsed = JSON.parse(clean);
setResults(parsed);
} catch {
setResults([{ title: “エラー”, mood: “-”, items: [], colorPoint: “”, tip: “もう一度お試しください”, reason: “” }]);
}
setLoading(false);
};

const CARD_COLORS = [”#fce4ec”, “#e3f2fd”, “#e8f5e9”];
const MOOD_COLORS = [”#e91e63”, “#1976d2”, “#388e3c”];

return (
<div style={{ marginBottom: “24px” }}>
{/* Header */}
<div style={{
background: “linear-gradient(135deg, #667eea 0%, #764ba2 100%)”,
borderRadius: “20px”, padding: “20px”, marginBottom: “14px”, color: “white”,
}}>
<div style={{ fontFamily: “‘Playfair Display’, serif”, fontSize: “18px”, fontWeight: “700”, marginBottom: “4px” }}>
✨ AIパーソナルスタイリスト
</div>
{hasProfile ? (
<div style={{ fontSize: “11px”, opacity: 0.85 }}>
{PC_LABEL[profile.personalColor]} · {profile.height}cm · {HAIR_LABEL[profile.hairLength]}{ profile.skeletonType ? ` · 骨格${{ straight: "ストレート", wave: "ウェーブ", natural: "ナチュラル" }[profile.skeletonType]}` : “” } のあなたへ
</div>
) : (
<div style={{ fontSize: “11px”, opacity: 0.75 }}>登録するとよりパーソナルな提案が届きます</div>
)}
</div>

```
  {/* 天気選択 */}
  <div style={{ marginBottom: "12px" }}>
    <div style={{ fontSize: "12px", fontWeight: "700", color: "#555", marginBottom: "8px" }}>今日の天気</div>
    <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
      {WEATHERS.map(w => (
        <button key={w.value} onClick={() => setWeather(w)} style={{
          padding: "8px 14px", borderRadius: "20px", border: "2px solid",
          borderColor: weather.value === w.value ? "#667eea" : "#e0e0e0",
          background: weather.value === w.value ? "#ede9ff" : "white",
          color: weather.value === w.value ? "#5c35d4" : "#666",
          fontWeight: "600", fontSize: "12px", cursor: "pointer",
          whiteSpace: "nowrap", fontFamily: "'Noto Sans JP', sans-serif",
          transition: "all 0.15s",
        }}>{w.label} {w.temp}</button>
      ))}
    </div>
  </div>

  {/* シチュエーション選択 */}
  <div style={{ marginBottom: "16px" }}>
    <div style={{ fontSize: "12px", fontWeight: "700", color: "#555", marginBottom: "8px" }}>シチュエーション</div>
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      {SITUATIONS.map(s => (
        <button key={s} onClick={() => setSituation(situation === s ? "" : s)} style={{
          padding: "7px 14px", borderRadius: "20px", border: "2px solid",
          borderColor: situation === s ? "#9b59b6" : "#e0e0e0",
          background: situation === s ? "#f5f0ff" : "white",
          color: situation === s ? "#9b59b6" : "#666",
          fontWeight: "600", fontSize: "12px", cursor: "pointer",
          fontFamily: "'Noto Sans JP', sans-serif", transition: "all 0.15s",
        }}>{s}</button>
      ))}
    </div>
  </div>

  <button onClick={handleGenerate} disabled={loading} style={{
    width: "100%", padding: "15px", borderRadius: "16px", border: "none",
    background: loading ? "#ccc" : "linear-gradient(135deg, #667eea, #9b59b6)",
    color: "white", fontSize: "15px", fontWeight: "700", cursor: loading ? "default" : "pointer",
    fontFamily: "'Noto Sans JP', sans-serif",
    boxShadow: loading ? "none" : "0 4px 20px rgba(155,89,182,0.35)",
    transition: "all 0.2s",
  }}>
    {loading ? "🌀 コーデを考えています…" : "🎨 3パターン提案してもらう"}
  </button>

  {/* Results */}
  {results && (
    <div style={{ marginTop: "20px" }}>
      {isDemo && (
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          background: "#fff8e1", borderRadius: "12px", padding: "10px 14px",
          marginBottom: "12px", border: "1.5px solid #ffe082",
        }}>
          <span style={{ fontSize: "16px" }}>👀</span>
          <div style={{ fontSize: "12px", color: "#795548" }}>
            <strong>デモ表示中</strong>　実際の提案はボタンを押すとAIが生成します
          </div>
        </div>
      )}
      {/* Pattern tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
        {results.map((r, i) => (
          <button key={i} onClick={() => setActivePattern(i)} style={{
            flex: 1, padding: "8px 4px", borderRadius: "12px", border: "2px solid",
            borderColor: activePattern === i ? MOOD_COLORS[i] : "#e0e0e0",
            background: activePattern === i ? CARD_COLORS[i] : "white",
            color: activePattern === i ? MOOD_COLORS[i] : "#aaa",
            fontWeight: "700", fontSize: "11px", cursor: "pointer",
            fontFamily: "'Noto Sans JP', sans-serif", transition: "all 0.15s",
          }}>
            パターン{i + 1}<br />
            <span style={{ fontSize: "10px", fontWeight: "500" }}>{r.mood}</span>
          </button>
        ))}
      </div>

      {results[activePattern] && (() => {
        const r = results[activePattern];
        const color = CARD_COLORS[activePattern];
        const moodColor = MOOD_COLORS[activePattern];
        return (
          <div style={{ background: color, borderRadius: "20px", padding: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div>
                <span style={{ background: "rgba(255,255,255,0.8)", borderRadius: "20px", padding: "3px 12px", fontSize: "11px", fontWeight: "700", color: moodColor }}>{r.mood}</span>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: "700", color: "#2a2a2a", marginTop: "6px" }}>{r.title}</div>
              </div>
            </div>

            {/* アバター＋アイテムリスト横並び */}
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "12px" }}>
              <div style={{ flexShrink: 0, background: "rgba(255,255,255,0.5)", borderRadius: "16px", padding: "8px" }}>
                <FashionAvatar profile={user?.profile} coordItems={r.items} cardColor={color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "#888", marginBottom: "6px" }}>コーデアイテム</div>
                <ClosetLegend />
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {r.items.map((item, i) => (
                    <ItemTag key={i} label={item} inCloset={isInCloset(item, closetItems)} />
                  ))}
                </div>
              </div>
            </div>

            {r.colorPoint && (
              <div style={{ background: "rgba(255,255,255,0.65)", borderRadius: "12px", padding: "10px 14px", marginBottom: "8px", fontSize: "12px", color: "#555" }}>
                <span style={{ fontWeight: "700", color: moodColor }}>🎨 カラーポイント</span><br />{r.colorPoint}
              </div>
            )}
            <div style={{ background: "rgba(255,255,255,0.65)", borderRadius: "12px", padding: "10px 14px", marginBottom: "8px", fontSize: "12px", color: "#555" }}>
              <span style={{ fontWeight: "700" }}>💡 スタイリングのコツ</span><br />{r.tip}
            </div>
            {r.reason && (
              <div style={{ background: "rgba(255,255,255,0.65)", borderRadius: "12px", padding: "10px 14px", fontSize: "12px", color: "#555" }}>
                <span style={{ fontWeight: "700" }}>✅ あなたに合う理由</span><br />{r.reason}
              </div>
            )}
          </div>
        );
      })()}
    </div>
  )}
</div>
```

);
}

const CATEGORY_OPTIONS = [“トップス”, “ボトムス”, “スカート”, “アウター”, “ワンピース”, “シューズ”, “バッグ”, “アクセサリー”, “その他”];
const EMOJI_OPTIONS = [“👕”,“👗”,“🧥”,“👔”,“👖”,“👟”,“👠”,“👡”,“👜”,“👝”,“🎒”,“🧣”,“🧤”,“🧢”,“💍”,“📿”,“⌚”,“🕶️”,“🧦”];
const COLOR_OPTIONS = [
{ label: “ホワイト”, value: “#f5f5f5” }, { label: “ブラック”, value: “#1a1a1a” },
{ label: “グレー”, value: “#9e9e9e” }, { label: “ネイビー”, value: “#1a237e” },
{ label: “ブルー”, value: “#4a90e2” }, { label: “レッド”, value: “#e53935” },
{ label: “ピンク”, value: “#f48fb1” }, { label: “パープル”, value: “#9b59b6” },
{ label: “グリーン”, value: “#66bb6a” }, { label: “イエロー”, value: “#fdd835” },
{ label: “オレンジ”, value: “#ff7043” }, { label: “ブラウン”, value: “#8B5E3C” },
{ label: “ベージュ”, value: “#d9c4a7” }, { label: “キャメル”, value: “#c8a165” },
];
const TAG_OPTIONS = [“カジュアル”, “きれいめ”, “フェミニン”, “モード”, “スポーツ”, “オフィス”, “デート”, “春夏”, “秋冬”, “ベーシック”, “トレンド”];

const BLANK_FORM = { name: “”, category: “トップス”, emoji: “👕”, color: “#f5f5f5”, tags: [], sleeveLength: “” };

// カテゴリ別アイテム名選択肢
const ITEM_PRESETS = {
“トップス”:   [“Tシャツ”, “カットソー”, “ブラウス”, “シャツ”, “ニット”, “スウェット”, “タンクトップ”, “キャミソール”, “ポロシャツ”, “チューブトップ”, “ビスチェ”, “コルセットトップ”, “バンドゥトップ”, “クロップトップ”, “リブニット”, “ボーダーT”, “ヘンリーネック”, “オフショルダー”, “ドレープトップ”, “レースブラウス”],
“ボトムス”:   [“デニム”, “スキニーパンツ”, “ワイドパンツ”, “スラックス”, “ショートパンツ”, “チノパン”, “レギンス”, “ジョガーパンツ”, “カーゴパンツ”, “テーパードパンツ”, “ガウチョパンツ”, “クロップドパンツ”, “バギーパンツ”, “サテンパンツ”, “レザーパンツ”, “リネンパンツ”, “トラックパンツ”, “デニムショーツ”],
“アウター”:   [“デニムジャケット”, “テーラードジャケット”, “ブルゾン”, “トレンチコート”, “ウールコート”, “ダウンジャケット”, “カーディガン”, “パーカー”, “フーディ”, “ライダース”, “ノーカラーコート”, “チェスターコート”, “ミリタリージャケット”, “ナイロンジャケット”, “ファーコート”, “ベスト”, “ポンチョ”, “マウンテンパーカー”, “ジップアップパーカー”, “ボアジャケット”, “キルティングジャケット”],
“ワンピース”: [“シャツワンピース”, “フレアワンピース”, “タイトワンピース”, “ニットワンピース”, “マキシワンピース”, “ミニワンピース”, “ラップワンピース”, “サテンワンピース”, “ニットワンピース”, “Aラインワンピース”, “キャミワンピース”, “ティアードワンピース”, “コルセットワンピース”, “ニットタイトワンピース”, “デニムワンピース”],
“スカート”:   [“フレアスカート”, “プリーツスカート”, “タイトスカート”, “ミニスカート”, “マキシスカート”, “デニムスカート”, “チェックスカート”, “ティアードスカート”, “ラップスカート”, “サテンスカート”, “レザースカート”, “ニットスカート”, “アシンメトリースカート”, “バイアスカットスカート”, “スリットスカート”],
“シューズ”:   [“スニーカー”, “パンプス”, “ローファー”, “ブーツ”, “サンダル”, “ミュール”, “バレエシューズ”, “ヒールブーツ”, “スリッポン”, “プラットフォームスニーカー”, “チャンキーヒール”, “ストラップサンダル”, “フラットサンダル”, “ウェッジサンダル”, “トングサンダル”, “グラディエーターサンダル”, “ビルケンサンダル”, “スポーツサンダル”, “スティレットヒール”, “アンクルブーツ”, “ニーハイブーツ”, “チェルシーブーツ”, “ドクターマーチン”, “エスパドリーユ”, “モカシン”, “オックスフォード”, “ダービーシューズ”, “メアリージェーン”],
“バッグ”:     [“トートバッグ”, “ショルダーバッグ”, “リュック”, “クラッチバッグ”, “ミニバッグ”, “かごバッグ”, “チェーンバッグ”, “ボストンバッグ”, “ウエストポーチ”, “バケツバッグ”, “フラップバッグ”, “サッチェルバッグ”, “ドラムバッグ”, “ハーフムーンバッグ”, “メッセンジャーバッグ”, “マルチポーチ”, “キャンバストート”, “レザートート”, “スタッズバッグ”, “クロスボディバッグ”, “ミニショルダー”, “ベルトバッグ”, “トラペーズバッグ”, “ホーボーバッグ”, “クリアバッグ”],
“アクセサリー”: [“ネックレス”, “ピアス”, “イヤリング”, “ブレスレット”, “リング”, “スカーフ”, “ベルト”, “ハット”, “サングラス”, “時計”, “バングル”, “チョーカー”, “ロングネックレス”, “パールネックレス”, “チェーンネックレス”, “フープピアス”, “スタッドピアス”, “ドロップピアス”, “チャームブレスレット”, “アンクレット”, “ヘアクリップ”, “ヘアバンド”, “ターバン”, “ベレー帽”, “キャップ”, “ニット帽”, “バケットハット”, “カウボーイハット”, “手袋”, “マフラー”, “ストール”, “レッグウォーマー”, “ソックス”, “タイツ”, “ニーハイソックス”],
“その他”:     [“ルームウェア”, “水着”, “レインウェア”, “スポーツウェア”, “ジャージ”, “レオタード”, “オーバーオール”, “サロペット”, “浴衣”, “着物”, “ガウン”, “ナイトウェア”],
};

const SLEEVE_OPTIONS = [
{ value: “ノースリーブ”, label: “ノースリーブ” },
{ value: “半袖”,         label: “半袖” },
{ value: “七分袖”,       label: “七分袖” },
{ value: “長袖”,         label: “長袖” },
];
// 袖を選ぶカテゴリ
const SLEEVE_CATEGORIES = [“トップス”, “アウター”, “ワンピース”];

function ItemModal({ item, onSave, onDelete, onClose }) {
const isEdit = !!item?.id;
const [form, setForm] = useState(item ? { sleeveLength: “”, …item } : { …BLANK_FORM });
const [tab, setTab] = useState(“basic”);
const [nameMode, setNameMode] = useState(“preset”); // “preset” | “custom”

const setF = (k, v) => setForm(f => ({ …f, [k]: v }));
const toggleTag = (t) => setF(“tags”, form.tags.includes(t) ? form.tags.filter(x => x !== t) : […form.tags, t]);

const presets = ITEM_PRESETS[form.category] || [];
const showSleeve = SLEEVE_CATEGORIES.includes(form.category);

// 完成アイテム名（袖長さ + アイテム名）
const fullName = form.name
? (showSleeve && form.sleeveLength ? `${form.sleeveLength}${form.name}` : form.name)
: “”;

const canSave = form.name.trim().length > 0;

return (
<div style={{
position: “fixed”, inset: 0, background: “rgba(0,0,0,0.45)”, zIndex: 100,
display: “flex”, alignItems: “flex-end”, justifyContent: “center”,
}} onClick={onClose}>
<div onClick={e => e.stopPropagation()} style={{
background: “white”, borderRadius: “24px 24px 0 0”,
width: “100%”, maxWidth: “430px”, maxHeight: “88vh”,
overflowY: “auto”, padding: “24px”,
animation: “slideUp 0.25s ease”,
}}>
<style>{`@keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }`}</style>

```
    <div style={{ width: "40px", height: "4px", background: "#e0e0e0", borderRadius: "4px", margin: "0 auto 20px" }} />

    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: "700" }}>
        {isEdit ? "アイテムを編集" : "アイテムを追加"}
      </div>
      {isEdit && (
        <button onClick={() => onDelete(item.id)} style={{
          background: "#fff0f0", border: "none", borderRadius: "10px",
          padding: "6px 12px", color: "#e53935", fontWeight: "700",
          fontSize: "12px", cursor: "pointer", fontFamily: "'Noto Sans JP', sans-serif",
        }}>🗑 削除</button>
      )}
    </div>

    {/* Preview */}
    <div style={{ display: "flex", alignItems: "center", gap: "14px", background: "#f7f5f3", borderRadius: "16px", padding: "14px", marginBottom: "20px" }}>
      <div style={{
        width: "56px", height: "56px", borderRadius: "50%", background: form.color,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "26px", border: "2px solid #eee", flexShrink: 0,
      }}>{form.emoji}</div>
      <div>
        <div style={{ fontWeight: "700", fontSize: "15px", color: "#2a2a2a" }}>{fullName || "アイテム名未入力"}</div>
        <div style={{ fontSize: "12px", color: "#aaa", marginTop: "2px" }}>{form.category}</div>
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "4px" }}>
          {form.tags.map((t, i) => <span key={i} style={{ background: "#eee", borderRadius: "8px", padding: "2px 8px", fontSize: "10px", color: "#666" }}>{t}</span>)}
        </div>
      </div>
    </div>

    {/* Inner tabs */}
    <div style={{ display: "flex", background: "#f0f0f0", borderRadius: "12px", padding: "3px", marginBottom: "18px" }}>
      {[["basic","基本情報"],["color","色・絵文字"],["tags","タグ"]].map(([key, label]) => (
        <button key={key} onClick={() => setTab(key)} style={{
          flex: 1, padding: "8px 4px", border: "none", borderRadius: "10px",
          fontWeight: "700", fontSize: "12px", cursor: "pointer",
          background: tab === key ? "white" : "transparent",
          color: tab === key ? "#9b59b6" : "#aaa",
          boxShadow: tab === key ? "0 1px 6px rgba(0,0,0,0.1)" : "none",
          fontFamily: "'Noto Sans JP', sans-serif", transition: "all 0.15s",
        }}>{label}</button>
      ))}
    </div>

    {/* Basic */}
    {tab === "basic" && (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* カテゴリ */}
        <div>
          <label style={{ fontSize: "12px", fontWeight: "700", color: "#555", display: "block", marginBottom: "8px" }}>カテゴリ</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {CATEGORY_OPTIONS.map(cat => (
              <button key={cat} onClick={() => { setF("category", cat); setF("name", ""); setF("sleeveLength", ""); }} style={{
                padding: "7px 14px", borderRadius: "20px", border: "2px solid",
                borderColor: form.category === cat ? "#9b59b6" : "#e0e0e0",
                background: form.category === cat ? "#f5f0ff" : "white",
                color: form.category === cat ? "#9b59b6" : "#666",
                fontWeight: "600", fontSize: "12px", cursor: "pointer",
                fontFamily: "'Noto Sans JP', sans-serif",
              }}>{cat}</button>
            ))}
          </div>
        </div>

        {/* 袖の長さ（対象カテゴリのみ）*/}
        {showSleeve && (
          <div>
            <label style={{ fontSize: "12px", fontWeight: "700", color: "#555", display: "block", marginBottom: "8px" }}>袖の長さ</label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {SLEEVE_OPTIONS.map(s => (
                <button key={s.value} onClick={() => setF("sleeveLength", form.sleeveLength === s.value ? "" : s.value)} style={{
                  padding: "7px 14px", borderRadius: "20px", border: "2px solid",
                  borderColor: form.sleeveLength === s.value ? "#667eea" : "#e0e0e0",
                  background: form.sleeveLength === s.value ? "#eef0ff" : "white",
                  color: form.sleeveLength === s.value ? "#667eea" : "#666",
                  fontWeight: "600", fontSize: "12px", cursor: "pointer",
                  fontFamily: "'Noto Sans JP', sans-serif",
                }}>{s.label}</button>
              ))}
            </div>
          </div>
        )}

        {/* アイテム名 */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <label style={{ fontSize: "12px", fontWeight: "700", color: "#555" }}>アイテム名 *</label>
            <div style={{ display: "flex", background: "#f0f0f0", borderRadius: "10px", padding: "2px" }}>
              {[["preset","選択"], ["custom","手入力"]].map(([m, l]) => (
                <button key={m} onClick={() => setNameMode(m)} style={{
                  padding: "4px 10px", border: "none", borderRadius: "8px", fontSize: "11px",
                  fontWeight: "600", cursor: "pointer",
                  background: nameMode === m ? "white" : "transparent",
                  color: nameMode === m ? "#9b59b6" : "#aaa",
                  fontFamily: "'Noto Sans JP', sans-serif",
                }}>{l}</button>
              ))}
            </div>
          </div>

          {nameMode === "preset" ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {presets.map(p => (
                <button key={p} onClick={() => setF("name", p)} style={{
                  padding: "8px 14px", borderRadius: "20px", border: "2px solid",
                  borderColor: form.name === p ? "#9b59b6" : "#e0e0e0",
                  background: form.name === p ? "#f5f0ff" : "white",
                  color: form.name === p ? "#9b59b6" : "#555",
                  fontWeight: "600", fontSize: "13px", cursor: "pointer",
                  fontFamily: "'Noto Sans JP', sans-serif", transition: "all 0.15s",
                }}>{p}</button>
              ))}
            </div>
          ) : (
            <input value={form.name} onChange={e => setF("name", e.target.value)}
              placeholder="例: ストライプシャツ" style={{
                width: "100%", padding: "12px 14px", borderRadius: "12px",
                border: "2px solid #f0f0f0", fontSize: "14px", outline: "none",
                background: "#fafafa", fontFamily: "'Noto Sans JP', sans-serif",
              }} />
          )}
        </div>
      </div>
    )}

    {/* Color & Emoji */}
    {tab === "color" && (
      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        <div>
          <label style={{ fontSize: "12px", fontWeight: "700", color: "#555", display: "block", marginBottom: "8px" }}>絵文字</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {EMOJI_OPTIONS.map(em => (
              <button key={em} onClick={() => setF("emoji", em)} style={{
                width: "42px", height: "42px", borderRadius: "12px", border: "2px solid",
                borderColor: form.emoji === em ? "#9b59b6" : "#e0e0e0",
                background: form.emoji === em ? "#f5f0ff" : "white",
                fontSize: "20px", cursor: "pointer",
              }}>{em}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ fontSize: "12px", fontWeight: "700", color: "#555", display: "block", marginBottom: "8px" }}>カラー</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {COLOR_OPTIONS.map(c => (
              <button key={c.value} onClick={() => setF("color", c.value)} title={c.label} style={{
                width: "36px", height: "36px", borderRadius: "50%", border: "3px solid",
                borderColor: form.color === c.value ? "#9b59b6" : "#e0e0e0",
                background: c.value, cursor: "pointer",
                boxShadow: form.color === c.value ? "0 0 0 2px #9b59b6" : "none",
              }} />
            ))}
          </div>
        </div>
      </div>
    )}

    {/* Tags */}
    {tab === "tags" && (
      <div>
        <label style={{ fontSize: "12px", fontWeight: "700", color: "#555", display: "block", marginBottom: "8px" }}>タグを選択</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {TAG_OPTIONS.map(t => (
            <button key={t} onClick={() => toggleTag(t)} style={{
              padding: "8px 16px", borderRadius: "20px", border: "2px solid",
              borderColor: form.tags.includes(t) ? "#9b59b6" : "#e0e0e0",
              background: form.tags.includes(t) ? "#f5f0ff" : "white",
              color: form.tags.includes(t) ? "#9b59b6" : "#666",
              fontWeight: "600", fontSize: "13px", cursor: "pointer",
              fontFamily: "'Noto Sans JP', sans-serif",
            }}>{t}</button>
          ))}
        </div>
      </div>
    )}

    <button onClick={() => canSave && onSave({ ...form, name: fullName || form.name })} style={{
      width: "100%", padding: "14px", borderRadius: "14px", border: "none",
      background: canSave ? "linear-gradient(135deg, #667eea, #9b59b6)" : "#ddd",
      color: "white", fontWeight: "700", fontSize: "15px",
      cursor: canSave ? "pointer" : "default", marginTop: "24px",
      fontFamily: "'Noto Sans JP', sans-serif",
      boxShadow: canSave ? "0 4px 16px rgba(155,89,182,0.3)" : "none",
    }}>
      {isEdit ? "変更を保存" : "追加する"}
    </button>
  </div>
</div>
```

);
}

function ClosetTab({ items, onAddItem, onEditItem, onDeleteItem }) {
const [filter, setFilter] = useState(“すべて”);
const [editMode, setEditMode] = useState(false);
const [modal, setModal] = useState(null); // null | “add” | item object

const categories = [“すべて”, …CATEGORY_OPTIONS];
const filtered = filter === “すべて” ? items : items.filter(i => i.category === filter);

const handleSave = (form) => {
if (modal === “add”) onAddItem(form);
else onEditItem({ …modal, …form });
setModal(null);
};

const handleDelete = (id) => {
onDeleteItem(id);
setModal(null);
};

return (
<div>
{modal && (
<ItemModal
item={modal === “add” ? null : modal}
onSave={handleSave}
onDelete={handleDelete}
onClose={() => setModal(null)}
/>
)}

```
  {/* Header row */}
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
    <div style={{ fontSize: "13px", color: "#aaa" }}>{items.length}アイテム</div>
    <button onClick={() => setEditMode(e => !e)} style={{
      padding: "6px 14px", borderRadius: "20px", border: "2px solid",
      borderColor: editMode ? "#e53935" : "#9b59b6",
      background: editMode ? "#fff0f0" : "#f5f0ff",
      color: editMode ? "#e53935" : "#9b59b6",
      fontWeight: "700", fontSize: "12px", cursor: "pointer",
      fontFamily: "'Noto Sans JP', sans-serif",
    }}>
      {editMode ? "✅ 完了" : "✏️ 編集"}
    </button>
  </div>

  {/* Category filter */}
  <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "8px", marginBottom: "16px" }}>
    {categories.map(cat => (
      <button key={cat} onClick={() => setFilter(cat)} style={{
        background: filter === cat ? "#2a2a2a" : "#f0f0f0",
        color: filter === cat ? "white" : "#555",
        border: "none", borderRadius: "20px", padding: "6px 14px",
        fontSize: "12px", fontWeight: "600", cursor: "pointer",
        whiteSpace: "nowrap", transition: "all 0.2s",
      }}>{cat}</button>
    ))}
  </div>

  {/* Grid */}
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
    {filtered.map(item => (
      <div key={item.id} onClick={() => editMode && setModal(item)} style={{
        background: "white", borderRadius: "16px", padding: "16px",
        textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        cursor: editMode ? "pointer" : "default",
        border: editMode ? "2px dashed #9b59b6" : "2px solid transparent",
        position: "relative", transition: "all 0.15s",
      }}>
        {editMode && (
          <div style={{
            position: "absolute", top: "8px", right: "8px",
            background: "#9b59b6", color: "white", borderRadius: "50%",
            width: "20px", height: "20px", fontSize: "11px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✎</div>
        )}
        <div style={{
          width: "50px", height: "50px", background: item.color, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "24px", margin: "0 auto 10px", border: "2px solid #eee",
        }}>{item.emoji}</div>
        <div style={{ fontSize: "13px", fontWeight: "600", color: "#2a2a2a", marginBottom: "4px" }}>{item.name}</div>
        <div style={{ fontSize: "11px", color: "#aaa" }}>{item.category}</div>
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "center", marginTop: "6px" }}>
          {item.tags.map((tag, i) => (
            <span key={i} style={{ background: "#f5f5f5", borderRadius: "8px", padding: "2px 8px", fontSize: "10px", color: "#777" }}>{tag}</span>
          ))}
        </div>
      </div>
    ))}

    {/* Add button */}
    <button onClick={() => setModal("add")} style={{
      background: "#f9f9f9", border: "2px dashed #ddd", borderRadius: "16px",
      padding: "16px", textAlign: "center", cursor: "pointer",
      color: "#aaa", fontSize: "13px", fontWeight: "600",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      minHeight: "120px",
    }}>
      <div style={{ fontSize: "28px", marginBottom: "6px" }}>+</div>
      アイテム追加
    </button>
  </div>
</div>
```

);
}

const SHOP_SITES = [
{
category: “総合ファッション”,
sites: [
{ name: “ZOZOTOWN”, desc: “国内最大級のファッション通販”, emoji: “🛍️”, color: “#000000”, url: “https://zozo.jp” },
{ name: “UNIQLO”, desc: “ベーシックアイテムならここ”, emoji: “🔴”, color: “#e60012”, url: “https://www.uniqlo.com/jp” },
{ name: “GU”, desc: “トレンドをお手頃価格で”, emoji: “🟣”, color: “#6a1b9a”, url: “https://www.gu-global.com/jp” },
{ name: “H&M”, desc: “世界的人気のファストファッション”, emoji: “🌍”, color: “#cc0000”, url: “https://www2.hm.com/ja_jp” },
]
},
{
category: “セレクトショップ”,
sites: [
{ name: “BEAMS”, desc: “トレンドセンスあふれるセレクト”, emoji: “🏷️”, color: “#2e4a7a”, url: “https://www.beams.co.jp” },
{ name: “SHIPS”, desc: “上質なきれいめカジュアル”, emoji: “⚓”, color: “#1a3a5c”, url: “https://www.shipsltd.co.jp” },
{ name: “UNITED ARROWS”, desc: “こだわりの大人スタイル”, emoji: “🏹”, color: “#2a2a2a”, url: “https://www.united-arrows.co.jp” },
{ name: “Rakuten Fashion”, desc: “ブランドが豊富なファッション通販”, emoji: “🛒”, color: “#bf0000”, url: “https://fashion.rakuten.co.jp” },
]
},
{
category: “ハイブランド・ラグジュアリー”,
sites: [
{ name: “FARFETCH”, desc: “世界中のラグジュアリーを一括購入”, emoji: “💎”, color: “#222222”, url: “https://www.farfetch.com/jp” },
{ name: “NET-A-PORTER”, desc: “世界トップクラスのラグジュアリー通販”, emoji: “👑”, color: “#1a1a1a”, url: “https://www.net-a-porter.com” },
{ name: “SSENSE”, desc: “ストリート×ラグジュアリーの融合”, emoji: “⭐”, color: “#000000”, url: “https://www.ssense.com/ja-jp” },
]
},
{
category: “フリマ・中古”,
sites: [
{ name: “メルカリ”, desc: “フリマアプリの定番”, emoji: “🔴”, color: “#ff0211”, url: “https://jp.mercari.com” },
{ name: “FRIL（フリル）”, desc: “レディースに特化したフリマ”, emoji: “🌸”, color: “#e91e8c”, url: “https://fril.jp” },
{ name: “ラクマ”, desc: “楽天のフリマアプリ”, emoji: “🍀”, color: “#009900”, url: “https://fril.jp” },
]
},
];

function ShoppingTab() {
const [search, setSearch] = useState(””);

const filtered = SHOP_SITES.map(cat => ({
…cat,
sites: cat.sites.filter(s =>
s.name.toLowerCase().includes(search.toLowerCase()) ||
s.desc.includes(search)
),
})).filter(cat => cat.sites.length > 0);

return (
<div>
{/* Header */}
<div style={{
background: “linear-gradient(135deg, #f093fb 0%, #f5576c 100%)”,
borderRadius: “20px”, padding: “20px”, marginBottom: “20px”, color: “white”,
}}>
<div style={{ fontFamily: “‘Playfair Display’, serif”, fontSize: “20px”, fontWeight: “700” }}>🛍️ ショッピング</div>
<div style={{ fontSize: “13px”, opacity: 0.85, marginTop: “4px” }}>お気に入りのサイトへジャンプ</div>
</div>

```
  {/* Search */}
  <div style={{ position: "relative", marginBottom: "20px" }}>
    <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>🔍</span>
    <input
      value={search}
      onChange={e => setSearch(e.target.value)}
      placeholder="サイト名で検索..."
      style={{
        width: "100%", padding: "12px 14px 12px 40px",
        borderRadius: "14px", border: "2px solid #f0f0f0",
        fontSize: "14px", outline: "none", background: "white",
        fontFamily: "'Noto Sans JP', sans-serif",
      }}
    />
  </div>

  {/* Site categories */}
  {filtered.map((cat, ci) => (
    <div key={ci} style={{ marginBottom: "24px" }}>
      <div style={{ fontSize: "13px", fontWeight: "700", color: "#888", marginBottom: "10px", letterSpacing: "0.5px" }}>
        {cat.category}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {cat.sites.map((site, si) => (
          <a
            key={si}
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              transition: "transform 0.15s, box-shadow 0.15s",
              cursor: "pointer",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateX(4px)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; }}
            >
              <div style={{
                width: "48px", height: "48px", borderRadius: "14px",
                background: site.color, display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: "22px", flexShrink: 0,
              }}>{site.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: "700", fontSize: "15px", color: "#2a2a2a" }}>{site.name}</div>
                <div style={{ fontSize: "12px", color: "#aaa", marginTop: "2px" }}>{site.desc}</div>
              </div>
              <span style={{ fontSize: "18px", color: "#ccc", flexShrink: 0 }}>→</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  ))}

  {filtered.length === 0 && (
    <div style={{ textAlign: "center", padding: "40px 0", color: "#aaa" }}>
      <div style={{ fontSize: "32px", marginBottom: "10px" }}>🔍</div>
      <div style={{ fontSize: "14px" }}>「{search}」に一致するサイトはありません</div>
    </div>
  )}
</div>
```

);
}

function TrendTab({ user }) {
const [selected, setSelected] = useState(null);
const [results, setResults] = useState(null);
const [loading, setLoading] = useState(false);

const handleSelect = async (trend) => {
setSelected(trend);
setResults(null);
setLoading(true);

```
const profile = user?.profile;
const pc = profile?.personalColor;
const profileDesc = profile?.height
  ? `身長${profile.height}cm・体重${profile.weight}kg・${profile.hairLength}ヘア・パーソナルカラー${PC_LABEL[pc] || ""}・骨格${({ straight: "ストレート", wave: "ウェーブ", natural: "ナチュラル" })[profile.skeletonType] || ""}`
  : "プロフィール未登録";

const favoriteStyles = (user?.favoriteStyles || [])
  .map(k => STYLE_OPTIONS.find(s => s.key === k)?.label)
  .filter(Boolean).join("・") || "指定なし";

const prompt = `トレンドキーワード「${trend.title}」（${trend.desc}）をテーマにしたコーデを10パターン提案してください。
```

ユーザー情報:

- ${profileDesc}
- 好みのスタイル: ${favoriteStyles}

必ず以下のJSON配列のみで返答してください（説明文・バッククォート不要）:
[
{
“title”: “コーデ名（10文字以内）”,
“mood”: “雰囲気タグ”,
“items”: [“アイテム1（トップス・ワンピース・アウターには半袖/長袖/七分袖/ノースリーブを明記）”, “アイテム2”, “アイテム3”],
“point”: “このトレンドを取り入れたポイント（1文）”
}
]
※itemsのトップス・ワンピース・アウターには必ず「半袖」「長袖」「七分袖」「ノースリーブ」のいずれかを含めること`;

```
try {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: "あなたはトレンドに精通したファッションスタイリストです。指定されたトレンドキーワードに沿ったコーデを提案します。必ずJSON配列のみ返答してください。",
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  const text = data.content?.find(b => b.type === "text")?.text || "[]";
  const clean = text.replace(/```json|```/g, "").trim();
  setResults(JSON.parse(clean));
} catch {
  setResults([{ title: "エラー", mood: "-", items: [], point: "もう一度お試しください" }]);
}
setLoading(false);
```

};

const CARD_COLORS = [
“#fce4ec”,”#e3f2fd”,”#e8f5e9”,”#fff8e1”,”#f3e5f5”,
“#e0f2f1”,”#fbe9e7”,”#e8eaf6”,”#f1f8e9”,”#fce4ec”,
];
const MOOD_COLORS = [
“#e91e63”,”#1976d2”,”#388e3c”,”#f9a825”,”#9c27b0”,
“#00897b”,”#e64a19”,”#3949ab”,”#7cb342”,”#e91e63”,
];

return (
<div>
{/* ヘッダー */}
<div style={{
background: “linear-gradient(135deg, #f5af19 0%, #f12711 100%)”,
borderRadius: “20px”, padding: “20px”, marginBottom: “20px”, color: “white”,
}}>
<div style={{ fontFamily: “‘Playfair Display’, serif”, fontSize: “20px”, fontWeight: “700” }}>2026 Spring/Summer</div>
<div style={{ fontSize: “13px”, opacity: 0.85, marginTop: “4px” }}>
{selected ? `「${selected.title}」の提案を表示中` : “トレンドをタップして提案を見る”}
</div>
</div>

```
  {/* トレンドカードグリッド */}
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
    {TRENDS.map(trend => {
      const isActive = selected?.id === trend.id;
      return (
        <div key={trend.id} onClick={() => handleSelect(trend)} style={{
          background: trend.color,
          borderRadius: "16px", padding: "16px", cursor: "pointer",
          border: `2px solid ${isActive ? "#f12711" : "transparent"}`,
          boxShadow: isActive ? "0 4px 20px rgba(241,39,17,0.3)" : "none",
          transition: "all 0.2s",
          transform: isActive ? "scale(1.02)" : "scale(1)",
        }}>
          <div style={{ fontSize: "26px", marginBottom: "8px" }}>{trend.icon}</div>
          <div style={{ fontSize: "14px", fontWeight: "700", color: "#2a2a2a", marginBottom: "4px" }}>{trend.title}</div>
          <div style={{ fontSize: "11px", color: "#666", lineHeight: "1.5", marginBottom: "8px" }}>{trend.desc}</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{
              background: "rgba(255,255,255,0.7)", borderRadius: "10px",
              padding: "2px 10px", fontSize: "10px", fontWeight: "600", color: "#444",
            }}>{trend.tag}</span>
            {isActive && <span style={{ fontSize: "14px" }}>✅</span>}
          </div>
        </div>
      );
    })}
  </div>

  {/* ローディング */}
  {loading && (
    <div style={{
      background: "white", borderRadius: "20px", padding: "32px",
      textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    }}>
      <div style={{ fontSize: "32px", marginBottom: "12px", animation: "spin 1s linear infinite", display: "inline-block" }}>🌀</div>
      <div style={{ fontSize: "14px", color: "#888" }}>10パターンのコーデを考えています…</div>
    </div>
  )}

  {/* 結果 */}
  {results && !loading && (
    <div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: "700", marginBottom: "14px", color: "#2a2a2a" }}>
        {selected?.icon} {selected?.title}のコーデ提案
      </div>
      {results.map((r, i) => (
        <div key={i} style={{
          background: CARD_COLORS[i % CARD_COLORS.length],
          borderRadius: "18px", padding: "16px", marginBottom: "12px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
          animation: `fadeUp 0.3s ease ${i * 0.05}s both`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "50%",
              background: MOOD_COLORS[i % MOOD_COLORS.length],
              color: "white", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "12px", fontWeight: "700", flexShrink: 0,
            }}>{i + 1}</div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: "700", color: "#2a2a2a" }}>{r.title}</div>
              <span style={{
                background: "rgba(255,255,255,0.75)", borderRadius: "10px",
                padding: "1px 8px", fontSize: "10px", fontWeight: "600",
                color: MOOD_COLORS[i % MOOD_COLORS.length],
              }}>{r.mood}</span>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
            {(r.items || []).map((item, j) => (
              <span key={j} style={{
                background: "rgba(255,255,255,0.85)", borderRadius: "10px",
                padding: "4px 10px", fontSize: "11px", color: "#333", fontWeight: "600",
              }}>{item}</span>
            ))}
          </div>
          {r.point && (
            <div style={{
              background: "rgba(255,255,255,0.6)", borderRadius: "10px",
              padding: "8px 12px", fontSize: "11px", color: "#555",
            }}>
              💡 {r.point}
            </div>
          )}
        </div>
      ))}
    </div>
  )}

  {/* 未選択時のガイド */}
  {!selected && !loading && (
    <div style={{ textAlign: "center", padding: "20px 0", color: "#bbb" }}>
      <div style={{ fontSize: "28px", marginBottom: "8px" }}>👆</div>
      <div style={{ fontSize: "13px" }}>上のトレンドカードをタップしてね</div>
    </div>
  )}
</div>
```

);
}

const STYLE_OPTIONS = [
{ key: “stylish”,    label: “スタイリッシュ”, emoji: “🖤”, desc: “クール・モード・洗練”,      color: “#2a2a2a”, light: “#f5f5f5” },
{ key: “girly”,      label: “ガーリー”,       emoji: “🌸”, desc: “フェミニン・甘め・可愛い”,  color: “#e91e8c”, light: “#fce4ec” },
{ key: “casual”,     label: “カジュアル”,     emoji: “👟”, desc: “ラフ・リラックス・デイリー”, color: “#4a90e2”, light: “#e3f2fd” },
{ key: “natural”,    label: “ナチュラル”,     emoji: “🌿”, desc: “オーガニック・アース・癒し”, color: “#6a9e6a”, light: “#e8f5e9” },
{ key: “office”,     label: “オフィス”,       emoji: “💼”, desc: “きれいめ・通勤・上品”,      color: “#5c6bc0”, light: “#e8eaf6” },
{ key: “street”,     label: “ストリート”,     emoji: “🔥”, desc: “ヴィンテージ・アメカジ”,    color: “#e65100”, light: “#fff3e0” },
{ key: “romantic”,   label: “ロマンティック”, emoji: “🌹”, desc: “エレガント・上品・華やか”,  color: “#9c4dcc”, light: “#f3e5f5” },
{ key: “sporty”,     label: “スポーティ”,     emoji: “⚡”, desc: “アクティブ・機能的・元気”,  color: “#00897b”, light: “#e0f2f1” },
{ key: “minimal”,    label: “ミニマル”,       emoji: “◻️”, desc: “シンプル・モノトーン・無駄なし”, color: “#757575”, light: “#f5f5f5” },
{ key: “vintage”,    label: “ヴィンテージ”,   emoji: “🎞️”, desc: “レトロ・クラシック・個性的”, color: “#8d6e63”, light: “#efebe9” },
];

const PC_LABEL_MAP = { spring: “イエベ春”, summer: “ブルベ夏”, autumn: “イエベ秋”, winter: “ブルベ冬” };
const HAIR_LABEL_MAP = { ショート: “ショート”, ミディアム: “ミディアム”, ロング: “ロング”, ベリーロング: “ベリーロング” };

function ProfileTab({ user, onUpdateUser, items, likedCoords }) {
const profile = user?.profile || {};
const savedStyles = user?.favoriteStyles || [];
const [selected, setSelected] = useState(savedStyles);
const [saved, setSaved] = useState(false);

const toggle = (key) => {
setSelected(prev =>
prev.includes(key) ? prev.filter(k => k !== key) : […prev, key]
);
setSaved(false);
};

const handleSave = () => {
onUpdateUser({ …user, favoriteStyles: selected });
setSaved(true);
setTimeout(() => setSaved(false), 2000);
};

const age = profile.birthdate
? Math.floor((Date.now() - new Date(profile.birthdate)) / (365.25 * 24 * 3600 * 1000))
: null;

const likedCount = Object.values(likedCoords || {}).filter(Boolean).length;

const stats = [
{ label: “アイテム数”, value: items?.length ?? 0, icon: “👗” },
{ label: “お気に入り”, value: likedCount,          icon: “❤️” },
{ label: “スタイル数”, value: selected.length,     icon: “✨” },
];

return (
<div>
{/* プロフィールヘッダー */}
<div style={{ textAlign: “center”, marginBottom: “20px” }}>
<div style={{
width: “80px”, height: “80px”,
background: “linear-gradient(135deg, #667eea, #764ba2)”,
borderRadius: “50%”,
display: “flex”, alignItems: “center”, justifyContent: “center”,
fontSize: “36px”, margin: “0 auto 12px”,
}}>👤</div>
<div style={{ fontFamily: “‘Playfair Display’, serif”, fontSize: “22px”, fontWeight: “700” }}>
{user?.name}
</div>
{selected.length > 0 && (
<div style={{ fontSize: “13px”, color: “#9b59b6”, marginTop: “6px”, fontWeight: “600” }}>
{selected.map(k => STYLE_OPTIONS.find(s => s.key === k)?.label).join(” × “)}
</div>
)}
</div>

```
  {/* スタッツ */}
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "20px" }}>
    {stats.map((s, i) => (
      <div key={i} style={{
        background: "white", borderRadius: "16px", padding: "14px 8px",
        textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
      }}>
        <div style={{ fontSize: "20px", marginBottom: "4px" }}>{s.icon}</div>
        <div style={{ fontSize: "20px", fontWeight: "700", color: "#2a2a2a" }}>{s.value}</div>
        <div style={{ fontSize: "11px", color: "#aaa" }}>{s.label}</div>
      </div>
    ))}
  </div>

  {/* プロフィール情報 */}
  {(age || profile.height || profile.personalColor) && (
    <div style={{
      background: "white", borderRadius: "20px", padding: "16px 20px",
      marginBottom: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    }}>
      <div style={{ fontWeight: "700", fontSize: "14px", marginBottom: "12px", color: "#555" }}>📋 基本情報</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {age && (
          <span style={tagStyle("#667eea")}>{age}歳</span>
        )}
        {profile.height && (
          <span style={tagStyle("#9b59b6")}>{profile.height}cm / {profile.weight}kg</span>
        )}
        {profile.hairLength && (
          <span style={tagStyle("#e91e63")}>{HAIR_LABEL_MAP[profile.hairLength] || profile.hairLength}</span>
        )}
        {profile.skeletonType && (
          <span style={tagStyle("#667eea")}>骨格{ { straight: "ストレート", wave: "ウェーブ", natural: "ナチュラル" }[profile.skeletonType] }</span>
        )}
        {profile.personalColor && (
          <span style={tagStyle("#f5af19")}>{PC_LABEL_MAP[profile.personalColor]}</span>
        )}
      </div>
    </div>
  )}

  {/* スタイル選択 */}
  <div style={{
    background: "white", borderRadius: "20px", padding: "20px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)", marginBottom: "16px",
  }}>
    <div style={{ fontWeight: "700", fontSize: "15px", marginBottom: "6px" }}>🎨 好きなスタイルを選ぼう</div>
    <div style={{ fontSize: "12px", color: "#aaa", marginBottom: "16px" }}>複数選択OK・AIコーデ提案に活用されます</div>

    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {STYLE_OPTIONS.map(s => {
        const isOn = selected.includes(s.key);
        return (
          <button key={s.key} onClick={() => toggle(s.key)} style={{
            display: "flex", alignItems: "center", gap: "14px",
            padding: "12px 16px", borderRadius: "14px",
            border: `2px solid ${isOn ? s.color : "#e8e8e8"}`,
            background: isOn ? s.light : "white",
            cursor: "pointer", textAlign: "left",
            fontFamily: "'Noto Sans JP', sans-serif",
            transition: "all 0.15s",
          }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "12px",
              background: isOn ? s.color : "#f0f0f0",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "20px", flexShrink: 0, transition: "all 0.15s",
            }}>{s.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "700", fontSize: "14px", color: isOn ? s.color : "#2a2a2a" }}>
                {s.label}
              </div>
              <div style={{ fontSize: "11px", color: "#aaa", marginTop: "2px" }}>{s.desc}</div>
            </div>
            <div style={{
              width: "22px", height: "22px", borderRadius: "50%",
              border: `2px solid ${isOn ? s.color : "#ddd"}`,
              background: isOn ? s.color : "white",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "all 0.15s",
            }}>
              {isOn && <span style={{ color: "white", fontSize: "13px", lineHeight: 1 }}>✓</span>}
            </div>
          </button>
        );
      })}
    </div>

    <button onClick={handleSave} style={{
      width: "100%", marginTop: "18px", padding: "14px",
      borderRadius: "14px", border: "none",
      background: saved
        ? "linear-gradient(135deg, #27ae60, #2ecc71)"
        : "linear-gradient(135deg, #667eea, #9b59b6)",
      color: "white", fontWeight: "700", fontSize: "15px",
      cursor: "pointer", fontFamily: "'Noto Sans JP', sans-serif",
      boxShadow: "0 4px 16px rgba(155,89,182,0.3)",
      transition: "background 0.3s",
    }}>
      {saved ? "✅ 保存しました！" : "スタイルを保存する"}
    </button>
  </div>
</div>
```

);
}

const tagStyle = (color) => ({
background: color + “18”,
color: color,
borderRadius: “20px”,
padding: “4px 12px”,
fontSize: “12px”,
fontWeight: “600”,
});

export default function FashionApp() {
const [user, setUser] = useState(() => getSession());
const [activeTab, setActiveTab] = useState(0);
const [items, setItems] = useState(SAMPLE_ITEMS);
const [likedCoords, setLikedCoords] = useState({});

if (!user) return <AuthScreen onLogin={setUser} />;

const toggleLike = (id) => {
setLikedCoords(prev => ({ …prev, [id]: !prev[id] }));
};

const addItem = (form) => {
setItems(prev => […prev, { id: Date.now(), …form }]);
};

const editItem = (updated) => {
setItems(prev => prev.map(i => i.id === updated.id ? updated : i));
};

const deleteItem = (id) => {
setItems(prev => prev.filter(i => i.id !== id));
};

const updateUser = (updated) => {
saveSession(updated);
setUser(updated);
};

const tabIcons = [“👗”, “🗂️”, “📱”, “🛍️”, “👤”];

return (
<div style={{
fontFamily: “‘Noto Sans JP’, sans-serif”,
background: “#f7f5f3”,
minHeight: “100vh”,
maxWidth: “430px”,
margin: “0 auto”,
display: “flex”,
flexDirection: “column”,
}}>
<style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Noto+Sans+JP:wght@400;500;700&display=swap'); @keyframes spin { to { transform: rotate(360deg); } } * { box-sizing: border-box; margin: 0; padding: 0; } input::placeholder { color: rgba(255,255,255,0.6); } ::-webkit-scrollbar { display: none; }`}</style>

```
  {/* Header */}
  <div style={{
    background: "white",
    padding: "20px 20px 16px",
    borderBottom: "1px solid #f0f0f0",
    position: "sticky", top: 0, zIndex: 10,
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: "700", letterSpacing: "-0.5px" }}>
        Parure
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "13px", color: "#9b59b6", fontWeight: "600" }}>👋 {user.name}</span>
        <button onClick={() => { clearSession(); setUser(null); }} style={{
          background: "#f5f0ff", border: "none", borderRadius: "10px",
          padding: "5px 10px", fontSize: "11px", color: "#9b59b6",
          fontWeight: "700", cursor: "pointer",
        }}>ログアウト</button>
      </div>
    </div>
    <div style={{ fontSize: "12px", color: "#aaa", marginTop: "2px" }}>
      {new Date().toLocaleDateString("ja-JP", { month: "long", day: "numeric", weekday: "short" })}
    </div>
  </div>

  {/* Content */}
  <div style={{ flex: 1, padding: "20px", overflowY: "auto", paddingBottom: "80px" }}>
    {activeTab === 0 && (
      <div>
        <WeatherBadge />
        <AICoordSection user={user} closetItems={items} />
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: "700", marginBottom: "14px", color: "#2a2a2a" }}>
          おすすめコーデ
        </div>
        {COORD_SUGGESTIONS.map(coord => (
          <CoordCard key={coord.id} coord={coord} onLike={toggleLike} liked={likedCoords[coord.id]} user={user} closetItems={items} />
        ))}
      </div>
    )}
    {activeTab === 1 && <ClosetTab items={items} onAddItem={addItem} onEditItem={editItem} onDeleteItem={deleteItem} />}
    {activeTab === 2 && <TrendTab user={user} />}
    {activeTab === 3 && <ShoppingTab />}
    {activeTab === 4 && <ProfileTab user={user} onUpdateUser={updateUser} items={items} likedCoords={likedCoords} />}
  </div>

  {/* Bottom Nav */}
  <div style={{
    position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
    width: "100%", maxWidth: "430px",
    background: "white",
    borderTop: "1px solid #f0f0f0",
    display: "flex",
    boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
  }}>
    {TABS.map((tab, i) => (
      <button key={i} onClick={() => setActiveTab(i)} style={{
        flex: 1, padding: "12px 0",
        background: "none", border: "none", cursor: "pointer",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
        transition: "all 0.2s",
      }}>
        <span style={{ fontSize: "20px", opacity: activeTab === i ? 1 : 0.4 }}>{tabIcons[i]}</span>
        <span style={{
          fontSize: "10px",
          fontWeight: "600",
          color: activeTab === i ? "#9b59b6" : "#aaa",
          letterSpacing: "0.3px",
        }}>{tab}</span>
      </button>
    ))}
  </div>
</div>
```

);
}
createRoot(document.getElementById('root')).render(<FashionApp />)

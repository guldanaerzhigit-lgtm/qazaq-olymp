import { useState } from 'react'
import { isFirebaseConfigured } from './firebase'

type Tab = 'Басты бет' | 'Олимпиадалар' | 'Мектептер' | 'Біз туралы'
const olympiads = [
  { subject: 'Математика', title: 'Жас математик', grades: '3–9 сынып', date: 'Қабылдау ашық', color: 'violet', icon: '∑', participants: '1 240+' },
  { subject: 'Қазақ тілі', title: 'Тіл білгірі', grades: '3–9 сынып', date: 'Жақында басталады', color: 'orange', icon: 'Ә', participants: '860+' },
  { subject: 'Жаратылыстану', title: 'Зерде әлемі', grades: '5–9 сынып', date: 'Қабылдау ашық', color: 'green', icon: '✳', participants: '540+' },
]

export default function App() {
  const [tab, setTab] = useState<Tab>('Басты бет')
  const [role, setRole] = useState('Оқушы')
  const [menuOpen, setMenuOpen] = useState(false)
  return <div className="app-shell">
    <header className="topbar"><a className="brand" href="#home" onClick={() => setTab('Басты бет')}><span className="brand-mark">Q</span><span>Qazaq<span className="brand-accent">Olymp</span><small>БІЛІМ БӘЙГЕСІ</small></span></a>
      <nav className={menuOpen ? 'nav nav-open' : 'nav'}>{(['Басты бет','Олимпиадалар','Мектептер','Біз туралы'] as Tab[]).map(item => <button key={item} className={tab === item ? 'nav-link active' : 'nav-link'} onClick={() => {setTab(item);setMenuOpen(false)}}>{item}</button>)}</nav>
      <div className="top-actions"><button className="login-btn" onClick={() => setRole('Мұғалім')}>Кіру</button><button className="primary-btn small" onClick={() => setRole('Оқушы')}>Тіркелу <span>↗</span></button></div>
      <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Мәзір">☰</button>
    </header>
    <main id="home">
      {tab === 'Басты бет' || tab === 'Олимпиадалар' ? <>
        <section className="hero"><div className="hero-copy"><div className="eyebrow"><span className="eyebrow-dot"/> ҚАЗАҚСТАНДЫҚ БІЛІМ ПЛАТФОРМАСЫ</div><h1>Біліміңді сына.<br/><span>Биігіңді бағындыр.</span></h1><p className="hero-text">Қазақстан оқушыларына арналған онлайн олимпиадалар. Қабілетіңді дамытып, жаңа жетістіктерге бірге қадам бас!</p><div className="hero-buttons"><button className="primary-btn" onClick={() => setTab('Олимпиадалар')}>Олимпиадаларды көру <span>→</span></button><button className="secondary-btn" onClick={() => setRole('Мұғалім')}>Мұғалімге арналған</button></div><div className="hero-stats"><div><strong>3–9</strong><span>СЫНЫПТАР</span></div><i/><div><strong>100%</strong><span>ОНЛАЙН</span></div><i/><div><strong>24/7</strong><span>ҚОЛЖЕТІМДІ</span></div></div></div>
        <div className="hero-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="spark spark-one">✦</div><div className="spark spark-two">✧</div><div className="hero-card card-back"><span>БІЛІМ • БОЛАШАҚ</span><b>∞</b></div><div className="hero-card card-front"><div className="medal">🏆</div><span className="card-kicker">СЕНІҢ МҮМКІНДІГІҢ</span><strong>Жеңіске<br/>бір қадам!</strong><div className="card-line"/><small>ӨЗІҢЕ СЕН. АЛҒА ҰМТЫЛ.</small></div><div className="floating-chip chip-top">✦ ТАЛПЫН</div><div className="floating-chip chip-bottom">★ ЖЕТІСТІК</div></div></section>
        <section className="features"><div className="feature"><span className="feature-icon purple">✎</span><div><b>Ыңғайлы формат</b><p>Кез келген құрылғыдан қатыс</p></div></div><div className="feature"><span className="feature-icon peach">♧</span><div><b>Әділ бағалау</b><p>Нәтиже автоматты есептеледі</p></div></div><div className="feature"><span className="feature-icon mint">♙</span><div><b>Жеке кабинет</b><p>Жетістіктерің бір жерде</p></div></div></section>
        <section className="olympiads-section"><div className="section-heading"><div><div className="eyebrow">БІЛІМ АЛАҢЫ</div><h2>Олимпиадалар <span>әлемі</span></h2><p>Өзіңе қызықты бағытты таңда да, біліміңді дәлелде.</p></div><button className="text-link" onClick={() => setTab('Олимпиадалар')}>Барлық олимпиада <span>→</span></button></div><div className="olympiad-grid">{olympiads.map(o => <article className="olympiad-card" key={o.title}><div className={'subject-icon '+o.color}>{o.icon}</div><div className="subject-label">{o.subject}</div><h3>{o.title}</h3><div className="card-meta"><span>▦ {o.grades}</span><span>◷ {o.date}</span></div><div className="card-footer"><span>◉ {o.participants} қатысушы</span><button aria-label="Олимпиаданы ашу" onClick={() => setRole('Оқушы')}>→</button></div></article>)}</div></section>
      </> : <section className="simple-page"><div className="eyebrow">QAZAQ OLYMP</div><h1>{tab}</h1><p>{tab === 'Мектептер' ? 'Мектептерді тіркеу және білім ұйымдарының нәтижелерін бақылау бөлімі.' : 'Қазақстан оқушыларының білімге деген қызығушылығын арттыратын ортақ алаң.'}</p><button className="primary-btn" onClick={() => setTab('Басты бет')}>Басты бетке оралу →</button></section>}
      <section className="role-panel"><div><div className="eyebrow">ЖЕКЕ КАБИНЕТ</div><h2>Платформаға қош келдің!</h2><p>Өз рөліңді таңда. Әр қатысушыға жеке мүмкіндіктер қарастырылған.</p></div><div className="role-actions"><select value={role} onChange={e => setRole(e.target.value)}><option>Оқушы</option><option>Мұғалім</option><option>Мектеп әкімшісі</option><option>Суперадмин</option></select><button className="primary-btn" onClick={() => alert('Келесі кезеңде Firebase арқылы тіркелу және кіру іске қосылады.')}>Кабинетке өту →</button></div></section>
    </main>
    <footer><a className="brand footer-brand" href="#home"><span className="brand-mark">Q</span><span>Qazaq<span className="brand-accent">Olymp</span><small>БІЛІМ БӘЙГЕСІ</small></span></a><span>© 2026 Qazaq Olymp. Барлық құқық қорғалған.</span><span className="footer-status"><i/> {isFirebaseConfigured ? 'Firebase қосылған' : 'Firebase баптауды күтуде'}</span></footer>
  </div>
}

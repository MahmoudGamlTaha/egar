import { Link } from 'react-router-dom';
import { T } from '../translations';
import { Ico } from '../components/Icon';
import { AnimatedSection } from '../components/AnimatedSection';
import { CountUp } from '../components/CountUp';

export function LandingPage({ lang, setLang, goLogin, goRegister }) {
  const t = T[lang];
  const ar = lang === 'ar';

  return (
    <div className={`landing-page ${lang}`} dir={t.dir}>
      <header className="landing-header">
        <div className="landing-logo">
          <span className="landing-icon">إ</span>
          <h1>{t.app}</h1>
        </div>
        <div className="landing-nav">
          <button className="lang-btn" onClick={() => setLang(ar ? 'en' : 'ar')}>
            <Ico n="globe" s={14} /> {ar ? 'English' : 'العربية'}
          </button>
          <Link to="/login" className="btn-ol">{t.login.btn}</Link>
          <Link to="/register" className="btn-tl">{t.login.reg}</Link>
        </div>
      </header>

      <main className="landing-main">
        <AnimatedSection>
          <section className="hero-section">
          <div className="hero-content">
            <h2>{t.landing.introTitle}</h2>
            <p>{t.landing.introText}</p>
          </div>
        </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="stats-section">
          <h3>{t.landing.statsTitle}</h3>
          <div className="stats-grid">
            <div className="stat-item"><CountUp end="1200" /><p>{t.landing.stat1}</p></div>
            <div className="stat-item"><CountUp end="5000" /><p>{t.landing.stat2}</p></div>
            <div className="stat-item"><CountUp end="10000" /><p>{t.landing.stat3}</p></div>
            <div className="stat-item"><h4>24/7</h4><p>{t.landing.stat4}</p></div>
          </div>
        </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="news-section">
          <h3>{t.landing.newsTitle}</h3>
          <div className="news-grid">
            <div className="news-item">
              <img src="/news1.jpg" alt="News 1" />
              <h4>{t.landing.news1Title}</h4>
              <p>{t.landing.news1Desc}</p>
            </div>
            <div className="news-item">
              <img src="/news2.jpg" alt="News 2" />
              <h4>{t.landing.news2Title}</h4>
              <p>{t.landing.news2Desc}</p>
            </div>
            <div className="news-item">
              <img src="/news3.jpg" alt="News 3" />
              <h4>{t.landing.news3Title}</h4>
              <p>{t.landing.news3Desc}</p>
            </div>
          </div>
        </section>
        </AnimatedSection>
      </main>

      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} {t.app}. {t.landing.rights}</p>
      </footer>
    </div>
  );
}

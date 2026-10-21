import { useLayoutEffect, useMemo, useRef, type CSSProperties } from "react";
import "./spell-card.css";
import logo from "/images/Lorebound.png";

export type SpellCardData = {
  id: string;
  name: string;
  characterName?: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description?: string;
  effects?: string;
  savingThrow?: string;
  extraSections?: string[][];
};

type SpellCardProps = { spell: SpellCardData };

const levelBadgeLabel = (level: number) => (level === 0 ? "0" : String(level));

const getSchoolSymbol = (school?: string) => {
  switch ((school ?? "").trim().toLowerCase()) {
    case "abjuration":
      return "⛨";
    case "conjuration":
      return "◎";
    case "divination":
      return "✦";
    case "enchantment":
      return "❦";
    case "evocation":
      return "✹";
    case "illusion":
      return "◈";
    case "necromancy":
      return "☠";
    case "transmutation":
      return "⚙";
    default:
      return "✧";
  }
};

const getSchoolAccent = (school?: string) => {
  switch ((school ?? "").trim().toLowerCase()) {
    case "abjuration":
      return { bg: "#6e8eb7", border: "#4b6c97", text: "#f3f8ff" };
    case "conjuration":
      return { bg: "#5a8f88", border: "#3d7068", text: "#f1fffb" };
    case "divination":
      return { bg: "#8f6eb3", border: "#6d4f92", text: "#faf4ff" };
    case "enchantment":
      return { bg: "#c46f96", border: "#9d5376", text: "#fff6fb" };
    case "evocation":
      return { bg: "#c27a3d", border: "#955828", text: "#fff7ef" };
    case "illusion":
      return { bg: "#7b7aa8", border: "#5e5d87", text: "#f7f7ff" };
    case "necromancy":
      return { bg: "#6b7b52", border: "#4f5d3c", text: "#f8fced" };
    case "transmutation":
      return { bg: "#b49841", border: "#8c7430", text: "#fffcec" };
    default:
      return { bg: "#7f7368", border: "#61574f", text: "#fffaf5" };
  }
};

/**
 * One fixed-size 2.5 x 3.5 inch card.
 * Body text shrinks until it fits while the title row remains fixed-size.
 */
export function SpellCard({ spell }: SpellCardProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const fit = () => {
      const body = bodyRef.current;
      const stats = statsRef.current;
      if (!body || !stats) return;

      const fits = (size: number) => {
        content.style.setProperty("--spell-text-size", `${size}pt`);
        return (
          body.scrollHeight <= body.clientHeight + 1 &&
          body.scrollWidth <= body.clientWidth + 1 &&
          stats.scrollWidth <= stats.clientWidth + 1
        );
      };

      let low = 4.1;
      let high = 8.55;
      let best = low;
      for (let i = 0; i < 16; i += 1) {
        const mid = (low + high) / 2;
        if (fits(mid)) {
          best = mid;
          low = mid;
        } else {
          high = mid;
        }
      }
      content.style.setProperty("--spell-text-size", `${best}pt`);
    };

    fit();
    void document.fonts?.ready.then(fit);
    const observer = new ResizeObserver(fit);
    if (frameRef.current) observer.observe(frameRef.current);
    return () => observer.disconnect();
  }, [spell]);

  const footerLabel = spell.characterName?.trim() || "";
  const schoolSymbol = useMemo(() => getSchoolSymbol(spell.school), [spell.school]);
  const schoolAccent = useMemo(() => getSchoolAccent(spell.school), [spell.school]);

  const schoolBadgeStyle = {
    "--school-badge-bg": schoolAccent.bg,
    "--school-badge-border": schoolAccent.border,
    "--school-badge-text": schoolAccent.text,
  } as CSSProperties;

  return (
    <article className="spell-card" ref={frameRef} aria-label={`${spell.name} spell card`}>
      <div
        className="spell-card__inner"
        ref={contentRef}
        style={{ "--spell-text-size": "8.55pt" } as CSSProperties}
      >
        <div className="spell-card__frame">
          <header className="spell-card__header">
            <div className="spell-card__title-panel">
              <div className="spell-card__title-row">
                <h1 title={spell.name}>{spell.name}</h1>
                <div className="spell-card__badge-group">
                  <div className="spell-card__level-badge" aria-label={`Spell level ${levelBadgeLabel(spell.level)}`}>
                    {levelBadgeLabel(spell.level)}
                  </div>
                  <div
                    className="spell-card__school-badge"
                    style={schoolBadgeStyle}
                    aria-label={`${spell.school} school`}
                    title={spell.school}
                  >
                    {schoolSymbol}
                  </div>
                </div>
              </div>
            </div>
          </header>

          <section className="spell-card__stats-panel" ref={statsRef} aria-label="Spell basics">
            <div className="spell-card__stat-cell">
              <dt>Casting Time</dt>
              <dd>{spell.castingTime}</dd>
            </div>
            <div className="spell-card__stat-cell">
              <dt>Range</dt>
              <dd>{spell.range}</dd>
            </div>
            <div className="spell-card__stat-cell">
              <dt>Components</dt>
              <dd>{spell.components}</dd>
            </div>
            <div className="spell-card__stat-cell">
              <dt>Duration</dt>
              <dd>{spell.duration}</dd>
            </div>
          </section>

          <div className="spell-card__body" ref={bodyRef}>
            <div className="spell-card__school-watermark" aria-hidden="true">
              <div className="spell-card__school-watermark-ring">
                <span>{schoolSymbol}</span>
              </div>
            </div>

            {spell.description && (
              <section className="spell-card__section spell-card__section--description">
                <p>{spell.description}</p>
              </section>
            )}

            {spell.effects && (
              <section className="spell-card__section">
                <h2>Effects</h2>
                <p>{spell.effects}</p>
              </section>
            )}

            {spell.extraSections?.map(([label, value], index) => (
              <section className="spell-card__section" key={`${label}-${index}`}>
                <h2>{label}</h2>
                <p>{value}</p>
              </section>
            ))}

            {spell.savingThrow && (
              <section className="spell-card__section">
                <h2>Saving Throw</h2>
                <p>{spell.savingThrow}</p>
              </section>
            )}
          </div>

          <footer className="spell-card__footer">
            <div className="spell-card__footer-meta">{footerLabel}</div>
            <div className="spell-card__brand" aria-label="Lorebound branding">
              <img className="spell-card__brand-logo" src={logo} alt="" />
              <span className="spell-card__brand-text">Lorebound</span>
            </div>
          </footer>
        </div>
      </div>
    </article>
  );
}

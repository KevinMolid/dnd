import { useLayoutEffect, useRef, useState } from "react";
import "./spell-card.css";

export type SpellCardData = {
  id: string;
  name: string;
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

const spellLevel = (level: number) =>
  level === 0 ? "Cantrip" : `Level ${level}`;

/**
 * One fixed-size 2.5 x 3.5 inch card. The content text shrinks until it fits.
 * Text is kept as real, selectable HTML (not an image).
 */
export function SpellCard({ spell }: SpellCardProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(9);

  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const fit = () => {
      // Binary-search the largest font that fits both dimensions.
      let low = 4.5;
      let high = 9;
      let best = low;

      for (let i = 0; i < 15; i++) {
        const test = (low + high) / 2;
        content.style.setProperty("--spell-text-size", `${test}pt`);
        const fits =
          content.scrollHeight <= content.clientHeight + 0.5 &&
          content.scrollWidth <= content.clientWidth + 0.5;
        if (fits) {
          best = test;
          low = test;
        } else {
          high = test;
        }
      }
      content.style.setProperty("--spell-text-size", `${best}pt`);
      setFontSize(best);
    };

    fit();
    document.fonts?.ready.then(fit);
    const observer = new ResizeObserver(fit);
    if (frameRef.current) observer.observe(frameRef.current);
    return () => observer.disconnect();
  }, [spell]);

  return (
    <article className="spell-card" ref={frameRef} aria-label={`${spell.name} spell card`}>
      <div
        className="spell-card__inner"
        ref={contentRef}
        style={{ "--spell-text-size": `${fontSize}pt` } as React.CSSProperties}
      >
        <header className="spell-card__header">
          <h1>{spell.name}</h1>
          <p>{spellLevel(spell.level)} · {spell.school}</p>
        </header>

        <div className="spell-card__rule" aria-hidden="true"><span>◆</span></div>
        <dl className="spell-card__stats">
          <div><dt>Casting Time</dt><dd>{spell.castingTime}</dd></div>
          <div><dt>Range</dt><dd>{spell.range}</dd></div>
          <div><dt>Components</dt><dd>{spell.components}</dd></div>
          <div><dt>Duration</dt><dd>{spell.duration}</dd></div>
        </dl>
        <div className="spell-card__rule" aria-hidden="true"><span>◆</span></div>

        {spell.description && (
          <section className="spell-card__section">
            <h2>Description</h2>
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
    </article>
  );
}

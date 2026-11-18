import { Character, CREW } from './Characters';
import { kidsFilms } from './kidsFilms';

const FILES = 'abcdefgh';
const pieceFile = (p) => `/pieces/chessnut/${p[0]}${p[1].toUpperCase()}.svg`;

/** A printable chess diagram (SVG, prints crisply on paper). */
export function Diagram({ pieces = [], stars = [], size = 230, blank = false }) {
  const sq = 25;
  return (
    <svg className="ws-diagram" viewBox="-14 -2 216 216" width={size} height={size} role="img" aria-label="Chess diagram">
      {Array.from({ length: 64 }, (_, i) => {
        const x = i % 8;
        const y = Math.floor(i / 8);
        const dark = (x + (8 - y)) % 2 === 1;
        return <rect key={i} x={x * sq} y={y * sq} width={sq} height={sq} fill={blank ? '#fff' : dark ? '#C9D9BC' : '#FFFFFF'} stroke="#7C8A80" strokeWidth=".6" />;
      })}
      <rect x="0" y="0" width="200" height="200" fill="none" stroke="#2E3135" strokeWidth="2" />
      {stars.map((s) => {
        const x = FILES.indexOf(s[0]) * sq + sq / 2;
        const y = (8 - Number(s[1])) * sq + sq / 2;
        return <path key={s} transform={`translate(${x - 10} ${y - 10}) scale(.2)`} d="m50 6 13 27.5 30 3.6-22 20.6 5.8 29.8L50 72.8 23.2 87.5 29 57.7 7 37.1l30-3.6Z" fill="none" stroke="#2E3135" strokeWidth="6" strokeLinejoin="round" />;
      })}
      {pieces.map((piece) => {
        const x = FILES.indexOf(piece.sq[0]) * sq;
        const y = (8 - Number(piece.sq[1])) * sq;
        return <image key={`${piece.p}${piece.sq}`} href={pieceFile(piece.p)} x={x + 2} y={y + 2} width={sq - 4} height={sq - 4} />;
      })}
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i} fontSize="8" fontFamily="Fredoka, sans-serif" fill="#5A6460">
          <text x={i * sq + sq / 2} y="210" textAnchor="middle">{FILES[i]}</text>
          <text x="-7" y={i * sq + sq / 2 + 3} textAnchor="middle">{8 - i}</text>
        </g>
      ))}
    </svg>
  );
}

export function puzzlePieces(fen) {
  const out = [];
  fen.split(' ')[0].split('/').forEach((row, r) => {
    let f = 0;
    for (const c of row) {
      if (/\d/.test(c)) { f += Number(c); continue; }
      out.push({ p: `${c === c.toUpperCase() ? 'w' : 'b'}${c.toUpperCase()}`, sq: `${FILES[f]}${8 - r}` });
      f += 1;
    }
  });
  return out;
}

/** The printable worksheet for one world, generated from the course data. */
export function WorksheetSheet({ world }) {
  const crew = CREW[world.crew];
  const unit = world.unit;
  const film = kidsFilms[world.id];
  const hasGames = Boolean(world.practice);
  const meet = film[0];
  const first = hasGames ? world.practice.puzzles[0] : null;
  const second = hasGames ? world.practice.puzzles[Math.min(1, world.practice.puzzles.length - 1)] : null;
  const pieceName = crew.piece.toLowerCase();
  const tricky = film.find((scene) => scene.arrows?.length) || film[1];

  return (
    <article className="ws-sheet" aria-label={`${world.title} worksheet`}>
      <header className="ws-head">
        <div>
          <p className="ws-kicker">The Thinking Academy · World {world.id} worksheet</p>
          <h1>{world.title}: {world.lessonTitle}</h1>
          <p className="ws-name">Name: ______________________ &nbsp; Date: ____________</p>
        </div>
        <Character id={world.crew} mood="happy" size={92} />
      </header>

      <section className="ws-task">
        <h2><span>1</span> Meet {crew.name}</h2>
        <p>{crew.blurb} {hasGames ? `${world.practice.rule}.` : meet.caption}</p>
      </section>

      <div className="ws-grid">
        <section className="ws-task">
          <h2><span>2</span> {hasGames ? `Colour every square the ${pieceName} can reach` : 'Look at the board'}</h2>
          <Diagram pieces={hasGames ? [{ p: `w${world.practice.type.toUpperCase()}`, sq: 'd4' }] : meet.pieces} />
          <p className="ws-small">{hasGames ? `Tip: ${world.practice.rule}.` : meet.caption}</p>
        </section>
        <section className="ws-task">
          <h2><span>3</span> {hasGames ? 'Draw the path to every star' : 'Draw the arrow'}</h2>
          <Diagram pieces={hasGames ? puzzlePieces(first.fen) : tricky.pieces} stars={hasGames ? first.targets : []} />
          <p className="ws-small">{hasGames ? `Use as few moves as you can. Best: ${first.nbMoves}.` : tricky.caption}</p>
        </section>
      </div>

      {hasGames && second && second !== first && (
        <section className="ws-task">
          <h2><span>4</span> Bonus: catch these stars too!</h2>
          <div className="ws-row">
            <Diagram pieces={puzzlePieces(second.fen)} stars={second.targets} size={200} />
            <div className="ws-tally">
              <p>How many moves did you need?</p>
              <div className="ws-boxes">{Array.from({ length: Math.max(4, second.nbMoves + 2) }, (_, i) => <span key={i} />)}</div>
            </div>
          </div>
        </section>
      )}

      <section className="ws-task ws-together">
        <h2><span>★</span> Play together: {unit.classroomMaterials?.activityName?.replace(/"/g, '') || 'Board walk'}</h2>
        <p>{unit.classroomMaterials?.instructions}</p>
        <Diagram size={180} />
      </section>

      <footer className="ws-foot">Grown-up tip: ask “How did you know it could go there?” The why matters more than the right answer.</footer>
    </article>
  );
}

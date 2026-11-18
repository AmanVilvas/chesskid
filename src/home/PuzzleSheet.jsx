import { Character } from '../kids/Characters';
import { Diagram, puzzlePieces } from '../kids/Worksheet';
import { UNITS } from './data';

/** A printable page of star puzzles for one piece, generated from the course's real puzzles. */
export function PuzzleSheet({ world, count = 4 }) {
  const puzzles = world.practice.puzzles.slice(0, count);
  const title = UNITS[world.id - 1].title;
  return (
    <article className="ws-sheet" aria-label={`${title} puzzle sheet`}>
      <header className="ws-head">
        <div>
          <p className="ws-kicker">The Thinking Academy · Unit {world.id} puzzle sheet</p>
          <h1>{title}: puzzles</h1>
          <p className="ws-name">Name: ______________________ &nbsp; Date: ____________</p>
        </div>
        <Character id={world.crew} mood="happy" size={92} />
      </header>
      <p className="ws-small" style={{ margin: '0 0 14px' }}>Move the {title.replace(/^The /, '').replace(/s$/, '').toLowerCase()} so it lands on every star. Use as few moves as you can, and write how many you needed.</p>
      <div className="ws-grid">
        {puzzles.map((puzzle, i) => (
          <section className="ws-task" key={puzzle.id}>
            <h2><span>{i + 1}</span> {puzzle.goal}</h2>
            <Diagram pieces={puzzlePieces(puzzle.fen)} stars={puzzle.targets} size={200} />
            <p className="ws-small">Best: {puzzle.nbMoves} move{puzzle.nbMoves === 1 ? '' : 's'}. My moves: ____</p>
          </section>
        ))}
      </div>
      <footer className="ws-foot">Grown-up tip: ask “Which star will you try first, and why?” Thinking aloud matters more than the quick answer.</footer>
    </article>
  );
}

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Award, LockKeyhole } from 'lucide-react';
import { useKids } from './KidsShell';
import { kidsWorlds } from './kidsWorlds';
import { Character, CREW } from './Characters';
import { KidsNav } from './KidsNav';

// The Chess Crew collection: one friend per piece world, plus badges from the later worlds.
export default function KidsCrewPage() {
  const { summary } = useKids();
  useEffect(() => { document.title = 'My crew | Crown Quest'; }, []);
  const friends = kidsWorlds.filter((world) => world.id <= 6);
  const badges = kidsWorlds.filter((world) => world.id > 6);
  const met = friends.filter((world) => summary.byId(world.id).chestOpened).length;

  return (
    <div className="kids-root kp-page kc-page">
      <KidsNav active="crew" />
      <main className="kp-main kc-main">
        <header className="kc-head">
          <h1>My Chess Crew</h1>
          <p>You have met <b>{met}</b> of {friends.length} friends. Open treasure chests to meet them all!</p>
        </header>
        <div className="kc-grid">
          {friends.map((world, i) => {
            const got = summary.byId(world.id).chestOpened;
            const crew = CREW[world.crew];
            return (
              <motion.article key={world.id} className={`kc-card ${got ? 'is-got' : ''}`} style={{ '--c': crew.color, '--d': crew.shade }}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="kc-art"><Character id={world.crew} size={120} silhouette={!got} mood={got ? 'happy' : 'sleep'} /></div>
                <h2>{got ? crew.name : '???'}</h2>
                <p>{got ? crew.blurb : `Waiting in ${world.title}`}</p>
                {!got && <Link to={`/play`} state={null} className="kc-where"><LockKeyhole size={16} /> {world.title}</Link>}
              </motion.article>
            );
          })}
        </div>
        {badges.length > 0 && <h2 className="kc-sub">Badges</h2>}
        <div className="kc-badges">
          {badges.map((world) => {
            const got = summary.byId(world.id).chestOpened;
            return (
              <div key={world.id} className={`kc-badge ${got ? 'is-got' : ''}`} style={{ '--c': world.color, '--d': world.deep }}>
                <span><Award size={30} /></span>
                <b>{got ? world.badge2 : '???'}</b>
                <small>{world.title}</small>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

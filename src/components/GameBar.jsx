// This file was renamed from ButtonDemo.jsx to GameBar.jsx. All imports and usages have been updated accordingly
import "./ButtonDemo/style.css";

const GameBar = () => (
  <div style={{
    display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#050801',
  }}>
    <a href="/blocks/index.html" target="_blank" rel="noopener noreferrer">
      <span></span><span></span><span></span><span></span>
      1. BLOCKS
    </a>
    <a href="/pinball/index.html" target="_blank" rel="noopener noreferrer">
      <span></span><span></span><span></span><span></span>
      2. PINBALL
    </a>
    <a href="/mafia/index.html" target="_blank" rel="noopener noreferrer">
      <span></span><span></span><span></span><span></span>
      3. MAFIA
    </a>    <a href="/moonwalk" rel="noopener noreferrer">
      <span></span><span></span><span></span><span></span>
      4. MOONWALK
    </a>
    <a href="/rock-paper-scissors/index.html" target="_blank" rel="noopener noreferrer">
      <span></span><span></span><span></span><span></span>
      5. ROCK PAPER SCISSORS
    </a>
    <a href="/AI-roller/index.html" target="_blank" rel="noopener noreferrer">
      <span></span><span></span><span></span><span></span>
      6. AI-ROLLER
    </a>
    <a href="/speed-analysis/speed_analysis.html" target="_blank" rel="noopener noreferrer">
      <span></span><span></span><span></span><span></span>
      7. SPEED ANALYSIS
    </a>
    <a href="/colorful-memory-game/colorful_memory_game.html" target="_blank" rel="noopener noreferrer">
      <span></span><span></span><span></span><span></span>
      8. COLORFUL MEMORY GAME
    </a>
    <a href="/music-player/index.html" target="_blank" rel="noopener noreferrer">
      <span></span><span></span><span></span><span></span>
      9. MJ MUSIC PLAYER
    </a>
  </div>
);

export default GameBar;

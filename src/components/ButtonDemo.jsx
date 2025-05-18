// This file was renamed to GameBar.jsx. Please use GameBar instead.

const GameBar = () => (
  <div className="my-4 flex flex-col gap-2">
    <a
      href="/src/components/ButtonDemo/blocks/index.html"
      className="rounded bg-violet-200 px-4 py-2 font-bold shadow transition hover:bg-violet-400"
    >
      1. BLOCKS
    </a>
    <a
      href="/src/components/ButtonDemo/pinball/index.html"
      className="rounded bg-violet-200 px-4 py-2 font-bold shadow transition hover:bg-violet-400"
    >
      2. PINBALL
    </a>
    <a
      href="/src/components/ButtonDemo/mafia/index.html"
      className="rounded bg-violet-200 px-4 py-2 font-bold shadow transition hover:bg-violet-400"
    >
      3. MAFIA
    </a>
  </div>
);

export default GameBar;

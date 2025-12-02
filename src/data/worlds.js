// src/data/worlds.js

import { games } from "./games";

const gamesById = Object.fromEntries(games.map((g) => [g.id, g]));

// Raw world definitions: just structure + which games belong, per player
const worldDefs = [
  {
    id: "world1-anderssen",
    name: "World 1 – Adolf Anderssen",
    focusPlayer: "Adolf Anderssen",
    description: "Romantic-era sacrificial pioneer.",
    levels: [
      { gameId: "game-immortal-1851" },
      { gameId: "game-evergreen-1852" },
      { gameId: "game-mayet-anderssen-1851" },
      { gameId: "game-anderssen-zukertort-1869" },
    ],
  },
  {
    id: "world2-morphy",
    name: "World 2 – Paul Morphy",
    focusPlayer: "Paul Morphy",
    description: "Classical attacking genius.",
    levels: [
      { gameId: "game-opera-1858" },
      { gameId: "game-morphy-anderssen-1858" },
      { gameId: "game-morphy-paulsen-1857" },
      { gameId: "game-morphy-bird-1858" },
    ],
  },
  {
    id: "world3-lasker",
    name: "World 3 – Emanuel Lasker",
    focusPlayer: "Emanuel Lasker",
    description: "Second world champion and fighting strategist.",
    levels: [
      { gameId: "game-lasker-bauer-1889" },
      { gameId: "game-lasker-napier-1904" },
      { gameId: "game-lasker-tarrasch-1914" },
      { gameId: "game-lasker-capablanca-1914" },
    ],
  },
  {
    id: "world4-fischer",
    name: "World 4 – Bobby Fischer",
    focusPlayer: "Bobby Fischer",
    description: "Modern legend of precision and deep preparation.",
    levels: [
      { gameId: "game-byrne-fischer-1956" },
      { gameId: "game-fischer-spassky-1972-g6" },
      { gameId: "game-fischer-taimanov-1971-g2" },
      { gameId: "game-fischer-larsen-1971-g1" },
    ],
  },
  {
    id: "world5-tal",
    name: "World 5 – Mikhail Tal",
    focusPlayer: "Mikhail Tal",
    description: "Modern legend of precision and deep preparation.",
    levels: [
      { gameId: "game-botvinnik-tal-1960-g6" },
    ],
  },
  {
    id: "world6-karpov",
    name: "World 6 – Anatoly Karpov",
    focusPlayer: "Anatoly Karpov",
    description: "Ice-cold world champion and master of precision.",
    levels: [{ gameId: "game-karpov-kasparov-1985-g16" }],
  },
  {
    id: "world7-kasparov",
    name: "World 7 – Garry Kasparov",
    focusPlayer: "Garry Kasparov",
    description: "Dynamic attacking machine and theoretical powerhouse.",
    levels: [{ gameId: "game-karpov-kasparov-1985-g16" }],
  },
];

// Build the final worlds array used by the app
export const worlds = worldDefs.map((world) => {
  const hydratedLevels = world.levels
    .map(({ gameId }) => {
      const game = gamesById[gameId];
      if (!game || !game.show) return null;

        // infer which color the focus player is in this game
        let playerColor = "white";
        if (game.white === world.focusPlayer) playerColor = "white";
        else if (game.black === world.focusPlayer) playerColor = "black";


      const year =
        game.year ??
        (game.date && game.date.length >= 4 ? game.date.slice(0, 4) : "");

      const titleBase = game.nickname || game.officialName;
      const title = `${titleBase}${year ? ` (${year})` : ""}`;

      const subtitleParts = [game.officialName];
      if (game.event) subtitleParts.push(game.event);
      const subtitle = subtitleParts.join(" – ");

      return {
        // use gameId as the level id: no duplicate strings
        id: gameId,
        gameId,
        playerColor,
        timePerMoveSeconds: game.timePerMoveSeconds,
        description: game.description,
        title,
        subtitle,
        pgn: game.pgn,
        gameMeta: game,
      };
    })
    .filter(Boolean);

  return { ...world, levels: hydratedLevels };
});

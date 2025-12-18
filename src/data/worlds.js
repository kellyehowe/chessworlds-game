// src/data/worlds.js
import { gamesSource } from "../source/gamesSource";
import { playersSource } from "../source/playersSource";

function normalize(s) {
  return String(s || "").trim().toLowerCase();
}

function playerMatchesGame(player, game) {
  const p = normalize(player.name);
  const white = normalize(game.white);
  const black = normalize(game.black);

  if (p && (p === white || p === black)) return true;

  const aliases = Array.isArray(player.aliases) ? player.aliases : [];
  for (const a of aliases) {
    const aa = normalize(a);
    if (aa && (aa === white || aa === black)) return true;
  }

  return false;
}

function inferPlayerColor(player, game) {
  const p = normalize(player.name);
  if (normalize(game.white) === p) return "white";
  if (normalize(game.black) === p) return "black";

  const aliases = Array.isArray(player.aliases) ? player.aliases : [];
  for (const a of aliases) {
    const aa = normalize(a);
    if (normalize(game.white) === aa) return "white";
    if (normalize(game.black) === aa) return "black";
  }

  return "white";
}

function yearFromGame(game) {
  return (
    game.year ??
    (game.date && game.date.length >= 4 ? game.date.slice(0, 4) : "")
  );
}

function buildLevelFromGame(player, game) {
  const year = yearFromGame(game);
  const titleBase = game.nickname || game.officialName || game.id;
  const title = `${titleBase}${year ? ` (${year})` : ""}`;

  const subtitleParts = [];
  if (game.officialName) subtitleParts.push(game.officialName);
  if (game.event) subtitleParts.push(game.event);
  const subtitle = subtitleParts.join(" – ");

  return {
    id: game.id,
    gameId: game.id,
    playerColor: inferPlayerColor(player, game),
    timePerMoveSeconds: game.timePerMoveSeconds,
    description: game.description,
    title,
    subtitle,
    pgn: game.pgn,
    gameMeta: game,
  };
}

// 1) sort players by worldOrder (then name)
const sortedPlayers = [...playersSource].sort((a, b) => {
  const ao = a.worldOrder ?? 9999;
  const bo = b.worldOrder ?? 9999;
  if (ao !== bo) return ao - bo;
  return String(a.name).localeCompare(String(b.name));
});

export const worlds = sortedPlayers
  // Player-level show gate (undefined treated as true)
  .filter((p) => p.show !== false)
  .map((player) => {
    // gameplay-only: game.show !== false (undefined treated as true)
    // also preserves gamesSource ordering
    const playableGames = gamesSource.filter(
      (g) => g.show !== false && playerMatchesGame(player, g)
    );

    const levels = playableGames.map((g) => buildLevelFromGame(player, g));

    return {
      id: player.id,
      name: player.worldName || `World – ${player.name}`,
      focusPlayer: player.name,
      description: player.description || "",
      levels,
      playerMeta: player,
    };
  })
  // hide worlds with no playable levels
  .filter((w) => (w.levels?.length ?? 0) > 0);

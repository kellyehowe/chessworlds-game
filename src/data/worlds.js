// src/data/worlds.js

// Import PGNs from the central PGN library
import {
  PGN_IMMORTAL_1851,
  PGN_EVERGREEN_1852,
  PGN_ANDERSSEN_MAYET_1851,
  PGN_ANDERSSEN_ZUKERTORT_1869,
  PGN_OPERA_1858,
  PGN_MORPHY_ANDERSSEN_1858,
  PGN_MORPHY_PAULSEN_1857,
  PGN_MORPHY_BIRD_1858,
  PGN_LASKER_BAUER_1889,
  PGN_LASKER_NAPIER_1904,
  PGN_LASKER_TARRASCH_1914,
  PGN_LASKER_CAPABLANCA_1914,
  PGN_GAME_OF_CENTURY_1956,
  PGN_FISCHER_SPASSKY_1972_G6,
  PGN_FISCHER_TAIMANOV_1971_G2,
  PGN_FISCHER_LARSEN_1971_G1,
  PGN_KARPOV_KASPAROV_1985_G16,
} from "./pgns";

// --------------------------------------------
// Worlds definition: 4 Worlds × 4 Levels = 16 Games
// --------------------------------------------

export const worlds = [
  // --------------------
  // World 1 – Anderssen
  // --------------------
  {
    id: "world1-anderssen",
    name: "World 1 – Adolf Anderssen",
    description: "Romantic-era sacrificial pioneer.",
    levels: [
      {
        id: "level1-immortal",
        title: "Level 1 – The Immortal Game (1851)",
        subtitle: "Anderssen vs Kieseritzky",
        description: "The most famous sacrificial game of all time.",
        playerColor: "white",
        timePerMoveSeconds: 12,
        pgn: PGN_IMMORTAL_1851,
      },
      {
        id: "level2-evergreen",
        title: "Level 2 – The Evergreen Game (1852)",
        subtitle: "Anderssen vs Dufresne",
        description: "Brilliant queen + double bishop sacrifice.",
        playerColor: "white",
        timePerMoveSeconds: 14,
        pgn: PGN_EVERGREEN_1852,
      },
      {
        id: "level3-mayet",
        // old title:
        // title: "Level 3 – Anderssen–Mayet (1851)",
        title: "Level 3 – Mayet–Anderssen (1851)",
        subtitle: "Punishing White's inaccuracies as Black.",
        description: "A sharp miniature where Anderssen strikes back with Black.",
        playerColor: "black",
        timePerMoveSeconds: 12,
        pgn: PGN_ANDERSSEN_MAYET_1851, // name can stay like this for now
      },
      {
        id: "level4-zukertort",
        title: "Level 4 – Anderssen–Zukertort (1869)",
        subtitle: "A brutal kingside onslaught.",
        description: "A later Anderssen masterpiece with heavy tactics.",
        playerColor: "white",
        timePerMoveSeconds: 14,
        pgn: PGN_ANDERSSEN_ZUKERTORT_1869,
      },
    ],
  },

  // --------------------
  // World 2 – Morphy
  // --------------------
  {
    id: "world2-morphy",
    name: "World 2 – Paul Morphy",
    description: "Classical attacking genius.",
    levels: [
      {
        id: "level1-opera",
        title: "Level 1 – The Opera Game (1858)",
        subtitle: "Morphy vs Duke Karl/Count Isouard",
        description: "The most famous miniature in chess history.",
        playerColor: "white",
        timePerMoveSeconds: 10,
        pgn: PGN_OPERA_1858,
      },
      {
        id: "level2-anderssen1858",
        title: "Level 2 – Morphy–Anderssen (1858)",
        subtitle: "A clash of titans in Paris.",
        description: "Fast development and a crushing king attack.",
        playerColor: "white",
        timePerMoveSeconds: 14,
        pgn: PGN_MORPHY_ANDERSSEN_1858,
      },
      {
        id: "level3-paulsen",
        title: "Level 3 – Morphy–Paulsen (1857)",
        subtitle: "Position transforms into tactics.",
        description: "A longer game showing Morphy’s technique.",
        playerColor: "white",
        timePerMoveSeconds: 16,
        pgn: PGN_MORPHY_PAULSEN_1857,
      },
      {
        id: "level4-bird",
        title: "Level 4 – Morphy–Bird (1858)",
        subtitle: "Rapid attack on f7.",
        description: "A beautiful attacking demonstration.",
        playerColor: "white",
        timePerMoveSeconds: 12,
        pgn: PGN_MORPHY_BIRD_1858,
      },
    ],
  },

  // --------------------
  // World 3 – Lasker
  // --------------------
  {
    id: "world3-lasker",
    name: "World 3 – Emanuel Lasker",
    description: "Second world champion and fighting strategist.",
    levels: [
      {
        id: "level1-bauer",
        title: "Level 1 – Lasker–Bauer (1889)",
        subtitle: "The famous counterattack.",
        description: "A textbook example of practical violence.",
        playerColor: "white",
        timePerMoveSeconds: 12,
        pgn: PGN_LASKER_BAUER_1889,
      },
      {
        id: "level2-napier",
        title: "Level 2 – Lasker–Napier (1904)",
        subtitle: "A wild tactical firestorm.",
        description: "One of the great attacking games of Lasker’s career.",
        playerColor: "white",
        timePerMoveSeconds: 16,
        pgn: PGN_LASKER_NAPIER_1904,
      },
      {
        id: "level3-tarrasch",
        title: "Level 3 – Lasker–Tarrasch (1914)",
        subtitle: "Punishing overextension.",
        description: "Lasker dismantles a rival in classic positional style.",
        playerColor: "white",
        timePerMoveSeconds: 18,
        pgn: PGN_LASKER_TARRASCH_1914,
      },
      {
        id: "level4-capablanca",
        title: "Level 4 – Lasker–Capablanca (1914)",
        subtitle: "Historic rivalry.",
        description: "A tough, complex fight between great champions.",
        playerColor: "white",
        timePerMoveSeconds: 18,
        pgn: PGN_LASKER_CAPABLANCA_1914,
      },
    ],
  },

  // --------------------
  // World 4 – Fischer
  // --------------------
  {
    id: "world4-fischer",
    name: "World 4 – Bobby Fischer",
    description: "Modern legend of precision and deep preparation.",
    levels: [
      {
        id: "level1-century",
        title: "Level 1 – Game of the Century (1956)",
        subtitle: "Byrne vs Fischer",
        description: "Brilliant queen sacrifice by a 13-year-old Fischer.",
        playerColor: "black", // Game of the Century Fischer was black
        timePerMoveSeconds: 16,
        pgn: PGN_GAME_OF_CENTURY_1956,
      },
      {
        id: "level2-spassky",
        title: "Level 2 – Fischer–Spassky (1972, Game 6)",
        subtitle: "World Championship brilliancy.",
        description: "Arguably Fischer’s finest positional game.",
        playerColor: "white",
        timePerMoveSeconds: 20,
        pgn: PGN_FISCHER_SPASSKY_1972_G6,
      },
      {
        id: "level3-taimanov",
        title: "Level 3 – Fischer–Taimanov (1971, Game 2)",
        subtitle: "Candidates 6–0 sweep.",
        description: "Fischer outcalculates one of the world’s best tacticians.",
        playerColor: "white",
        timePerMoveSeconds: 18,
        pgn: PGN_FISCHER_TAIMANOV_1971_G2,
      },
      {
        id: "level4-larsen",
        title: "Level 4 – Fischer–Larsen (1971, Game 1)",
        subtitle: "Another 6–0 demolition.",
        description: "A crushing start to a historic match.",
        playerColor: "white",
        timePerMoveSeconds: 16,
        pgn: PGN_FISCHER_LARSEN_1971_G1,
      },
    ],
  },

  // --------------------
  // World 5 – Karpov
  // --------------------
  {
    id: "world5-karpov",
    name: "World 5 – Anatoly Karpov",
    description: "Ice-cold world champion and master of precision.",
    levels: [
      {
        id: "level1-karpov-kasparov-1985",
        title: "Level 1 – Karpov–Kasparov (1985)",
        subtitle: "Karpov's perspective on Kasparov's immortal game.",
        description:
          "Play Karpov's side as White and try to improve on history.",
        playerColor: "white",
        timePerMoveSeconds: 20,
        pgn: PGN_KARPOV_KASPAROV_1985_G16,
      },
    ],
  },

  // --------------------
  // World 6 – Kasparov
  // --------------------
  {
    id: "world6-kasparov",
    name: "World 6 – Garry Kasparov",
    description: "Dynamic attacking machine and theoretical powerhouse.",
    levels: [
      {
        id: "level1-kasparov-immortal-1985",
        title: "Level 1 – Kasparov's Immortal (1985)",
        subtitle: "Same game, Kasparov's side.",
        description:
          "Relive Kasparov's masterpiece from the Black side move by move.",
        playerColor: "black",
        timePerMoveSeconds: 20,
        pgn: PGN_KARPOV_KASPAROV_1985_G16,
      },
    ],
  },
];


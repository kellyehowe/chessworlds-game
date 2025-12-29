// src/source/gamesSource.js
import defaultBundle from "./defaultSourceBundle.json";
export const gamesSource = defaultBundle.gamesSource;

// // Canonical source of truth for all historical games.
// // Sorted by era, then roughly by year/date.
// // Each game can be reused in multiple "worlds" and has a global `show` flag.
// // UI-specific defaults like timePerMoveSeconds + description also live here.

// export const gamesSource = [
//   // ===========================================
//   // Romantic Era (1800–1870)
//   // ===========================================

//   {
//     id: "game-immortal-1851",
//     era: "romantic",
//     year: 1851,
//     date: "1851-06-21", // approximate/optional
//     white: "Adolf Anderssen",
//     black: "Lionel Kieseritzky",
//     event: "London 1851",
//     nickname: "The Immortal Game",
//     officialName: "Anderssen vs Kieseritzky",
//     result: "1-0",
//     show: true,
//     timePerMoveSeconds: 12,
//     description: "The most famous sacrificial game of all time.",
//     pgn: `
// 1.e4 e5 2.f4 exf4 3.Bc4 Qh4+ 4.Kf1 b5 5.Bxb5 Nf6
// 6.Nf3 Qh6 7.d3 Nh5 8.Nh4 Qg5 9.Nf5 c6 10.g4 Nf6
// 11.Rg1 cxb5 12.h4 Qg6 13.h5 Qg5 14.Qf3 Ng8 15.Bxf4
// Qf6 16.Nc3 Bc5 17.Nd5 Qxb2 18.Bd6 Qxa1+ 19.Ke2 Bxg1
// 20.e5 Na6 21.Nxg7+ Kd8 22.Qf6+ Nxf6 23.Be7+ 1-0
// `,
//   },


//   {
//     id: "game-evergreen-1852",
//     era: "romantic",
//     year: 1852,
//     date: "1852-??-??",
//     white: "Adolf Anderssen",
//     black: "Jean Dufresne",
//     event: "Berlin 1852",
//     nickname: "The Evergreen Game",
//     officialName: "Anderssen vs Dufresne",
//     result: "1-0",
//     show: true,
//     timePerMoveSeconds: 14,
//     description: "Brilliant queen and double-bishop sacrifice.",
//     pgn: `
// 1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.b4 Bxb4 5.c3 Ba5
// 6.d4 exd4 7.O-O d3 8.Qb3 Qf6 9.e5 Qg6 10.Re1 Nge7
// 11.Ba3 b5 12.Qxb5 Rb8 13.Qa4 Bb6 14.Nbd2 Bb7 15.Ne4
// Qf5 16.Bxd3 Qh5 17.Nf6+ gxf6 18.exf6 Rg8 19.Rad1
// Qxf3 20.Rxe7+ Nxe7 21.Qxd7+ Kxd7 22.Bf5+ Kc6
// 23.Bd7# 1-0
// `,
//   },

//   {
//     id: "game-mayet-anderssen-1851",
//     era: "romantic",
//     year: 1851,
//     date: "1851-??-??",
//     white: "Carl Mayet",
//     black: "Adolf Anderssen",
//     event: "Berlin 1851",
//     nickname: null,
//     officialName: "Mayet vs Anderssen",
//     result: "0-1",
//     show: true,
//     timePerMoveSeconds: 12,
//     description: "A sharp miniature where Anderssen punishes inaccuracies as Black.",
//     pgn: `
// 1.e4 e5 2.Nf3 Nc6 3.Bb5 Bc5 4.c3 Nf6 5.Bxc6 dxc6 6.O-O Bg4
// 7.h3 h5 8.hxg4 hxg4 9.Nxe5 g3 10.d4 Nxe4 11.Qg4 Bxd4 12.Qxe4 0-1
// `,
//   },

//   {
//     id: "game-anderssen-zukertort-1869",
//     era: "romantic",
//     year: 1869,
//     date: "1869-??-??",
//     white: "Adolf Anderssen",
//     black: "Johannes Zukertort",
//     event: "Barmen 1869",
//     nickname: null,
//     officialName: "Anderssen vs Zukertort",
//     result: "0-1",
//     show: true,
//     timePerMoveSeconds: 14,
//     description: "A later Anderssen masterpiece with a brutal kingside onslaught.",
//     pgn: `
// 1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.b4 Bxb4 5.c3 Ba5
// 6.d4 exd4 7.O-O Bb6 8.cxd4 d6 9.d5 Na5 10.Bb2 Ne7
// 11.Bd3 O-O 12.Nc3 Ng6 13.Ne2 c5 14.Qd2 f6 15.Kh1
// Bc7 16.Rac1 Rb8 17.Ng3 b5 18.Nh5 c4 19.Bb1 b4
// 20.Bd4 Bb6 21.Bxb6 Qxb6 22.Nd4 Bd7 23.f4 Rbe8
// 24.Qf2 b3 25.axb3 Nxb3 26.Rcd1 Nxd4 27.Rxd4 Rc8
// 28.Rdd1 Qxf2 29.Rxf2 Bg4 30.Ng3 Bxd1 31.Rd2 Ba4
// 32.Nf5 Rfd8 33.h4 c3 34.Ra2 c2 35.Bxc2 Bxc2
// 36.Ne7+ Nxe7 37.Rxa7 Kf8 38.h5 Bxe4 39.h6 gxh6
// 40.Kh2 Rc2 41.Kh3 Bxg2+ 42.Kg3 Nf5+ 43.Kg4 Be4
// 44.Rxh7 Kg8 45.Ra7 Rg2+ 46.Kh5 Bf3# 0-1
// `,
//   },

//   {
//     id: "game-opera-1858",
//     era: "romantic",
//     year: 1858,
//     date: "1858-??-??",
//     white: "Paul Morphy",
//     black: "Duke Karl / Count Isouard",
//     event: "Paris 1858",
//     nickname: "The Opera Game",
//     officialName: "Morphy vs Duke Karl/Count Isouard",
//     result: "1-0",
//     show: true,
//     timePerMoveSeconds: 10,
//     description: "The most famous miniature in chess history.",
//     pgn: `
// 1.e4 e5 2.Nf3 d6 3.d4 Bg4 4.dxe5 Bxf3 5.Qxf3 dxe5
// 6.Bc4 Nf6 7.Qb3 Qe7 8.Nc3 c6 9.Bg5 b5 10.Nxb5 cxb5
// 11.Bxb5+ Nbd7 12.O-O-O Rd8 13.Rxd7 Rxd7 14.Rd1 Qe6
// 15.Bxd7+ Nxd7 16.Qb8+ Nxb8 17.Rd8# 1-0
// `,
//   },

//   {
//     id: "game-morphy-anderssen-1858",
//     era: "romantic",
//     year: 1858,
//     date: "1858-??-??",
//     white: "Paul Morphy",
//     black: "Adolf Anderssen",
//     event: "Paris 1858",
//     nickname: null,
//     officialName: "Morphy vs Anderssen",
//     result: "1-0",
//     show: true,
//     timePerMoveSeconds: 14,
//     description: "Fast development and a crushing king attack.",
//     pgn: `
// 1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d4 exd4 6.cxd4
// Bb4+ 7.Nc3 Nxe4 8.O-O Bxc3 9.d5 Bf6 10.Re1 Ne7
// 11.Rxe4 d6 12.Bg5 Bxg5 13.Nxg5 O-O 14.Nxh7 Kxh7
// 15.Qh5+ Kg8 16.Rh4 f6 17.Re1 Bf5 18.Rhe4 Bxe4
// 19.Rxe4 Qf8 20.Qe2 Rf7 21.h4 Qd7 22.h5 Nxd5
// 23.h6 gxh6 24.Qh5 c6 25.b4 f5 26.Rh4 Qe6 27.b5 cxb5
// 28.Bb3 Rc8 29.Qd1 Rc5 30.Rd4 Rg7 31.Rxd5 Rxd5
// 32.Bxd5 Qxd5 33.Qxd5+ Rf7 34.Qxd6 Kg7 35.Qe5+ Kg6
// 36.Qxb5 Re7 37.f4 b6 38.a4 h5 39.Kh2 h4 40.Kh3 Re3+
// 41.Kxh4 Re6 42.Qd7 Kf6 43.Qd8+ Kf7 44.Kg5 Rg6+
// 45.Kxf5 Rxg2 46.Qd7+ Kf8 47.Qxa7 Rg7 48.Qxb6 Rf7+
// 49.Kg6 Rg7+ 50.Kf6 Rf7+ 51.Ke6 Re7+ 52.Kf5 Rf7+
// 53.Kg4 Rg7+ 54.Kf3 Rf7 55.a5 Kg7 56.a6 Rf8
// 57.Qb7+ Rf7 58.Qxf7+ Kxf7 59.a7 1-0
// `,
//   },

//   {
//     id: "game-morphy-paulsen-1857",
//     era: "romantic",
//     year: 1857,
//     date: "1857-??-??",
//     white: "Paul Morphy",
//     black: "Louis Paulsen",
//     event: "New York 1857",
//     nickname: null,
//     officialName: "Morphy vs Paulsen",
//     result: "1/2-1/2",
//     show: true,
//     timePerMoveSeconds: 16,
//     description: "A longer game showing Morphy’s attacking and endgame technique.",
//     pgn: `
// 1.e4 e5 2.Nf3 d5 3.exd5 e4 4.Qe2 Be7 5.Qxe4 Nf6 6.Bb5+ Bd7
// 7.Qe2 Nxd5 8.Bxd7+ Qxd7 9.d4 O-O 10.O-O Nc6 11.c4 Nf6 12.d5
// Nb4 13.Ne5 Qf5 14.Nc3 Nc2 15.g4 Nxg4 16.Qxg4 Qxg4+ 17.Nxg4
// Nxa1 18.Bf4 Nc2 19.Bxc7 Rac8 20.d6 Bd8 21.Nd5 Kh8 22.Rd1 Bxc7
// 23.Nxc7 Rfd8 24.a3 Kg8 25.c5 f6 26.Rd2 Ne1 27.Kf1 Nf3 28.Rd3
// Ng5 29.b4 Rd7 30.f4 Nf7 31.Ne3 Nh6 32.b5 Kf7 33.Ke2 g6 34.a4
// Ng8 35.Nc4 Ne7 36.b6 axb6 37.Nxb6 Rcxc7 38.Nxd7 Rxd7 39.dxe7
// Kxe7 40.Re3+ Kf7 41.Rb3 Ke6 42.Rb6+ Kd5 43.Rxf6 Kxc5 44.f5
// gxf5 45.Rxf5+ Kb4 46.a5 Rc7 47.Rh5 Kc4 48.Ke3 Kb4 49.h4 Rc3+
// 50.Kd4 1/2-1/2
// `,
//   },

//   {
//     id: "game-morphy-bird-1858",
//     era: "romantic",
//     year: 1858,
//     date: "1858-??-??",
//     white: "Paul Morphy",
//     black: "Henry Bird",
//     event: "London 1858",
//     nickname: null,
//     officialName: "Morphy vs Bird",
//     result: "0-1",
//     show: true,
//     timePerMoveSeconds: 12,
//     description: "A rapid attack on f7 leading to a spectacular finish.",
//     pgn: `
// 1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d4 exd4 6.e5
// d5 7.exf6 dxc4 8.fxg7 Rg8 9.O-O Be6 10.Bg5 Qd5
// 11.Bf6 d3 12.Nbd2 Qf5 13.Ne4 Be7 14.Nd4 Qxe4
// 15.Nxc6 Qxc6 16.Bxe7 Kxe7 17.Qh5 Rxg7 18.Qh4+ Kf8
// 19.f3 Qc5+ 20.Kh1 Qg5 21.Qf2 Bd5 22.Rae1 Re8
// 23.Qc5+ Re7 24.Rf2 d2 25.Rd1 Bc6 26.Qd4 Re8
// 27.Rfxd2 Kg8 28.h4 Qg3 29.Qf2 Qf4 30.Rd4 Qf5
// 31.Rxc4 Qb5 32.Rg4 Re2 33.Rd8+ Re8 34.Qg3+ Kf8
// 35.Rg8+ Ke7 36.Qxc7+ Kf6 37.Qf4+ Qf5 38.Qd6+ Re6
// 39.Qd4+ Qe5 40.Qg4 Ke7 41.Qb4+ Qd6 42.Qxd6+ Rxd6
// 43.Rxd6 Kxd6 44.Rg7 Bd5 45.a3 h5 46.Rg5 f6 47.Rxh5
// b5 48.Rf5 Ke6 49.g4 Bc4 50.h5 Bd3 51.Rf4 Kf7
// 52.g5 f5 53.Rd4 Bc4 54.Rd7+ Kg8 55.h6 f4 56.g6 Kf8
// 57.h7 Bg8 58.hxg8=Q+ Kxg8 59.Rf7 b4 60.axb4 1-0
// `,
//   },

//   // ===========================================
//   // Classical Era (1880–1920)
//   // ===========================================

//   {
//     id: "game-lasker-bauer-1889",
//     era: "classical",
//     year: 1889,
//     date: "1889-??-??",
//     white: "Emanuel Lasker",
//     black: "Johann Bauer",
//     event: "Amsterdam 1889",
//     nickname: null,
//     officialName: "Lasker vs Bauer",
//     result: "1/2-1/2",
//     show: true,
//     timePerMoveSeconds: 12,
//     description: "A textbook example of counterattack and practical resourcefulness.",
//     pgn: `
// 1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Be7 5.e3 O-O 6.Nf3 h6
// 7.Bh4 b6 8.cxd5 Nxd5 9.Bxe7 Qxe7 10.Nxd5 exd5 11.Rc1
// Be6 12.Qa4 c5 13.Qa3 Rc8 14.Bb5 a6 15.dxc5 bxc5
// 16.O-O Ra7 17.Be2 Nd7 18.Nd4 Qf8 19.Nxe6 fxe6
// 20.e4 d4 21.f4 Qe7 22.e5 Rb8 23.b3 a5 24.Bc4 Kh8
// 25.Qb2 a4 26.Qe2 axb3 27.axb3 Nb6 28.Bd3 Nd5
// 29.Qe4 g6 30.Qxg6 Qg7 31.Qxe6 Ne3 32.Rf2 Rg8
// 33.Qh3 Rf8 34.g3 Ra3 35.Rxc5 Rxb3 36.Bf1 Nxf1
// 37.Rxf1 d3 38.Rd1 Qa7 39.Qxh6+ Kg8 40.Qe6+ Kh8
// 41.Qh6+ Kg8 42.e6 Qxc5+ 43.Kg2 Rb2+ 44.Kh3 Qf5+
// 45.g4 Qe4 46.Qg5+ Kh8 47.Qh6+ Kg8 48.Qg5+ Kh7
// 49.Qe7+ Kg8 50.Qg5+ Kh8 51.Qh6+ Kg8 52.Qg5+ Kh7
// 53.Qe7+ Kg8 54.Qg5+ 1/2-1/2
// `,
//   },

//   {
//     id: "game-lasker-napier-1904",
//     era: "classical",
//     year: 1904,
//     date: "1904-??-??",
//     white: "Emanuel Lasker",
//     black: "William Napier",
//     event: "Cambridge Springs 1904",
//     nickname: null,
//     officialName: "Lasker vs Napier",
//     result: "0-1",
//     show: true,
//     timePerMoveSeconds: 16,
//     description: "One of the wildest tactical battles of Lasker’s career.",
//     pgn: `
// 1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5
// 7.Bb3 d6 8.c3 O-O 9.h3 Nb8 10.d4 Nbd7 11.Nbd2 Bb7
// 12.Bc2 Re8 13.Nf1 Bf8 14.Ng3 g6 15.Bg5 h6 16.Bd2 c5
// 17.d5 c4 18.Nh2 Nc5 19.f4 exf4 20.Bxf4 Nfd7 21.Ng4 h5
// 22.Nh6+ Kg7 23.Nxh5+ gxh5 24.Qxh5 Qf6 25.Nf5+ Kg8
// 26.Re3 Ne5 27.Rg3+ Ng6 28.Bg5 Qh8 29.Nh6+ Bxh6
// 30.Bxh6 Re5 31.Qh4 Rae8 32.Rf1 Nd7 33.Qg4 Nf6
// 34.Qf3 Rxe4 35.Bxe4 Rxe4 36.Qxf6 Qxh6 37.Qxf7+ Kh8
// 38.Rxg6 Qe3+ 39.Kh2 Qg3+ 40.Rxg3 1-0
// `,
//   },

//   {
//     id: "game-lasker-tarrasch-1914",
//     era: "classical",
//     year: 1914,
//     date: "1914-??-??",
//     white: "Emanuel Lasker",
//     black: "Siegbert Tarrasch",
//     event: "St. Petersburg 1914",
//     nickname: null,
//     officialName: "Lasker vs Tarrasch",
//     result: "1-0",
//     show: true,
//     timePerMoveSeconds: 18,
//     description: "Lasker punishes overextension in a classic middlegame lesson.",
//     pgn: `
// 1.d4 d5 2.c4 e6 3.Nc3 Be7 4.Nf3 Nf6 5.Bg5 h6 6.Bh4 O-O
// 7.e3 b6 8.cxd5 Nxd5 9.Bxe7 Qxe7 10.Nxd5 exd5 11.Rc1
// Be6 12.Qa4 c5 13.Qa3 Rc8 14.Bb5 a6 15.dxc5 bxc5
// 16.O-O Ra7 17.Be2 Nd7 18.Rfd1 Qf6 19.Nd4 c4
// 20.b3 Ne5 21.bxc4 dxc4 22.Nxe6 Qxe6 23.Rd6 Qe7
// 24.Rxa6 Rxa6 25.Qxa6 Rb8 26.Bxc4 Nxc4 27.Qxc4 Qa3
// 28.h3 Rb2 29.Qc8+ Kh7 30.Qf5+ Kg8 31.Rc8+ Qf8
// 32.Rxf8+ Kxf8 33.Qc8+ Ke7 34.Qc7+ Ke6 35.Qc4+ Ke7
// 36.Qc3 Rb1+ 37.Kh2 Rb7 38.a4 Rd7 39.a5 Kf8 40.Qc5+
// Kg8 41.a6 Kg7 42.a7 Rd8 43.Qb6 Rd2 44.a8=Q Rxf2
// 45.Qd4+ f6 46.Qd7+ Kh6 47.Qh8+ Kg5 48.Qg4# 1-0
// `,
//   },

//   {
//     id: "game-lasker-capablanca-1914",
//     era: "classical",
//     year: 1914,
//     date: "1914-??-??",
//     white: "Emanuel Lasker",
//     black: "José Raúl Capablanca",
//     event: "St. Petersburg 1914",
//     nickname: null,
//     officialName: "Lasker vs Capablanca",
//     result: "1-0",
//     show: true,
//     timePerMoveSeconds: 18,
//     description: "A famous attacking win over his future successor.",
//     pgn: `
// 1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Be7 5.e3 O-O 6.Nf3 h6
// 7.Bh4 b6 8.cxd5 exd5 9.Bd3 Bb7 10.O-O Nbd7 11.Rc1 c5
// 12.Qe2 Ne4 13.Bxe7 Qxe7 14.dxc5 Ndxc5 15.Bb1 Ba6
// 16.Nb5 Qd7 17.Nfd4 Nd6 18.a4 Nxa4 19.Qc2 Bxb5
// 20.Qh7# 1-0
// `,
//   },

//   // ===========================================
//   // Modern Era (1950–1990)
//   // ===========================================

//   {
//     id: "game-byrne-fischer-1956",
//     era: "modern",
//     year: 1956,
//     date: "1956-10-17",
//     white: "Donald Byrne",
//     black: "Bobby Fischer",
//     event: "New York 1956",
//     nickname: "The Game of the Century",
//     officialName: "Byrne vs Fischer",
//     result: "0-1",
//     show: true,
//     timePerMoveSeconds: 16,
//     description:
//       "Brilliant queen sacrifice by a 13-year-old Fischer, one of the most famous games ever played.",
//     pgn: `
// 1.Nf3 Nf6 2.c4 g6 3.Nc3 Bg7 4.d4 O-O 5.Bf4 d5 6.Qb3 dxc4
// 7.Qxc4 c6 8.e4 Nbd7 9.Rd1 Nb6 10.Qc5 Bg4 11.Bg5 Na4
// 12.Qa3 Nxc3 13.bxc3 Nxe4 14.Bxe7 Qb6 15.Bc4 Nxc3
// 16.Bc5 Re8+ 17.Kf1 Be6 18.Bxb6 Bxc4+ 19.Kg1 Ne2+
// 20.Kf1 Nxd4+ 21.Kg1 Ne2+ 22.Kf1 Nc3+ 23.Kg1 axb6
// 24.Qb4 Ra4 25.Qxb6 Nxd1 26.h3 Rxa2 27.Kh2 Nxf2
// 28.Re1 Rxe1 29.Qd8+ Bf8 30.Nxe1 Bd5 31.Nf3 b5
// 32.Nf3 Ne4 33.Ne5 Kg7 34.Nd7 Bd6+ 35.Qxd6 Nxd6
// 36.Ne5 Rxg2+ 37.Kh1 Re2+ 38.Kg1 Rxe5 39.h4 b4
// 40.Kf2 b3 41.Kg3 b2 42.h5 b1=Q 43.hxg6 Qxg6+
// 44.Kh4 Rh5# 0-1
// `,
//   },

//   {
//     id: "game-botvinnik-tal-1960-g6",
//     era: "modern",
//     year: 1960,
//     date: "1960-03-26",
//     white: "Mikhail Botvinnik",
//     black: "Mikhail Tal",
//     event: "Botvinnik - Tal World Championship Match",
//     nickname: "TBD",
//     officialName: "Botvinnik - Tal World Championship Match (1960)",
//     result: "0-1",
//     show: true,
//     timePerMoveSeconds: 16,
//     description:
//       "Find something later and stick it here.",
//     pgn: `
// 1.c4 Nf6 2.Nf3 g6 3.g3 Bg7 4.Bg2 O-O 5.d4 d6 6.Nc3 Nbd7 7.O-O
// e5 8.e4 c6 9.h3 Qb6 10.d5 cxd5 11.cxd5 Nc5 12.Ne1 Bd7 13.Nd3
// Nxd3 14.Qxd3 Rfc8 15.Rb1 Nh5 16.Be3 Qb4 17.Qe2 Rc4 18.Rfc1
// Rac8 19.Kh2 f5 20.exf5 Bxf5 21.Ra1 Nf4 22.gxf4 exf4 23.Bd2
// Qxb2 24.Rab1 f3 25.Rxb2 fxe2 26.Rb3 Rd4 27.Be1 Be5+ 28.Kg1 Bf4
// 29.Nxe2 Rxc1 30.Nxd4 Rxe1+ 31.Bf1 Be4 32.Ne2 Be5 33.f4 Bf6
// 34.Rxb7 Bxd5 35.Rc7 Bxa2 36.Rxa7 Bc4 37.Ra8+ Kf7 38.Ra7+ Ke6
// 39.Ra3 d5 40.Kf2 Bh4+ 41.Kg2 Kd6 42.Ng3 Bxg3 43.Bxc4 dxc4
// 44.Kxg3 Kd5 45.Ra7 c3 46.Rc7 Kd4 47.Rd7+ 0-1
// `,
//   },

//   {
//     id: "game-fischer-spassky-1972-g6",
//     era: "modern",
//     year: 1972,
//     date: "1972-??-??",
//     white: "Bobby Fischer",
//     black: "Boris Spassky",
//     event: "Reykjavik 1972, Game 6",
//     nickname: null,
//     officialName: "Fischer vs Spassky",
//     result: "1-0",
//     show: true,
//     timePerMoveSeconds: 20,
//     description: "Often called Fischer’s finest positional game from the 1972 match.",
//     pgn: `
// 1.c4 e6 2.Nc3 d5 3.d4 Nf6 4.Nf3 Be7 5.Bf4 O-O 6.e3 Nbd7
// 7.c5 c6 8.Bd3 b6 9.b4 a5 10.a3 Ba6 11.Bxa6 Rxa6
// 12.O-O Qc8 13.Qc2 Qb7 14.h3 Rfa8 15.Rab1 axb4
// 16.axb4 b5 17.e4 dxe4 18.Nxe4 Nd5 19.Bd6 Ra4 20.Bxe7
// Nxe7 21.Neg5 Ng6 22.h4 Nf6 23.g3 h6 24.Ne4 Nxe4
// 25.Qxe4 Ne7 26.Ne5 Nd5 27.Qf3 Rf8 28.Rfe1 Rxb4
// 29.Rxb4 Nxb4 30.Rb1 Nd5 31.Nc4 Qa6 32.Ne5 Qa2
// 33.Rb3 Qa1+ 34.Kg2 Qxd4 35.Nxc6 Qxc5 36.Ne5 b4
// 37.Nd7 Qd6 38.Nxf8 Kxf8 39.Qe4 g6 40.Qd4 Kg8
// 41.Rb1 Qc6 42.Kh2 Qc2 43.Ra1 Qc8 44.Ra5 Qd8
// 45.Rb5 Qe8 46.Rb7 Qc8 47.Qa7 Qf8 48.Rb8 Qxb8
// 49.Qxb8+ Kg7 50.Qe5+ Kg8 51.h5 gxh5 52.Qxh5 Kg7
// 53.Qe5+ Kg8 54.Qb8+ Kg7 55.Qe5+ Kg8 56.Qd4 Kh7
// 57.Qg4 b3 58.Qf3 b2 59.Qxf7+ Kh8 60.Qb7 Nf6
// 61.Qxb2 Kg7 62.g4 Kg6 63.f4 Nxg4+ 64.Kg3 Nf6
// 65.Qe5 Kf7 66.f5 h5 67.Qe6+ Kg7 68.Qe7+ Kg8
// 69.Qxf6 h4+ 70.Kxh4 Kh7 71.Qg6+ Kh8 72.Qh6+ Kg8
// 73.Qg5+ Kf7 74.Qg6+ Ke7 75.Qe6+ Kf8 76.Qd7 Kg8
// 77.f6 Kh8 78.Qg7# 1-0
// `,
//   },

//   {
//     id: "game-fischer-taimanov-1971-g2",
//     era: "modern",
//     year: 1971,
//     date: "1971-??-??",
//     white: "Bobby Fischer",
//     black: "Mark Taimanov",
//     event: "Vancouver 1971, Game 2",
//     nickname: null,
//     officialName: "Fischer vs Taimanov",
//     result: "1-0",
//     show: true,
//     timePerMoveSeconds: 18,
//     description:
//       "From a quiet opening into a crushing attack, part of Fischer’s 6–0 demolition.",
//     pgn: `
// 1.c4 Nf6 2.Nc3 e6 3.Nf3 d5 4.d4 Be7 5.Bg5 O-O 6.e3 b6
// 7.cxd5 exd5 8.Bd3 Bb7 9.O-O Nbd7 10.Qc2 c5 11.Rad1 Rc8
// 12.Bf5 h6 13.Bh4 Rc6 14.Ne5 Rc7 15.Qe2 Nxe5 16.dxe5
// Ne4 17.Bxe7 Nxc3 18.bxc3 Qxe7 19.f4 Rd8 20.Bb1 Bc6
// 21.Rf3 Ba4 22.Rd2 Bc6 23.Rg3 f6 24.Qh5 fxe5 25.Qg6
// Kf8 26.fxe5 Qxe5 27.Rf2+ Ke7 28.Rf7+ Ke8 29.Rxg7+
// Rxg7 30.Qxc6+ Ke7 31.Rf3 Qxc3 32.Qc7+ Rd7 33.Qf4 Qc1+
// 34.Rf1 Qb2 35.Qf8+ Ke6 36.Bf5+ Ke5 37.Qe8+ Rde7
// 38.Qb8+ Rc7 39.Qh8+ Kd6 40.Qxh6+ Ke5 41.Qe6# 1-0
// `,
//   },

//   {
//     id: "game-fischer-larsen-1971-g1",
//     era: "modern",
//     year: 1971,
//     date: "1971-??-??",
//     white: "Bobby Fischer",
//     black: "Bent Larsen",
//     event: "Denver 1971, Game 1",
//     nickname: null,
//     officialName: "Fischer vs Larsen",
//     result: "1-0",
//     show: true,
//     timePerMoveSeconds: 16,
//     description: "A crushing start to Fischer’s 6–0 Candidates victory over Larsen.",
//     pgn: `
// 1.c4 e5 2.Nc3 Nf6 3.Nf3 Nc6 4.g3 d5 5.cxd5 Nxd5 6.Bg2 Nb6
// 7.O-O Be7 8.d3 O-O 9.Be3 Re8 10.Rc1 Bf8 11.a3 Nd4
// 12.b4 a5 13.b5 Bxa3 14.Ra1 Bb4 15.Na2 Bf8 16.Nc3 Bb4
// 17.Bd2 Bd7 18.Nxd4 exd4 19.Na2 Bxd2 20.Qxd2 Bxb5
// 21.Bxb7 Ra7 22.Bg2 c5 23.Rfb1 Bd7 24.Qb2 Na4 25.Qc2 Qf6
// 26.Rb7 Rxb7 27.Bxb7 Rb8 28.Bg2 Rb2 29.Qd1 Qe7 30.Nc1 Nc3
// 31.Qe1 a4 32.e3 Qf6 33.exd4 cxd4 34.Be4 Nxe4 35.dxe4 Qf3
// 36.Ra2 Bh3 37.Qf1 Bxf1 38.Kxf1 Qxf2# 0-1
// `,
//   },

//   {
//     id: "game-karpov-kasparov-1985-g16",
//     era: "modern",
//     year: 1985,
//     date: "1985-??-??",
//     white: "Anatoly Karpov",
//     black: "Garry Kasparov",
//     event: "World Championship 1985, Game 16",
//     nickname: "The Octopus or Kasparov's Immortal Game",
//     officialName: "Karpov - Kasparov World Championship Match (1985)",
//     result: "0-1",
//     show: true,
//     timePerMoveSeconds: 20,
//     description:
//       "World Championship clash often called Kasparov’s immortal game (hidden until PGN is finalized).",
//     pgn: `
// 1.e4 c5 2.Nf3 e6 3.d4 cxd4 4.Nxd4 Nc6 5.Nb5 d6 6.c4 Nf6 7.N1c3
// a6 8.Na3 d5 9.cxd5 exd5 10.exd5 Nb4 11.Be2 Bc5 12.O-O O-O
// 13.Bf3 Bf5 14.Bg5 Re8 15.Qd2 b5 16.Rad1 Nd3 17.Nab1 h6 18.Bh4
// b4 19.Na4 Bd6 20.Bg3 Rc8 21.b3 g5 22.Bxd6 Qxd6 23.g3 Nd7
// 24.Bg2 Qf6 25.a3 a5 26.axb4 axb4 27.Qa2 Bg6 28.d6 g4 29.Qd2
// Kg7 30.f3 Qxd6 31.fxg4 Qd4+ 32.Kh1 Nf6 33.Rf4 Ne4 34.Qxd3 Nf2+
// 35.Rxf2 Bxd3 36.Rfd2 Qe3 37.Rxd3 Rc1 38.Nb2 Qf2 39.Nd2 Rxd1+
// 40.Nxd1 Re1+ 0-1
// `,
//   },
// ];

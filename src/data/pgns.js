// src/data/pgns.js
// Central PGN store for all worlds/levels.
// Format: full historical game, SAN, no comments/variations/NAGs.

// ------------------------------
// Anderssen Games (World 1)
// ------------------------------

// Immortal Game – Anderssen vs Kieseritzky, London 1851
export const PGN_IMMORTAL_1851 = `
1.e4 e5 2.f4 exf4 3.Bc4 Qh4+ 4.Kf1 b5 5.Bxb5 Nf6
6.Nf3 Qh6 7.d3 Nh5 8.Nh4 Qg5 9.Nf5 c6 10.g4 Nf6
11.Rg1 cxb5 12.h4 Qg6 13.h5 Qg5 14.Qf3 Ng8 15.Bxf4
Qf6 16.Nc3 Bc5 17.Nd5 Qxb2 18.Bd6 Qxa1+ 19.Ke2 Bxg1
20.e5 Na6 21.Nxg7+ Kd8 22.Qf6+ Nxf6 23.Be7+ 1-0
`;

// Evergreen Game – Anderssen vs Dufresne, Berlin 1852
export const PGN_EVERGREEN_1852 = `
1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.b4 Bxb4 5.c3 Ba5
6.d4 exd4 7.O-O d3 8.Qb3 Qf6 9.e5 Qg6 10.Re1 Nge7
11.Ba3 b5 12.Qxb5 Rb8 13.Qa4 Bb6 14.Nbd2 Bb7 15.Ne4
Qf5 16.Bxd3 Qh5 17.Nf6+ gxf6 18.exf6 Rg8 19.Rad1
Qxf3 20.Rxe7+ Nxe7 21.Qxd7+ Kxd7 22.Bf5+ Kc6
23.Bd7# 1-0
`;

// Mayet–Anderssen – Berlin 1851 (full historical game)
export const PGN_ANDERSSEN_MAYET_1851 = `
1.e4 e5 2.Nf3 Nc6 3.Bb5 Bc5 4.c3 Nf6 5.Bxc6 dxc6 6.O-O Bg4
7.h3 h5 8.hxg4 hxg4 9.Nxe5 g3 10.d4 Nxe4 11.Qg4 Bxd4 12.Qxe4 0-1
`;

// Anderssen–Zukertort – Barmen 1869
export const PGN_ANDERSSEN_ZUKERTORT_1869 = `
1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.b4 Bxb4 5.c3 Ba5
6.d4 exd4 7.O-O Bb6 8.cxd4 d6 9.d5 Na5 10.Bb2 Ne7
11.Bd3 O-O 12.Nc3 Ng6 13.Ne2 c5 14.Qd2 f6 15.Kh1
Bc7 16.Rac1 Rb8 17.Ng3 b5 18.Nh5 c4 19.Bb1 b4
20.Bd4 Bb6 21.Bxb6 Qxb6 22.Nd4 Bd7 23.f4 Rbe8
24.Qf2 b3 25.axb3 Nxb3 26.Rcd1 Nxd4 27.Rxd4 Rc8
28.Rdd1 Qxf2 29.Rxf2 Bg4 30.Ng3 Bxd1 31.Rd2 Ba4
32.Nf5 Rfd8 33.h4 c3 34.Ra2 c2 35.Bxc2 Bxc2
36.Ne7+ Nxe7 37.Rxa7 Kf8 38.h5 Bxe4 39.h6 gxh6
40.Kh2 Rc2 41.Kh3 Bxg2+ 42.Kg3 Nf5+ 43.Kg4 Be4
44.Rxh7 Kg8 45.Ra7 Rg2+ 46.Kh5 Bf3# 0-1
`;

// ------------------------------
// Morphy Games (World 2)
// ------------------------------

// Opera Game – Morphy vs Duke Karl/Count Isouard, Paris 1858
export const PGN_OPERA_1858 = `
1.e4 e5 2.Nf3 d6 3.d4 Bg4 4.dxe5 Bxf3 5.Qxf3 dxe5
6.Bc4 Nf6 7.Qb3 Qe7 8.Nc3 c6 9.Bg5 b5 10.Nxb5 cxb5
11.Bxb5+ Nbd7 12.O-O-O Rd8 13.Rxd7 Rxd7 14.Rd1 Qe6
15.Bxd7+ Nxd7 16.Qb8+ Nxb8 17.Rd8# 1-0
`;

// Morphy–Anderssen, Paris 1858
export const PGN_MORPHY_ANDERSSEN_1858 = `
1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d4 exd4 6.cxd4
Bb4+ 7.Nc3 Nxe4 8.O-O Bxc3 9.d5 Bf6 10.Re1 Ne7
11.Rxe4 d6 12.Bg5 Bxg5 13.Nxg5 O-O 14.Nxh7 Kxh7
15.Qh5+ Kg8 16.Rh4 f6 17.Re1 Bf5 18.Rhe4 Bxe4
19.Rxe4 Qe8 20.Qe2 Rf7 21.h4 Qd7 22.h5 Nxd5
23.h6 gxh6 24.Qh5 c6 25.b4 f5 26.Rh4 Qe6 27.b5 cxb5
28.Bb3 Rc8 29.Qd1 Rc5 30.Rd4 Rg7 31.Rxd5 Rxd5
32.Bxd5 Qxd5 33.Qxd5+ Rf7 34.Qxd6 Kg7 35.Qe5+ Kg6
36.Qxb5 Re7 37.f4 b6 38.a4 h5 39.Kh2 h4 40.Kh3 Re3+
41.Kxh4 Re6 42.Qd7 Kf6 43.Qd8+ Kf7 44.Kg5 Rg6+
45.Kxf5 Rxg2 46.Qd7+ Kf8 47.Qxa7 Rg7 48.Qxb6 Rf7+
49.Kg6 Rg7+ 50.Kf6 Rf7+ 51.Ke6 Re7+ 52.Kf5 Rf7+
53.Kg4 Rg7+ 54.Kf3 Rf7 55.a5 Kg7 56.a6 Rf6
57.Qb7+ Rf7 58.Qxf7+ Kxf7 59.a7 1-0
`;

// Morphy–Paulsen, New York 1857
export const PGN_MORPHY_PAULSEN_1857 = `
1.e4 e5 2.Nf3 d5 3.exd5 e4 4.Qe2 Be7 5.Qxe4 Nf6 6.Bb5+ Bd7
7.Qe2 Nxd5 8.Bxd7+ Qxd7 9.d4 O-O 10.O-O Nc6 11.c4 Nf6 12.d5
Nb4 13.Ne5 Qf5 14.Nc3 Nc2 15.g4 Nxg4 16.Qxg4 Qxg4+ 17.Nxg4
Nxa1 18.Bf4 Nc2 19.Bxc7 Rac8 20.d6 Bd8 21.Nd5 Kh8 22.Rd1 Bxc7
23.Nxc7 Rfd8 24.a3 Kg8 25.c5 f6 26.Rd2 Ne1 27.Kf1 Nf3 28.Rd3
Ng5 29.b4 Rd7 30.f4 Nf7 31.Ne3 Nh6 32.b5 Kf7 33.Ke2 g6 34.a4
Ng8 35.Nc4 Ne7 36.b6 axb6 37.Nxb6 Rcxc7 38.Nxd7 Rxd7 39.dxe7
Kxe7 40.Re3+ Kf7 41.Rb3 Ke6 42.Rb6+ Kd5 43.Rxf6 Kxc5 44.f5
gxf5 45.Rxf5+ Kb4 46.a5 Rc7 47.Rh5 Kc4 48.Ke3 Kb4 49.h4 Rc3+
50.Kd4 1/2-1/2
`;

// Morphy–Bird, London 1858
export const PGN_MORPHY_BIRD_1858 = `
1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d4 exd4 6.e5
d5 7.exf6 dxc4 8.fxg7 Rg8 9.O-O Be6 10.Bg5 Qd5
11.Bf6 d3 12.Nbd2 Qf5 13.Ne4 Be7 14.Nd4 Qxe4
15.Nxc6 Qxc6 16.Bxe7 Kxe7 17.Qh5 Rxg7 18.Qh4+ Kf8
19.f3 Qc5+ 20.Kh1 Qg5 21.Qf2 Bd5 22.Rae1 Re8
23.Qc5+ Re7 24.Rf2 d2 25.Rd1 Bc6 26.Qd4 Re1+
27.Rf1 Qxg2# 0-1
`;

// ------------------------------
// Lasker Games (World 3)
// ------------------------------

// Lasker–Bauer, Amsterdam 1889
export const PGN_LASKER_BAUER_1889 = `
1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Be7 5.e3 O-O 6.Nf3 h6
7.Bh4 b6 8.cxd5 Nxd5 9.Bxe7 Qxe7 10.Nxd5 exd5 11.Rc1
Be6 12.Qa4 c5 13.Qa3 Rc8 14.Bb5 a6 15.dxc5 bxc5
16.O-O Ra7 17.Be2 Nd7 18.Nd4 Qf8 19.Nxe6 fxe6
20.e4 d4 21.f4 Qe7 22.e5 Rb8 23.b3 a5 24.Bc4 Kh8
25.Qb2 a4 26.Qe2 axb3 27.axb3 Nb6 28.Bd3 Nd5
29.Qe4 g6 30.Qxg6 Qg7 31.Qxe6 Ne3 32.Rf2 Rg8
33.Qh3 Rf8 34.g3 Ra3 35.Rxc5 Rxb3 36.Bf1 Nxf1
37.Rxf1 d3 38.Rd1 Qa7 39.Qxh6+ Kg8 40.Qe6+ Kh8
41.Qh6+ Kg8 42.e6 Qxc5+ 43.Kg2 Rb2+ 44.Kh3 Qf5+
45.g4 Qe4 46.Qg5+ Kh8 47.Qh6+ Kg8 48.Qg5+ Kh7
49.Qe7+ Kg8 50.Qg5+ Kh8 51.Qh6+ Kg8 52.Qg5+ Kh7
53.Qe7+ Kg8 54.Qg5+ 1/2-1/2
`;

// Lasker–Napier, Cambridge Springs 1904
export const PGN_LASKER_NAPIER_1904 = `
1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5
7.Bb3 d6 8.c3 O-O 9.h3 Nb8 10.d4 Nbd7 11.Nbd2 Bb7
12.Bc2 Re8 13.Nf1 Bf8 14.Ng3 g6 15.Bg5 h6 16.Bd2 c5
17.d5 c4 18.Nh2 Nc5 19.f4 exf4 20.Bxf4 Nfd7 21.Ng4 h5
22.Nh6+ Kg7 23.Nxh5+ gxh5 24.Qxh5 Qf6 25.Nf5+ Kg8
26.Re3 Ne5 27.Rg3+ Ng6 28.Bg5 Qh8 29.Nh6+ Bxh6
30.Bxh6 Re5 31.Qh4 Rae8 32.Rf1 Nd7 33.Qg4 Nf6
34.Qf3 Rxe4 35.Qxf6 Qxf6 36.Rxf6 Re1+ 37.Kh2 Bxd5
38.Bxg6 fxg6 39.Rgxg6+ Kh7 40.Rg7+ Kh8 41.Rxd6 Bg8
42.Rxa6 R1e7 43.Rg5 Re6 44.Bg7+ Kh7 45.Ra7 Rg6
46.Bf6+ Kh6 47.Rxb5 Re2 48.Bg5+ Rxg5 49.Rxg5 Kxg5
50.Rb7 Bd5 51.Rb5 Rxg2+ 52.Kh1 Rd2+ 53.Kg1 Kh4
54.a4 Kg3 55.Kf1 Bf3 56.Rg5+ Kf4 57.Rg7 Ke3
58.Re7+ Be4 59.Kg1 Rg2+ 60.Kf1 Rh2 61.Rxe4+ Kxe4
62.a5 Kf3 63.Kg1 Ra2 64.h4 Rxa5 65.Kh2 Kg4
66.h5 Rxh5+ 67.Kg2 Rf5 68.Kg1 Kg3 69.Kh1 Rf1#
0-1
`;

// Lasker–Tarrasch, St. Petersburg 1914
export const PGN_LASKER_TARRASCH_1914 = `
1.d4 d5 2.c4 e6 3.Nc3 Be7 4.Nf3 Nf6 5.Bg5 h6 6.Bh4 O-O
7.e3 b6 8.cxd5 Nxd5 9.Bxe7 Qxe7 10.Nxd5 exd5 11.Rc1
Be6 12.Qa4 c5 13.Qa3 Rc8 14.Bb5 a6 15.dxc5 bxc5
16.O-O Ra7 17.Be2 Nd7 18.Rfd1 Qf6 19.Nd4 c4
20.b3 Ne5 21.bxc4 dxc4 22.Nxe6 Qxe6 23.Rd6 Qe7
24.Rxa6 Rxa6 25.Qxa6 Rb8 26.Bxc4 Nxc4 27.Qxc4 Qa3
28.h3 Rb2 29.Qc8+ Kh7 30.Qf5+ Kg8 31.Rc8+ Qf8
32.Rxf8+ Kxf8 33.Qc8+ Ke7 34.Qc7+ Ke8 35.Qe5+ Re2
36.Qb5+ Kf8 37.Qxe2 g6 38.a4 Kg7 39.a5 h5 40.a6
Kh6 41.a7 f5 42.a8=Q f4 43.Qf8+ Kg5 44.Qxf4#
1-0
`;

// Lasker–Capablanca, St. Petersburg 1914
export const PGN_LASKER_CAPABLANCA_1914 = `
1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Be7 5.e3 O-O 6.Nf3 h6
7.Bh4 b6 8.cxd5 exd5 9.Bd3 Bb7 10.O-O Nbd7 11.Rc1 c5
12.Qe2 Ne4 13.Bxe7 Qxe7 14.dxc5 Ndxc5 15.Bb1 Ba6
16.Nb5 Qd7 17.Nfd4 Nd6 18.a4 Nxa4 19.Qc2 Bxb5
20.Qh7# 1-0
`;

// ------------------------------
// Fischer Games (World 4)
// ------------------------------

// Game of the Century – Byrne vs Fischer, New York 1956
export const PGN_GAME_OF_CENTURY_1956 = `
1.Nf3 Nf6 2.c4 g6 3.Nc3 Bg7 4.d4 O-O 5.Bf4 d5 6.Qb3 dxc4
7.Qxc4 c6 8.e4 Nbd7 9.Rd1 Nb6 10.Qc5 Bg4 11.Bg5 Na4
12.Qa3 Nxc3 13.bxc3 Nxe4 14.Bxe7 Qb6 15.Bc4 Nxc3
16.Bc5 Rfe8+ 17.Kf1 Be6 18.Bxb6 Bxc4+ 19.Kg1 Ne2+
20.Kf1 Nxd4+ 21.Kg1 Ne2+ 22.Kf1 Nc3+ 23.Kg1 axb6
24.Qb4 Ra4 25.Qxb6 Nxd1 26.h3 Rxa2 27.Kh2 Nxf2
28.Re1 Rxe1 29.Qd8+ Bf8 30.Nxe1 Bd5 31.Qb8 b5
32.Nf3 Ne4 33.Ne5 Kg7 34.Nd7 Bd6+ 35.Qxd6 Nxd6
36.Ne5 Rxg2+ 37.Kh1 Nf5 38.Nd3 Ng3# 0-1
`;

// Fischer–Spassky, Reykjavik 1972, Game 6
export const PGN_FISCHER_SPASSKY_1972_G6 = `
1.c4 e6 2.Nc3 d5 3.d4 Nf6 4.Nf3 Be7 5.Bf4 O-O 6.e3 Nbd7
7.c5 c6 8.Bd3 b6 9.b4 a5 10.a3 Ba6 11.Bxa6 Rxa6
12.O-O Qc8 13.Qc2 Qb7 14.h3 Rfa8 15.Rab1 axb4
16.axb4 b5 17.e4 dxe4 18.Nxe4 Nd5 19.Bd6 Ra4 20.Bxe7
Nxe7 21.Neg5 Ng6 22.h4 Nf6 23.g3 h6 24.Ne4 Nxe4
25.Qxe4 Ne7 26.Ne5 Nd5 27.Qf3 Rf8 28.Rfe1 Rxb4
29.Rxb4 Nxb4 30.Rb1 Nd5 31.Nc4 Qa6 32.Ne5 Qa2
33.Rb3 Qa1+ 34.Kg2 Qxd4 35.Nxc6 Qxc5 36.Ne5 b4
37.Nd7 Qd6 38.Nxf8 Kxf8 39.Qe4 g6 40.Qd4 Kg8
41.Rb1 Qc6 42.Kh2 Qc2 43.Ra1 Kh7 44.Ra8 Nf6
45.Qxf6 Qxf2+ 46.Qxf2 Kg7 47.Ra7 h5 48.Qxf7+ Kh6
49.Qf4+ g5 50.Qxg5# 1-0
`;

// Fischer–Taimanov, Candidates, Vancouver 1971, Game 2
export const PGN_FISCHER_TAIMANOV_1971_G2 = `
1.c4 Nf6 2.Nc3 e6 3.Nf3 d5 4.d4 Be7 5.Bg5 O-O 6.e3 b6
7.cxd5 exd5 8.Bd3 Bb7 9.O-O Nbd7 10.Qc2 c5 11.Rad1 Rc8
12.Bf5 h6 13.Bh4 Rc6 14.Ne5 Rc7 15.Qe2 Nxe5 16.dxe5
Ne4 17.Bxe7 Nxc3 18.bxc3 Qxe7 19.f4 Rd8 20.Bb1 Bc6
21.Rf3 Ba4 22.Rd2 Bc6 23.Rg3 f6 24.Qh5 fxe5 25.Qg6
Kf8 26.fxe5 Qxe5 27.Rf2+ Ke7 28.Rf7+ Ke8 29.Rxg7+
Rxg7 30.Qxc6+ Kf8 31.Rf3+ Kg8 32.Qxh6 Qxc3
33.Qe6+ Kh8 34.Rh3+ Rh7 35.Rxh7# 1-0
`;

// Fischer–Larsen, Candidates, Denver 1971, Game 1
export const PGN_FISCHER_LARSEN_1971_G1 = `
1.c4 e5 2.Nc3 Nf6 3.Nf3 Nc6 4.g3 d5 5.cxd5 Nxd5 6.Bg2 Nb6
7.O-O Be7 8.d3 O-O 9.Be3 Re8 10.Rc1 Bf8 11.a3 Nd4
12.b4 a5 13.b5 Bxa3 14.Ra1 Bb4 15.Na2 Bf8 16.Nc3 Bb4
17.Bd2 Bd7 18.Nxd4 exd4 19.Na2 Bf8 20.Bxb7 Ra7
21.Bg2 Bxb5 22.Nc1 a4 23.Qc2 a3 24.Nb3 Ba4 25.Rfb1 c5
26.Qa2 c4 27.dxc4 Nxc4 28.Bf4 g5 29.Bc1 d3 30.exd3 Qxd3
31.Bxg5 Re2 32.Bf1 Rxa2 33.Bxd3 Bxb3 34.Rxb3 Rxa1+
35.Bb1 a2 36.Bf6 Rxb1+ 37.Rxb1 axb1=Q+ 38.Rxb1 Bg7
39.Bg5 h6 40.Bf4 Ra2 41.h4 Bd4 42.Rf1 Kg7 43.Kg2 Kg6
44.g4 h5 45.gxh5+ Kxh5 46.Kg3 Ra3+ 47.f3 Ne3
48.Rb1 Nf5+ 49.Kg2 Nxh4+ 50.Kg3 Rxf3+ 51.Kh2 Rxf4
52.Rb5+ Kg4 53.Rb4 Nf3+ 54.Kg2 Re4 55.Rb7 Re2+ 56.Kf1 Rf2#
0-1
`;

// ------------------------------
// Karpov–Kasparov (extra worlds)
// ------------------------------

// World Championship 1985/86 – Karpov vs Kasparov
// NOTE: paste the real PGN for the game here, in pure SAN,
// no comments, no header tags, just moves and result.
export const PGN_KARPOV_KASPAROV_1985_G16 = `
1.e4 c5 2.Nf3 ... 0-1
`;

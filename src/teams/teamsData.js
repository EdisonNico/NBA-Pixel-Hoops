// Datos de equipos y jugadores. Ratings: [velocidad, tiro, triple, pase, defensa] (0-99).

const SK = { a: '#f1c27d', b: '#c68642', c: '#8d5524', d: '#5c3a1e' };
const HR = { blk: '#15110f', brn: '#3b2314', gry: '#8a8a8a', blo: '#caa24a' };
// Pl(nombre, dorsal, posición, piel, pelo, estilo, ratings, extras)
const Pl = (name, num, pos, skin, hair, style, r, ex) => Object.assign({
  name, num, pos, skin: SK[skin], hair: HR[hair], style,
  spd: r[0], sho: r[1], thr: r[2], pas: r[3], def: r[4]
}, ex || {});

const T = (id, city, name, abbr, main, trim, players) => ({
  id, city, name, abbr, main, trim, altMain: '#f2f2f2', altTrim: main, players
});

export const TEAMS = [
  T('lal', 'Los Angeles', 'Lakers', 'LAL', '#552583', '#FDB927', [
    Pl('Austin Reaves', '15', 'PG', 'a', 'brn', 'short', [82, 80, 78, 82, 70], { beard: true }),
    Pl('Luka Doncic', '77', 'SG', 'a', 'brn', 'short', [78, 92, 90, 94, 68], { beard: true }),
    Pl('LeBron James', '23', 'SF', 'c', 'blk', 'short', [86, 90, 80, 92, 82], { band: '#ffffff', beard: true }),
    Pl('Rui Hachimura', '28', 'PF', 'b', 'blk', 'short', [76, 80, 74, 62, 74]),
    Pl('Jaxson Hayes', '11', 'C', 'c', 'blk', 'afro', [80, 66, 40, 55, 80])
  ]),
  T('gsw', 'Golden State', 'Warriors', 'GSW', '#1D428A', '#FFC72C', [
    Pl('Stephen Curry', '30', 'PG', 'a', 'brn', 'short', [88, 94, 99, 90, 66]),
    Pl('Brandin Podziemski', '2', 'SG', 'a', 'brn', 'short', [80, 76, 74, 78, 72]),
    Pl('Jimmy Butler', '10', 'SF', 'b', 'blk', 'short', [82, 84, 66, 80, 90], { beard: true }),
    Pl('Jonathan Kuminga', '00', 'PF', 'c', 'blk', 'braids', [90, 78, 62, 58, 76]),
    Pl('Draymond Green', '23', 'C', 'c', 'blk', 'bald', [70, 60, 55, 84, 92], { beard: true })
  ]),
  T('bos', 'Boston', 'Celtics', 'BOS', '#007A33', '#ffffff', [
    Pl('Derrick White', '9', 'PG', 'c', 'blk', 'bald', [82, 76, 82, 78, 86]),
    Pl('Payton Pritchard', '11', 'SG', 'a', 'blo', 'short', [84, 80, 88, 80, 62]),
    Pl('Jaylen Brown', '7', 'SF', 'c', 'blk', 'short', [88, 86, 80, 72, 82], { band: '#ffffff' }),
    Pl('Jayson Tatum', '0', 'PF', 'c', 'blk', 'short', [86, 92, 86, 78, 82]),
    Pl('Neemias Queta', '88', 'C', 'a', 'brn', 'short', [66, 66, 30, 56, 84], { beard: true })
  ]),
  T('chi', 'Chicago', 'Bulls', 'CHI', '#CE1141', '#111111', [
    Pl('Josh Giddey', '3', 'PG', 'a', 'brn', 'short', [78, 74, 70, 90, 62]),
    Pl('Coby White', '0', 'SG', 'c', 'blk', 'short', [90, 82, 84, 72, 60]),
    Pl('Matas Buzelis', '14', 'SF', 'a', 'blo', 'short', [84, 76, 70, 64, 74]),
    Pl('Patrick Williams', '44', 'PF', 'c', 'blk', 'short', [80, 72, 72, 58, 78]),
    Pl('Nikola Vucevic', '9', 'C', 'a', 'brn', 'short', [58, 80, 74, 66, 66], { beard: true })
  ]),
  T('mia', 'Miami', 'Heat', 'MIA', '#98002E', '#F9A01B', [
    Pl('Davion Mitchell', '45', 'PG', 'c', 'blk', 'short', [88, 68, 66, 78, 88]),
    Pl('Tyler Herro', '14', 'SG', 'a', 'brn', 'short', [82, 86, 88, 78, 64]),
    Pl('Norman Powell', '24', 'SF', 'c', 'blk', 'bald', [84, 84, 82, 64, 70]),
    Pl('Andrew Wiggins', '22', 'PF', 'c', 'blk', 'braids', [88, 78, 76, 58, 78]),
    Pl('Bam Adebayo', '13', 'C', 'c', 'blk', 'bald', [80, 80, 60, 76, 92])
  ]),
  T('nyk', 'New York', 'Knicks', 'NYK', '#006BB6', '#F58426', [
    Pl('Jalen Brunson', '11', 'PG', 'b', 'blk', 'short', [82, 90, 82, 84, 66]),
    Pl('Mikal Bridges', '25', 'SG', 'c', 'blk', 'short', [84, 80, 82, 66, 88]),
    Pl('OG Anunoby', '8', 'SF', 'c', 'blk', 'short', [84, 78, 80, 58, 90]),
    Pl('Josh Hart', '3', 'PF', 'a', 'brn', 'short', [78, 68, 66, 80, 82]),
    Pl('Karl-Anthony Towns', '32', 'C', 'b', 'blk', 'short', [70, 88, 86, 66, 66], { beard: true })
  ]),
  T('mil', 'Milwaukee', 'Bucks', 'MIL', '#00471B', '#EEE1C6', [
    Pl('Ryan Rollins', '13', 'PG', 'c', 'blk', 'short', [88, 72, 70, 72, 70]),
    Pl('Gary Trent Jr', '7', 'SG', 'b', 'blk', 'short', [82, 78, 84, 62, 64]),
    Pl('Kyle Kuzma', '18', 'SF', 'c', 'blk', 'short', [78, 80, 78, 62, 66], { beard: true }),
    Pl('Bobby Portis', '9', 'PF', 'a', 'brn', 'short', [72, 78, 76, 56, 70], { beard: true }),
    Pl('Giannis Antetokounmpo', '34', 'C', 'c', 'blk', 'short', [90, 86, 50, 78, 94], { band: '#ffffff' })
  ]),
  T('dal', 'Dallas', 'Mavericks', 'DAL', '#00538C', '#B8C4CA', [
    Pl('Kyrie Irving', '11', 'PG', 'b', 'blk', 'short', [90, 92, 88, 86, 62], { beard: true }),
    Pl('Klay Thompson', '31', 'SG', 'a', 'brn', 'short', [78, 88, 94, 66, 70]),
    Pl('Cooper Flagg', '32', 'SF', 'a', 'blo', 'short', [86, 80, 74, 74, 86]),
    Pl('PJ Washington', '25', 'PF', 'c', 'blk', 'short', [80, 76, 78, 60, 78], { beard: true }),
    Pl('Anthony Davis', '3', 'C', 'c', 'blk', 'short', [80, 82, 56, 62, 94])
  ])
];
export const teamById = id => TEAMS.find(t => t.id === id) || TEAMS[0];

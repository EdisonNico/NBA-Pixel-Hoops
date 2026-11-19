// Conferencia Oeste (15 equipos). Plantillas aproximadas: edítalas libremente.

import { Pl, T } from './builders.js';

export const WEST = [
  T('dal', 'Dallas', 'Mavericks', 'DAL', '#00538C', '#B8C4CA', [
    Pl('Kyrie Irving', '11', 'PG', 'b', 'blk', 'short', [90, 92, 88, 86, 62], { beard: true }),
    Pl('Klay Thompson', '31', 'SG', 'a', 'brn', 'short', [78, 88, 94, 66, 70]),
    Pl('Cooper Flagg', '32', 'SF', 'a', 'blo', 'short', [86, 80, 74, 74, 86]),
    Pl('PJ Washington', '25', 'PF', 'c', 'blk', 'short', [80, 76, 78, 60, 78], { beard: true }),
    Pl('Anthony Davis', '3', 'C', 'c', 'blk', 'short', [80, 82, 56, 62, 94])
  ]),
  T('den', 'Denver', 'Nuggets', 'DEN', '#0E2240', '#FEC524', [
    Pl('Jamal Murray', '27', 'PG', 'c', 'blk', 'short', [86, 88, 90, 82, 66], { beard: true }),
    Pl('Christian Braun', '0', 'SG', 'a', 'brn', 'short', [86, 72, 76, 62, 78]),
    Pl('Aaron Gordon', '50', 'SF', 'a', 'brn', 'short', [84, 76, 66, 70, 86]),
    Pl('Cam Johnson', '8', 'PF', 'c', 'blk', 'short', [78, 82, 86, 58, 66]),
    Pl('Nikola Jokic', '15', 'C', 'a', 'brn', 'short', [60, 92, 82, 99, 66], { beard: true })
  ]),
  T('gsw', 'Golden State', 'Warriors', 'GSW', '#1D428A', '#FFC72C', [
    Pl('Stephen Curry', '30', 'PG', 'a', 'brn', 'short', [88, 94, 99, 90, 66]),
    Pl('Brandin Podziemski', '2', 'SG', 'a', 'brn', 'short', [80, 76, 74, 78, 72]),
    Pl('Jimmy Butler', '10', 'SF', 'b', 'blk', 'short', [82, 84, 66, 80, 90], { beard: true }),
    Pl('Jonathan Kuminga', '00', 'PF', 'c', 'blk', 'braids', [90, 78, 62, 58, 76]),
    Pl('Draymond Green', '23', 'C', 'c', 'blk', 'bald', [70, 60, 55, 84, 92], { beard: true })
  ]),
  T('hou', 'Houston', 'Rockets', 'HOU', '#CE1141', '#C4CED4', [
    Pl('Fred VanVleet', '5', 'PG', 'c', 'blk', 'short', [84, 78, 84, 86, 80]),
    Pl('Amen Thompson', '1', 'SG', 'c', 'blk', 'short', [92, 70, 50, 74, 86]),
    Pl('Kevin Durant', '7', 'SF', 'c', 'blk', 'short', [82, 96, 92, 66, 74]),
    Pl('Jabari Smith Jr', '10', 'PF', 'c', 'blk', 'short', [76, 78, 80, 50, 74]),
    Pl('Alperen Sengun', '28', 'C', 'a', 'brn', 'short', [70, 88, 60, 86, 70], { beard: true })
  ]),
  T('lac', 'Los Angeles', 'Clippers', 'LAC', '#C8102E', '#1D428A', [
    Pl('James Harden', '1', 'PG', 'c', 'blk', 'short', [76, 88, 92, 94, 56], { beard: true }),
    Pl('Bradley Beal', '0', 'SG', 'c', 'blk', 'short', [78, 88, 88, 70, 62]),
    Pl('Kawhi Leonard', '2', 'SF', 'c', 'blk', 'short', [80, 92, 84, 72, 94]),
    Pl('John Collins', '20', 'PF', 'c', 'blk', 'short', [74, 78, 74, 50, 72]),
    Pl('Ivica Zubac', '40', 'C', 'a', 'brn', 'short', [54, 74, 10, 52, 86])
  ]),
  T('lal', 'Los Angeles', 'Lakers', 'LAL', '#552583', '#FDB927', [
    Pl('Austin Reaves', '15', 'PG', 'a', 'brn', 'short', [82, 80, 78, 82, 70], { beard: true }),
    Pl('Luka Doncic', '77', 'SG', 'a', 'brn', 'short', [78, 92, 90, 94, 68], { beard: true }),
    Pl('LeBron James', '23', 'SF', 'c', 'blk', 'short', [86, 90, 80, 92, 82], { band: '#ffffff', beard: true }),
    Pl('Rui Hachimura', '28', 'PF', 'b', 'blk', 'short', [76, 80, 74, 62, 74]),
    Pl('Jaxson Hayes', '11', 'C', 'c', 'blk', 'afro', [80, 66, 40, 55, 80])
  ]),
  T('mem', 'Memphis', 'Grizzlies', 'MEM', '#5D76A9', '#12173F', [
    Pl('Ja Morant', '12', 'PG', 'c', 'blk', 'short', [96, 80, 78, 88, 60]),
    Pl('Jaylen Wells', '0', 'SG', 'a', 'brn', 'short', [78, 74, 82, 56, 70]),
    Pl('Santi Aldama', '7', 'SF', 'a', 'brn', 'short', [76, 70, 76, 62, 70]),
    Pl('Jaren Jackson Jr', '13', 'PF', 'c', 'blk', 'short', [76, 82, 80, 56, 90]),
    Pl('Zach Edey', '14', 'C', 'a', 'brn', 'short', [54, 74, 10, 40, 86], { beard: true })
  ]),
  T('min', 'Minnesota', 'Timberwolves', 'MIN', '#0C2340', '#78BE20', [
    Pl('Mike Conley', '10', 'PG', 'c', 'blk', 'short', [76, 80, 84, 92, 72]),
    Pl('Anthony Edwards', '5', 'SG', 'c', 'blk', 'short', [94, 90, 88, 80, 78]),
    Pl('Jaden McDaniels', '3', 'SF', 'c', 'blk', 'short', [82, 70, 70, 56, 88]),
    Pl('Julius Randle', '30', 'PF', 'c', 'blk', 'short', [76, 84, 78, 72, 66]),
    Pl('Rudy Gobert', '27', 'C', 'c', 'blk', 'short', [60, 66, 10, 44, 96], { beard: true })
  ]),
  T('nop', 'New Orleans', 'Pelicans', 'NOP', '#0C2340', '#85714D', [
    Pl('Dejounte Murray', '5', 'PG', 'c', 'blk', 'short', [86, 80, 72, 84, 80]),
    Pl('Trey Murphy III', '25', 'SG', 'a', 'brn', 'short', [84, 80, 90, 60, 70]),
    Pl('Herb Jones', '22', 'SF', 'c', 'blk', 'short', [84, 66, 66, 66, 92]),
    Pl('Zion Williamson', '1', 'PF', 'c', 'blk', 'short', [90, 88, 40, 76, 66]),
    Pl('Derik Queen', '0', 'C', 'c', 'blk', 'short', [72, 72, 60, 76, 68])
  ]),
  T('okc', 'Oklahoma City', 'Thunder', 'OKC', '#007AC1', '#EF3B24', [
    Pl('Shai Gilgeous-Alexander', '2', 'PG', 'c', 'blk', 'short', [94, 94, 84, 88, 84]),
    Pl('Jalen Williams', '8', 'SG', 'c', 'blk', 'short', [86, 86, 82, 80, 82]),
    Pl('Luguentz Dort', '5', 'SF', 'c', 'blk', 'short', [78, 66, 76, 52, 92], { beard: true }),
    Pl('Chet Holmgren', '7', 'PF', 'c', 'blk', 'short', [80, 82, 80, 62, 92]),
    Pl('Isaiah Hartenstein', '55', 'C', 'a', 'brn', 'short', [66, 66, 40, 78, 84])
  ]),
  T('phx', 'Phoenix', 'Suns', 'PHX', '#1D1160', '#E56020', [
    Pl('Devin Booker', '1', 'PG', 'c', 'blk', 'short', [86, 92, 88, 88, 60]),
    Pl('Jalen Green', '4', 'SG', 'c', 'blk', 'short', [90, 84, 86, 66, 56]),
    Pl('Dillon Brooks', '3', 'SF', 'c', 'blk', 'short', [78, 74, 76, 58, 84], { beard: true }),
    Pl('Royce ONeale', '00', 'PF', 'a', 'brn', 'short', [70, 62, 76, 64, 82], { beard: true }),
    Pl('Oso Ighodaro', '11', 'C', 'c', 'blk', 'short', [74, 66, 30, 56, 78])
  ]),
  T('por', 'Portland', 'Trail Blazers', 'POR', '#E03A3E', '#111111', [
    Pl('Damian Lillard', '0', 'PG', 'c', 'blk', 'short', [84, 90, 96, 86, 60]),
    Pl('Shaedon Sharpe', '17', 'SG', 'c', 'blk', 'short', [92, 80, 82, 60, 60]),
    Pl('Jerami Grant', '9', 'SF', 'c', 'blk', 'short', [80, 80, 82, 56, 70]),
    Pl('Deni Avdija', '8', 'PF', 'a', 'brn', 'short', [84, 78, 74, 80, 76]),
    Pl('Donovan Clingan', '23', 'C', 'c', 'blk', 'short', [60, 66, 10, 52, 86])
  ]),
  T('sac', 'Sacramento', 'Kings', 'SAC', '#5A2D81', '#63727A', [
    Pl('Russell Westbrook', '0', 'PG', 'c', 'blk', 'short', [90, 70, 56, 92, 66], { beard: true }),
    Pl('Zach LaVine', '8', 'SG', 'a', 'brn', 'short', [90, 86, 86, 68, 52]),
    Pl('DeMar DeRozan', '10', 'SF', 'c', 'blk', 'short', [76, 88, 62, 72, 64]),
    Pl('Keegan Murray', '13', 'PF', 'a', 'blo', 'short', [80, 82, 86, 52, 72]),
    Pl('Domantas Sabonis', '11', 'C', 'a', 'brn', 'short', [62, 84, 64, 92, 70], { beard: true })
  ]),
  T('sas', 'San Antonio', 'Spurs', 'SAS', '#3a3a3a', '#C4CED4', [
    Pl('DeAaron Fox', '4', 'PG', 'c', 'blk', 'short', [96, 84, 80, 86, 66]),
    Pl('Stephon Castle', '5', 'SG', 'c', 'blk', 'short', [86, 78, 72, 76, 86]),
    Pl('Devin Vassell', '24', 'SF', 'c', 'blk', 'short', [80, 80, 86, 60, 72]),
    Pl('Jeremy Sochan', '10', 'PF', 'a', 'brn', 'short', [80, 68, 60, 70, 80]),
    Pl('Victor Wembanyama', '1', 'C', 'c', 'blk', 'short', [78, 88, 86, 70, 98])
  ]),
  T('uta', 'Utah', 'Jazz', 'UTA', '#3E2680', '#F9A01B', [
    Pl('Keyonte George', '3', 'PG', 'c', 'blk', 'short', [84, 80, 82, 82, 56]),
    Pl('Isaiah Collier', '13', 'SG', 'c', 'blk', 'short', [86, 72, 66, 82, 60]),
    Pl('Lauri Markkanen', '23', 'SF', 'a', 'blo', 'short', [76, 90, 88, 60, 68]),
    Pl('Taylor Hendricks', '0', 'PF', 'c', 'blk', 'short', [84, 66, 66, 48, 70]),
    Pl('Walker Kessler', '24', 'C', 'c', 'blk', 'short', [64, 64, 10, 40, 90])
  ])
];

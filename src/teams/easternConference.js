// Conferencia Este (15 equipos). Plantillas aproximadas: edítalas libremente.

import { Pl, T } from './builders.js';

export const EAST = [
  T('atl', 'Atlanta', 'Hawks', 'ATL', '#E03A3E', '#C1D32F', [
    Pl('Trae Young', '11', 'PG', 'c', 'blk', 'short', [86, 88, 90, 95, 55]),
    Pl('Dyson Daniels', '5', 'SG', 'c', 'blk', 'short', [88, 66, 62, 76, 92]),
    Pl('Jalen Johnson', '1', 'SF', 'c', 'blk', 'short', [82, 76, 66, 80, 76]),
    Pl('Zaccharie Risacher', '10', 'PF', 'c', 'blk', 'short', [80, 74, 76, 58, 70]),
    Pl('Onyeka Okongwu', '17', 'C', 'c', 'blk', 'short', [76, 72, 50, 60, 82])
  ]),
  T('bkn', 'Brooklyn', 'Nets', 'BKN', '#1a1a1a', '#ffffff', [
    Pl('Egor Demin', '8', 'PG', 'a', 'brn', 'short', [80, 68, 70, 80, 60]),
    Pl('Cam Thomas', '24', 'SG', 'c', 'blk', 'short', [84, 86, 80, 60, 50]),
    Pl('Michael Porter Jr', '1', 'SF', 'c', 'blk', 'short', [80, 86, 86, 56, 60]),
    Pl('Terance Mann', '14', 'PF', 'c', 'blk', 'short', [80, 70, 72, 66, 78]),
    Pl('Nic Claxton', '33', 'C', 'c', 'blk', 'short', [82, 68, 20, 56, 86])
  ]),
  T('bos', 'Boston', 'Celtics', 'BOS', '#007A33', '#ffffff', [
    Pl('Derrick White', '9', 'PG', 'c', 'blk', 'bald', [82, 76, 82, 78, 86]),
    Pl('Payton Pritchard', '11', 'SG', 'a', 'blo', 'short', [84, 80, 88, 80, 62]),
    Pl('Jaylen Brown', '7', 'SF', 'c', 'blk', 'short', [88, 86, 80, 72, 82], { band: '#ffffff' }),
    Pl('Jayson Tatum', '0', 'PF', 'c', 'blk', 'short', [86, 92, 86, 78, 82]),
    Pl('Neemias Queta', '88', 'C', 'a', 'brn', 'short', [66, 66, 30, 56, 84], { beard: true })
  ]),
  T('cha', 'Charlotte', 'Hornets', 'CHA', '#00788C', '#1D1160', [
    Pl('LaMelo Ball', '1', 'PG', 'c', 'blk', 'short', [88, 84, 86, 94, 60]),
    Pl('Kon Knueppel', '7', 'SG', 'a', 'brn', 'short', [78, 82, 90, 66, 64]),
    Pl('Brandon Miller', '24', 'SF', 'c', 'blk', 'short', [84, 82, 80, 62, 68]),
    Pl('Miles Bridges', '0', 'PF', 'c', 'blk', 'short', [86, 78, 72, 62, 70]),
    Pl('Mark Williams', '5', 'C', 'c', 'blk', 'short', [70, 66, 30, 48, 86])
  ]),
  T('chi', 'Chicago', 'Bulls', 'CHI', '#CE1141', '#111111', [
    Pl('Josh Giddey', '3', 'PG', 'a', 'brn', 'short', [78, 74, 70, 90, 62]),
    Pl('Coby White', '0', 'SG', 'c', 'blk', 'short', [90, 82, 84, 72, 60]),
    Pl('Matas Buzelis', '14', 'SF', 'a', 'blo', 'short', [84, 76, 70, 64, 74]),
    Pl('Patrick Williams', '44', 'PF', 'c', 'blk', 'short', [80, 72, 72, 58, 78]),
    Pl('Nikola Vucevic', '9', 'C', 'a', 'brn', 'short', [58, 80, 74, 66, 66], { beard: true })
  ]),
  T('cle', 'Cleveland', 'Cavaliers', 'CLE', '#860038', '#FDBB30', [
    Pl('Darius Garland', '10', 'PG', 'c', 'blk', 'short', [90, 82, 84, 88, 54]),
    Pl('Donovan Mitchell', '45', 'SG', 'c', 'blk', 'short', [92, 90, 88, 78, 76]),
    Pl('Max Strus', '1', 'SF', 'a', 'brn', 'short', [74, 76, 86, 60, 68]),
    Pl('Evan Mobley', '4', 'PF', 'c', 'blk', 'short', [84, 72, 48, 66, 92]),
    Pl('Jarrett Allen', '31', 'C', 'c', 'blk', 'short', [66, 70, 20, 52, 88])
  ]),
  T('det', 'Detroit', 'Pistons', 'DET', '#C8102E', '#1D42BA', [
    Pl('Cade Cunningham', '2', 'PG', 'a', 'brn', 'short', [82, 86, 82, 88, 70]),
    Pl('Ausar Thompson', '9', 'SG', 'c', 'blk', 'short', [92, 62, 50, 72, 88]),
    Pl('Tobias Harris', '12', 'SF', 'c', 'blk', 'short', [72, 80, 78, 62, 66]),
    Pl('Isaiah Stewart', '28', 'PF', 'c', 'blk', 'bald', [70, 62, 52, 50, 82]),
    Pl('Jalen Duren', '0', 'C', 'c', 'blk', 'short', [82, 70, 10, 48, 84])
  ]),
  T('ind', 'Indiana', 'Pacers', 'IND', '#002D62', '#FDBB30', [
    Pl('Tyrese Haliburton', '0', 'PG', 'c', 'blk', 'short', [90, 86, 90, 98, 70]),
    Pl('Andrew Nembhard', '2', 'SG', 'c', 'blk', 'short', [82, 72, 74, 82, 76]),
    Pl('Aaron Nesmith', '23', 'SF', 'a', 'brn', 'short', [80, 74, 80, 56, 74]),
    Pl('Pascal Siakam', '43', 'PF', 'c', 'blk', 'short', [82, 82, 70, 72, 80]),
    Pl('Isaiah Jackson', '22', 'C', 'c', 'blk', 'short', [78, 60, 20, 40, 84])
  ]),
  T('mia', 'Miami', 'Heat', 'MIA', '#98002E', '#F9A01B', [
    Pl('Davion Mitchell', '45', 'PG', 'c', 'blk', 'short', [88, 68, 66, 78, 88]),
    Pl('Tyler Herro', '14', 'SG', 'a', 'brn', 'short', [82, 86, 88, 78, 64]),
    Pl('Norman Powell', '24', 'SF', 'c', 'blk', 'bald', [84, 84, 82, 64, 70]),
    Pl('Andrew Wiggins', '22', 'PF', 'c', 'blk', 'braids', [88, 78, 76, 58, 78]),
    Pl('Bam Adebayo', '13', 'C', 'c', 'blk', 'bald', [80, 80, 60, 76, 92])
  ]),
  T('mil', 'Milwaukee', 'Bucks', 'MIL', '#00471B', '#EEE1C6', [
    Pl('Ryan Rollins', '13', 'PG', 'c', 'blk', 'short', [88, 72, 70, 72, 70]),
    Pl('Gary Trent Jr', '7', 'SG', 'b', 'blk', 'short', [82, 78, 84, 62, 64]),
    Pl('Kyle Kuzma', '18', 'SF', 'c', 'blk', 'short', [78, 80, 78, 62, 66], { beard: true }),
    Pl('Bobby Portis', '9', 'PF', 'a', 'brn', 'short', [72, 78, 76, 56, 70], { beard: true }),
    Pl('Giannis Antetokounmpo', '34', 'C', 'c', 'blk', 'short', [90, 86, 50, 78, 94], { band: '#ffffff' })
  ]),
  T('nyk', 'New York', 'Knicks', 'NYK', '#006BB6', '#F58426', [
    Pl('Jalen Brunson', '11', 'PG', 'b', 'blk', 'short', [82, 90, 82, 84, 66]),
    Pl('Mikal Bridges', '25', 'SG', 'c', 'blk', 'short', [84, 80, 82, 66, 88]),
    Pl('OG Anunoby', '8', 'SF', 'c', 'blk', 'short', [84, 78, 80, 58, 90]),
    Pl('Josh Hart', '3', 'PF', 'a', 'brn', 'short', [78, 68, 66, 80, 82]),
    Pl('Karl-Anthony Towns', '32', 'C', 'b', 'blk', 'short', [70, 88, 86, 66, 66], { beard: true })
  ]),
  T('orl', 'Orlando', 'Magic', 'ORL', '#0077C0', '#C4CED4', [
    Pl('Jalen Suggs', '4', 'PG', 'c', 'blk', 'short', [88, 70, 74, 80, 92]),
    Pl('Desmond Bane', '3', 'SG', 'c', 'blk', 'short', [78, 86, 92, 70, 80]),
    Pl('Franz Wagner', '22', 'SF', 'a', 'brn', 'short', [82, 84, 78, 76, 74]),
    Pl('Paolo Banchero', '5', 'PF', 'c', 'blk', 'short', [76, 88, 76, 80, 76]),
    Pl('Wendell Carter Jr', '34', 'C', 'c', 'blk', 'short', [66, 74, 70, 60, 76])
  ]),
  T('phi', 'Philadelphia', '76ers', 'PHI', '#006BB6', '#ED174C', [
    Pl('Tyrese Maxey', '0', 'PG', 'c', 'blk', 'short', [95, 86, 88, 80, 66]),
    Pl('VJ Edgecombe', '77', 'SG', 'c', 'blk', 'short', [88, 76, 72, 66, 70]),
    Pl('Kelly Oubre Jr', '9', 'SF', 'c', 'blk', 'afro', [86, 70, 70, 50, 70]),
    Pl('Paul George', '8', 'PF', 'c', 'blk', 'short', [82, 86, 88, 70, 72]),
    Pl('Joel Embiid', '21', 'C', 'c', 'blk', 'short', [66, 92, 70, 70, 90])
  ]),
  T('tor', 'Toronto', 'Raptors', 'TOR', '#CE1141', '#111111', [
    Pl('Immanuel Quickley', '5', 'PG', 'c', 'blk', 'short', [90, 82, 86, 82, 60]),
    Pl('RJ Barrett', '9', 'SG', 'c', 'blk', 'short', [80, 82, 76, 64, 64]),
    Pl('Scottie Barnes', '4', 'SF', 'c', 'blk', 'short', [86, 80, 66, 86, 82]),
    Pl('Brandon Ingram', '14', 'PF', 'c', 'blk', 'short', [78, 86, 80, 70, 64]),
    Pl('Jakob Poeltl', '19', 'C', 'a', 'brn', 'short', [60, 60, 10, 50, 82])
  ]),
  T('was', 'Washington', 'Wizards', 'WAS', '#002B5C', '#E31837', [
    Pl('Jordan Poole', '13', 'PG', 'c', 'blk', 'short', [88, 82, 84, 76, 48]),
    Pl('CJ McCollum', '3', 'SG', 'c', 'blk', 'short', [82, 86, 88, 74, 60]),
    Pl('Bilal Coulibaly', '0', 'SF', 'c', 'blk', 'short', [88, 64, 62, 60, 86]),
    Pl('Kyshawn George', '18', 'PF', 'a', 'brn', 'short', [80, 72, 76, 66, 66]),
    Pl('Alex Sarr', '20', 'C', 'c', 'blk', 'short', [78, 70, 60, 56, 80])
  ])
];

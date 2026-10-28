// Times do Morro da Live - Volta Redonda / RJ
const TEAMS = [
  {
    id: 'palmeiras',
    name: 'Palmeiras',
    short: 'PAL',
    primary: '#006437',
    secondary: '#ffffff',
    accent: '#00ff88',
    initials: 'P',
    logo: 'assets/escudos/palmeiras.png'
  },
  {
    id: 'flamengo',
    name: 'Flamengo',
    short: 'FLA',
    primary: '#c41e3a',
    secondary: '#000000',
    accent: '#ff1744',
    initials: 'CRF',
    logo: 'assets/escudos/flamengo.png'
  },
  {
    id: 'saopaulo',
    name: 'São Paulo',
    short: 'SPFC',
    primary: '#ffffff',
    secondary: '#000000',
    accent: '#ff0000',
    initials: 'SPFC',
    logo: 'assets/escudos/saopaulo.png'
  },
  {
    id: 'cienciano',
    name: 'Cienciano',
    short: 'CIE',
    primary: '#003399',
    secondary: '#ffffff',
    accent: '#4fc3f7',
    initials: 'C',
    logo: 'assets/escudos/cienciano.png'
  },
  {
    id: 'independiente',
    name: 'Independiente',
    short: 'CAI',
    primary: '#e30613',
    secondary: '#ffffff',
    accent: '#ff5252',
    initials: 'C.A.I.',
    logo: 'assets/escudos/independiente.png'
  },
  {
    id: 'river',
    name: 'River Plate',
    short: 'CARP',
    primary: '#ffffff',
    secondary: '#e30613',
    accent: '#ff1744',
    initials: 'CARP',
    logo: 'assets/escudos/river.png'
  },
  {
    id: 'boca',
    name: 'Boca Juniors',
    short: 'CABJ',
    primary: '#0033a0',
    secondary: '#ffd700',
    accent: '#ffc107',
    initials: 'CABJ',
    logo: 'assets/escudos/boca.png'
  },
  {
    id: 'altamira',
    name: 'Altamira',
    short: 'AEC',
    primary: '#006400',
    secondary: '#ffffff',
    accent: '#00e676',
    initials: 'A.E.C.',
    logo: 'assets/escudos/altamira.png'
  }
];

// Mensagens fake de chat
const FAKE_CHAT = [
  { user: 'bia7772', text: 'kkkkkk', color: '#ff80ab' },
  { user: 'ju102', text: 'morro lotado 🔥', color: '#80d8ff' },
  { user: 'gui223', text: 'Palmeiras é o maior', color: '#00e676' },
  { user: 'nanda_oficial', text: 'Flamengo tá dominando', color: '#ff5252' },
  { user: 'caio_oficial4', text: 'Time 1', color: '#ffd740' },
  { user: 'blazinho6', text: 'Volta Redonda tá on fire', color: '#69f0ae' },
  { user: 'carol_rj3', text: 'baile de VR 🔥', color: '#ea80fc' },
  { user: 'marizinho35', text: 'sobe o morro!!!', color: '#82b1ff' },
  { user: 'vinizinho15', text: 'Cienciano presente', color: '#ffab40' },
  { user: 'lari_br4', text: 'baile top de Volta Redonda', color: '#f48fb1' },
  { user: 'neto_br1', text: 'MC Poze 🔥', color: '#80cbc4' },
  { user: 'rafa7772', text: 'quem tá ganhando?', color: '#ce93d8' },
  { user: 'manu103', text: 'Palmeiras 💚', color: '#00c853' },
  { user: 'dudu7739', text: 'Flamengo 🔴⚫', color: '#ff1744' },
  { user: 'gui_rj', text: 'dançando até o chão', color: '#ffd600' },
  { user: 'ze222', text: 'morro em festa - VR', color: '#40c4ff' },
  { user: 'pedrin223', text: 'bandeira no alto', color: '#ff6e40' },
  { user: 'bia_live', text: 'ao vivo do morro de Volta Redonda', color: '#b388ff' },
  { user: 'truco_vr', text: 'truco na mesa 🃏', color: '#ffd740' },
  { user: 'sinuca_boy', text: 'tacando na sinuca', color: '#69f0ae' }
];

const SECRET_CHAT = [
  { user: 'facção_01', text: 'VAMO MANO, AQUI É A FESTA!!!', color: '#ff1744' },
  { user: 'balla_vr', text: '🔥🔥🔥 BOLA NA CARA', color: '#ff5252' },
  { user: 'morro_secreto', text: '100 MIL NO MORRO PORRA', color: '#ffd600' },
  { user: 'tiro_de_bola', text: 'VAMO QUE VAMO', color: '#00e676' },
  { user: 'festa_louca', text: 'AQUI É VOLTA REDONDA CARAIO', color: '#ea80fc' },
  { user: 'escudo_up', text: 'todos os times juntos 🔥', color: '#40c4ff' }
];

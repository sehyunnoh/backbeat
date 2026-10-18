export interface Level {
  id: number;
  title: string;
  tagline: string;
  blurb: string;
}

export const levels: Level[] = [
  {
    id: 0,
    title: 'Getting Started',
    tagline: 'Know your kit, set it up, learn the words.',
    blurb:
      'Meet every pad on your TD-1DMK, find your way around the sound module, sit in a way that does not hurt, and learn how to count a beat.',
  },
  {
    id: 1,
    title: 'Grip & Wrist',
    tagline: 'Hold the sticks right. Let them bounce.',
    blurb:
      'Learn matched grip, where to strike, and how the wrist snap makes the stick rebound. This is the foundation for everything that comes later.',
  },
  {
    id: 2,
    title: 'Basic Rudiments',
    tagline: 'The ABCs of drumming.',
    blurb:
      'Single strokes, double strokes and paradiddles: the sticking patterns that every beat and fill is built from. Start slow, speed comes later.',
  },
  {
    id: 3,
    title: 'First Grooves',
    tagline: 'Hands and feet, together.',
    blurb:
      'Kick, snare and hi-hat all at once. Build your first rock beat one limb at a time, then add small kick changes and an open hi-hat.',
  },
  {
    id: 4,
    title: 'Fills & Transitions',
    tagline: 'Break the groove, land on the crash.',
    blurb:
      'A fill is a short break at the end of a phrase. Learn to start with a crash, play a snare fill and a tom fill, then glue groove and fill together.',
  },
  {
    id: 5,
    title: 'Faster & Fresher',
    tagline: 'Sixteenth notes and new grooves.',
    blurb:
      'Count four notes per beat, play a sixteenth-note hi-hat beat, and meet three new grooves: ride cymbal, half-time and four-on-the-floor.',
  },
  {
    id: 6,
    title: 'Groove Toolbox',
    tagline: 'Triplets, shuffle, ghost notes.',
    blurb:
      'Add the tools that make a beat feel alive: triplets and the shuffle, very quiet ghost notes, controlled dynamics and two more rudiments.',
  },
  {
    id: 7,
    title: 'Playing Real Music',
    tagline: 'From exercises to songs.',
    blurb:
      'How songs are built, how to learn one step by step, how to organise your practice, and what to explore next.',
  },
  {
    id: 8,
    title: 'Style Sampler',
    tagline: 'Funk, reggae, ballads and swing.',
    blurb:
      'Use what you know to play the basic groove of four different styles. A small taste of how far the same skills can take you.',
  },
  {
    id: 9,
    title: 'Reading Drum Music',
    tagline: 'Understand real sheet music.',
    blurb:
      'Learn note values, where each drum lives on the staff, and read simple grooves in standard notation. Every example shows the familiar chart next to the real staff.',
  },
];

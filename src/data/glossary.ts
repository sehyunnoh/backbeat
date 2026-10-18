export type GlossaryGroup = 'Kit' | 'Rhythm' | 'Technique';

export interface Term {
  term: string;
  group: GlossaryGroup;
  /** Plain-English meaning. */
  meaning: string;
}

export const glossary: Term[] = [
  // ---------- Kit ----------
  { group: 'Kit', term: 'Kick (bass drum)', meaning: 'The big, low drum you play with your right foot using the kick pedal. On your TD-1DMK it is a pad that the kick pedal hits.' },
  { group: 'Kit', term: 'Snare', meaning: 'The crisp, sharp drum right in front of you. Most beats put the snare on beats 2 and 4. The TD-1DMK snare is an 8" mesh pad.' },
  { group: 'Kit', term: 'Hi-hat', meaning: 'Two small cymbals on a stand that you open and close with a foot pedal. On the TD-1DMK it is one fixed pad plus a pedal that senses closed, half-open and open.' },
  { group: 'Kit', term: 'Tom', meaning: 'The medium drums above and beside the snare. Your kit has three: Tom 1 (highest), Tom 2 and Tom 3 (lowest). Mostly used for fills.' },
  { group: 'Kit', term: 'Crash', meaning: 'A cymbal for big accents, like the start of a new section or the end of a fill.' },
  { group: 'Kit', term: 'Ride', meaning: 'A cymbal for a steady, ringing pulse. A common alternative to the hi-hat for keeping time.' },
  { group: 'Kit', term: 'Throne', meaning: 'The drummer’s stool. Its height matters a lot for comfort and control.' },
  { group: 'Kit', term: 'Pad', meaning: 'The surface you hit on an electronic kit. It senses how hard you hit and tells the sound module.' },
  { group: 'Kit', term: 'Mesh head', meaning: 'A woven playing surface used on e-drum pads. It feels closer to a real drum and is quieter than rubber. The TD-1DMK is a "Double Mesh Kit".' },
  { group: 'Kit', term: 'Sound module', meaning: 'The "brain" of an electronic kit. It makes the sounds, and also has the metronome and practice (Coach) functions.' },

  // ---------- Rhythm ----------
  { group: 'Rhythm', term: 'Tempo', meaning: 'How fast the music goes.' },
  { group: 'Rhythm', term: 'BPM', meaning: 'Beats per minute: the number that measures tempo. 60 BPM is one beat every second; 120 BPM is two per second.' },
  { group: 'Rhythm', term: 'Beat (pulse)', meaning: 'The steady pulse you tap your foot to. A metronome click is one beat. Drummers also say "a beat" to mean a drum pattern (see Groove).' },
  { group: 'Rhythm', term: 'Measure (bar)', meaning: 'A small group of beats, separated from the next group by a bar line in written music. In 4/4 a measure has four beats.' },
  { group: 'Rhythm', term: 'Time signature', meaning: 'Two numbers at the start of the music. The top one says how many beats are in each measure; the bottom says which note gets one beat. 4/4 is the most common.' },
  { group: 'Rhythm', term: 'Quarter note', meaning: 'A note that lasts one beat in 4/4. Counted "1 2 3 4".' },
  { group: 'Rhythm', term: 'Eighth note', meaning: 'Half a beat. Two eighth notes fit in one beat. Counted "1 & 2 & 3 & 4 &".' },
  { group: 'Rhythm', term: 'Sixteenth note', meaning: 'A quarter of a beat. Four fit in one beat. Counted "1 e & a 2 e & a".' },
  { group: 'Rhythm', term: 'Rest', meaning: 'A moment of silence that still takes up time. You keep counting through it.' },
  { group: 'Rhythm', term: 'Subdivision', meaning: 'Splitting each beat into smaller equal parts (two, three or four). Counting subdivisions keeps your timing even.' },
  { group: 'Rhythm', term: 'Count', meaning: 'Saying the beats out loud ("1 & 2 & ...") while you play. It is the best timing tool you have.' },
  { group: 'Rhythm', term: 'Downbeat / upbeat', meaning: 'The downbeat is on the number ("1", "2"). The upbeat is the "&" between numbers.' },
  { group: 'Rhythm', term: 'Accent', meaning: 'A note played louder than the others to make it stand out. Shown in this site’s charts as a bigger symbol.' },
  { group: 'Rhythm', term: 'Dynamics', meaning: 'How loud or soft you play. Good drummers control it on purpose.' },
  { group: 'Rhythm', term: 'Backbeat', meaning: 'The snare hits on beats 2 and 4 of a 4/4 measure. It gives rock and pop their "clap along" feel.' },
  { group: 'Rhythm', term: 'Groove', meaning: 'A repeating drum pattern that makes people move. Your basic rock beat is a groove.' },
  { group: 'Rhythm', term: 'Fill', meaning: 'A short break from the groove, usually at the end of a phrase, often moving around the toms.' },
  { group: 'Rhythm', term: 'Ghost note', meaning: 'A very quiet note, usually on the snare, that adds texture between the main hits.' },

  // ---------- Technique ----------
  { group: 'Technique', term: 'Stroke', meaning: 'One hit with the stick, including how it is lifted and how it returns.' },
  { group: 'Technique', term: 'Rebound', meaning: 'The stick bouncing back up after it hits the pad. Learning to let it bounce instead of pushing it is the heart of good technique.' },
  { group: 'Technique', term: 'Fulcrum', meaning: 'The pivot point where your thumb and index finger hold the stick. The stick swings around it.' },
  { group: 'Technique', term: 'Matched grip', meaning: 'Holding both sticks the same way. It is the standard grip and the one this course uses.' },
  { group: 'Technique', term: 'Traditional grip', meaning: 'An older style where the left hand holds its stick differently, like a handshake with the stick in the web of the thumb. Common in jazz and marching. You do not need it now.' },
  { group: 'Technique', term: 'Wrist snap', meaning: 'A quick wrist movement that throws the stick at the pad and lets it bounce back, instead of pressing down with your arm.' },
  { group: 'Technique', term: 'Rudiment', meaning: 'A basic sticking pattern, like a drummer’s alphabet. Beats and fills are built from them.' },
  { group: 'Technique', term: 'Sticking', meaning: 'Which hand plays which note. Written as R (right) and L (left).' },
  { group: 'Technique', term: 'Lead hand', meaning: 'The hand that starts a pattern. Most people lead with their stronger hand.' },
  { group: 'Technique', term: 'Weak hand', meaning: 'Your non-dominant hand. It is usually less even at first, so it needs a little extra practice.' },
  { group: 'Technique', term: 'Single stroke roll', meaning: 'Alternating hands, one hit each: R L R L R L R L.' },
  { group: 'Technique', term: 'Double stroke roll', meaning: 'Two hits per hand, then switch: R R L L R R L L.' },
  { group: 'Technique', term: 'Paradiddle', meaning: 'A four-note pattern, R L R R L R L L, that changes which hand leads.' },
  { group: 'Technique', term: 'Open / closed hi-hat', meaning: 'Closed: pedal pressed, short tight "tss". Open: pedal released, longer sizzling sound.' },
  { group: 'Technique', term: 'Practice pad', meaning: 'A small quiet pad for working on stick technique. Your snare pad on the TD-1DMK can serve as one with the sound turned down.' },
];

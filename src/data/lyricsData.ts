export interface LyricLine {
  time: number; // Start time in seconds
  text: string;
}

export const LYRICS_DATABASE: Record<string, LyricLine[]> = {
  // Every Summertime (NIKI)
  '68HocO7fx9z0MgDU0ZPHro': [
    { time: 0, text: "🎵 (Intro)" },
    { time: 14, text: "28 degrees of warm in our town" },
    { time: 18, text: "No cloud in sight, pink sunshine" },
    { time: 21, text: "Our edges soften, we're all-around" },
    { time: 25, text: "Baby, you're the one that I've been waiting for" },
    { time: 28, text: "Baby, I'd go anywhere with you" },
    { time: 32, text: "Baby, I'd go anywhere you want me to" },
    { time: 35, text: "Baby, I'd do anything for you" },
    { time: 39, text: "Oh, every summertime with you" },
    { time: 43, text: "🎵 (Instrumental)" },
    { time: 50, text: "Hey, there's a couple things I know now" },
    { time: 54, text: "Hey, there's a couple things I think I've figured out" },
    { time: 57, text: "Like you don't build a house out of sand" },
    { time: 61, text: "And you don't tell your mother when you hold a hand" }
  ],
  // Autumn (NIKI)
  '0W5o1Kxw1VlohSajPqeBMF': [
    { time: 0, text: "🎵 (Intro)" },
    { time: 15, text: "I carved my name into your ribcage" },
    { time: 20, text: "We talked of lands away from this cage" },
    { time: 24, text: "You said, \"Don't fret, love" },
    { time: 27, text: "Someday I'll be my own man, I'll be free\"" },
    { time: 31, text: "Oh, but darling, did you mean" },
    { time: 35, text: "Darling, did you mean free from me?" },
    { time: 39, text: "You promised home" },
    { time: 43, text: "The kind I'd never known" },
    { time: 47, text: "But here we are, skin and flesh and beating hearts" },
    { time: 51, text: "And I'm wondering what the hell I'm doing wrong" }
  ],
  // Take a Chance with Me (NIKI)
  '21acb66djKRlDPJOXRBCkc': [
    { time: 0, text: "🎵 (Intro)" },
    { time: 8, text: "His laugh you'd die for, his laugh you'd die for" },
    { time: 11, text: "The kind that colors the sky" },
    { time: 14, text: "Heart intangible, slips away faster" },
    { time: 17, text: "Than dandelion fluff in the sunlight" },
    { time: 21, text: "And he's got swirls of passion in his eyes" },
    { time: 24, text: "Uncovering the dreams he dreams at night" },
    { time: 27, text: "As much and hard as he tries to hide" },
    { time: 30, text: "I can see right through" },
    { time: 34, text: "His voice you'd melt for" },
    { time: 38, text: "He says my name like I'd fade away somehow if he's too loud" },
    { time: 42, text: "What I would give for me to get my feet back on the ground" },
    { time: 46, text: "Head off the clouds" },
    { time: 50, text: "Oh, why can't we for once, say what we want, say what we feel?" },
    { time: 54, text: "Why can't you disregard the world and run to what is real?" }
  ],
  // Autumn Reimagined (Ben&Ben)
  '4jKfiwrpklbqDOrwiUBsLv': [
    { time: 0, text: "🎵 (Intro)" },
    { time: 15, text: "I carved my name into your ribcage" },
    { time: 20, text: "We talked of lands away from this cage" },
    { time: 24, text: "You said, \"Don't fret, love" },
    { time: 27, text: "Someday I'll be my own man, I'll be free\"" },
    { time: 31, text: "Oh, but darling, did you mean" },
    { time: 35, text: "Darling, did you mean free from me?" }
  ],
  // Lifetime Reimagined (Ben&Ben)
  '2c5JKO8gPaOFVxQ0elwXEG': [
    { time: 0, text: "🎵 (Piano Intro)" },
    { time: 12, text: "Paper planes and porcelain" },
    { time: 16, text: "Smell of rain through the window pane" },
    { time: 20, text: "And the sight of you" },
    { time: 24, text: "Oh, you were a good dream" },
    { time: 28, text: "I was scared to lose you then" },
    { time: 32, text: "But secrets turn into regrets" },
    { time: 36, text: "Buried feelings grow" },
    { time: 40, text: "Oh, you were a good dream" },
    { time: 44, text: "Was there a lifetime waiting for us" },
    { time: 48, text: "In a world where I was yours?" },
    { time: 52, text: "Was it the wrong time, what if we tried" },
    { time: 56, text: "Giving in a little more?" },
    { time: 60, text: "To the warmth we had before" }
  ]
};

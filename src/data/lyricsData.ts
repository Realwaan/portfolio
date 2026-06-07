export interface LyricLine {
  time: number; // Start time in seconds
  text: string;
}

export const LYRICS_DATABASE: Record<string, LyricLine[]> = {
  // Every Summertime (NIKI)
  '68HocO7fx9z0MgDU0ZPHro': [
    { time: 0, text: "🎵 (Intro)" },
    { time: 13, text: "Eighteen, we were undergrads" },
    { time: 15.6, text: "Stayed out late, never made it to class, uh" },
    { time: 19.2, text: "Outer Richmond in a taxi cab" },
    { time: 21.7, text: "You were sweatin' bullets on the way to my dad's" },
    { time: 28.8, text: "And oh, you said, \"Baby, think we're movin' too fast!\"" },
    { time: 37.5, text: "And I swear the magnolias flashed a smile" },
    { time: 48.4, text: "And that's when I caught me" },
    { time: 51.8, text: "Hopin' you'd stay a while" },
    { time: 61.3, text: "Baby, I'd give up anything to travel inside your mind" },
    { time: 67.4, text: "Baby, I fall in love again come every summertime" },
    { time: 73.3, text: "My daddy taught me to choose 'em wisely but you don't have to try" },
    { time: 79.4, text: "'Cause, baby, I fall in love every summertime" },
    { time: 86, text: "Twenty-five, man, we're missin' church" },
    { time: 88.5, text: "Laugh 'bout everyone we're hatin' at work" },
    { time: 91.6, text: "Dinner with your sister and the jokes kinda hurt" },
    { time: 94.5, text: "Cry all the way home and you're puttin' me first, oh" },
    { time: 101.2, text: "Yeah, you just always know what to say" },
    { time: 110.3, text: "We're strolling down the boulevard" },
    { time: 114.3, text: "And dancing under streetlights, oh, yeah" },
    { time: 122.8, text: "Every year we get older and I'm still on your side" },
    { time: 134.2, text: "Baby, I'd give up anything to travel inside your mind" },
    { time: 140.3, text: "Baby, I fall in love again come every summertime" },
    { time: 146.2, text: "My daddy taught me to choose 'em wisely but you don't have to try" },
    { time: 152.2, text: "'Cause, baby, I fall in love every summertime" },
    { time: 158, text: "Every day is summertime" },
    { time: 161, text: "Every day is summertime" },
    { time: 164, text: "Every day is summertime with you" },
    { time: 170, text: "Every day is summertime" },
    { time: 173, text: "Every day is summertime" },
    { time: 176, text: "Every day is summertime with you" }
  ],
  // Autumn (NIKI) - Shifted earlier by 2.5s to fix late timing
  '0W5o1Kxw1VlohSajPqeBMF': [
    { time: 0, text: "🎵 (Intro)" },
    { time: 13, text: "I carved my name into your ribcage" },
    { time: 16.8, text: "We talked of lands away from this cage" },
    { time: 20.7, text: "You said, \"Don't fret, love" },
    { time: 24, text: "Someday I'll be my own man, I'll be free\"" },
    { time: 28, text: "Oh, but darling, did you mean" },
    { time: 31.5, text: "Darling, did you mean free from me?" },
    { time: 36.5, text: "You promised home" },
    { time: 40.5, text: "The kind I'd never known" },
    { time: 44.3, text: "But here we are, skin and flesh and beating hearts" },
    { time: 48.7, text: "And I'm wondering what the hell I'm doing wrong" }
  ],
  // Take a Chance with Me (NIKI)
  '21acb66djKRlDPJOXRBCkc': [
    { time: 0, text: "🎵 (Intro)" },
    { time: 8, text: "His laugh you'd die for, his laugh you'd die for" },
    { time: 11, text: "The kind that colors the sky" },
    { time: 14, text: "Heart intangible, slips away faster" },
    { time: 17, text: "Uncovering the dreams he dreams at night" },
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
  // Autumn Reimagined (Ben&Ben) - Shifted earlier by 2.5s to fix late timing
  '4jKfiwrpklbqDOrwiUBsLv': [
    { time: 0, text: "🎵 (Intro)" },
    { time: 13, text: "I carved my name into your ribcage" },
    { time: 16.8, text: "We talked of lands away from this cage" },
    { time: 20.7, text: "You said, \"Don't fret, love" },
    { time: 24, text: "Someday I'll be my own man, I'll be free\"" },
    { time: 28, text: "Oh, but darling, did you mean" },
    { time: 31.5, text: "Darling, did you mean free from me?" }
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

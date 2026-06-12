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
  // Autumn (NIKI) - Aligned to album track audio timing
  '0W5o1Kxw1VlohSajPqeBMF': [
    { time: 0, text: "🎵 (Intro)" },
    { time: 1.7, text: "I carved my name into your ribcage" },
    { time: 11.6, text: "We talked of lands away from this cage" },
    { time: 21.0, text: "You said, \"Don't fret, love" },
    { time: 24.0, text: "Someday I'll be my own man, I'll be free\"" },
    { time: 30.0, text: "Oh, but darling, did you mean" },
    { time: 33.1, text: "Darling, did you mean free from me?" },
    { time: 42.6, text: "You promised home" },
    { time: 45.6, text: "The kind I'd never known" },
    { time: 51.3, text: "But here we are, skin and flesh and beating hearts" },
    { time: 55.1, text: "And I'm wondering what the hell I'm doing wrong" }
  ],
  // Take a Chance with Me (NIKI) - Aligned to official track audio timing
  '21acb66djKRlDPJOXRBCkc': [
    { time: 0, text: "🎵 (Intro)" },
    { time: 16.5, text: "His laugh you'd die for, his laugh you'd die for" },
    { time: 19.5, text: "The kind that colors the sky" },
    { time: 22.9, text: "Heart intangible, slips away faster" },
    { time: 26.0, text: "Than dandelion fluff in the sunlight" },
    { time: 36.6, text: "And he's got swirls of passion in his eyes" },
    { time: 42.0, text: "Uncovering the dreams he dreams at night" },
    { time: 47.0, text: "As much and hard as he tries to hide" },
    { time: 50.2, text: "I can see right through" },
    { time: 57.4, text: "His voice you'd melt for, he says my name like" },
    { time: 62.2, text: "I'd fade away somehow if he's too loud" },
    { time: 66.0, text: "What I would give for me to get my feet back on the ground" },
    { time: 70.0, text: "Head off the clouds" },
    { time: 76.4, text: "I laugh at how we're polar opposites" },
    { time: 80.6, text: "I read him like a book and he's a clueless little kid" },
    { time: 87.1, text: "Doesn't know that I'd stop time and space" },
    { time: 91.1, text: "Just to make him smile" },
    { time: 93.5, text: "Make him smile" },
    { time: 97.8, text: "Oh, why can't we for once, say what we want, say what we feel?" },
    { time: 101.5, text: "Why can't you disregard the world and run to what is real?" }
  ],
  // Autumn Reimagined (Ben&Ben) - Aligned to NIKI's Autumn lyrics and timing
  '4jKfiwrpklbqDOrwiUBsLv': [
    { time: 0, text: "🎵 (Intro)" },
    { time: 1.7, text: "I carved my name into your ribcage" },
    { time: 11.6, text: "We talked of lands away from this cage" },
    { time: 21.0, text: "You said, \"Don't fret, love" },
    { time: 24.0, text: "Someday I'll be my own man, I'll be free\"" },
    { time: 30.0, text: "Oh, but darling, did you mean" },
    { time: 33.1, text: "Darling, did you mean free from me?" },
    { time: 42.6, text: "You promised home" },
    { time: 45.6, text: "The kind I'd never known" },
    { time: 51.3, text: "But here we are, skin and flesh and beating hearts" },
    { time: 55.1, text: "And I'm wondering what the hell I'm doing wrong" }
  ],
  // Lifetime Reimagined (Ben&Ben) - Aligned to official track audio timing
  '2c5JKO8gPaOFVxQ0elwXEG': [
    { time: 0, text: "🎵 (Piano Intro)" },
    { time: 12.7, text: "Was there a lifetime waiting for us" },
    { time: 16.5, text: "In a world where I was yours?" },
    { time: 21.9, text: "Paper planes and porcelain" },
    { time: 26.5, text: "Smell of rain through the window pane" },
    { time: 31.6, text: "And the sight of you" },
    { time: 34.7, text: "Oh, you were a good dream" },
    { time: 39.1, text: "I was scared to lose you then" },
    { time: 44.1, text: "But secrets turn into regrets" },
    { time: 49.2, text: "Buried feelings grow" },
    { time: 52.2, text: "Oh, you were a good dream" },
    { time: 57.3, text: "Was there a lifetime waiting for us" },
    { time: 61.3, text: "In a world where I was yours?" },
    { time: 67.6, text: "Was it the wrong time, what if we tried" },
    { time: 71.1, text: "Giving in a little more?" },
    { time: 75.3, text: "To the warmth we had before" }
  ]
};

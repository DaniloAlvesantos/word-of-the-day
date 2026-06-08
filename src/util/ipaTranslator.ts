import { dictionary } from "cmu-pronouncing-dictionary";

const arpabetToIpa: Record<string, string> = {
  AA: "ɑ",
  AE: "æ",
  AH: "ʌ",
  AO: "ɔ",
  AW: "aʊ",
  AY: "aɪ",
  EH: "ɛ",
  ER: "ɜr",
  EY: "eɪ",
  IH: "ɪ",
  IY: "i",
  OW: "oʊ",
  OY: "ɔɪ",
  UH: "ʊ",
  UW: "u",
  B: "b",
  CH: "tʃ",
  D: "d",
  DH: "ð",
  F: "f",
  G: "ɡ",
  HH: "h",
  JH: "dʒ",
  K: "k",
  L: "l",
  M: "m",
  N: "n",
  NG: "ŋ",
  P: "p",
  R: "r",
  S: "s",
  SH: "ʃ",
  T: "t",
  TH: "θ",
  V: "v",
  W: "w",
  Y: "j",
  Z: "z",
  ZH: "ʒ",
};

export const translateToIpa = (text: string): string => {
  if (!text) return "";

  const words = text.toLowerCase().trim().split(/\s+/);
  const cmuDict = dictionary as Record<string, string>;

  const translatedWords = words.map((word) => {
    const cleanWord = word.replace(
      /^[.,\/#!$%\^&\*;:{}=\-_`~()]+|[.,\/#!$%\^&\*;:{}=\-_`~()]+$/g,
      "",
    );

    const arpabetString = cmuDict[cleanWord];

    if (!arpabetString) {
      return `[${word}]`;
    }

    const phonemes = arpabetString.split(" ");

    const ipaPhonemes = phonemes.map((phoneme) => {
      const basePhoneme = phoneme.replace(/[0-9]/g, "");
      const isPrimaryStress = phoneme.endsWith("1");

      const ipaSymbol = arpabetToIpa[basePhoneme] || "";
      return isPrimaryStress ? `ˈ${ipaSymbol}` : ipaSymbol;
    });

    return ipaPhonemes.join("");
  });

  return `/${translatedWords.join(" ")}/`;
}

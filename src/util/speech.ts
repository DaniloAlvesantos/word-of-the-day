export const Speech = (text: string, time: number) => {
  if (typeof window !== "undefined") {
    const synth = window.speechSynthesis;

    const speak = () => {
      const utterThis = new SpeechSynthesisUtterance(text);

      const voices = synth.getVoices();
      const preferredVoice =
        voices.find(
          (v) => v.lang.startsWith("en") && v.name.includes("Google"),
        ) || voices.find((v) => v.lang.startsWith("en"));

      if (preferredVoice) utterThis.voice = preferredVoice;

      utterThis.lang = "en-US";

      utterThis.rate = time % 2 !== 0 ? 0.9 : 0.7;
      utterThis.pitch = 1;

      synth.cancel();
      synth.speak(utterThis);
    };

    if (synth.getVoices().length !== 0) {
      speak();
    } else {
      synth.onvoiceschanged = speak;
    }
  }
};

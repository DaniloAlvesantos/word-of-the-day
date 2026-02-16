export const Speech = (text: string, time: number) => {
    if (typeof window !== "undefined") {
        const synth = window.speechSynthesis;
        const utterThis = new SpeechSynthesisUtterance(text);
        
        utterThis.rate = time % 2 !== 0 ? 0.8 : 0.6; 
        
        utterThis.pitch = 1; 

        synth.cancel(); 
        
        synth.speak(utterThis);
    }
}
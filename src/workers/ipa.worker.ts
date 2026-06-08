import { translateToIpa } from "@/util/ipaTranslator";

self.addEventListener("message", (event: MessageEvent<string>) => {
  const text = event.data;
  const ipaResult = translateToIpa(text);
  self.postMessage(ipaResult);
});

interface HighlightProps {
  text: string;
  wordToHighlight: string;
}

export const Highlight = ({ wordToHighlight, text }: HighlightProps) => {
  const regex = new RegExp(`(${wordToHighlight})`, "gi");
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((d) =>
        d.toLocaleLowerCase() === wordToHighlight.toLowerCase() ? (
          <u key={crypto.randomUUID()} className="font-semibold">{d}</u>
        ) : (
          d
        ),
      )}
    </span>
  );
};

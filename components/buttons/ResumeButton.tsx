import LinkButton from "./LinkButton";

export default function ResumeButton() {
  return (
    <div className="w-full flex justify-center p-5">
      <LinkButton
        fullWidth
        newWindow
        text={"Download résumé (PDF, 77kb)"}
        link="/Badaczewski_Résumé.pdf"
        variant="secondary"
      />
    </div>
  );
}

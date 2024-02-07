import LinkButton from "./LinkButton";

export default function ResumeButton() {
  return (
    <div className="w-full flex justify-center p-5">
      <LinkButton
        fullWidth
        newWindow
        text={"Download résumé (PDF, 79kb)"}
        link="/Badaczewski_CV.pdf"
        variant="secondary"
      />
    </div>
  );
}

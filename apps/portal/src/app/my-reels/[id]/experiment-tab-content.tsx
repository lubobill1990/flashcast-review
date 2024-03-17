import { Experiment, Sample } from "@prisma/client";
import { Textarea } from "@fluentui/react-components";

export const ExperimentTabContent: React.FC<{ sample: Sample }> = ({
  sample,
}) => {
  const data = sample.data as any;
  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="font-bold">Recording</div>
      <video src={data.recording} controls className="max-h-80"></video>
      <div className="font-bold">Transcription</div>
      <a href={data.transcription} className="underline">
        Transcription.docx
      </a>
      <div className="font-bold">AI Notes</div>
      <Textarea value={data.notes} className="w-full"></Textarea>
    </div>
  );
};

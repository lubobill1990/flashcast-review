"use client";

import { useRouter } from "next/navigation";
import { submit } from "./actions";
import Branding from "../branding";
import {
  MainPageCard,
  Textarea,
  Label,
  Field,
  Button,
  Divider,
} from "portal-ui";

export default function Page() {
  const router = useRouter();

  const handleSubmit = (formData: FormData) => {
    submit(formData).then(id => router.push(`/my-reels/${id}`));
  };

  return (
    <>
      <Branding />
      <MainPageCard activePage="start_generating">
        <Label style={{ fontSize: "16px" }}>
          Upload recording file, transcript and AI notes from Meeting recap to
          generate short clips that capture the key meeting moments and
          summaries.
        </Label>
        <form action={handleSubmit} style={{ marginTop: "16px" }}>
          <Field
            required
            label={<Label weight="semibold">Recording</Label>}
            hint="Upload the recording file from your device. Supporting file type: .mp4 and .mov files"
          >
            <input id="recording-input" type="file" name="recording" />
          </Field>
          <Divider style={{ margin: "16px 0" }} />
          <Field
            required
            label={<Label weight="semibold">Transcription</Label>}
            hint="Go to Meeting Recap and click on “Download” under Transcript. Supporting file type: .docx file."
          >
            <input id="transcription-input" type="file" name="transcription" />
          </Field>
          <Divider style={{ margin: "16px 0" }} />
          <Field
            required
            label={<Label weight="semibold">AI notes</Label>}
            hint="Go to Meeting Recap and click on “Copy all” under AI notes. Paste in the full AI notes below."
          >
            <Textarea id="notes-input" name="notes" />
          </Field>
          <div style={{ display: "flex", justifyContent: "right" }}>
            <Button
              appearance="primary"
              type="submit"
              style={{
                background:
                  "linear-gradient(99.14deg, #499DFF -17.23%, #5E64FF 41.03%, #E64EFF 150.75%)",
              }}
            >
              Start generating reels
            </Button>
          </div>
        </form>
      </MainPageCard>
    </>
  );
}

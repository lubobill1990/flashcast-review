'use client';

import { useRouter } from "next/navigation";
import { submit } from './actions';

export default function Page() {
  const router = useRouter();
  const handleSubmit = (formData: FormData) => {
    submit(formData).then(sample => sample?.id && router.push(`/sample/${sample.id}`));
  }

  return (
    <div>
      <h1>Create a sample</h1>
      <form action={handleSubmit}>
        <label htmlFor='recording-input'>Upload the video recording</label>
          {/* <input type='file' name="recording" /> */}
        <input id='recording-input' type='file' name="recording" />
        <br />
        <label htmlFor='transcription-input'>Upload the transcription</label>
        <input id='transcription-input' type='file' name="transcription" />
        <br />
        <label htmlFor='notes-input'>AI Note</label>
        <textarea id='notes-input' name="notes" />
        <br />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

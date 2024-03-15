'use client';

import { useRouter } from 'next/navigation';
import { submit } from './actions';
import Branding from '../branding';
import Link from 'next/link';
import { Card } from 'portal-ui';

export default function Page() {
  const router = useRouter();

  const handleSubmit = (formData: FormData) => {
    submit(formData).then((id) => router.push(`/my-reels/${id}`));
  };

  return (
    <>
      <Branding />
      <Card>
        <nav>
          <Link href='/start-generating' className='active-nav-link'>
            Start generating
          </Link>
          <Link href='/my-reels'>My reels</Link>
        </nav>
        <form action={handleSubmit}>
          <label htmlFor='recording-input'>Upload the video recording</label>
          {/* <input type='file' name="recording" /> */}
          <input id='recording-input' type='file' name='recording' />
          <br />
          <label htmlFor='transcription-input'>Upload the transcription</label>
          <input id='transcription-input' type='file' name='transcription' />
          <br />
          <label htmlFor='notes-input'>AI Note</label>
          <textarea id='notes-input' name='notes' />
          <br />
          <button type='submit'>Create</button>
        </form>
      </Card>
    </>
  );
}

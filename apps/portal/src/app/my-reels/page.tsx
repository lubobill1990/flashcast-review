import Link from 'next/link';
import Branding from '../branding';
import factory from '@/factory';
import { MainPageCard, ReelsCollection } from 'portal-ui';

type ClipData = {
  clipUrl?: string;
  thumnailUrl?: string;
} | undefined;

export default async function Page() {
  const user = await factory.userService.getUser();
  const sampleOutputs = await factory.sampleOutputService.getSampleOutputsByUserId(user.id);

  return (
    <>
      <Branding />
      <MainPageCard activePage='my_reels'>
        {
          sampleOutputs
          ? <ul>
              {sampleOutputs.map((sampleOutput) =>
                <li key={sampleOutput.id}>
                  <ReelsCollection
                    status={sampleOutput.status}
                    clipThumnails={sampleOutput.clips.map(clip => (clip.data as ClipData)?.thumnailUrl || '')}
                    createdDate={sampleOutput.createdAt.toLocaleString()}
                    url={`/my-reels/${sampleOutput.id}`}
                  />
                </li>
              )}
              {/* {sampleOutputs.map((v) =>
                <li key={v.id}>
                  <Link href={`/my-reels/${v.id}`}>{v.id}</Link>
                </li>
              )} */}
            </ul>
          : <p>No reels</p>
        }
      </MainPageCard>
    </>
  );
}

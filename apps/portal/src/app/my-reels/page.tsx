import Link from 'next/link';
import Branding from '../branding';
import factory from '@/factory';

export default async function Page() {
  const user = await factory.userService.getUser();
  const sampleOutputs = await factory.sampleOutputService.getSampleOutputsByUserId(user.id);

  return (
    <div>
      <Branding />
      <nav>
        <Link href='/start-generating'>Start generating</Link>
        <Link href='/my-reels'>My reels</Link>
      </nav>
      {
        sampleOutputs
          ? (
            <ul>
              {sampleOutputs.map((v) =>
                <li key={v.id}>
                  <Link href={`/my-reels/${v.id}`}>{v.id}</Link>
                </li>
              )}
            </ul>
          )
          : <p>No reels</p>
      }
      
    </div>
  );
}

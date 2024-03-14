import { redirect } from "next/navigation";

export default function Home() {
  redirect('/start-generating');
  // return (
  //   <main className='flex flex-col items-center justify-between p-24'>
  //     The main page
  //   </main>
  // );
}

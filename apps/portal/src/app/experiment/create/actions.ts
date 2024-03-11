'use server';

import { getServerSession } from 'next-auth';

export async function submit(_currentState: unknown, formData: FormData) {
  const session = await getServerSession();
  console.log({
    session,
    _currentState,
    name: formData.get('name'),
    description: formData.get('description'),
    parameters: formData.get('parameters'),
  });

  return {
    id: 123,
    errors: {},
  };
}

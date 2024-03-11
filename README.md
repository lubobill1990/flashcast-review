This is the web app for reviewing the flash cast generated video clips.

The repo contains the frontend and backend in pnpm monorepo style.

The frontend is built with:

1. Next.js as the overall framework
2. Tailwind CSS for fast styling
3. Radix UI for UI components
4. NextAuth for authentication

The backend is built with:

1. Postgres as the database
2. Prisma as the ORM
3. Next.js API routes + server action for the backend
4. NextAuth for authentication

## Getting Started

### Install depdencies

Ensure you have:

1. node >= 18.0.0.
2. pnpm >= 8.15.0. If not, install it with:

```bash
npm install -g pnpm
```

Go to the project root:

```bash
pnpm install
```

Install docker and docker-compose. In Windows, you install Docker Desktop and run docker in WSL2.

After installing docker, run the following command to start the database:

```bash
pnpm docker:up
```

### Setup environment variables

Create a `.env.local` file in the root of the project and add the following environment variables:

```bash
AZURE_AD_TENANT_ID="To get it from Bo"
AZURE_AD_CLIENT_ID="To get it from Bo"
AZURE_AD_CLIENT_SECRET="To get it from Bo"
NEXTAUTH_SECRET="some random string"
NEXTAUTH_URL="http://localhost:3000"
```

### Database setup

Run the following command to create the database, run the migrations, and generate typings:

```bash
pnpm db:deploy
pnpm db:genearte
```

### Start the development server

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Need to know for coding

### Auth

In client component, you can use `useSession` hook to get the session object. The session object contains the user information:

```ts
import { useSession } from 'next-auth/react';

const { data: session, status } = useSession();
```

In server component or API route, you can use `getServerSession` function to get the session object:

```ts
import { getServerSession } from 'next-auth';

const session = await getServerSession();
```

### Submit data to server

You could use fetch + API route to submit data to server:

```ts
const response = await fetch('/api/submit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ data: 'some data' }),
});
```

But, a more convenient way is to use `useFormState` and `useFormStatus` hook + server action:

In server action:

```ts
'use server';

import { getServerSession } from 'next-auth';

export async function submit(_currentState: unknown, formData: FormData) {
  const session = await getServerSession();

  return { data: 'some data to return back to client', errors: [] };
}
```

In client component:

```ts
const [resp, dispatch] = useFormState(submit, undefined);
// resp.data is the data returned from server action
// resp.errors is the errors returned from server action
const status = useFormStatus();
// status.status is the status of the form, you can render a spinner or error message based on it
```

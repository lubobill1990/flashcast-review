'use client';

import { Text, Button } from '@radix-ui/themes';
import { makeAutoObservable } from 'mobx';
import { useMemo } from 'react';
import { useFormState } from 'react-dom';
import { submit } from './actions';
import { observer } from 'mobx-react-lite';
class Experiment {
  name: string = '';
  description: string = '';
  parameters: any = {};

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setName(name: string) {
    this.name = name;
  }

  setDescription(description: string) {
    this.description = description;
  }

  setParameters(parameters: any) {
    this.parameters = parameters;
  }
}

const Page = observer(() => {
  const expModel = useMemo(() => new Experiment(), []);
  const [resp, dispatch] = useFormState(submit, undefined);

  return (
    <div>
      <h1>Create an experiment</h1>

      <form action={dispatch} className='flex flex-col gap-3'>
        <Text as='label'>
          Name
          <input
            type='text'
            name='name'
            value={expModel.name}
            onChange={(e) => expModel.setName(e.target.value)}
          />
        </Text>
        <Text as='label'>
          Description
          <textarea
            name='description'
            value={expModel.description}
            onChange={(e) => expModel.setDescription(e.target.value)}
          />
        </Text>
        <Text as='label'>
          Parameters
          <textarea />
        </Text>
        <Button>Submit</Button>
      </form>
    </div>
  );
});

export default Page;

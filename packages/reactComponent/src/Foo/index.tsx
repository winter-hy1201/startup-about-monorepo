import { add } from '@startup-about-monorepo/utils';
import React, { type FC } from 'react';

const Foo: FC<{ title: string }> = (props) => (
  <div className="flex">
    <div> {props.title}</div>

    <div>{props.title}</div>

    <div>{props.title}</div>

    <div>{add(1, 2)}</div>
  </div>
);

export default Foo;

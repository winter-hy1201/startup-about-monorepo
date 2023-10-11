# 利用 useState 特性 强制组件重新渲染

```jsx
import React from 'react';
import { useUpdate } from 'ahooks';

export default () => {
  const update = useUpdate();

  return (
    <>
      <div>Time: {Date.now()}</div>
      <button type="button" onClick={update} style={{ marginTop: 8 }}>
        update
      </button>
    </>
  );
};
```

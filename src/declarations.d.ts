declare module '*.po' {
  const messages: Record<string, CompiledMessage>
  // export default messages;
}

declare module '*.svg?react' {
  import * as React from 'react'

  const ReactComponent: React.FunctionComponent<React.ComponentProps<'svg'> & { title?: string }>

  export default ReactComponent
}

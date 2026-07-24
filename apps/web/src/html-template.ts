import type { DehydratedState } from '@tanstack/react-query'

// Compose the full HTML document around the server-rendered app markup. The
// dehydrated query cache is inlined so the client entry can rehydrate it; `<`
// is escaped so a `</script>` in the data can't break out of the tag.
export function renderDocument(input: {
  appHtml: string
  dehydratedState: DehydratedState
  clientScript: string
  title?: string
}): string {
  const serialized = JSON.stringify(input.dehydratedState).replace(/</g, '\\u003c')
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${input.title ?? 'Kotodama'}</title>
</head>
<body>
<div id="root">${input.appHtml}</div>
<script>window.__DEHYDRATED__=${serialized}</script>
<script type="module" src="${input.clientScript}"></script>
</body>
</html>`
}

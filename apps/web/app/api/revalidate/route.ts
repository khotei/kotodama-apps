import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

// Backend-webhook → precise per-word ISR revalidation (AC-6). Secret-gated via a
// header; without a matching REVALIDATE_SECRET the request is rejected WITHOUT
// revalidating (a missing env means every call 401s — fail closed). The word
// path is the DECODED segment, matching the SSG prerender key (gate f).
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret || request.headers.get('x-revalidate-secret') !== secret) {
    return NextResponse.json({ revalidated: false }, { status: 401 })
  }

  const body = (await request.json().catch(() => null)) as {
    language?: unknown
    word?: unknown
  } | null
  if (typeof body?.language !== 'string' || typeof body?.word !== 'string') {
    return NextResponse.json({ revalidated: false }, { status: 400 })
  }

  const path = `/words/${body.language}/${body.word}`
  revalidatePath(path)
  return NextResponse.json({ revalidated: true, path })
}

import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy — type garden',
  description: 'Privacy policy for the YASH RAJ creative studio website.',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-dvh bg-[#f6e9e8] px-5 py-12 text-[#211719] md:px-10 md:py-20">
      <article className="mx-auto max-w-2xl">
        <Link href="/" className="text-xs uppercase tracking-[0.2em] opacity-60 hover:opacity-100">← Back home</Link>
        <p className="mt-16 text-xs uppercase tracking-[0.25em] opacity-50">Last updated November 2026</p>
        <h1 className="mt-3 font-serif text-5xl tracking-tight md:text-7xl">Privacy policy</h1>
        <p className="mt-6 text-lg leading-8 opacity-75">This is a small creative studio by YASH RAJ. We keep data collection intentionally limited and use it only to keep the experience working and improve the experiments.</p>
        <div className="mt-12 space-y-10 text-sm leading-7 opacity-80">
          <section><h2 className="font-serif text-2xl opacity-100">What we collect</h2><p className="mt-2">The site may record anonymous page views and interactions such as the tool used, route visited, and basic control labels. We do not ask for your name, email, precise location, or payment information.</p></section>
          <section><h2 className="font-serif text-2xl opacity-100">How it is used</h2><p className="mt-2">Activity data is used to understand which creative tools are useful, find errors, and improve performance. It is stored in Supabase with row-level security and is not publicly readable.</p></section>
          <section><h2 className="font-serif text-2xl opacity-100">Your choices</h2><p className="mt-2">You can leave the site at any time. Browser session identifiers are temporary and are not used to identify you personally. Generated posters and videos are downloaded directly to your device and are not uploaded by this site.</p></section>
          <section><h2 className="font-serif text-2xl opacity-100">Contact</h2><p className="mt-2">For privacy questions, contact YASH RAJ through <a className="underline" href="https://www.instagram.com/c0deryash/">Instagram</a>.</p></section>
        </div>
        <p className="mt-16 border-t border-current/15 pt-5 text-xs uppercase tracking-[0.16em] opacity-45">All rights reserved by YASH RAJ</p>
      </article>
    </main>
  )
}

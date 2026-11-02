import Link from 'next/link'

const qrSource = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20260821_110816_FamApp-etzwkjJnqHQoFrhyfC5rn2pkegywKQ.jpg'

export default function SupportPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#d5c3bd] px-6 py-16 text-[#161312]">
      <section className="w-full max-w-md text-center">
        <p className="mb-4 text-[10px] uppercase tracking-[0.3em] opacity-55">support the studio</p>
        <h1 className="font-serif text-5xl tracking-tight md:text-6xl">keep the weird ideas growing.</h1>
        <p className="mx-auto mt-5 max-w-sm text-sm leading-6 opacity-70">
          If this little corner of the internet made you smile, you can support future experiments through the QR code below.
        </p>
        <div className="mx-auto mt-10 w-fit rounded-[2rem] bg-[#eee4de] p-4 shadow-[0_24px_80px_rgba(33,20,16,0.18)]">
          <img src={qrSource} alt="QR code to support YASH through FamApp" className="block aspect-square w-64 rounded-2xl object-cover" />
        </div>
        <p className="mt-5 font-mono text-xs tracking-wide opacity-65">pay2yash@fam</p>
        <Link href="/" className="mt-10 inline-flex rounded-full border border-[#161312]/20 px-4 py-2 text-xs uppercase tracking-[0.18em] transition-colors hover:bg-[#161312] hover:text-[#eee4de]">
          back to the garden
        </Link>
      </section>
    </main>
  )
}

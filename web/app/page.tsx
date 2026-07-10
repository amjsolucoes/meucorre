import { Nav } from '@/components/nav';
import { Hero } from '@/components/hero';
import { FeatureGrid } from '@/components/feature-grid';
import { FreeBanner } from '@/components/free-banner';
import { AudienceChips } from '@/components/audience-chips';
import { TrustSection } from '@/components/trust-section';
import { WaitlistForm } from '@/components/waitlist-form';
import { Footer } from '@/components/footer';

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <FeatureGrid />
        <FreeBanner />
        <AudienceChips />
        <TrustSection />
        <section className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h2 className="font-display text-3xl font-extrabold text-text-primary sm:text-4xl">
            Comece a organizar seu corre hoje
          </h2>
          <p className="mx-auto mt-4 max-w-md font-body text-text-secondary">
            Deixe seu e-mail e avisamos assim que o app estiver disponível pra baixar.
          </p>
          <div className="mt-8 flex justify-center">
            <WaitlistForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

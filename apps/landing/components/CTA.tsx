import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CallToAction() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 shadow-2xl sm:px-16 md:pt-20 md:pb-20">
          <div className="relative z-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl max-w-2xl mx-auto">
              Ready to Boost Your Click-Through Rates?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-primary-foreground/90">
              Join thousands of users who trust Shortly for their link management. 
              Start for free today, no credit card required.
            </p>
            <div className="mt-10 flex justify-center gap-x-6">
              <Link
                href="/dashboard"
                className="group inline-flex items-center justify-center rounded-xl bg-background px-8 py-4 text-base font-bold text-primary shadow-sm hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background transition-all"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
          
          {/* Background pattern */}
          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
            aria-hidden="true"
          >
            <circle cx="512" cy="512" r="512" fill="url(#gradient)" fillOpacity="0.25" />
            <defs>
              <radialGradient id="gradient">
                <stop stopColor="#ffffff" />
                <stop offset="1" stopColor="#ffffff" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </section>
  );
}

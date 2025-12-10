import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { FeatureSection } from '@/components/FeatureSection';
import { CallToAction } from '@/components/CTA';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Simple Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-primary">
                Shortly
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-primary transition-colors">
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white transition-all bg-primary rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      <Hero />
      <FeatureSection />
      <CallToAction />

      {/* Simple Footer */}
      <footer className="bg-white border-t border-zinc-100 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-xl font-bold text-primary">Shortly</span>
              <p className="mt-2 text-sm text-zinc-500">
                © {new Date().getFullYear()} Shortly. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-zinc-400 hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-zinc-400 hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-zinc-400 hover:text-primary transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

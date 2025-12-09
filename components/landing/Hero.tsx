import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-16 pb-32 lg:pt-32 lg:pb-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6">
            Shorten Your Links, <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">
              Expand Your Reach
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Shortly is the modern, secure, and fast URL shortener designed for everyone.
            Track your clicks, manage your links, and grow your audience with ease.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-primary-foreground transition-all bg-primary border border-transparent rounded-xl shadow-lg hover:bg-primary/90 hover:shadow-primary/25 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Get Started for Free
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-foreground transition-all bg-secondary border border-border rounded-xl shadow-sm hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none opacity-50 overflow-hidden">
         <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
         <div className="absolute top-[20%] right-[10%] w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
         <div className="absolute bottom-[20%] left-[30%] w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>
    </section>
  );
}

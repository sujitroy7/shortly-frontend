import { Link, BarChart3, ShieldCheck, Zap } from 'lucide-react';

const features = [
  {
    icon: <Zap className="h-6 w-6 text-primary" />,
    title: 'Lightning Fast',
    description: 'Create short links in milliseconds. Our optimized infrastructure ensures your redirects are instant.',
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-primary" />,
    title: 'Detailed Analytics',
    description: 'Track clicks, geographic data, and referrer sources to understand your audience better.',
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-primary" />,
    title: 'Secure & Reliable',
    description: 'HTTPS encryption by default. We prioritize security and uptime so your links always work.',
  },
];

export function FeatureSection() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything You Need to Grow
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful features packed into a simple, easy-to-use interface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

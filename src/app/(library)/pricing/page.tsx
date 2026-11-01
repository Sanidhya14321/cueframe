import { Check } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const PLANS = [
  {
    name: 'Local',
    price: 'Free',
    note: 'Runs on your computer with your own Claude Code',
    features: ['Full video editor', 'MCP agent editing', 'Your own AI and voice keys'],
    action: { label: 'Download', href: 'https://github.com/Sanidhya14321/cueframe' },
  },
  {
    name: 'Hosted',
    price: 'Server cost + margin + 18% GST',
    note: 'A private ClipKit instance on our servers, billed monthly',
    features: ['Your own isolated workspace', 'Cloud rendering', 'Admin, creator and viewer roles'],
    action: { label: 'Request access', href: '/login' },
  },
] as const;

const PricingPage = () => (
  <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-5 sm:px-6">
    <h1 className="font-display text-2xl">Pricing</h1>
    <p className="text-muted-foreground text-sm">
      Demonstration of the planned model. Online payments are not enabled yet.
    </p>
    <div className="grid gap-px overflow-hidden rounded-xl border bg-border md:grid-cols-2">
      {PLANS.map((plan) => (
        <section key={plan.name} className="flex flex-col gap-3 bg-background p-5">
          <h2 className="font-medium text-sm">{plan.name}</h2>
          <p className="font-display text-2xl">{plan.price}</p>
          <p className="text-muted-foreground text-sm">{plan.note}</p>
          <ul className="flex flex-1 flex-col gap-1.5 text-sm">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <Check className="size-4 text-primary" aria-hidden={true} />
                {feature}
              </li>
            ))}
          </ul>
          <Button asChild variant="outline" className="self-start">
            <Link href={plan.action.href}>{plan.action.label}</Link>
          </Button>
        </section>
      ))}
    </div>
  </div>
);

export default PricingPage;

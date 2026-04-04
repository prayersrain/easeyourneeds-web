export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold font-heading text-slate-900 dark:text-white mb-4">Terms of Service</h1>
        <p className="text-slate-500 dark:text-slate-400">Last updated: April 1, 2026</p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-li:text-slate-600 dark:prose-li:text-slate-300 bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        
        <p>
          Welcome to Ease Your Needs. These Terms of Service (&quot;Terms&quot;) govern your use of our website and services. By accessing or using our platform, you agree to be bound by these Terms.
        </p>

        <h2>1. Services Provided</h2>
        <p>
          Ease Your Needs provides premium Zoom account rentals, live event operators, and related digital services. Our automated system handles bookings and account deployment for Zoom events ranging from 100 to 1,000 participants.
        </p>
        <ul>
          <li>All bookings are subject to our server capacity. If a capacity limit is reached, our support staff will handle the assignment manually.</li>
          <li>We reserve the right to suspend accounts that abuse our services or violate Zoom&apos;s official terms of service.</li>
        </ul>

        <h2>2. Payments and Refunds</h2>
        <p>
          All payments are processed securely via our payment gateways. Wallet balances can be topped up and are non-refundable to bank accounts unless specified under special withdrawal conditions for staff operations.
        </p>
        <p>
          Refunds for failed bookings (e.g., due to system errors or unavailability) will be credited directly to your Ease Your Needs Balance. Cash refunds are subject to manual review and approval by our Administrators.
        </p>

        <h2>3. Loyalty Points</h2>
        <p>
          Loyalty points are earned for every completed transaction. Points have no cash value and can only be redeemed for discounts or free rentals within the Ease Your Needs platform.
        </p>

        <h2>4. User Responsibilities</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account authentication links (magic links) and all activities that occur under your account. Do not share your login credentials with untrusted parties.
        </p>

        <h2>5. Modifications to Terms</h2>
        <p>
          We may modify these Terms at any time. We will notify you of material changes by posting the updated Terms on this site. Your continued use of the platform after such changes constitutes acceptance.
        </p>

        <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex flex-col items-center text-center">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Still have questions?</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Our legal team is ready to help you understand our terms.</p>
          <a href="/contact" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Contact Support</a>
        </div>
      </div>
    </div>
  );
}

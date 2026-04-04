export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold font-heading text-slate-900 dark:text-white mb-4">Privacy Policy</h1>
        <p className="text-slate-500 dark:text-slate-400">Last updated: April 1, 2026</p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-li:text-slate-600 dark:prose-li:text-slate-300 bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        
        <p>
          At Ease Your Needs, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          We may collect information about you in a variety of ways. The information we may collect includes:
        </p>
        <ul>
          <li><strong>Personal Data:</strong> Name, email address, phone number, and account credentials used to register.</li>
          <li><strong>Financial Data:</strong> Transaction history and balance records (we do not store your full banking or credit card details directly).</li>
          <li><strong>Usage Data:</strong> Zoom meeting logs, cloud recording access logs, IP addresses, and browsing statistics.</li>
        </ul>

        <h2>2. Use of Your Information</h2>
        <p>
          Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use your information to:
        </p>
        <ul>
          <li>Create and manage your account and authentication via magic links.</li>
          <li>Process transactions and send related data (invoices, receipts).</li>
          <li>Automatically assign Zoom Server-to-Server accounts via our APIs.</li>
          <li>Send marketing and promotional communications (if opted-in).</li>
        </ul>

        <h2>3. Disclosure of Your Information</h2>
        <p>
          We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
        </p>
        <p>
          <strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, or to protect the rights, property, and safety of others.
          <br /><br />
          <strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us, including payment processing, data analysis, email delivery (e.g. Resend), hosting services, and customer service.
        </p>

        <h2>4. Security of Your Information</h2>
        <p>
          We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that no security measures are perfect or impenetrable.
        </p>

        <h2>5. Cloud Recordings & Zoom Data</h2>
        <p>
          Recordings of your Zoom meetings hosted on our accounts are securely stored on our servers for a limited period depending on your booking package. We do not access, share, or sell your video content. Download links are provided only to the authenticated user who initiated the booking.
        </p>

        <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex flex-col items-center text-center">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Privacy Concerns?</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Contact our DPO (Data Protection Officer) directly.</p>
          <a href="/contact" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Message Us</a>
        </div>
      </div>
    </div>
  );
}

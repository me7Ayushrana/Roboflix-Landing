import Link from "next/link"

export const metadata = {
  title: "Privacy Policy & Terms - ROBOFLIX",
  description: "Privacy policy, terms of service, and legal information for ROBOFLIX robotics learning platform.",
}

export default function PolicyPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-24">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="text-red-600 hover:text-red-500 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-red-600">Privacy</span> & Legal
          </h1>
          <p className="text-gray-400">Last updated: April 2026</p>
        </div>

        {/* Table of Contents */}
        <div className="mb-12 p-6 bg-red-600/10 border border-red-600/30 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Table of Contents</h2>
          <ul className="space-y-2 text-gray-300">
            <li><a href="#privacy" className="hover:text-red-600 transition-colors">Privacy Policy</a></li>
            <li><a href="#terms" className="hover:text-red-600 transition-colors">Terms of Service</a></li>
            <li><a href="#refund" className="hover:text-red-600 transition-colors">Refund Policy</a></li>
            <li><a href="#payment" className="hover:text-red-600 transition-colors">Payment & Billing</a></li>
            <li><a href="#disclaimer" className="hover:text-red-600 transition-colors">Disclaimer</a></li>
            <li><a href="#contact" className="hover:text-red-600 transition-colors">Contact Us</a></li>
          </ul>
        </div>

        {/* Privacy Policy */}
        <section id="privacy" className="mb-12 scroll-mt-20">
          <h2 className="text-3xl font-bold text-red-600 mb-6">Privacy Policy</h2>
          
          <div className="space-y-6 text-gray-300">
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h3>
              <p>We collect information you provide directly to us, such as:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                <li>Account registration information (name, email, password)</li>
                <li>Profile information and course progress</li>
                <li>Payment information through secure third-party processors</li>
                <li>Communication preferences and feedback</li>
                <li>Device and usage data through analytics</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h3>
              <p>Your information is used to:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                <li>Provide and improve our learning platform</li>
                <li>Process payments and send receipts</li>
                <li>Send educational content and updates</li>
                <li>Respond to your inquiries and support requests</li>
                <li>Analyze usage patterns to enhance user experience</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">3. Data Security</h3>
              <p>We implement industry-standard security measures to protect your data, including encryption, secure servers, and regular security audits. However, no transmission over the internet is completely secure.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">4. Sharing Your Information</h3>
              <p>We do not sell your personal information. We only share data with:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                <li>Service providers (payment processors, hosting providers)</li>
                <li>When required by law or legal process</li>
                <li>With your explicit consent</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">5. Your Rights</h3>
              <p>You have the right to:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                <li>Access your personal information</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your account and data</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">6. Cookies</h3>
              <p>We use cookies to enhance your experience. You can control cookie settings through your browser. Disabling cookies may affect some platform features.</p>
            </div>
          </div>
        </section>

        {/* Terms of Service */}
        <section id="terms" className="mb-12 scroll-mt-20">
          <h2 className="text-3xl font-bold text-red-600 mb-6">Terms of Service</h2>
          
          <div className="space-y-6 text-gray-300">
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h3>
              <p>By accessing and using ROBOFLIX, you agree to be bound by these terms. If you do not agree, please discontinue use immediately.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">2. User Responsibilities</h3>
              <p>You agree to:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain confidentiality of your account credentials</li>
                <li>Use the platform for lawful purposes only</li>
                <li>Not engage in harassment, abuse, or illegal activity</li>
                <li>Respect intellectual property rights</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">3. Intellectual Property</h3>
              <p>All course content, code, designs, and materials are owned by ROBOFLIX or its licensors. You may use them for personal learning purposes only. Unauthorized reproduction or distribution is prohibited.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">4. Limitation of Liability</h3>
              <p>ROBOFLIX is provided "as is." We are not liable for indirect, incidental, special, or consequential damages. Our total liability is limited to the amount you paid for your subscription.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">5. Modifications to Service</h3>
              <p>We reserve the right to modify or discontinue services with notice. Changes to pricing will be communicated at least 30 days in advance.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">6. Account Termination</h3>
              <p>We may terminate accounts that violate these terms or engage in abuse. You can delete your account anytime through your account settings.</p>
            </div>
          </div>
        </section>

        {/* Refund Policy */}
        <section id="refund" className="mb-12 scroll-mt-20">
          <h2 className="text-3xl font-bold text-red-600 mb-6">Refund Policy</h2>
          
          <div className="space-y-6 text-gray-300">
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Entry Pass (₹989)</h3>
              <p>You have 7 days from purchase to request a full refund if you are not satisfied with the course. No refund will be issued after 7 days.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Monthly Membership (₹299/month)</h3>
              <p>Memberships can be cancelled anytime, and refunds are provided on a pro-rata basis for unused days. Refunds are processed within 5-7 business days.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Founder Access</h3>
              <p>Refund eligibility depends on the terms agreed upon with XAIR during the sales process. Contact our team for specific details.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Refund Process</h3>
              <p>To request a refund:</p>
              <ol className="list-decimal list-inside ml-4 mt-2 space-y-2">
                <li>Email info@xair.live with your order details</li>
                <li>Provide a reason for the refund request</li>
                <li>We will review and respond within 3 business days</li>
                <li>Approved refunds are processed to the original payment method</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Payment & Billing Section */}
        <section id="payment" className="mb-12 scroll-mt-20">
          <h2 className="text-3xl font-bold text-red-600 mb-6">Payment & Billing</h2>
          
          <div className="space-y-6 text-gray-300">
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Payment Methods</h3>
              <p>We accept payments through Razorpay, including:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                <li>Credit and Debit Cards (Visa, Mastercard, American Express)</li>
                <li>Net Banking</li>
                <li>UPI (Unified Payments Interface)</li>
                <li>Digital Wallets</li>
                <li>EMI Options</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Billing Information</h3>
              <p>All payments are securely processed through Razorpay. We collect billing information required for:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                <li>Processing your subscription payment</li>
                <li>Generating invoices and receipts</li>
                <li>Fraud prevention and security</li>
                <li>Tax compliance</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Auto-Renewal</h3>
              <p>Monthly memberships auto-renew unless cancelled. You can cancel anytime from your account dashboard without penalties. Cancellation is effective at the end of the current billing cycle.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Invoice & Receipts</h3>
              <p>Digital invoices and receipts are sent to your registered email. You can also download them anytime from your account. All payments are GST-compliant and include tax details.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Failed Payments</h3>
              <p>If a payment fails, we will notify you immediately. You can retry payment through your account. Your access will be suspended until payment is successfully processed.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Payment Security</h3>
              <p>We use industry-standard encryption (SSL/TLS) to protect all payment transactions. Your payment information is processed securely through Razorpay and is PCI-DSS compliant. ROBOFLIX never stores your full credit card details.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Currency & Pricing</h3>
              <p>All prices are displayed in Indian Rupees (₹). Prices are subject to change with 30 days' notice. GST will be added to all transactions as per government regulations.</p>
            </div>
          </div>
        </section>

        {/* Disclaimer Section */}
        <section id="disclaimer" className="mb-12 scroll-mt-20">
          <h2 className="text-3xl font-bold text-red-600 mb-6">Disclaimer</h2>
          
          <div className="space-y-6 text-gray-300">
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Content Accuracy</h3>
              <p>While we strive for accuracy, ROBOFLIX makes no warranties about the completeness, accuracy, or availability of content. All course materials are provided "as is" for educational purposes.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">No Professional Advice</h3>
              <p>Content provided on ROBOFLIX is educational in nature and should not be construed as professional engineering, technical, or legal advice. Always consult with qualified professionals for specific applications.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Hardware & Safety</h3>
              <p>When building robots, follow all safety protocols. ROBOFLIX is not responsible for injuries or damages resulting from improper use of hardware, tools, or components. Always use appropriate protective equipment and follow manufacturer guidelines.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Third-Party Content</h3>
              <p>ROBOFLIX may include references to third-party websites, tools, and resources. We are not responsible for their content, accuracy, or availability. Use third-party services at your own risk.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Employment Opportunities</h3>
              <p>ROBOFLIX provides educational content and job board listings. We do not guarantee employment, internship placements, or specific career outcomes. Individual results vary based on skills, effort, and market conditions.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Service Availability</h3>
              <p>While we maintain high uptime standards, ROBOFLIX does not guarantee uninterrupted service. We may experience technical issues, maintenance, or outages beyond our control.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Changes to Policy</h3>
              <p>ROBOFLIX reserves the right to update this policy anytime. Continued use of the platform constitutes acceptance of updated terms. We will notify users of material changes via email.</p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="mb-12 scroll-mt-20">
          <h2 className="text-3xl font-bold text-red-600 mb-6">Contact Us</h2>
          
          <div className="p-8 bg-red-600/10 border border-red-600/30 rounded-lg">
            <p className="text-gray-300 mb-6">If you have questions about this policy or our services, contact us:</p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="text-red-600 font-bold text-xl mt-1">📧</span>
                <div>
                  <p className="font-semibold text-white">Email</p>
                  <a href="mailto:info@xair.live" className="text-gray-300 hover:text-red-600 transition-colors">
                    info@xair.live
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-red-600 font-bold text-xl mt-1">📱</span>
                <div>
                  <p className="font-semibold text-white">Phone</p>
                  <a href="tel:+918288898544" className="text-gray-300 hover:text-red-600 transition-colors">
                    82888 98544
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-red-600 font-bold text-xl mt-1">🌐</span>
                <div>
                  <p className="font-semibold text-white">Web</p>
                  <p className="text-gray-300">ROBOFLIX - Your Robotics Journey</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-red-600/30">
          <p className="text-gray-500 text-sm mb-6">
            © 2026 ROBOFLIX. All rights reserved. Privacy policy and terms updated April 2026.
          </p>
          <Link href="/" className="text-red-600 hover:text-red-500 transition-colors font-semibold">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}

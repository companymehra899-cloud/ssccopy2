import React, { useState } from 'react';
import { X, Mail, Shield, FileText, Info, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export type InfoPageType = 'about' | 'privacy' | 'terms' | 'contact';

interface InfoModalProps {
  initialPage: InfoPageType;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ initialPage, onClose }) => {
  const [activeTab, setActiveTab] = useState<InfoPageType>(initialPage);

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setIsSubmitted(true);
  };

  return (
    <div
      style={{
        background: 'rgba(0, 0, 0, 0.75)',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 9999,
      }}
      className="flex items-center justify-center p-4 font-sans backdrop-blur-sm"
    >
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10000,
        }}
        className="w-full max-w-4xl max-h-[90vh] bg-white text-gray-900 rounded-xl shadow-2xl overflow-hidden flex flex-col border border-gray-300"
      >
        {/* Modal Header */}
        <div className="bg-[#b22222] text-white px-6 py-4 flex items-center justify-between shadow">
          <div className="flex items-center gap-2">
            <Info className="w-6 h-6 text-amber-300" />
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-wide">
              Sarkari Portal Information Center
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-black/20 p-1.5 rounded-full transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-gray-100 border-b border-gray-200 px-4 pt-2 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-extrabold uppercase transition border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'about'
                ? 'border-[#b22222] text-[#b22222] bg-white shadow-sm'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Info className="w-4 h-4" /> About Us
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-extrabold uppercase transition border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'privacy'
                ? 'border-[#b22222] text-[#b22222] bg-white shadow-sm'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Shield className="w-4 h-4" /> Privacy Policy
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-extrabold uppercase transition border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'terms'
                ? 'border-[#b22222] text-[#b22222] bg-white shadow-sm'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4" /> Terms & Conditions
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-extrabold uppercase transition border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'contact'
                ? 'border-[#b22222] text-[#b22222] bg-white shadow-sm'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Mail className="w-4 h-4" /> Contact Us
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 text-sm leading-relaxed text-gray-700 bg-white">
          {activeTab === 'about' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-xl font-bold text-gray-900 border-b pb-2">About Sarkari Portal</h3>
              <p>
                Welcome to <strong>Sarkari Portal</strong> (www.sarkariportal.com), India’s fastest-growing and most reliable real-time information aggregator for Government Jobs, Admit Cards, Exam Results, Answer Keys, Syllabus, and University Admissions.
              </p>
              <p>
                Our mission is to empower millions of job aspirants across India by providing instant, structured, and accurate notifications for recruitments conducted by UPSC, SSC, Banking Boards (IBPS/SBI), Railways (RRB), Defense Services (Army, Navy, Air Force), Teaching Exams (CTET/UPTET), and State Public Service Commissions (UPPSC, BPSC, RSMSSB, MPESB, etc.).
              </p>
              <h4 className="font-bold text-gray-900 pt-2">Why Aspirants Trust Us:</h4>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Lightning Fast Updates:</strong> Real-time alerts as soon as official notifications are released.</li>
                <li><strong>Structured Details:</strong> Clear breakdown of Important Dates, Application Fees, Age Limits, Vacancy Breakdown, and Official Links.</li>
                <li><strong>AI-Powered Scrapers & Verification:</strong> Advanced verification systems ensuring zero broken links or fake notices.</li>
                <li><strong>Candidate Utilities:</strong> Free online Age Calculator, Photo & Signature Inspector, and Live Exam Tickers.</li>
              </ul>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 text-xs text-amber-900 mt-4">
                <strong>Disclaimer Notice:</strong> Sarkari Portal is an independent private platform and is not affiliated with any Government Ministry, Department, or Recruitment Board.
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Privacy Policy</h3>
              <p className="text-xs text-gray-500">Last Updated: January 2026</p>
              <p>
                At <strong>Sarkari Portal</strong>, accessible from www.sarkariportal.com, safeguarding the privacy of our visitors is our topmost priority. This Privacy Policy document outlines the types of information collected and recorded by Sarkari Portal and how we utilize it.
              </p>
              <h4 className="font-bold text-gray-900 pt-2">1. Information We Collect</h4>
              <p>
                We may collect non-personal identification data including browser type, device info, IP address, operating system, and pages visited on our portal through standard web analytics and cookies to enhance user experience.
              </p>
              <h4 className="font-bold text-gray-900 pt-2">2. Use of Cookies</h4>
              <p>
                Sarkari Portal uses cookies to store visitor preferences and record user-specific information regarding the pages accessed, optimizing our web content according to visitor browser type.
              </p>
              <h4 className="font-bold text-gray-900 pt-2">3. Third-Party Partners & Advertisements</h4>
              <p>
                Some third-party advertisers or analytic providers on our site may use cookies and web beacons. We do not control third-party cookies and advise reviewing their respective privacy policies.
              </p>
              <h4 className="font-bold text-gray-900 pt-2">4. Consent</h4>
              <p>
                By using our website, you hereby consent to our Privacy Policy and agree to its terms.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Terms & Conditions</h3>
              <p className="text-xs text-gray-500">Last Updated: January 2026</p>
              <p>
                Please read these Terms and Conditions carefully before using the <strong>Sarkari Portal</strong> website operated by our team.
              </p>
              <h4 className="font-bold text-gray-900 pt-2">1. Acceptance of Terms</h4>
              <p>
                By accessing or using this portal, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the website.
              </p>
              <h4 className="font-bold text-gray-900 pt-2">2. Accuracy of Information</h4>
              <p>
                While we strive to provide the most accurate and up-to-date exam notifications, results, and admit card links, government recruitment criteria can change. Users are strongly encouraged to verify details on official government commission websites before applying.
              </p>
              <h4 className="font-bold text-gray-900 pt-2">3. Intellectual Property</h4>
              <p>
                All layout designs, graphics, text formatting, and software code on Sarkari Portal are the intellectual property of Sarkari Portal and protected by copyright laws.
              </p>
              <h4 className="font-bold text-gray-900 pt-2">4. External Links</h4>
              <p>
                Our portal contains links to official government application portals and notification PDFs. We assume no responsibility for the content or privacy practices of external third-party sites.
              </p>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Contact Us</h3>
              <p>
                Have questions about a job notification, found a broken link, or need support? Get in touch with our helpdesk team. We respond within 24 hours.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-gray-50 border p-4 rounded-lg flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#b22222] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-gray-900 text-sm mb-1">Email Support</strong>
                    <span className="text-gray-600">support@sarkariportal.com</span>
                  </div>
                </div>

                <div className="bg-gray-50 border p-4 rounded-lg flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#b22222] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-gray-900 text-sm mb-1">Helpdesk Hours</strong>
                    <span className="text-gray-600">Mon - Sat: 9:00 AM - 6:00 PM</span>
                  </div>
                </div>

                <div className="bg-gray-50 border p-4 rounded-lg flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#b22222] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-gray-900 text-sm mb-1">Head Office</strong>
                    <span className="text-gray-600">Connaught Place, New Delhi, India</span>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-gray-50 border p-6 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider">
                  Send Us a Direct Message
                </h4>

                {isSubmitted ? (
                  <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-lg flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    <div>
                      <strong className="block font-bold">Message Received Successfully!</strong>
                      <p className="text-xs text-emerald-700 mt-0.5">
                        Thank you for reaching out. Our support team will get back to your email ({contactEmail}) shortly.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Your Name *</label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Enter your full name"
                          className="w-full bg-white text-gray-900 text-xs p-2.5 rounded border border-gray-300 focus:border-[#b22222] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="Enter your email address"
                          className="w-full bg-white text-gray-900 text-xs p-2.5 rounded border border-gray-300 focus:border-[#b22222] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Subject / Inquiry Type</label>
                      <input
                        type="text"
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        placeholder="e.g. Broken Link / Partnership / Job Query"
                        className="w-full bg-white text-gray-900 text-xs p-2.5 rounded border border-gray-300 focus:border-[#b22222] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Your Message *</label>
                      <textarea
                        rows={4}
                        required
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Write your message here in detail..."
                        className="w-full bg-white text-gray-900 text-xs p-2.5 rounded border border-gray-300 focus:border-[#b22222] focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-[#b22222] hover:bg-[#8b1a1a] text-white font-bold text-xs px-6 py-2.5 rounded transition cursor-pointer flex items-center gap-2 shadow"
                    >
                      <Send className="w-4 h-4" /> Send Inquiry Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-100 px-6 py-3 border-t border-gray-200 flex justify-between items-center text-xs text-gray-600">
          <span>© 2026 Sarkari Portal. All Rights Reserved.</span>
          <button
            onClick={onClose}
            className="bg-gray-800 hover:bg-black text-white px-4 py-1.5 rounded font-bold transition cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};

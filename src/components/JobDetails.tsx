import React, { useState } from 'react';
import { JobPost } from '../types';
import { ArrowLeft, ExternalLink, Download, Share2, Calendar, FileText, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';

interface JobDetailsProps {
  job: JobPost;
  onBack: () => void;
}

export const JobDetails: React.FC<JobDetailsProps> = ({ job, onBack }) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out ${job.title} on Sarkari Portal!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Salary Calculator State
  const [basicPay, setBasicPay] = useState<number>(0);
  const [salaryResult, setSalaryResult] = useState<number | null>(null);

  const handleCalculateSalary = () => {
    // Simple placeholder calculator logic: Basic + 40% allowances
    if (basicPay > 0) {
      setSalaryResult(basicPay + basicPay * 0.4);
    }
  };

  const jobPostingSchema = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.shortInfo,
    "datePosted": job.postDate,
    "validThrough": job.lastDate,
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.department
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <script type="application/ld+json">
        {JSON.stringify(jobPostingSchema)}
      </script>
      {/* ... Top Navigation ... */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 bg-[#b22222] hover:bg-red-800 text-white font-bold text-xs sm:text-sm px-3.5 py-2 rounded transition shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs px-3 py-2 rounded transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Form Details
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1 bg-amber-400 hover:bg-amber-500 text-black font-bold text-xs px-3 py-2 rounded transition shadow-xs cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
        </div>
      </div>

      {/* Main Container Container Box */}
      <div className="bg-white border-2 border-[#b22222] rounded shadow-md overflow-hidden">
        {/* Salary Calculator & Details (New) */}
        <div className="p-5 border-b border-gray-200">
           <h3 className="bg-[#b22222] text-white text-sm sm:text-base font-extrabold uppercase p-2 text-center rounded mb-3">
              Salary Details & Calculator
            </h3>
            {job.salaryDetails && (
               <p className="text-sm font-semibold mb-3">Pay Scale: {job.salaryDetails}</p>
            )}
            <div className="flex gap-2 items-center">
              <input type="number" placeholder="Enter Basic Pay" className="border p-2 rounded text-sm w-40" onChange={(e) => setBasicPay(Number(e.target.value))} />
              <button onClick={handleCalculateSalary} className="bg-red-800 text-white px-3 py-2 rounded text-sm font-bold">Calculate Approx Salary</button>
            </div>
            {salaryResult && <p className="mt-2 font-bold text-green-700">Approx In-Hand Salary: ₹{salaryResult.toLocaleString()}</p>}
        </div>

        {/* Syllabus (New) */}
        {job.syllabusDetails && (
          <div className="p-5 border-b border-gray-200">
            <h3 className="bg-[#b22222] text-white text-sm sm:text-base font-extrabold uppercase p-2 text-center rounded mb-3">
              Simplified Syllabus
            </h3>
            <p className="text-sm text-gray-800 font-medium">{job.syllabusDetails}</p>
          </div>
        )}

        {/* Selection Process (New) */}
        {job.selectionProcess && (
          <div className="p-5 border-b border-gray-200">
            <h3 className="bg-[#b22222] text-white text-sm sm:text-base font-extrabold uppercase p-2 text-center rounded mb-3">
              Selection Process
            </h3>
            <p className="text-sm text-gray-800 font-medium">{job.selectionProcess}</p>
          </div>
        )}

        {/* Title Banner */}
        <div className="bg-[#b22222] text-white p-5 text-center border-b-2 border-red-900">
          <span className="text-sm font-black uppercase tracking-wider bg-amber-400 text-black px-3 py-1 rounded inline-block mb-2">
            {job.category}
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight uppercase leading-snug">
            {job.title}
          </h1>
          <p className="text-amber-200 text-base sm:text-lg font-bold mt-2">
            {job.department}
          </p>
        </div>

        {/* Short Summary Bar */}
        <div className="bg-red-50 p-3.5 border-b border-red-200 text-sm sm:text-base text-gray-800 flex flex-wrap justify-between items-center gap-3 font-bold">
          <div className="flex items-center gap-4">
            <span>
              <strong>Post Date:</strong> {job.postDate}
            </span>
            {job.lastDate && (
              <span className="text-red-700 font-extrabold">
                <strong>Last Date:</strong> {job.lastDate}
              </span>
            )}
          </div>
          {job.totalPosts && (
            <span className="bg-red-800 text-white font-extrabold px-3 py-1 rounded text-xs sm:text-sm">
              Total Posts: {job.totalPosts}
            </span>
          )}
        </div>

        {/* Short Information */}
        <div className="p-5 border-b border-gray-200 bg-amber-50/50">
          <h3 className="font-extrabold text-red-800 text-base uppercase mb-1.5">Short Information:</h3>
          <p className="text-sm sm:text-base text-gray-900 leading-relaxed font-semibold">
            {job.shortInfo}
          </p>
        </div>

        {/* Important Dates & Application Fee 2-Column Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-red-200 border-b border-gray-200">
          {/* Important Dates */}
          <div className="p-5">
            <h3 className="bg-[#b22222] text-white text-sm sm:text-base font-extrabold uppercase p-2 text-center rounded mb-3">
              Important Dates
            </h3>
            <ul className="text-sm sm:text-base space-y-2.5 text-gray-900 font-semibold">
              {job.importantDates.applicationBegin && (
                <li className="flex justify-between border-b border-dashed border-gray-300 pb-1.5">
                  <span className="text-gray-700">Application Begin:</span>
                  <strong className="text-green-700">{job.importantDates.applicationBegin}</strong>
                </li>
              )}
              {job.importantDates.lastDateApply && (
                <li className="flex justify-between border-b border-dashed border-gray-300 pb-1.5">
                  <span className="text-gray-700">Last Date for Apply Online:</span>
                  <strong className="text-red-700">{job.importantDates.lastDateApply}</strong>
                </li>
              )}
              {job.importantDates.lastDatePayFee && (
                <li className="flex justify-between border-b border-dashed border-gray-300 pb-1.5">
                  <span className="text-gray-700">Pay Exam Fee Last Date:</span>
                  <strong>{job.importantDates.lastDatePayFee}</strong>
                </li>
              )}
              {job.importantDates.examDate && (
                <li className="flex justify-between border-b border-dashed border-gray-300 pb-1.5">
                  <span className="text-gray-700">Exam Date:</span>
                  <strong className="text-blue-800">{job.importantDates.examDate}</strong>
                </li>
              )}
              {job.importantDates.admitCardDate && (
                <li className="flex justify-between border-b border-dashed border-gray-300 pb-1.5">
                  <span className="text-gray-700">Admit Card Available:</span>
                  <strong className="text-purple-800">{job.importantDates.admitCardDate}</strong>
                </li>
              )}
              {job.importantDates.resultDate && (
                <li className="flex justify-between border-b border-dashed border-gray-300 pb-1.5">
                  <span className="text-gray-700">Result Declared Date:</span>
                  <strong className="text-red-700">{job.importantDates.resultDate}</strong>
                </li>
              )}
            </ul>
          </div>

          {/* Application Fee */}
          <div className="p-5">
            <h3 className="bg-[#b22222] text-white text-sm sm:text-base font-extrabold uppercase p-2 text-center rounded mb-3">
              Application Fee
            </h3>
            <ul className="text-sm sm:text-base space-y-2.5 text-gray-900 font-semibold">
              {job.applicationFee.generalObcEws && (
                <li className="flex justify-between border-b border-dashed border-gray-300 pb-1.5">
                  <span className="text-gray-700">General / OBC / EWS:</span>
                  <strong className="text-red-700">{job.applicationFee.generalObcEws}</strong>
                </li>
              )}
              {job.applicationFee.scStPh && (
                <li className="flex justify-between border-b border-dashed border-gray-300 pb-1.5">
                  <span className="text-gray-700">SC / ST / PH:</span>
                  <strong className="text-green-700">{job.applicationFee.scStPh}</strong>
                </li>
              )}
              {job.applicationFee.allCategoryFemale && (
                <li className="flex justify-between border-b border-dashed border-gray-300 pb-1.5">
                  <span className="text-gray-700">All Category Female:</span>
                  <strong className="text-green-700">{job.applicationFee.allCategoryFemale}</strong>
                </li>
              )}
            </ul>
            {job.applicationFee.paymentMode && (
              <div className="mt-3.5 p-2.5 bg-gray-100 rounded border border-gray-200 text-xs sm:text-sm text-gray-800 font-medium">
                <strong>Payment Mode:</strong> {job.applicationFee.paymentMode}
              </div>
            )}
          </div>
        </div>

        {/* Age Limit Section */}
        {(job.ageLimit.minAge || job.ageLimit.maxAge || job.ageLimit.extraRules) && (
          <div className="p-5 border-b border-gray-200 bg-red-50/40">
            <h3 className="bg-[#b22222] text-white text-sm sm:text-base font-extrabold uppercase p-2 text-center rounded mb-3">
              Age Limit Criteria {job.ageLimit.asOnDate && `(As on ${job.ageLimit.asOnDate})`}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm sm:text-base text-gray-900 font-semibold">
              <div>
                {job.ageLimit.minAge && (
                  <p className="mb-1">
                    • Minimum Age: <strong className="text-red-700">{job.ageLimit.minAge}</strong>
                  </p>
                )}
                {job.ageLimit.maxAge && (
                  <p className="mb-1">
                    • Maximum Age: <strong className="text-red-700">{job.ageLimit.maxAge}</strong>
                  </p>
                )}
              </div>
              <div>
                {job.ageLimit.extraRules && (
                  <p className="text-gray-800 italic">• {job.ageLimit.extraRules}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Vacancy Details Table */}
        {job.vacancyDetails && job.vacancyDetails.length > 0 && (
          <div className="p-5 border-b border-gray-200">
            <h3 className="bg-[#b22222] text-white text-sm sm:text-base font-extrabold uppercase p-2 text-center rounded mb-3">
              Vacancy Details & Eligibility Qualification
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm sm:text-base text-left border border-gray-300">
                <thead className="bg-red-800 text-white uppercase text-xs sm:text-sm font-extrabold">
                  <tr>
                    <th className="p-3 border border-gray-300">Post Name</th>
                    <th className="p-3 border border-gray-300">Total Post</th>
                    <th className="p-3 border border-gray-300">Eligibility</th>
                    <th className="p-3 border border-gray-300">Gender</th>
                    <th className="p-3 border border-gray-300">Category Wise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {job.vacancyDetails.map((v, i) => (
                    <tr key={i} className="hover:bg-gray-50 font-medium">
                      <td className="p-3 border border-gray-300 font-extrabold text-red-900">{v.postName}</td>
                      <td className="p-3 border border-gray-300 font-extrabold text-gray-900">{v.totalPosts}</td>
                      <td className="p-3 border border-gray-300 text-gray-800">{v.eligibility}</td>
                      <td className="p-3 border border-gray-300 text-gray-800">
                        {v.maleVacancy && <div>Male: {v.maleVacancy}</div>}
                        {v.femaleVacancy && <div>Female: {v.femaleVacancy}</div>}
                      </td>
                      <td className="p-3 border border-gray-300 text-gray-800 text-xs">
                        {v.categoryWiseSeats && Object.entries(v.categoryWiseSeats).map(([k, val]) => (
                            <div key={k}>{k.toUpperCase()}: {val}</div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Useful Important Links Table */}
        <div className="p-5 bg-amber-50/60">
          <h3 className="bg-[#b22222] text-white text-sm sm:text-base font-extrabold uppercase p-2 text-center rounded mb-3">
            Some Useful Important Links
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm sm:text-base text-left border border-gray-300 bg-white">
              <tbody className="divide-y divide-gray-200 font-extrabold">
                {job.links.applyOnline && (
                  <tr>
                    <td className="p-2.5 border border-gray-300 text-red-800 w-1/2">
                      Apply Online Form
                    </td>
                    <td className="p-2.5 border border-gray-300">
                      <a
                        href={job.links.applyOnline}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded inline-flex items-center gap-1 shadow-xs transition"
                      >
                        Click Here <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                )}
                {job.links.downloadNotification && (
                  <tr>
                    <td className="p-2.5 border border-gray-300 text-red-800">
                      Download Official Notification PDF
                    </td>
                    <td className="p-2.5 border border-gray-300">
                      <a
                        href={job.links.downloadNotification}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded inline-flex items-center gap-1 shadow-xs transition"
                      >
                        Download PDF <Download className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                )}
                {job.links.downloadAdmitCard && (
                  <tr>
                    <td className="p-2.5 border border-gray-300 text-red-800">
                      Download Admit Card / Hall Ticket
                    </td>
                    <td className="p-2.5 border border-gray-300">
                      <a
                        href={job.links.downloadAdmitCard}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-purple-700 hover:bg-purple-800 text-white px-3 py-1 rounded inline-flex items-center gap-1 shadow-xs transition"
                      >
                        Download Admit Card <Download className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                )}
                {job.links.downloadResult && (
                  <tr>
                    <td className="p-2.5 border border-gray-300 text-red-800">
                      Download Selection Result / Score Card
                    </td>
                    <td className="p-2.5 border border-gray-300">
                      <a
                        href={job.links.downloadResult}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded inline-flex items-center gap-1 shadow-xs transition"
                      >
                        Check Result <Download className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                )}
                {job.links.downloadAnswerKey && (
                  <tr>
                    <td className="p-2.5 border border-gray-300 text-red-800">
                      Download Official Answer Key
                    </td>
                    <td className="p-2.5 border border-gray-300">
                      <a
                        href={job.links.downloadAnswerKey}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded inline-flex items-center gap-1 shadow-xs transition"
                      >
                        Download Answer Key <Download className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                )}
                {job.links.downloadSyllabus && (
                  <tr>
                    <td className="p-2.5 border border-gray-300 text-red-800">
                      Download Exam Syllabus PDF
                    </td>
                    <td className="p-2.5 border border-gray-300">
                      <a
                        href={job.links.downloadSyllabus}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-teal-700 hover:bg-teal-800 text-white px-3 py-1 rounded inline-flex items-center gap-1 shadow-xs transition"
                      >
                        Download Syllabus <Download className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                )}
                {job.links.officialWebsite && (
                  <tr>
                    <td className="p-2.5 border border-gray-300 text-red-800">
                      Official Portal Website
                    </td>
                    <td className="p-2.5 border border-gray-300">
                      <a
                        href={job.links.officialWebsite}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-gray-800 hover:bg-black text-white px-3 py-1 rounded inline-flex items-center gap-1 shadow-xs transition"
                      >
                        Official Website <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                )}
                {job.links.officialSource && (
                  <tr>
                    <td className="p-2.5 border border-gray-300 text-red-800">
                      Official Source
                    </td>
                    <td className="p-2.5 border border-gray-300">
                      <a
                        href={job.links.officialSource}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded inline-flex items-center gap-1 shadow-xs transition"
                      >
                        Visit Official Source <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* How to Fill Form Guidance */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-700 space-y-2">
          <h4 className="font-extrabold text-red-900 text-xs uppercase">
            📝 How to Fill Online Application Form Instructions:
          </h4>
          <ol className="list-decimal list-inside space-y-1 font-medium text-gray-800">
            <li>Read the Official Notification before applying for the recruitment application form.</li>
            <li>Check and collect all documents: Eligibility, ID Proof, Address Details, Basic Details.</li>
            <li>Ready scan documents related to recruitment form: Photo, Sign, ID Proof, Qualification Marksheets.</li>
            <li>Before submitting the application form, check the preview and all columns carefully.</li>
            <li>Take a print out of final submitted form for future reference.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

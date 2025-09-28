// components/Disclaimer.tsx
export default function Disclaimer() {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-2 flex flex-col md:flex-row mt-0 items-start gap-2 sticky top-0 z-50">
      <div className="flex-shrink-0">
        <svg
          className="w-6 h-6 text-yellow-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8z" />
        </svg>
      </div>
      <div className="flex flex-col">
        <p className="text-yellow-800 font-semibold">⚠ Posting Disclaimer</p>
        <p className="text-yellow-700 text-sm">
          You can post up to <strong>3 posts per day</strong>.  
          Currently, posting works only for <strong>Twitter</strong> and <strong>LinkedIn</strong>.  
          Instagram posting is not available due to API restrictions.  
          We are working to add Instagram support soon.
        </p>
      </div>
    </div>
  );
}

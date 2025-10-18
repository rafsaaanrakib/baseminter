import { useState } from 'react';

export default function FeedbackForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!message) {
      setError('Please enter your feedback.');
      return;
    }
    // Simulate submission (replace with API integration)
    setTimeout(() => {
      setSubmitted(true);
    }, 700);
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto p-6 rounded-2xl bg-green-50 border border-green-300 text-green-800 shadow-lg mt-10 text-center" role="status">
        <h4 className="text-xl font-bold mb-2">Thank you for your feedback!</h4>
        <p>We appreciate your input and will use it to improve BaseMinter.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 rounded-2xl bg-white/40 border border-blue-300/30 shadow-lg mt-10 flex flex-col gap-6" aria-label="Send feedback">
      <h4 className="text-lg font-bold text-[#0000FF] mb-2">Send Feedback</h4>
      <label htmlFor="feedback-email" className="text-blue-900 font-semibold">Email (optional)</label>
      <input
        id="feedback-email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="px-4 py-2 rounded-xl border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="you@domain.com"
        aria-label="Your email (optional)"
      />
      <label htmlFor="feedback-message" className="text-blue-900 font-semibold">Your Feedback</label>
      <textarea
        id="feedback-message"
        value={message}
        onChange={e => setMessage(e.target.value)}
        className="px-4 py-2 rounded-xl border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[100px]"
        placeholder="Let us know what you think..."
        required
        aria-required="true"
        aria-label="Your feedback"
      />
      {error && <p className="text-red-500 font-bold" role="alert">{error}</p>}
      <button
        type="submit"
        className="w-full py-3 px-6 bg-gradient-to-r from-[#0000FF] to-blue-400 text-white font-extrabold rounded-xl shadow hover:shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-60"
        aria-label="Submit feedback"
      >
        Send Feedback
      </button>
    </form>
  );
}

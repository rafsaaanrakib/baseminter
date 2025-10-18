import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-gradient-to-br from-[#0000FF] via-blue-500 to-blue-200"
      role="main"
      aria-label="Hero section"
    >
      <section className="bg-white/10 rounded-2xl p-8 shadow-xl backdrop-blur-md max-w-2xl w-full" aria-labelledby="hero-title">
        <h1 id="hero-title" className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-[#0000FF] to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
          Mint. Meme. Make History on <span className="text-[#0000FF]">Base</span>.
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-blue-900 mb-8 max-w-2xl font-medium">
          Deploy your own ERC20 token on Base in seconds. No coding required.
        </p>
        <motion.button
          whileHover={{ scale: 1.07, boxShadow: '0 0 40px rgba(0,0,255,0.5)', filter: 'brightness(1.1)' }}
          whileTap={{ scale: 0.97, filter: 'brightness(0.95)' }}
          className="px-8 py-4 text-base sm:text-lg font-bold text-white bg-[#0000FF] rounded-xl shadow-[0_0_30px_rgba(0,0,255,0.3)] hover:shadow-[0_0_40px_rgba(0,0,255,0.5)] transition-shadow focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-60"
          tabIndex={0}
          aria-label="Mint your token"
          onClick={() => {
            const el = document.getElementById('token-form-title');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }}
        >
          Mint Your Token
        </motion.button>
      </section>
    </motion.main>
  );
}
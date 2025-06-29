import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simulate delay after loader (e.g., app ready)
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500); // Adjust delay as needed
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      {/* Background Image */}
      <img
        src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
        alt="Recruitment banner"
        className="absolute inset-0 object-cover w-full h-full"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-indigo-900 opacity-80"></div>

      {/* Content Wrapper */}
      <div className="relative z-10 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-screen-xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-12">

          {/* Left: Animated Text */}
          <motion.div
            initial={{ x: -120, opacity: 0 }}
            animate={isVisible ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 1.4, ease: 'easeOut' , delay:0.8}}
            className="text-white w-full lg:w-7/12 text-center lg:text-left"
          >
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
              AI-Powered Hiring<br />
              That Matches You Faster
            </h1>
            <p className="text-indigo-100 text-lg mb-6">
              Post your job. Get matched with vetted recruiters. Track everything in one smart dashboard.
            </p>
            <a
              href="#how-it-works"
              className="inline-flex items-center text-teal-300 font-medium hover:text-white transition"
            >
              See how it works
              <svg className="w-3 h-3 ml-2" fill="currentColor" viewBox="0 0 12 12">
                <path d="M9.707,5.293l-5-5A1,1,0,0,0,3.293,1.707L7.586,6,3.293,10.293a1,1,0,1,0,1.414,1.414l5-5A1,1,0,0,0,9.707,5.293Z" />
              </svg>
            </a>
          </motion.div>

          {/* Right: Animated Form */}
          <motion.div
            initial={{ x: 110, opacity: 0 }}
            animate={isVisible ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 1.3, ease: 'easeOut', delay: 0.8 }}
            className="w-full max-w-md"
          >
            <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8">
              <h3 className="text-xl font-semibold text-center mb-6">
                Get Early Access
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input
                    type="text"
                    placeholder="Your Company"
                    required
                    className="mt-1 block w-full h-11 px-4 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Business Email</label>
                  <input
                    type="email"
                    placeholder="you@company.com"
                    required
                    className="mt-1 block w-full h-11 px-4 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Looking to hire for</label>
                  <input
                    type="text"
                    placeholder="e.g., Sales, Tech, Marketing"
                    className="mt-1 block w-full h-11 px-4 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-900 text-white py-2 rounded-md hover:bg-indigo-700 transition"
                >
                  Request Access
                </button>
                <p className="text-xs text-gray-600 text-center mt-3">
                  We’ll contact you once onboarding opens. No spam, promise.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Bottom SVG */}
      <svg
        className="absolute inset-x-0 bottom-0 text-white z-0"
        viewBox="0 0 1160 163"
      >
        <path
          fill="currentColor"
          d="M-164 13L-104 39.7C-44 66 76 120 196 141C316 162 436 152 556 119.7C676 88 796 34 916 13C1036 -8 1156 2 1216 7.7L1276 13V162.5H1216C1156 162.5 1036 162.5 916 162.5C796 162.5 676 162.5 556 162.5C436 162.5 316 162.5 196 162.5C76 162.5 -44 162.5 -104 162.5H-164V13Z"
        />
      </svg>
    </div>
  );
};

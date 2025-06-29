import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Kenzie Edgar",
    img: "https://i.pravatar.cc/100?img=1",
    message:
      "Using this platform streamlined our entire hiring workflow. Finding the right recruiters is now effortless.",
  },
  {
    name: "Stevie Tifft",
    img: "https://i.pravatar.cc/100?img=2",
    message:
      "An incredibly intuitive system. It’s like having an AI hiring assistant on our team.",
  },
  {
    name: "Tommie Ewart",
    img: "https://i.pravatar.cc/100?img=3",
    message:
      "This platform saved us hours in manual coordination with recruiters. Highly recommended!",
  },
  {
    name: "Charlie Howse",
    img: "https://i.pravatar.cc/100?img=4",
    message:
      "We got great matches from verified recruiters and tracked everything in one dashboard.",
  },
  {
    name: "Nevada Herbertson",
    img: "https://i.pravatar.cc/100?img=5",
    message:
      "Our recruitment speed improved dramatically. It’s smart, fast, and easy to use.",
  },
  {
    name: "Kris Stanton",
    img: "https://i.pravatar.cc/100?img=6",
    message:
      "This is the kind of recruitment tech we’ve been waiting for. No more messy spreadsheets!",
  },
];

const Testimonials = ({ animationVariants }) => {
  return (
    <div className="w-full bg-white border-y border-gray-200 px-5 py-16 md:py-24 text-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-5 text-gray-600">
            What people <br /> are saying.
          </h1>
          <h3 className="text-xl mb-5 font-light">
            Here’s how we’re helping teams hire better, faster, and smarter.
          </h3>
          <div className="text-center mb-10">
            <span className="inline-block w-1 h-1 rounded-full bg-indigo-500 ml-1"></span>
            <span className="inline-block w-3 h-1 rounded-full bg-indigo-500 ml-1"></span>
            <span className="inline-block w-40 h-1 rounded-full bg-indigo-500"></span>
            <span className="inline-block w-3 h-1 rounded-full bg-indigo-500 ml-1"></span>
            <span className="inline-block w-1 h-1 rounded-full bg-indigo-500 ml-1"></span>
          </div>
        </div>

        <div className="-mx-3 md:flex flex-wrap items-start justify-center">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="px-3 md:w-1/3"
              initial="hiddenLeft"
              whileInView="visible"
              custom={i}
              viewport={{ once: true, amount: 0.2 }}
              variants={animationVariants}
            >
              <div className="w-full mx-auto rounded-lg bg-white border border-gray-200 p-5 text-gray-800 font-light mb-6">
                <div className="flex items-center mb-4">
                  <div className="overflow-hidden rounded-full w-10 h-10 bg-gray-50 border border-gray-200">
                    <img src={t.img} alt={t.name} />
                  </div>
                  <div className="flex-grow pl-3">
                    <h6 className="font-bold text-sm uppercase text-gray-600">{t.name}</h6>
                  </div>
                </div>
                <p className="text-sm leading-tight">
                  <span className="text-lg leading-none italic font-bold text-gray-400 mr-1">"</span>
                  {t.message}
                  <span className="text-lg leading-none italic font-bold text-gray-400 ml-1">"</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;

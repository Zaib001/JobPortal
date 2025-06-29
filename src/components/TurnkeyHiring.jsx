import { useState } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaClock, FaMapMarkerAlt } from "react-icons/fa";

const infoData = {
    PATH: {
        title: "Platform-Aided Turnkey Hiring (PATH)",
        text:
            "No more missing hiring deadlines! CBREX’s PATH is the next-gen solution that revolutionizes hiring for niche skills and hard-to-fill locations at scale, through a global vendor marketplace."
    },
    "Vendor Consolidation": {
        title: "Vendor Consolidation",
        text:
            "Easily manage all vendors under one platform, simplifying your recruitment pipeline and enhancing accountability."
    },
    "Multi-Geo": {
        title: "Multi-Geo",
        text:
            "Source talent across various locations with optimized logistics and compliance using a unified system."
    }
};

const HiringModule = () => {
    const [active, setActive] = useState("PATH");

    return (
        <section className="relative py-16 px-4 sm:px-6 lg:px-16 bg-white">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-32 max-w-7xl mx-auto items-start"
            >
                {/* Left Side - Textual Info */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="relative z-10"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                        Complete Talent Sourcing Solutions for Both Full-time and Contract Jobs
                    </h2>

                    <div className="flex flex-col gap-3 mb-6">
                        {Object.keys(infoData).map((key) => (
                            <button
                                key={key}
                                onClick={() => setActive(key)}
                                className={`text-left px-4 py-2 rounded-lg font-medium transition-all duration-200 ${active === key
                                    ? "bg-indigo-100 text-indigo-600"
                                    : "bg-gray-100 text-gray-700 hover:bg-indigo-50"
                                    }`}
                            >
                                {key}
                            </button>
                        ))}
                    </div>

                    <div className="border rounded-xl p-6 shadow-sm bg-white">
                        <h3 className="text-indigo-600 font-semibold text-xl mb-2">
                            {infoData[active].title}
                        </h3>
                        <p className="text-gray-700">
                            {infoData[active].text}
                        </p>
                    </div>
                </motion.div>

                {/* Right Side - Visual Representation */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="relative w-full max-w-4xl mx-auto mt-10 lg:mt-0"
                >
                    {/* Main user image */}
                    <img
                        src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D"
                        alt="Main Visual"
                        className="w-full rounded-xl shadow-lg"
                    />

                    {/* Indigo Requirements Box */}
                    <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 bg-gradient-to-b from-indigo-400 to-indigo-600 text-white p-6 rounded-xl shadow-xl w-60">
                        <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                        <hr className="border-indigo-300 mb-4" />
                        <div className="space-y-4 text-sm">
                            <div className="flex items-center gap-3">
                                <FaUsers className="text-white text-base" />
                                <span>20 Designers</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaClock className="text-white text-base" />
                                <span>2 Weeks</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaMapMarkerAlt className="text-white text-base" />
                                <span>Location</span>
                            </div>
                        </div>
                    </div>

                    {/* Clock Ticking Overlay */}
                    <img
                        src="https://images.unsplash.com/photo-1701956532817-018bd4f4c34b?w=600&auto=format&fit=crop&q=60"
                        alt="Clock Ticking"
                        className="absolute -top-14 -right-8 w-36 rounded-lg shadow-md"
                    />

                    {/* Dashboard Overlay */}
                    <img
                        src="https://colorlib.com/wp/wp-content/uploads/sites/2/free-dashboard-templates-1.jpg"
                        alt="Dashboard"
                        className="absolute -bottom-10 -right-6 w-44 rounded-lg shadow-lg"
                    />
                </motion.div>
            </motion.div>
        </section>
    );
};

export default HiringModule;

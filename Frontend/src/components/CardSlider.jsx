import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const teachers = [
  {
    id: 1,
    name: "Mr. Shivam Sahani",
    subject: "Mathematics / English",
    qualification: "B.Sc , M.Sc",
    image: "/Images/teacher1.jpg",
  },
  {
    id: 2,
    name: "Mr. Ajay Sahani",
    subject: "Science / Math / Computer",
    qualification: "B.Tech Computer Science[AI&ML]",
    image: "/Images/teacher3.jpg",
  },
  {
    id: 3,
    name: "Mr. Nirbhay Sahani",
    subject: "Hindi / General Knowledge",
    qualification: "B.A [Hindi] , BTC",
    image: "/Images/teacher4.jpg",
  },
];

const achievers = [
  {
    id: 1,
    name: "XYZ Singh",
    achievement: "10th Topper 2024",
    qualification: "96%",
    image: "",
  },
  {
    id: 2,
    name: "XYZ Sahani",
    achievement: "12th Selection",
    qualification: "92%",
    image: "",
  },
];

const Card = ({ item, type }) => {
  const getImage = (img) =>
    img && img !== "xyz" ? img : "/Images/default.jpg";

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="
        bg-orange-100/40 dark:bg-white/5
        backdrop-blur-xl
        border border-orange-400 dark:border-white/10
        rounded-2xl shadow-xl
        p-5 text-center h-[260px] flex flex-col justify-center
      "
    >
      <img
        src={getImage(item.image)}
        alt={item.name}
        className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-orange-500 object-cover"
      />

      <h3 className="text-sm font-semibold text-black dark:text-white">
        {item.name}
      </h3>

      <p className="text-orange-500 text-sm font-medium">
        {type === "teacher" ? item.subject : item.achievement}
      </p>

      <p className="text-gray-600 dark:text-gray-400 text-xs">
        {item.qualification}
      </p>
    </motion.div>
  );
};

const SliderRow = ({ data, type, title }) => {
  const [index, setIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);

  // 🔥 Responsive
  useEffect(() => {
    const updateView = () => {
      if (window.innerWidth < 640) setCardsPerView(1);
      else if (window.innerWidth < 1024) setCardsPerView(2);
      else setCardsPerView(3);
    };

    updateView();
    window.addEventListener("resize", updateView);
    return () => window.removeEventListener("resize", updateView);
  }, []);

  // 🔥 Auto Slide
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev >= data.length - cardsPerView ? 0 : prev + 1));
    }, 2500); // speed

    return () => clearInterval(interval);
  }, [data.length, cardsPerView]);

  const nextSlide = () => {
    setIndex((prev) => (prev >= data.length - cardsPerView ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setIndex((prev) => (prev <= 0 ? data.length - cardsPerView : prev - 1));
  };

  return (
    <section>
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center md:text-left">
        {title}
      </h2>

      <div className="flex items-center gap-3">
        {/* Slider */}
        <div className="overflow-hidden w-full">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${index * (100 / cardsPerView)}%)`,
            }}
          >
            {data.map((item) => (
              <div
                key={item.id}
                className="px-2 flex-shrink-0"
                style={{ width: `${100 / cardsPerView}%` }}
              >
                <Card item={item} type={type} />
              </div>
            ))}
          </div>
        </div>

        {/* Next */}
      </div>
    </section>
  );
};

const CardSlider = () => {
  return (
    <div className="space-y-16">
      <SliderRow data={teachers} type="teacher" title="👩‍🏫 Our Teachers" />
      <section className="bg-orange-100 dark:bg-gray-900 border border-orange-400 dark:border-white/10 p-6 rounded-xl text-center">
        <blockquote className="italic text-black dark:text-gray-200 text-xl">
          “Education is the most powerful weapon which you can use to change the
          world.”
          <span className="block mt-2 font-semibold text-orange-500">
            – Nelson Mandela
          </span>
        </blockquote>
      </section>
      <SliderRow data={achievers} type="achiever" title="Our Achievers" />
    </div>
  );
};

export default CardSlider;

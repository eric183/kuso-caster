import { motion } from "framer-motion";
import { useEffect } from "react";

export const FeedList = () => {
  useEffect(() => {
    console.log("FeedList");
  }, []);
  return (
    <nav className="col-span-1 border-r-2 border-gray-600">
      <ul className="flex flex-col">
        <li className="flex items-center justify-between py-2">
          <motion.img src=""></motion.img>
        </li>
      </ul>
    </nav>
  );
};

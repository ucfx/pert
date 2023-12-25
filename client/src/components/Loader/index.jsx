import "./style.css";
import { motion } from "framer-motion";
const Loader = () => {
    return (
        <motion.div
            className="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <span></span>
            <span></span>
        </motion.div>
    );
};

export default Loader;

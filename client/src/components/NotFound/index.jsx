import React from "react";
import { Flex, Heading, Text, Link } from "@chakra-ui/react";
import { motion } from "framer-motion";

const NotFound = () => {
    return (
        <Flex
            align="center"
            justify="center"
            minH="100vh"
            direction="column"
            textAlign="center"
        >
            <motion.div
                initial={{ opacity: 0, translateY: -20 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, translateY: -20 }}
            >
                <Heading fontSize="6xl" color="red.500">
                    404
                </Heading>
                <Text fontSize="xl" fontWeight="bold" mt={4}>
                    Page not found
                </Text>
            </motion.div>
        </Flex>
    );
};

export default NotFound;

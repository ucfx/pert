import usePageTitle from "hooks/usePageTitle";
import { useEffect } from "react";
import {
    Box,
    Heading,
    VStack,
    Grid,
    Text,
    Divider,
    Skeleton,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import "./style.css";

const Projects = () => {
    const { updatePageTitle } = usePageTitle();
    const {
        data: { projects },
        loading,
    } = useOutletContext();
    useEffect(() => {
        updatePageTitle("Projects");
    }, [updatePageTitle]);

    return (
        <Box p={4}>
            <Heading
                as={motion.h1}
                initial={{ translateX: -8, opacity: 0 }}
                animate={{
                    translateX: 0,
                    opacity: 1,
                    transition: { duration: 0.5, delay: 0.2 },
                }}
                mb={4}
            >
                My Projects
            </Heading>
            <Divider
                as={motion.hr}
                initial={{ translateY: 8, opacity: 0 }}
                animate={{
                    translateY: 0,
                    opacity: 1,
                    transition: { duration: 0.5, delay: 0.4 },
                }}
                mb={4}
                borderWidth={2}
                borderColor="gray.400"
            />
            <Grid templateColumns="repeat(4, 1fr)" gap={6}>
                {!loading &&
                    projects.map((project) => (
                        <motion.div
                            key={project._id}
                            initial={{
                                opacity: 0,
                                translateY: 10,
                            }}
                            animate={{
                                opacity: 1,
                                translateY: 0,
                                transition: { duration: 0.5 },
                            }}
                            transition={{ duration: 0.2 }}
                            exit={{ opacity: 0, translateY: -10 }}
                            w={"250%"}
                        >
                            <VStack
                                className="project-card"
                                bg="purple.100"
                                p={4}
                                borderRadius="md"
                                boxShadow="md"
                                spacing={2}
                                align="start"
                                w="100%"
                            >
                                <Heading size="md">{project.title}</Heading>
                                <Text fontSize="sm" color="gray.600">
                                    ID: {project._id}
                                </Text>
                            </VStack>
                        </motion.div>
                    ))}
            </Grid>
        </Box>
    );
};

export default Projects;

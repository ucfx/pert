import usePageTitle from "hooks/usePageTitle";
import { useEffect } from "react";
import { Box, Heading, Grid, Flex, VStack, Text } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import "./style.css";
import CreateProject from "./CreateProject";
import useProject from "hooks/useProjects";
import ProjectCard from "./ProjectCard";
const Projects = () => {
    const { updatePageTitle } = usePageTitle();
    const { data: projects, loading, updateData } = useProject();
    useEffect(() => {
        updatePageTitle("Projects");
    }, [updatePageTitle]);

    return (
        <Flex h={"100%"} flexDirection={"column"} pos={"relative"} zIndex={1}>
            <Flex
                justifyContent={"space-between"}
                alignItems={"center"}
                h={"14%"}
                bg={"purple.50"}
                borderBottom={"2px solid"}
                borderColor={"purple.100"}
                boxSizing="border-box"
                boxShadow={
                    "0 0 5px 0 rgba(0,0,0,0.5), 0 0 20px 0 rgba(0,0,0,0.1)"
                }
                pos={"relative"}
                zIndex="1"
                p="4"
            >
                <Heading
                    as={motion.h1}
                    position="relative"
                    initial={{
                        translateX: -8,
                        opacity: 0,
                    }}
                    animate={{
                        translateX: 0,
                        opacity: 1,
                        transition: { duration: 0.5, delay: 0.2 },
                    }}
                    pl={4}
                    _before={{
                        content: "''",
                        position: "absolute",
                        top: "0",
                        left: "0",
                        margin: "0 auto",
                        width: "4px",
                        height: "100%",
                        borderRadius: "4px",
                        background: "purple.300",
                    }}
                    fontSize={"3xl"}
                >
                    My Projects
                </Heading>
                <CreateProject
                    updateData={updateData}
                    titleList={
                        (projects &&
                            projects.map((project) => project.title)) ||
                        []
                    }
                />
            </Flex>
            <Box
                position="relative"
                overflow={"hidden"}
                overflowY={"auto"}
                className="youcef"
                p={4}
                pl={2}
                pr={2}
                ml={1}
                mr={1}
                h={"86%"}
                style={{
                    scrollbarGutter: "stable both-edges",
                }}
            >
                <AnimatePresence>
                    {!loading && projects && projects.length === 0 && (
                        <VStack
                            as={motion.div}
                            initial={{
                                opacity: 0,
                                translateY: -10,
                            }}
                            animate={{
                                opacity: 1,
                                translateY: 0,
                            }}
                            exit={{
                                opacity: 0,
                                translateY: -10,
                            }}
                            transition={{
                                duration: 0.5,
                            }}
                            w={"100%"}
                            h={"100%"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            spacing={4}
                        >
                            <Text fontSize={"xl"} fontWeight={"bold"}>
                                You don't have any projects yet. Create one!
                            </Text>
                            <CreateProject
                                updateData={updateData}
                                titleList={
                                    (projects &&
                                        projects.map(
                                            (project) => project.title
                                        )) ||
                                    []
                                }
                                popoverPlacement={"top"}
                            />
                        </VStack>
                    )}
                </AnimatePresence>

                <Grid
                    gridAutoRows={{
                        base: "minmax(auto, 140px)",
                        md: "minmax(auto, 140px)",
                        lg: "minmax(auto, 140px)",
                    }}
                    templateColumns={{
                        base: "repeat(1, 1fr)",
                        md: "repeat(2, 1fr)",
                        lg: "repeat(3, 1fr)",
                        xl: "repeat(4, 1fr)",
                    }}
                    gap={6}
                >
                    {!loading &&
                        projects &&
                        projects.map((project) => (
                            <ProjectCard
                                key={project._id}
                                project={project}
                                updateData={updateData}
                            />
                        ))}
                </Grid>
            </Box>
        </Flex>
    );
};

export default Projects;

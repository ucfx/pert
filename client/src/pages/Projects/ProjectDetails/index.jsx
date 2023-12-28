import usePageTitle from "hooks/usePageTitle";
import { useEffect } from "react";
import { Box, Heading, Grid, Flex, Button, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

import DeletePopover from "components/DeletePopover";
import useProjectDetails from "hooks/useProjectDetails";
import UpdateProjectTitle from "pages/Projects/UpdateProjectTitle";
import "../style.css";
const ProjectDetails = () => {
    const { updatePageTitle } = usePageTitle();
    const { data: project, loading, updateData } = useProjectDetails();
    const location = useLocation();
    useEffect(() => {
        if (project) updatePageTitle("Projects", "Projects | " + project.title);
    }, [updatePageTitle, project]);
    const navigate = useNavigate();

    return (
        <Flex
            className="project-details"
            h={"100%"}
            flexDirection={"column"}
            pos={"relative"}
            zIndex={1}
        >
            {project && (
                <Flex
                    as={motion.div}
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                        transition: { duration: 0.5 },
                    }}
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
                    <>
                        <Heading
                            as={motion.h2}
                            position="relative"
                            initial={{
                                translateX: -8,
                                opacity: 0,
                            }}
                            animate={{
                                translateX: 0,
                                opacity: 1,
                                transition: { duration: 0.5 },
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
                        >
                            <i
                                className="fa-solid fa-chevron-left back-icon"
                                onClick={() => navigate(-1)}
                            />
                            <i className="fa-duotone fa-diagram-project" />
                            {project.title}
                            <UpdateProjectTitle
                                project={project}
                                updateData={updateData}
                                currentTitle={project.title}
                            />
                            <Flex
                                fontSize={"md"}
                                align={"center"}
                                color={"purple.400"}
                            >
                                <Text mr={2}>{project._id}</Text>
                                <i
                                    className="fa-regular fa-copy hint-message"
                                    data-hint="Copy"
                                    onClick={(e) => {
                                        e.target.setAttribute(
                                            "data-hint",
                                            "Copied!"
                                        );
                                        setTimeout(() => {
                                            e.target.setAttribute(
                                                "data-hint",
                                                "Copy"
                                            );
                                        }, 1000);
                                        navigator.clipboard.writeText(
                                            project._id
                                        );
                                    }}
                                />
                            </Flex>
                        </Heading>

                        <DeletePopover projectId={project._id} />
                    </>
                </Flex>
            )}
            {!loading && !project && (
                <Flex
                    mt={"150px"}
                    h={"100%"}
                    w={"100%"}
                    justifyContent={"center"}
                    flexDirection={"column"}
                    alignItems={"center"}
                >
                    <Text fontSize={"xl"}>
                        Project not found, Maybe it was deleted.
                    </Text>
                    <Text fontSize={"md"}>Go back to projects page.</Text>
                    <Button
                        mt={4}
                        colorScheme="purple"
                        onClick={() =>
                            navigate(
                                location.pathname
                                    .split("/")
                                    .slice(0, 3)
                                    .join("/")
                            )
                        }
                    >
                        Go back
                    </Button>
                </Flex>
            )}
            <Box
                position="relative"
                overflow={"hidden"}
                overflowY={"auto"}
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
                <Grid
                    templateColumns={{
                        base: "repeat(1, 1fr)",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(3, 1fr)",
                        lg: "repeat(4, 1fr)",
                        xl: "repeat(5, 1fr)",
                    }}
                    gap={4}
                    className="grid"
                ></Grid>
            </Box>
        </Flex>
    );
};

export default ProjectDetails;

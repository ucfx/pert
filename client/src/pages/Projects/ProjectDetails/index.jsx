import usePageTitle from "hooks/usePageTitle";
import { useEffect } from "react";
import { Box, Heading, Grid, Flex, Button, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

import DeletePopover from "components/DeletePopover";
import Table from "components/Table";
import useProjectDetails from "hooks/useProjectDetails";
import UpdateProjectTitle from "pages/Projects/UpdateProjectTitle";
import { BsDiagram3Fill } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { MdContentCopy } from "react-icons/md";
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
                {project && (
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
                            {/* <i
                                className="fa-solid fa-chevron-left "
                                onClick={() => navigate(-1)}
                            /> */}
                            <IoIosArrowBack
                                onClick={() => navigate(-1)}
                                className="back-icon"
                                style={{
                                    display: "inline-block",
                                }}
                            />
                            {/* <i className="fa-duotone fa-diagram-project" /> */}
                            <BsDiagram3Fill
                                style={{
                                    display: "inline-block",
                                    marginRight: "10px",
                                }}
                            />
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
                                    className="hint-message"
                                    data-hint="Copy"
                                    onClick={(e) => {
                                        e.target.parentNode.setAttribute(
                                            "data-hint",
                                            "Copied!"
                                        );
                                        setTimeout(() => {
                                            e.target.parentNode.setAttribute(
                                                "data-hint",
                                                "Copy"
                                            );
                                        }, 1000);
                                        navigator.clipboard.writeText(
                                            project._id
                                        );
                                    }}
                                >
                                    <MdContentCopy className="copy-icon" />
                                </i>
                            </Flex>
                        </Heading>

                        <DeletePopover projectId={project._id} />
                    </>
                )}
            </Flex>
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
                <Flex justify={"space-between"} gap={4} className="grid">
                    <Table />
                </Flex>
            </Box>
        </Flex>
    );
};

export default ProjectDetails;

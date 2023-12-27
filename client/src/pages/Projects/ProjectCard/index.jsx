import { motion, AnimatePresence } from "framer-motion";
import {
    Box,
    Flex,
    Heading,
    Text,
    VStack,
    useDisclosure,
    Button,
    ButtonGroup,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverArrow,
    PopoverCloseButton,
    PopoverBody,
    PopoverFooter,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const ProjectCard = ({ project, updateData }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { isOpen: isVisible, onClose: onDelete } = useDisclosure({
        defaultIsOpen: true,
    });
    const navigate = useNavigate();
    const handleDeleteProject = async (projectId) => {
        onClose();
        const {
            data: { projects },
        } = await axios.delete(`/api/projects/${projectId}`);
        onDelete();
        setTimeout(() => {
            updateData(projects);
        }, 500);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{
                        opacity: 0,
                        translateY: 10,
                    }}
                    animate={{
                        opacity: 1,
                        translateY: 0,
                        transition: {
                            duration: 0.5,
                            delay: 0.2,
                        },
                    }}
                    exit={{ opacity: 0, translateY: -10 }}
                    w={"250%"}
                >
                    <VStack
                        className="project-card"
                        bg="purple.100"
                        borderRadius="md"
                        boxShadow="md"
                        spacing={2}
                        align="start"
                        w="100%"
                        p={4}
                    >
                        <Flex
                            w={"100%"}
                            justifyContent={"space-between"}
                            align={"center"}
                            className="project-card-title"
                            onClick={() => {
                                navigate(`${project._id}`);
                            }}
                            _hover={{
                                h2: {
                                    color: "purple.700",
                                },
                                i: {
                                    color: "purple.700",
                                },
                            }}
                        >
                            <Box>
                                <Heading size="md">
                                    <i className="fa-duotone fa-diagram-project" />
                                    {project.title}
                                </Heading>
                                <Text fontSize="sm" color="gray.600">
                                    {project._id}
                                </Text>
                            </Box>
                            <i className="fa-solid fa-chevron-right" />
                        </Flex>

                        <Flex w={"100%"} justifyContent={"space-between"}>
                            <Text fontSize="sm" color="gray.600">
                                Created at:
                                {project.createdAt || "2023-05-22"}
                            </Text>

                            <Popover
                                returnFocusOnClose={true}
                                isOpen={isOpen}
                                onClose={onClose}
                                placement="bottom"
                                closeOnBlur={true}
                            >
                                <PopoverTrigger>
                                    <motion.i
                                        initial={{
                                            opacity: 0,
                                            translateY: 10,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            translateY: 0,
                                            transition: {
                                                duration: 0.5,
                                                delay: 0.3,
                                            },
                                        }}
                                        exit={{ opacity: 0, translateY: -10 }}
                                        onClick={onOpen}
                                        whileHover={{
                                            color: "#b74a42",
                                            transition: {
                                                duration: 0.2,
                                            },
                                        }}
                                        whileTap={{ scale: 0.9 }}
                                        className="fa-regular fa-trash-alt trash-icon"
                                    ></motion.i>
                                </PopoverTrigger>
                                <PopoverContent
                                    bg={"purple.50"}
                                    boxShadow={
                                        "0px 0px 10px 0px rgba(0,0,0,0.45)"
                                    }
                                >
                                    <PopoverHeader
                                        fontWeight="semibold"
                                        borderColor={"purple.300"}
                                    >
                                        Confirmation
                                    </PopoverHeader>
                                    <PopoverArrow />
                                    <PopoverCloseButton />
                                    <PopoverBody>
                                        Are you sure you want to continue with
                                        your action?
                                        <span className="warning-message">
                                            You cannot undo this action
                                            afterwards!
                                        </span>
                                    </PopoverBody>
                                    <PopoverFooter
                                        display="flex"
                                        justifyContent="flex-end"
                                        borderColor={"purple.100"}
                                    >
                                        <ButtonGroup size="sm">
                                            <Button
                                                bg={"purple.100"}
                                                onClick={onClose}
                                                variant="outline"
                                                _hover={{
                                                    bg: "purple.200",
                                                    transition: {
                                                        duration: 0.2,
                                                    },
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    handleDeleteProject(
                                                        project._id
                                                    )
                                                }
                                                colorScheme="red"
                                            >
                                                Apply
                                            </Button>
                                        </ButtonGroup>
                                    </PopoverFooter>
                                </PopoverContent>
                            </Popover>
                        </Flex>
                    </VStack>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProjectCard;

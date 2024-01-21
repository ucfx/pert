import { Pert } from "assets/js";
import usePageTitle from "hooks/usePageTitle";
import { useEffect, useReducer, useState, useMemo, useRef } from "react";
import {
    Box,
    Heading,
    Flex,
    Button,
    Text,
    useToast,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    TabIndicator,
} from "@chakra-ui/react";
import { Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { motion } from "framer-motion";
import { produce } from "immer";
import PertChart from "components/PertChart";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import DeletePopover from "components/DeletePopover";
import Table from "components/Table";
import useProjectDetails from "hooks/useProjectDetails";
import UpdateProjectTitle from "pages/Projects/UpdateProjectTitle";
import { BsDiagram3Fill } from "react-icons/bs";
import { IoIosArrowBack, IoIosSave } from "react-icons/io";
import { MdContentCopy } from "react-icons/md";
import { FaLongArrowAltRight } from "react-icons/fa";

import axios from "axios";

import "../style.css";
const ProjectDetails = () => {
    const { updatePageTitle } = usePageTitle();
    const location = useLocation();
    const [opened, { open, close }] = useDisclosure(false);
    const [saved, setSaved] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);
    const toast = useToast({ position: "top", isClosable: true });
    const { projectId } = useParams();
    const chartContainer = useRef();
    const [imageDimensions, setImageDimensions] = useState({
        width: 50,
        height: 50,
    });
    useEffect(() => {
        if (!chartContainer.current) return;
        const resizeObserver = new ResizeObserver(() => {
            setImageDimensions({
                width: chartContainer.current.offsetWidth,
                height: chartContainer.current.offsetHeight,
            });
        });
        resizeObserver.observe(chartContainer.current);

        return () => resizeObserver.disconnect();
    }, [chartContainer.current]);

    const { data: project, loading, updateData } = useProjectDetails();

    useEffect(() => {
        if (project) updatePageTitle("Projects", "Projects | " + project.title);
    }, [updatePageTitle, project]);
    const navigate = useNavigate();

    const actionTypes = {
        SET_PROJECT: "SET_PROJECT",
        ADD_TASK: "ADD_TASK",
        DELETE_TASK: "DELETE_TASK",
        SAVE_PROJECT: "SAVE_PROJECT",
        UPDATE_TASK_LENGTH: "UPDATE_TASK_LENGTH",
        UPDATE_TASK_NAME: "UPDATE_TASK_NAME",
        TOGGLE_EDITING_NAME: "TOGGLE_EDITING_NAME",
        TOGGLE_EDITING_LENGTH: "TOGGLE_EDITING_LENGTH",
        TOGGLE_EDITING_DEPENDS_ON: "TOGGLE_EDITING_DEPENDS_ON",
        UPDATE_TASK_DEPENDS_ON: "UPDATE_TASK_DEPENDS_ON",
        DELETE_KEY_FROM_EDITABLE: "DELETE_KEY_FROM_EDITABLE",
        ADD_TASK_EDITABLE: "ADD_TASK_EDITABLE",
    };

    const reducer = (state, action) => {
        setSaved(false);
        switch (action.type) {
            case actionTypes.SET_PROJECT:
                setSaved(true);
                return produce(state, (draftState) => {
                    draftState.tasks = action.payload.tasks;
                    draftState.editable = action.payload.editable;
                });

            case actionTypes.ADD_TASK:
                return produce(state, (draftState) => {
                    draftState.tasks.push(action.payload);
                });

            case actionTypes.ADD_TASK_EDITABLE:
                return produce(state, (draftState) => {
                    draftState.editable.push({
                        editingTask: true,
                        editingLength: true,
                    });
                });

            case actionTypes.DELETE_TASK:
                return produce(state, (draftState) => {
                    draftState.tasks.forEach((task) => {
                        if (task.dependsOn) {
                            task.dependsOn = task.dependsOn.filter(
                                (key) => key !== action.payload.taskKey
                            );
                        }
                    });
                    draftState.tasks.splice(action.payload.index, 1);
                    draftState.tasks.forEach((task) => {
                        if (parseInt(task.key) > action.payload.taskKey) {
                            task.key = `${task.key - 1}`;
                        }
                        if (task.dependsOn) {
                            if (task.dependsOn.length === 0) {
                                delete task.dependsOn;
                                return;
                            }
                            task.dependsOn = task.dependsOn.map((key) =>
                                parseInt(key) > action.payload.taskKey
                                    ? `${parseInt(key) - 1}`
                                    : key
                            );
                        }
                    });
                    draftState.editable.splice(action.payload.index, 1);
                });

            case actionTypes.UPDATE_TASK_NAME:
                return produce(state, (draftState) => {
                    draftState.tasks[action.payload.index].text =
                        action.payload.text;
                });
            case actionTypes.UPDATE_TASK_LENGTH:
                return produce(state, (draftState) => {
                    draftState.tasks[action.payload.index].length =
                        action.payload.length;
                });
            case actionTypes.UPDATE_TASK_DEPENDS_ON:
                return produce(state, (draftState) => {
                    draftState.tasks[action.payload.index].dependsOn =
                        action.payload.dependsOn;
                });
            case actionTypes.TOGGLE_EDITING_NAME:
                return produce(state, (draftState) => {
                    draftState.editable[action.payload.index].editingTask =
                        !draftState.editable[action.payload.index].editingTask;
                });
            case actionTypes.TOGGLE_EDITING_LENGTH:
                return produce(state, (draftState) => {
                    draftState.editable[action.payload.index].editingLength =
                        !draftState.editable[action.payload.index]
                            .editingLength;
                });
            default:
                return state;
        }
    };

    const [data, dispatch] = useReducer(reducer, {
        tasks: [],
        editable: [],
    });

    const [nodes, levels, links, criticalPaths] = useMemo(() => {
        try {
            const pert = new Pert(data.tasks).solve();
            console.log("Done");
            console.log(pert.criticalPaths);

            return [pert.nodes, pert.levels, pert.links, pert.criticalPaths];
        } catch (err) {
            console.log(err);
            return [[], {}, []];
        }
    }, [JSON.stringify(data.tasks)]);

    useEffect(() => {
        if (project)
            dispatch({
                type: "SET_PROJECT",
                payload: {
                    tasks: project.tasks,
                    editable: Array.from(
                        { length: project.tasks.length },
                        () => ({
                            editingTask: false,
                            editingLength: false,
                        })
                    ),
                },
            });
    }, [project]);

    const updateProject = (data) => {
        setSaveLoading(true);
        console.log(data);
        console.log(projectId);
        const postData = (data) => {
            return new Promise((resolve, reject) => {
                axios
                    .put(`/api/projects/${projectId}`, data)
                    .then(({ data: { project } }) => {
                        console.log("saved");
                        updateData(project);
                        setSaved(true);
                        resolve();
                    })
                    .catch((err) => {
                        console.log(err);
                        reject();
                    })
                    .finally(() => {
                        setSaveLoading(false);
                    });
            });
        };

        toast.closeAll();
        toast.promise(postData(data), {
            loading: {
                title: "Saving...",
                description: "Please wait.",
            },
            success: () => {
                return {
                    title: "Success!",
                    description: "Saved successfully.",
                    duration: 1500,
                    colorScheme: "purple",
                };
            },
            error: () => {
                return {
                    title: "An error occurred.",
                    description: "Something went wrong!",
                    duration: 3000,
                };
            },
        });
    };

    const nodesToDisplay = nodes.slice(1, -1);

    const taskNames = nodesToDisplay.map((task) => task.text);
    const freeFloats = nodesToDisplay.map((task) => task.freeFloat);
    const totalFloats = nodesToDisplay.map((task) => task.totalFloat);

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
                            <IoIosArrowBack
                                onClick={() => navigate(-1)}
                                className="back-icon"
                                style={{
                                    display: "inline-block",
                                }}
                            />
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
                            </Flex>{" "}
                        </Heading>
                        <Flex align={"center"} gap={5}>
                            <Button
                                onClick={open}
                                colorScheme="purple"
                                mt={4}
                                mb={4}
                                size="sm"
                                variant="outline"
                                width="fit-content"
                                className="show-tasks"
                                _hover={{
                                    background: "purple.100",
                                }}
                            >
                                Show Tasks
                            </Button>
                            <DeletePopover projectId={project._id} />
                        </Flex>
                    </>
                </Flex>
            )}
            {!loading && !project && (
                <Flex
                    mt={"30px"}
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
            {!loading && project && (
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
                    <Drawer
                        offset={1}
                        radius="20px 0 0 20px"
                        size={"ml"}
                        opened={opened}
                        onClose={close}
                        position="right"
                        transitionProps={{
                            transition: "fade",
                            duration: 150,
                            timingFunction: "linear",
                        }}
                        withCloseButton={false}
                    >
                        <Drawer.Header>
                            <Drawer.Title>Tasks</Drawer.Title>
                            <Flex ml="auto" gap={2}>
                                <Button
                                    colorScheme="purple"
                                    leftIcon={<IoIosSave />}
                                    mt={4}
                                    mb={4}
                                    size="sm"
                                    className="show-tasks"
                                    isLoading={saveLoading}
                                    onClick={() =>
                                        updateProject({ tasks: data.tasks })
                                    }
                                    loadingText="Saving..."
                                    isDisabled={saved}
                                >
                                    Save
                                </Button>
                                <Button
                                    onClick={close}
                                    colorScheme="purple"
                                    mt={4}
                                    mb={4}
                                    size="sm"
                                    variant="outline"
                                    className="show-tasks"
                                >
                                    Close
                                </Button>
                            </Flex>
                        </Drawer.Header>
                        <Table
                            data={data}
                            actionTypes={actionTypes}
                            dispatch={dispatch}
                            setSaved={setSaved}
                            saved={saved}
                        />
                    </Drawer>
                    <Tabs
                        isFitted
                        variant="unstyled"
                        height={"calc(100% - 42px)"}
                    >
                        <TabList>
                            <Tab
                                border={"2px solid"}
                                borderColor={"purple.100"}
                                _selected={{
                                    color: "white",
                                    bg: "purple.400",
                                    borderColor: "purple.400",
                                }}
                                _hover={{ borderColor: "purple.400" }}
                            >
                                Pert
                            </Tab>
                            <Tab
                                border={"2px solid"}
                                borderColor={"purple.100"}
                                _selected={{
                                    color: "white",
                                    bg: "purple.400",
                                    borderColor: "purple.400",
                                }}
                                _hover={{ borderColor: "purple.400" }}
                            >
                                Gant
                            </Tab>
                            <Tab
                                border={"2px solid"}
                                borderColor={"purple.100"}
                                _selected={{
                                    color: "white",
                                    bg: "purple.400",
                                    borderColor: "purple.400",
                                }}
                                _hover={{ borderColor: "purple.400" }}
                            >
                                Floats
                            </Tab>
                        </TabList>

                        <TabPanels height={"full"}>
                            <TabPanel height={"full"} pl={0} pr={0}>
                                <Flex
                                    ref={chartContainer}
                                    w={"100%"}
                                    h={"100%"}
                                    className="pert-chart"
                                >
                                    <PertChart
                                        data={data.tasks}
                                        containerWidth={imageDimensions.width}
                                        containerHeight={imageDimensions.height}
                                        nodes={nodes}
                                        levels={levels}
                                        links={links}
                                    />
                                </Flex>
                            </TabPanel>
                            <TabPanel>
                                <p>Gant</p>
                            </TabPanel>
                            <TabPanel>
                                <Flex>
                                    <Box w={"100%"}>
                                        <Heading as="h3" size="md" mb={4}>
                                            Floats
                                        </Heading>
                                        <table style={{ width: "100%" }}>
                                            <thead>
                                                <tr>
                                                    <th
                                                        style={{
                                                            backgroundColor:
                                                                "#D5D5E2",
                                                        }}
                                                    >
                                                        Task
                                                    </th>
                                                    {taskNames.map(
                                                        (task, index) => (
                                                            <th
                                                                key={index}
                                                                style={{
                                                                    backgroundColor:
                                                                        nodesToDisplay[
                                                                            index
                                                                        ]
                                                                            .totalFloat ===
                                                                        0
                                                                            ? "#ffa87d"
                                                                            : "#D5D5E2",
                                                                }}
                                                            >
                                                                {task}
                                                            </th>
                                                        )
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td
                                                        style={{
                                                            backgroundColor:
                                                                "#D5D5E2",
                                                        }}
                                                    >
                                                        FF (ML)
                                                    </td>
                                                    {freeFloats.map(
                                                        (freeFloat, index) => (
                                                            <td key={index}>
                                                                {freeFloat}
                                                            </td>
                                                        )
                                                    )}
                                                </tr>
                                                <tr>
                                                    <td
                                                        style={{
                                                            backgroundColor:
                                                                "#D5D5E2",
                                                        }}
                                                    >
                                                        TF (MT)
                                                    </td>
                                                    {totalFloats.map(
                                                        (totalFloat, index) => (
                                                            <td key={index}>
                                                                {totalFloat}
                                                            </td>
                                                        )
                                                    )}
                                                </tr>
                                            </tbody>
                                        </table>
                                        <Heading as="h3" size="md" mt={4}>
                                            Critical Path
                                        </Heading>
                                        <Flex
                                            justifyContent={"space-between"}
                                            alignItems={"flex-start"}
                                            flexDirection={"column"}
                                            gap={2}
                                            mt={4}
                                        >
                                            {criticalPaths.map(
                                                (path, index) => (
                                                    <Flex
                                                        key={index}
                                                        p={2}
                                                        justifyContent={
                                                            "center"
                                                        }
                                                        gap={2}
                                                        alignItems={"center"}
                                                        bg={"purple.100"}
                                                        borderRadius={"md"}
                                                    >
                                                        {path.map(
                                                            (task, index) => (
                                                                <>
                                                                    <span
                                                                        key={
                                                                            index
                                                                        }
                                                                        style={{
                                                                            fontWeight:
                                                                                "bold",
                                                                        }}
                                                                    >
                                                                        {
                                                                            task.text
                                                                        }
                                                                    </span>
                                                                    {index !==
                                                                        path.length -
                                                                            1 && (
                                                                        <FaLongArrowAltRight
                                                                            fontSize={
                                                                                22
                                                                            }
                                                                        />
                                                                    )}
                                                                </>
                                                            )
                                                        )}
                                                    </Flex>
                                                )
                                            )}
                                        </Flex>
                                    </Box>
                                </Flex>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            )}
        </Flex>
    );
};

export default ProjectDetails;

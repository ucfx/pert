import { useEffect, useReducer, useState } from "react";
import PertChart from "components/PertChart";
import { produce } from "immer";
import { CloseButton, MultiSelect, TextInput } from "@mantine/core";
import { IoMdAdd, IoIosSave } from "react-icons/io";
import useProjectDetails from "hooks/useProjectDetails";
import { useToast, Button } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Table({ initialState = [] }) {
    const { updateData: saveProject } = useProjectDetails();
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(true);
    const toast = useToast({ position: "top", isClosable: true });
    const { projectId } = useParams();

    const updateProject = (data) => {
        setLoading(true);
        console.log(data);
        console.log(projectId);
        const postData = (data) => {
            return new Promise((resolve, reject) => {
                axios
                    .put(`/api/projects/${projectId}`, data)
                    .then(({ data: { project } }) => {
                        console.log("saved");
                        saveProject(project);
                        setSaved(true);
                        resolve();
                    })
                    .catch((err) => {
                        console.log(err);
                        reject();
                    })
                    .finally(() => {
                        setLoading(false);
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

    const actionTypes = {
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
            case actionTypes.ADD_TASK:
                return produce(state, (draftState) => {
                    draftState.push(action.payload);
                });

            case actionTypes.DELETE_TASK:
                return produce(state, (draftState) => {
                    draftState.forEach((task) => {
                        if (task.dependsOn) {
                            task.dependsOn = task.dependsOn.filter(
                                (key) => key !== action.payload.taskKey
                            );
                        }
                    });
                    draftState.splice(action.payload.index, 1);
                    draftState.forEach((task) => {
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
                });

            case actionTypes.UPDATE_TASK_NAME:
                return produce(state, (draftState) => {
                    draftState[action.payload.index].text = action.payload.text;
                });
            case actionTypes.UPDATE_TASK_LENGTH:
                return produce(state, (draftState) => {
                    draftState[action.payload.index].length =
                        action.payload.length;
                });
            case actionTypes.UPDATE_TASK_DEPENDS_ON:
                return produce(state, (draftState) => {
                    draftState[action.payload.index].dependsOn =
                        action.payload.dependsOn;
                });
            case actionTypes.TOGGLE_EDITING_NAME:
                return produce(state, (draftState) => {
                    draftState[action.payload.index].editingTask =
                        !draftState[action.payload.index].editingTask;
                });
            case actionTypes.TOGGLE_EDITING_LENGTH:
                return produce(state, (draftState) => {
                    draftState[action.payload.index].editingLength =
                        !draftState[action.payload.index].editingLength;
                });
            default:
                return state;
        }
    };

    const editReducer = (state, action) => {
        switch (action.type) {
            case actionTypes.ADD_TASK_EDITABLE:
                return produce(state, (draftState) => {
                    draftState.push({
                        editingTask: true,
                        editingLength: true,
                    });
                });
            case actionTypes.TOGGLE_EDITING_NAME:
                return produce(state, (draftState) => {
                    draftState[action.payload.index].editingTask =
                        !draftState[action.payload.index].editingTask;
                });
            case actionTypes.TOGGLE_EDITING_LENGTH:
                return produce(state, (draftState) => {
                    draftState[action.payload.index].editingLength =
                        !draftState[action.payload.index].editingLength;
                });
            case actionTypes.TOGGLE_EDITING_DEPENDS_ON:
                return produce(state, (draftState) => {
                    draftState[action.payload.index] =
                        !draftState[action.payload.index];
                });
            case actionTypes.DELETE_KEY_FROM_EDITABLE:
                return produce(state, (draftState) => {
                    delete draftState[action.payload.index];
                });

            default:
                return state;
        }
    };

    const [data, dispatch] = useReducer(reducer, initialState);
    const [editable, dispatch2] = useReducer(
        editReducer,
        Array.from({ length: initialState.length }, () => ({
            editingTask: false,
            editingLength: false,
        }))
    );

    useEffect(() => {
        console.log("saved", saved);
    }, [saved]);

    return (
        <>
            <div className="flex place-content-center">
                <table className="border-1 border-purple-700 m-5 w-[600px]">
                    <thead>
                        <tr>
                            <th className="w-[150px]">Task</th>
                            <th className="w-[100px]">Duration</th>
                            <th className="w-[260px]">Depends On</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((task, index) => (
                            <tr key={task.key}>
                                {task.text && !editable[index].editingTask ? (
                                    <td
                                        className="group"
                                        onDoubleClick={() => {
                                            dispatch2({
                                                type: actionTypes.TOGGLE_EDITING_NAME,
                                                payload: {
                                                    index: index,
                                                },
                                            });
                                        }}
                                    >
                                        <div className="flex flex-row w-[100%] justify-between">
                                            {task.text}

                                            <CloseButton
                                                className="hidden group-hover:block ml-2 text-red-500"
                                                onClick={() => {
                                                    dispatch({
                                                        type: actionTypes.DELETE_TASK,
                                                        payload: {
                                                            index: index,
                                                            taskKey: task.key,
                                                        },
                                                    });
                                                }}
                                            />
                                        </div>
                                    </td>
                                ) : (
                                    <td>
                                        <TextInput
                                            placeholder="Task Name"
                                            type="text"
                                            onFocus={(e) => {
                                                if (e.target.value === "")
                                                    e.target.value =
                                                        task.text || "";
                                            }}
                                            onBlur={(e) => {
                                                if (e.target.value === "")
                                                    e.target.value =
                                                        task.text || "";
                                                dispatch({
                                                    type: actionTypes.UPDATE_TASK_NAME,
                                                    payload: {
                                                        index: index,
                                                        text: e.target.value,
                                                    },
                                                });
                                                dispatch2({
                                                    type: actionTypes.TOGGLE_EDITING_NAME,
                                                    payload: {
                                                        index: index,
                                                    },
                                                });
                                            }}
                                            onKeyUp={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    dispatch({
                                                        type: actionTypes.UPDATE_TASK_NAME,
                                                        payload: {
                                                            index: index,
                                                            text: e.target
                                                                .value,
                                                        },
                                                    });
                                                    dispatch2({
                                                        type: actionTypes.TOGGLE_EDITING_NAME,
                                                        payload: {
                                                            index: index,
                                                        },
                                                    });
                                                } else if (e.key === "Escape") {
                                                    dispatch2({
                                                        type: actionTypes.TOGGLE_EDITING_NAME,
                                                        payload: {
                                                            index: index,
                                                        },
                                                    });
                                                }
                                            }}
                                            autoFocus
                                        />
                                    </td>
                                )}

                                <td
                                    onDoubleClick={(e) => {
                                        dispatch2({
                                            type: actionTypes.TOGGLE_EDITING_LENGTH,
                                            payload: {
                                                index: index,
                                            },
                                        });
                                        setTimeout(() => {
                                            e.target
                                                .querySelector("div div input")
                                                ?.focus();
                                        }, 0);
                                    }}
                                >
                                    {(task.length || task.length == 0) &&
                                    !editable[index].editingLength ? (
                                        task.length
                                    ) : (
                                        <TextInput
                                            placeholder="Duration"
                                            type="number"
                                            onFocus={(e) => {
                                                if (e.target.value === "")
                                                    e.target.value =
                                                        task.length || 0;
                                            }}
                                            onBlur={(e) => {
                                                if (e.target.value === "")
                                                    e.target.value =
                                                        task.length || 0;
                                                dispatch({
                                                    type: actionTypes.UPDATE_TASK_LENGTH,
                                                    payload: {
                                                        index: index,
                                                        length: parseInt(
                                                            e.target.value || 0
                                                        ),
                                                    },
                                                });
                                                dispatch2({
                                                    type: actionTypes.TOGGLE_EDITING_LENGTH,
                                                    payload: {
                                                        index: index,
                                                    },
                                                });
                                            }}
                                            onKeyUp={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    dispatch({
                                                        type: actionTypes.UPDATE_TASK_LENGTH,
                                                        payload: {
                                                            index: index,
                                                            length: parseInt(
                                                                e.target
                                                                    .value || 0
                                                            ),
                                                        },
                                                    });
                                                    dispatch2({
                                                        type: actionTypes.TOGGLE_EDITING_LENGTH,
                                                        payload: {
                                                            index: index,
                                                        },
                                                    });
                                                }
                                            }}
                                        />
                                    )}
                                </td>

                                <td>
                                    {/* select from previous tasks */}
                                    <div className="flex flex-row flex-wrap">
                                        <MultiSelect
                                            style={{
                                                width: "100%",
                                            }}
                                            data={data
                                                .filter(
                                                    (n) =>
                                                        task.key !== n.key &&
                                                        !n.dependsOn?.includes(
                                                            task.key
                                                        )
                                                )
                                                .map((task) => ({
                                                    label: task.text,
                                                    value: task.key,
                                                }))}
                                            value={task.dependsOn || []}
                                            onChange={(value) => {
                                                dispatch({
                                                    type: actionTypes.UPDATE_TASK_DEPENDS_ON,
                                                    payload: {
                                                        index: index,
                                                        dependsOn: value,
                                                    },
                                                });
                                            }}
                                            placeholder={
                                                !task.dependsOn ||
                                                task.dependsOn.length === 0
                                                    ? "None"
                                                    : ""
                                            }
                                            hidePickedOptions
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {/* add new task */}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>
                                <Button
                                    leftIcon={<IoMdAdd />}
                                    colorScheme="purple"
                                    onClick={() => {
                                        let index = data.length + 1;
                                        dispatch2({
                                            type: actionTypes.ADD_TASK_EDITABLE,
                                        });
                                        dispatch({
                                            type: actionTypes.ADD_TASK,
                                            payload: {
                                                key: `${index}`,
                                                length: 0,
                                                text: `Task ${index}`,
                                            },
                                        });
                                    }}
                                    className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-100 ease-in-out"
                                >
                                    Add Task
                                </Button>
                            </td>
                            <td></td>
                            <td>
                                <Button
                                    isLoading={loading}
                                    loadingText="Saving..."
                                    colorScheme="purple"
                                    isDisabled={saved}
                                    leftIcon={<IoIosSave />}
                                    onClick={() => {
                                        updateProject({ tasks: data });
                                    }}
                                    className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-100 ease-in-out"
                                >
                                    Save
                                </Button>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div
                className="pert-chart"
                style={{
                    width: 600,
                    height: 400,
                }}
            >
                <PertChart
                    data={data}
                    containerWidth={600}
                    containerHeight={400}
                />
            </div>
        </>
    );
}

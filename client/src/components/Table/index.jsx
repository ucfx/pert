import { CloseButton, MultiSelect, TextInput } from "@mantine/core";
import { IoMdAdd } from "react-icons/io";
import useProjectDetails from "hooks/useProjectDetails";
import { Button } from "@chakra-ui/react";
import getLetterFromNumber from "./getLetterFromNumber";
import "./style.css";
export default function Table({ data, actionTypes, dispatch, setSaved }) {
    const { updateData: saveProject } = useProjectDetails();

    console.log("rendered");

    return (
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
                    {data.tasks && data.tasks.length === 0 && (
                        <tr>
                            <td colSpan="3" className="text-center">
                                No Tasks
                            </td>
                        </tr>
                    )}
                    {data.tasks &&
                        data.tasks.map((task, index) => (
                            <tr key={task.key}>
                                {task.text &&
                                !data.editable[index].editingTask ? (
                                    <td
                                        className="group"
                                        onDoubleClick={() => {
                                            dispatch({
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
                                                e.target.select();
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
                                                dispatch({
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
                                                    dispatch({
                                                        type: actionTypes.TOGGLE_EDITING_NAME,
                                                        payload: {
                                                            index: index,
                                                        },
                                                    });
                                                } else if (e.key === "Escape") {
                                                    dispatch({
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
                                        dispatch({
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
                                    !data.editable[index].editingLength ? (
                                        task.length
                                    ) : (
                                        <TextInput
                                            classNames={{
                                                input: "border-purple-400 border-1 hover:border-5  focus:border-5 focus:border-blue-500 transition duration-100 ease-in-out",
                                            }}
                                            style={{
                                                width: "100%",
                                            }}
                                            placeholder="Duration"
                                            type="number"
                                            onFocus={(e) => {
                                                if (e.target.value === "")
                                                    e.target.value =
                                                        task.length || 0;
                                                e.target.select();
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
                                                dispatch({
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
                                                    dispatch({
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
                                            // add box shadow to dropdown
                                            classNames={{
                                                dropdown:
                                                    "bg-purple-50 rounded-md border-purple-300 border-1 shadow-xl",
                                                option: "hover:bg-purple-100 transition duration-100 ease-in-out",
                                                pill: "bg-purple-100 border-purple-500 border-1",
                                                input: "border-purple-400 border-1 hover:border-5 hover:bg-purple-50 transition duration-100 ease-in-out",
                                            }}
                                            style={{
                                                width: "100%",
                                            }}
                                            data={data.tasks
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
                </tbody>
                <tfoot>
                    <tr>
                        <td>
                            <Button
                                leftIcon={<IoMdAdd />}
                                colorScheme="purple"
                                onClick={() => {
                                    let index = data.tasks.length + 1;
                                    dispatch({
                                        type: actionTypes.ADD_TASK_EDITABLE,
                                    });
                                    dispatch({
                                        type: actionTypes.ADD_TASK,
                                        payload: {
                                            key: `${index}`,
                                            length: 0,
                                            text: getLetterFromNumber(index),
                                        },
                                    });
                                }}
                                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-100 ease-in-out"
                            >
                                Add Task
                            </Button>
                        </td>
                        <td></td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}

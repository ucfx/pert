import { lazy, useReducer } from "react";
const PertChart = lazy(() => import("components/PertChart"));
import { produce, current } from "immer";
import { Button, CloseButton, MultiSelect, TextInput } from "@mantine/core";
import { IoMdAdd } from "react-icons/io";
import { IoMdCheckmark } from "react-icons/io";

export default function Table() {
	const initialState = [
		// { key: 0, length: 0, text: "Start" },
		{ key: "1", length: 6, text: "A", dependsOn: ["5"] },
		{ key: "2", length: 5, text: "B", dependsOn: ["10", "5"] },
		{ key: "3", length: 1, text: "C" },
		{ key: "4", length: 1, text: "D" },
		{ key: "5", length: 2, text: "E" },
		{ key: "6", length: 6, text: "F", dependsOn: ["4"] },
		{ key: "7", length: 3, text: "G", dependsOn: ["6", "4"] },
		{ key: "8", length: 4, text: "H", dependsOn: ["1", "3", "4"] },
		{
			key: "9",
			length: 1,
			text: "I",
			dependsOn: ["8", "1", "3", "4", "5", "11", "6"],
		},
		{ key: "10", length: 4, text: "J", dependsOn: ["5"] },
		{ key: "11", length: 8, text: "K", dependsOn: ["4", "6"] },
		{
			key: "12",
			length: 0,
			text: "Z",
			edititingTask: false,
			editingLength: false,
			editingDependsOn: true,
		},
	];

	const actionTypes = {
		ADD_TASK: "ADD_TASK",
		DELETE_TASK: "DELETE_TASK",
		UPDATE_TASK_LENGTH: "UPDATE_TASK_LENGTH",
		UPDATE_TASK_NAME: "UPDATE_TASK_NAME",
		TOGGLE_EDITING_NAME: "TOGGLE_EDITING_NAME",
		TOGGLE_EDITING_LENGTH: "TOGGLE_EDITING_LENGTH",
		TOGGLE_EDITING_DEPENDS_ON: "TOGGLE_EDITING_DEPENDS_ON",
		UPDATE_TASK_DEPENDS_ON: "UPDATE_TASK_DEPENDS_ON",
	};

	const reducer = (state, action) => {
		switch (action.type) {
			case actionTypes.ADD_TASK:
				return produce(state, (draftState) => {
					draftState.push(action.payload);
				});
			case actionTypes.DELETE_TASK:
				// delete task and remove from dependsOn according to action.payload.taskKey
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
					console.log("Cunt after this its new state");
					console.log("here", current(draftState));
				});

			case actionTypes.UPDATE_TASK_NAME:
				return produce(state, (draftState) => {
					draftState[action.payload.index].text = action.payload.text;
				});
			case actionTypes.UPDATE_TASK_LENGTH:
				return produce(state, (draftState) => {
					draftState[action.payload.index].length = action.payload.length;
				});
			case actionTypes.UPDATE_TASK_DEPENDS_ON:
				return produce(state, (draftState) => {
					draftState[action.payload.index].dependsOn = action.payload.dependsOn;
				});
			case actionTypes.TOGGLE_EDITING_NAME:
				return produce(state, (draftState) => {
					draftState[action.payload.index].edititingTask =
						!draftState[action.payload.index].edititingTask;
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

	const [data, dispatch] = useReducer(reducer, initialState);

	return (
		<>
			<div className="flex place-content-center">
				<table className="border-2 border-white rounded-xl m-5 bg-zinc-800 w-[60%]">
					<thead>
						<tr>
							<th>Task</th>
							<th>Duration</th>
							<th>Depends On</th>
						</tr>
					</thead>
					<tbody>
						{data.map((task, index) => (
							<tr key={task.key}>
								{task.text && !task.edititingTask ? (
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
											value={task.text || ""}
											onChange={(e) => {
												dispatch({
													type: actionTypes.UPDATE_TASK_NAME,
													payload: {
														index: index,
														text: e.target.value,
													},
												});
											}}
											onKeyUp={(e) => {
												if (e.key === "Enter") {
													dispatch({
														type: actionTypes.TOGGLE_EDITING_NAME,
														payload: {
															index: index,
														},
													});
												}
											}}
										/>
									</td>
								)}

								{(task.length || task.length == 0) && !task.editingLength ? (
									<td
										onDoubleClick={() => {
											dispatch({
												type: actionTypes.TOGGLE_EDITING_LENGTH,
												payload: {
													index: index,
												},
											});
										}}
									>
										{task.length}
									</td>
								) : (
									<td>
										<TextInput
											placeholder="Duration"
											type="number"
											value={task.length || ""}
											onChange={(e) => {
												dispatch({
													type: actionTypes.UPDATE_TASK_LENGTH,
													payload: {
														index: index,
														length: e.target.value || 0,
													},
												});
											}}
											onKeyUp={(e) => {
												if (e.key === "Enter") {
													e.preventDefault();
													dispatch({
														type: actionTypes.TOGGLE_EDITING_LENGTH,
														payload: {
															index: index,
														},
													});
												}
											}}
										/>
									</td>
								)}

								<td className="max-w-[600px]">
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
														!n.dependsOn?.includes(task.key)
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
											placeholder={!task.dependsOn ? "None" : ""}
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
									leftSection={<IoMdAdd />}
									onClick={() => {
										dispatch({
											type: actionTypes.ADD_TASK,
											payload: {
												key: `${data.length + 1}`,
												length: 0,
												text: `Task ${data.length + 1}`,
												edititingTask: true,
												editingLength: true,
											},
										});
									}}
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
			<button>Click me</button>
			<div
				className="pert-chart"
				style={{
					width: 800,
					height: 400,
				}}
			>
				<PertChart data={data} containerWidth={800} containerHeight={400} />
			</div>
		</>
	);
}

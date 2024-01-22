import "gantt-task-react/dist/index.css";
import { Gantt } from "gantt-task-react";
const GantChart = ({ ganttData }) => {
    return ganttData.length !== 0 ? (
        <Gantt
            barBackgroundColor="#8484A9"
            tasks={ganttData}
            listCellWidth=""
            barCornerRadius={5}
            columnWidth={80}
            viewMode="Day"
            fontSize={18}
            barFill={70}
        />
    ) : (
        <p
            style={{
                textAlign: "center",
                padding: "100px 0",
                fontSize: "20px",

                color: "#8484A9",

                fontWeight: "bold",

                fontFamily: "sans-serif",

                letterSpacing: "1px",
            }}
        >
            No tasks to display. Please add a task to see the Gantt Chart.
        </p>
    );
};

export default GantChart;

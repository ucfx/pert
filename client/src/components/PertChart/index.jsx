import { useRef, useEffect, useMemo } from "react";
import Pert from "assets/js/Pert.js";
import Drawer from "assets/js/Drawer.js";
import "./style.css";
const PertChart = ({ data }) => {
    const ref = useRef();

    useEffect(() => {
        const pert = new Pert(data).solve();
        new Drawer(
            ref.current,
            pert.nodes,
            pert.levels,
            pert.links
        ).drawPERTDiagram();
    }, []);
    return (
        <div className="chart">
            <svg ref={ref} />
        </div>
    );
};

export default PertChart;

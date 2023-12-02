import { useRef, useEffect, useMemo, useState } from "react";
import Pert from "assets/js/Pert.js";
import Drawer from "assets/js/Drawer.js";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import "./style.css";

const PertChart = ({ data, containerWidth, containerHeight }) => {
    const svgElement = useRef();
    const [imageNaturalWidth, setImageNaturalWidth] = useState(0);
    const [imageNaturalHeight, setImageNaturalHeight] = useState(0);

    const [nodes, levels, links] = useMemo(() => {
        const pert = new Pert(data.map((item) => ({ ...item }))).solve();
        console.log("Done");
        return [pert.nodes, pert.levels, pert.links];
    }, [JSON.stringify(data)]);

    const scaleUp = true;
    const zoomFactor = 8;

    useEffect(() => {
        if (!svgElement.current) return;

        const maxHeight =
            Math.max(...Object.keys(levels).map((key) => levels[key].length)) *
                140 -
            35;

        const maxWidth = (Object.values(levels).length - 1) * 140 + 90;

        setImageNaturalHeight(maxHeight);
        setImageNaturalWidth(maxWidth);

        svgElement.current.setAttribute("height", maxHeight);
        svgElement.current.setAttribute("width", maxWidth);
    }, [nodes, levels, links, svgElement.current]);

    useEffect(() => {
        if (
            nodes.length === 0 ||
            containerWidth === 0 ||
            containerHeight === 0 ||
            imageNaturalHeight === 0 ||
            imageNaturalWidth === 0
        )
            return;

        new Drawer(svgElement.current, nodes, levels, links).drawPERTDiagram();
    }, [
        containerWidth,
        containerHeight,
        imageNaturalWidth,
        imageNaturalHeight,
        data,
    ]);

    const imageScale = useMemo(() => {
        if (
            containerWidth === 0 ||
            containerHeight === 0 ||
            imageNaturalWidth === 0 ||
            imageNaturalHeight === 0
        )
            return 1;

        const scale = Math.min(
            containerWidth / imageNaturalWidth,
            containerHeight / imageNaturalHeight
        );
        return scaleUp ? scale : Math.max(scale, 1);
    }, [
        scaleUp,
        containerWidth,
        containerHeight,
        imageNaturalWidth,
        imageNaturalHeight,
    ]);

    return (
        <div className="chart">
            <TransformWrapper
                key={`${containerWidth}x${containerHeight}`}
                initialScale={imageScale}
                minScale={imageScale}
                maxScale={imageScale * zoomFactor}
                centerOnInit
            >
                {({ zoomIn, zoomOut, resetTransform, centerView }) => (
                    <>
                        <div className="chart-controls">
                            <button onClick={() => zoomIn()}>
                                <i className="fa-regular fa-circle-plus" />
                            </button>
                            <button onClick={() => zoomOut()}>
                                <i className="fa-regular fa-circle-minus" />
                            </button>
                            <button onClick={() => centerView(imageScale)}>
                                <i className="fa-regular fa-compress" />
                            </button>
                        </div>
                        <TransformComponent
                            wrapperStyle={{
                                width: "100%",
                                height: "100%",
                            }}
                        >
                            <svg
                                ref={svgElement}
                                onLoadCapture={() => {
                                    setTimeout(() => {
                                        resetTransform();
                                        centerView(imageScale);
                                    }, 400);
                                }}
                            />
                        </TransformComponent>
                    </>
                )}
            </TransformWrapper>
        </div>
    );
};

export default PertChart;

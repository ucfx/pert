import { useRef, useEffect, useMemo, useState } from "react";
import { Pert, Drawer } from "assets/js";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { useToast } from "@chakra-ui/react";
import { CiCircleMinus, CiCirclePlus, CiUndo } from "react-icons/ci";
import "./style.css";
function useOnScreen(ref) {
    const [isIntersecting, setIntersecting] = useState(false);

    const observer = useMemo(
        () =>
            new IntersectionObserver(([entry]) =>
                setIntersecting(entry.isIntersecting)
            ),
        [ref]
    );

    useEffect(() => {
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return isIntersecting;
}

const PertChart = ({ data, containerWidth, containerHeight }) => {
    const svgElement = useRef();
    const isOnScreen = useOnScreen(svgElement);
    const func = useRef();

    const [imageNaturalWidth, setImageNaturalWidth] = useState(0);
    const [imageNaturalHeight, setImageNaturalHeight] = useState(0);

    const toast = useToast({ position: "top" });
    const [nodes, levels, links] = useMemo(() => {
        try {
            const pert = new Pert(data).solve();
            console.log("Done");
            return [pert.nodes, pert.levels, pert.links];
        } catch (err) {
            console.log(err);
            return [[], {}, []];
        }
    }, [JSON.stringify(data)]);

    const scaleUp = true;
    const zoomFactor = 8;

    useEffect(() => {
        if (nodes.length === 0) {
            toast({
                title: "Error",
                description: "Circular dependency detected!",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        } else {
            toast.closeAll();
        }
        if (!svgElement.current) return;

        const maxHeight =
            Math.max(...Object.keys(levels).map((key) => levels[key].length)) *
                140 -
            35;

        const maxWidth = (Object.values(levels).length - 1) * 140 + 90;

        setImageNaturalHeight(maxHeight < 0 ? 900 : maxHeight);
        setImageNaturalWidth(maxWidth < 0 ? 0 : maxWidth);

        svgElement.current.setAttribute(
            "height",
            maxHeight < 0 ? 0 : maxHeight
        );
        svgElement.current.setAttribute("width", maxWidth < 0 ? 0 : maxWidth);
    }, [nodes, levels, links, svgElement.current]);

    useEffect(() => {
        if (
            nodes.length === 0 ||
            containerWidth === 0 ||
            containerHeight === 0 ||
            imageNaturalHeight === 0 ||
            imageNaturalWidth === 0
        ) {
            while (svgElement.current.firstChild) {
                svgElement.current.removeChild(svgElement.current.firstChild);
            }
            return;
        }

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

    useEffect(() => {
        if (!isOnScreen) return;
        if (!svgElement.current) return;
        if (!func.current) return;
        func.current.resetTransform();
        func.current.centerView(imageScale);
    }, [isOnScreen, imageScale, data]);

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
                        {isOnScreen &&
                            (() => {
                                func.current = { resetTransform, centerView };
                            })()}
                        <div className="chart-controls">
                            <button onClick={() => zoomOut()}>
                                <CiCircleMinus />
                            </button>
                            <button onClick={() => centerView(imageScale)}>
                                <CiUndo />
                            </button>
                            <button onClick={() => zoomIn()}>
                                <CiCirclePlus />
                            </button>
                        </div>
                        <TransformComponent
                            wrapperStyle={{
                                width: "100%",
                                height: "100%",
                            }}
                        >
                            <svg ref={svgElement} className="svg-chart" />
                        </TransformComponent>
                    </>
                )}
            </TransformWrapper>
        </div>
    );
};

export default PertChart;

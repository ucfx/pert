class Drawer {
    constructor(SvgContainer, nodes, levelNodeMap, nodeLinkArray) {
        this.nodes = nodes;
        this.svgContainer = SvgContainer;
        this.levelNodeMap = levelNodeMap;
        this.nodeLinkArray = nodeLinkArray;
        this.sizeH = 70;
        this.sizeW = this.sizeH * 2;
        this.raduis = this.sizeH / 2;
        this.fontSize = 16 * (this.sizeH / 80);
        this.levelMaxLength = Object.values(levelNodeMap).reduce(
            (maxHeight, nodes) => Math.max(maxHeight, nodes.length),
            0
        );
        this.padding = this.raduis + 10;
        this.maxHeight = this.levelMaxLength * 2 * this.sizeH - this.raduis;
        this.maxWidth =
            (Object.values(this.levelNodeMap).length - 1) * this.sizeW +
            this.sizeH +
            20;

        SvgContainer.style.width = this.maxWidth;
        SvgContainer.style.height = this.maxHeight;
        SvgContainer.classList.remove("line-transparent");
    }

    drawPERTDiagram() {
        this.clear();

        // Draw nodes
        Object.keys(this.levelNodeMap).forEach((level) => {
            this.levelNodeMap[level].forEach((nodeId) => {
                this.drawNode(nodeId, parseInt(level));
            });
        });
    }

    createText(text, x, y) {
        const textElement = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );
        textElement.setAttribute("x", x);
        textElement.setAttribute("y", y);
        textElement.setAttribute("text-anchor", "middle");
        textElement.setAttribute("font-size", `${this.fontSize + 2}px`);
        textElement.setAttribute("font-family", "Tajawal");
        textElement.setAttribute("font-weight", "bold");
        textElement.textContent = text;
        textElement.addEventListener("mouseenter", (e) => {
            e.target.parentNode.classList.add("hover");
        });

        textElement.addEventListener("mouseleave", (e) => {
            e.target.parentNode.classList.remove("hover");
        });
        return textElement;
    }

    drawNode(nodeId, level) {
        const nodeLength = this.levelNodeMap[level].length;
        const currIndexNode = this.levelNodeMap[level].findIndex(
            (node) => node === nodeId
        );

        const x = level * this.sizeW + this.padding;

        let y =
            currIndexNode * this.sizeH * 2 +
            this.sizeH +
            this.maxHeight / 2 -
            this.sizeH * nodeLength;

        // Create a group element for the node
        const nodeGroup = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
        );

        nodeGroup.setAttribute("nodeId", nodeId);
        const endNodes = this.nodeLinkArray.filter(
            (link) => link.from === nodeId
        );
        const startNodes = this.nodeLinkArray.filter(
            (link) => link.to === nodeId
        );

        const splitLines = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );
        splitLines.setAttribute("class", "split-lines");
        splitLines.setAttribute(
            "d",
            `
    M ${
        x -
        Math.sqrt(
            Math.pow(this.raduis, 2) -
                Math.pow(this.raduis - (2 * this.raduis) / 3, 2)
        )
    } ${y - this.raduis / 3}
    L ${
        x +
        Math.sqrt(
            Math.pow(this.raduis, 2) -
                Math.pow(this.raduis - (2 * this.raduis) / 3, 2)
        )
    } ${y - this.raduis / 3}
    M ${
        x -
        Math.sqrt(
            Math.pow(this.raduis, 2) -
                Math.pow(this.raduis - (2 * this.raduis) / 3, 2)
        )
    } ${y + this.raduis / 3}
    L ${
        x +
        Math.sqrt(
            Math.pow(this.raduis, 2) -
                Math.pow(this.raduis - (2 * this.raduis) / 3, 2)
        )
    } ${y + this.raduis / 3}
    M ${x} ${y - this.raduis / 3}
    L ${x} ${y + this.raduis}
`
        );
        splitLines.addEventListener("mouseenter", (e) => {
            e.target.parentNode.classList.add("hover");
        });

        splitLines.addEventListener("mouseleave", (e) => {
            e.target.parentNode.classList.remove("hover");
        });

        // Draw the circle
        const nodeCircle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );
        nodeCircle.setAttribute("cx", x);
        nodeCircle.setAttribute("cy", y);
        nodeCircle.setAttribute("r", this.raduis);
        nodeCircle.setAttribute(
            "class",
            this.nodes[nodeId].earlyFinish === this.nodes[nodeId].lateFinish
                ? "critical"
                : ""
        );
        nodeCircle.setAttribute("stroke-width", 2);

        // Draw the text
        const nodeText = this.createText(
            this.nodes[nodeId].text,
            x,
            y - this.raduis + this.raduis / 2
        );

        const nodeEarlyStart = this.createText(
            this.nodes[nodeId].earlyStart,
            x - this.raduis / 2 + this.raduis / 9,
            y + this.raduis / 9
        );

        const nodeEarlyFinish = this.createText(
            this.nodes[nodeId].earlyFinish,
            x + this.raduis / 2 - this.raduis / 9,
            y + this.raduis / 9
        );

        const nodeLateStart = this.createText(
            this.nodes[nodeId].lateStart,
            x - this.raduis / 2 + this.raduis / 9,
            y + (this.raduis / 3) * 2 + this.raduis / 9
        );

        const nodeLateFinish = this.createText(
            this.nodes[nodeId].lateFinish,
            x + this.raduis / 2 - this.raduis / 9,
            y + (this.raduis / 3) * 2 + this.raduis / 9
        );

        nodeGroup.appendChild(nodeCircle);
        nodeGroup.appendChild(splitLines);
        nodeGroup.appendChild(nodeEarlyStart);
        nodeGroup.appendChild(nodeEarlyFinish);
        nodeGroup.appendChild(nodeLateStart);
        nodeGroup.appendChild(nodeLateFinish);
        nodeGroup.appendChild(nodeText);

        const nodeLinks = this.nodeLinkArray.filter(
            (link) => link.from === nodeId
        );
        const paths = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
        );
        paths.setAttribute("class", "paths");
        nodeLinks.forEach((link, index) => {
            const { pathGroup, startCircle } = this.drawLink(
                link.from,
                link.to,
                index === nodeLinks.length - 1,
                link.critical
            );
            paths.appendChild(pathGroup);
            if (startCircle) paths.appendChild(startCircle);
        });
        nodeGroup.addEventListener("click", () => {
            this.svgContainer.classList.add("line-transparent");
            const selected = document.querySelector(".selected");
            const removeClass = (className) => {
                document
                    .querySelectorAll(`[nodeId]`)
                    .forEach((node) => node.classList.remove("to", "from"));
                document
                    .querySelectorAll(`path.path-hover`)
                    .forEach((path) => path.classList.remove("path-hover"));
            };

            if (selected && selected === nodeGroup) {
                nodeGroup.classList.remove("selected");
                this.svgContainer.classList.remove("line-transparent");
                removeClass();
                return;
            }
            if (selected) {
                selected.classList.remove("selected");
                removeClass();
            }

            nodeGroup.classList.add("selected");

            endNodes.forEach((link) => {
                document
                    .querySelector(`[nodeId="${link.to}"]`)
                    .classList.add("to");
            });
            startNodes.forEach((link) => {
                document
                    .querySelector(`[nodeId="${link.from}"]`)
                    .classList.add("from");
                document
                    .querySelector(
                        `path[from="from-${link.from}"][to="to-${link.to}"]`
                    )
                    .classList.add("path-hover");
            });
        });
        nodeGroup.appendChild(paths);

        this.svgContainer.appendChild(nodeGroup);
    }

    drawLink(from, to, end, critical) {
        const fromLevel = this.nodes[from].level;
        const fromIndex = this.levelNodeMap[fromLevel].findIndex(
            (node) => node === from
        );
        const toLevel = this.nodes[to].level;
        const toIndex = this.levelNodeMap[toLevel].findIndex(
            (node) => node === to
        );

        const fromX = fromLevel * this.sizeW + this.padding + this.raduis + 3;
        const fromY =
            fromIndex * this.sizeH * 2 +
            this.sizeH +
            this.maxHeight / 2 -
            this.sizeH * this.levelNodeMap[fromLevel].length;
        const toX = toLevel * this.sizeW + this.padding - this.raduis;
        const toY =
            toIndex * this.sizeH * 2 +
            this.sizeH +
            this.maxHeight / 2 -
            this.sizeH * this.levelNodeMap[toLevel].length;

        const pathGroup = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
        );

        const pathData = `M ${fromX} ${fromY} C ${
            fromX + 20 * (toLevel - fromLevel) + (toX - fromX) / 1.2
        } ${fromY} ${
            fromX + 20 * (toLevel - fromLevel) + (toX - fromX) / 4
        } ${toY} ${toX} ${toY}`;

        const hiddenLinkPath = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );

        hiddenLinkPath.setAttribute("d", pathData);
        hiddenLinkPath.setAttribute("class", "hidden-path");

        const linkPath = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );

        linkPath.setAttribute("d", pathData);
        linkPath.setAttribute("from", `from-${from}`);
        linkPath.setAttribute("to", `to-${to}`);
        linkPath.setAttribute("class", `${critical ? "critical-link" : ""}`);
        pathGroup.appendChild(hiddenLinkPath);
        pathGroup.appendChild(linkPath);

        const startCircle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );
        if (end) {
            startCircle.setAttribute("cx", fromX);
            startCircle.setAttribute("cy", fromY);
            startCircle.setAttribute("r", this.raduis / 10);
            return { pathGroup, startCircle };
        }

        return { pathGroup };
    }

    clear() {
        while (this.svgContainer.firstChild) {
            this.svgContainer.removeChild(this.svgContainer.firstChild);
        }
    }
}

export default Drawer;

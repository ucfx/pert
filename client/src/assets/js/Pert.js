"use strict";

class Pert {
    constructor(data) {
        this.data = [
            { key: "0", length: 0, text: "Start" },
            ...data.map((_) =>
                !_.dependsOn || _.dependsOn.length === 0
                    ? { ..._, dependsOn: ["0"] }
                    : { ..._ }
            ),
        ];
        this.nodes = null;
        this.levels = null;
    }

    calculatePERT() {
        this.nodes = null;
        this.levels = null;

        this.nodes = [...this.data];
        this.getLevels();

        let levelKeys = Object.keys(this.levels);
        levelKeys.forEach((levelKey) => {
            this.levels[levelKey].forEach((index) => {
                this.calculateEarlyTimes(index);
            });
        });

        let lastTask = this.nodes.reduce((prev, current) =>
            prev.earlyFinish > current.earlyFinish ? prev : current
        );
        lastTask.lateFinish = lastTask.earlyFinish;
        lastTask.critical = true;
        levelKeys = levelKeys.sort((a, b) => b - a);

        this.nodes.push({
            key: this.nodes.length.toString(),
            text: "Finish",
            dependsOn: [lastTask.key],
            length: 0,
            earlyStart: lastTask.earlyFinish,
            earlyFinish: lastTask.earlyFinish,
            lateFinish: lastTask.earlyFinish,
            lateStart: lastTask.earlyFinish,
            level: levelKeys.length,
            critical: true,
            freeFloat: 0,
            totalFloat: 0,
        });
        this.levels[levelKeys.length] = [`${this.nodes.length - 1}`];

        levelKeys.forEach((levelKey) => {
            this.levels[levelKey].forEach((index) => {
                this.calculateLateTimes(index, lastTask.lateFinish);
            });
        });
        return this.nodes;
    }

    getSuccessors(task) {
        return this.nodes.filter(
            (t) => t.dependsOn && t.dependsOn.includes(task.key)
        );
    }

    calculateEarlyTimes(index) {
        let task = this.nodes[index];
        if (!task.dependsOn) {
            task.earlyStart = 0;
        } else {
            let maxFinishTime = 0;
            task.dependsOn.forEach((dependency) => {
                let dependencyTask = this.nodes.find(
                    (item) => item.key === dependency
                );
                maxFinishTime = Math.max(
                    maxFinishTime,
                    dependencyTask.earlyStart + dependencyTask.length
                );
            });
            task.earlyStart = maxFinishTime;
        }
        task.earlyFinish = task.earlyStart + task.length;
    }

    calculateLateTimes(index, lateFinishLastTask) {
        let task = this.nodes[index];
        let successors = this.getSuccessors(task);

        let lateFinish;
        if (successors.length === 0) {
            lateFinish = lateFinishLastTask;
        } else {
            lateFinish = Math.min(
                ...successors.map((s) => s.lateFinish - s.length)
            );
        }

        task.lateFinish = lateFinish;
        task.lateStart = task.lateFinish - task.length;
        task.critical = task.earlyFinish === task.lateFinish;

        if (!task.critical) {
            task.freeFloat =
                (successors.length === 0
                    ? lateFinishLastTask
                    : Math.min(...successors.map((s) => s.earlyStart))) -
                task.earlyFinish;
            task.totalFloat = task.lateFinish - task.earlyFinish;
        } else {
            task.freeFloat = 0;
            task.totalFloat = 0;
        }
    }

    getLevels() {
        this.levels = {};

        let nodes = [...this.nodes];
        // array to check circular dependencies
        let arr = [];
        const calcLevel = (task) => {
            if (arr.includes(task.key)) {
                throw new Error("Circular dependency detected");
            }
            if (!task.dependsOn || task.dependsOn.length === 0) {
                task.level = 0;
            } else {
                let maxLevel = 0;
                task.dependsOn.forEach((dependency) => {
                    let dependencyTask = nodes.find(
                        (item) => item.key === dependency
                    );
                    if (dependencyTask.level === undefined) {
                        arr.push(task.key);
                        calcLevel(dependencyTask);
                    }
                    maxLevel = Math.max(maxLevel, dependencyTask.level + 1);
                });
                task.level = maxLevel;
            }
            if (!this.levels[task.level]) {
                this.levels[task.level] = [];
            }
            if (!this.levels[task.level].includes(task.key)) {
                this.levels[task.level].push(task.key);
            }
        };

        nodes.forEach((task) => {
            arr = [];
            calcLevel(task);
        });

        let levelKeys = Object.keys(this.levels);
        levelKeys.forEach((levelKey) => {
            this.levels[levelKey] = this.levels[levelKey].sort((a, b) => a - b);
        });
    }

    getNodeLinks() {
        let linkData = [];
        let dependencies = [];
        this.nodes.forEach((task, index) => {
            if (index === 0) return;
            if (task.dependsOn) {
                task.dependsOn.forEach((dependency) => {
                    dependencies.push(dependency);
                    linkData.push({
                        from: dependency,
                        to: task.key,
                        critical:
                            task.critical &&
                            this.nodes[parseInt(dependency)].critical,
                    });
                });
            } else {
                linkData.push({
                    from: 0,
                    to: task.key,
                    critical: task.critical,
                });
            }
        });

        // Add links to finish node
        this.nodes
            .filter(
                (task) =>
                    !dependencies.includes(task.key) &&
                    task.key !== `${this.nodes.length - 1}`
            )
            .forEach((node) => {
                linkData.push({
                    from: node.key,
                    to: this.nodes[this.nodes.length - 1].key,
                    critical: node.critical,
                });
            });

        return linkData;
    }

    getAllCriticalPaths() {
        let criticalPaths = [];
        const links = this.getNodeLinks();
        const startNodes = links.filter(
            (link) => link.from === "0" && link.critical
        );

        startNodes.forEach((startNode) => {
            let path = [startNode];
            const findPath = (node) => {
                const nodeLinks = links.filter(
                    (link) => link.from === node.to && link.critical
                );
                if (nodeLinks.length === 0) {
                    criticalPaths.push([...path]);
                } else {
                    nodeLinks.forEach((nodeLink) => {
                        path.push(nodeLink);
                        findPath(nodeLink);
                        path.pop();
                    });
                }
            };
            findPath(startNode);
        });

        let paths = [];
        criticalPaths.forEach((path) => {
            let pathStr = path.map((_) => _.to);
            if (!paths.includes(pathStr)) {
                paths.push(pathStr);
            }
        });
        criticalPaths = paths.map((path) =>
            path.slice(0, -1).map((_) => {
                return { text: this.nodes[_].text, key: _ };
            })
        );

        return criticalPaths;
    }

    solve() {
        return {
            nodes: this.calculatePERT(),
            levels: this.levels,
            links: this.getNodeLinks(),
            criticalPaths: this.getAllCriticalPaths(),
        };
    }
}

export default Pert;

"use strict";

class Pert {
    constructor(data) {
        this.data = [...data];
        this.nodes = null;
        this.levels = null;
    }

    calculatePERT() {
        this.nodes = null;
        this.levels = null;
        this.links = null;

        this.nodes = [...this.data];

        if (this.levels === null) this.getLevels();

        let levelKeys = Object.keys(this.levels);
        levelKeys.forEach((levelKey) => {
            this.levels[levelKey].forEach((index) => {
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
            });
        });

        let lastTask = this.nodes.reduce((prev, current) =>
            prev.earlyFinish > current.earlyFinish ? prev : current
        );
        lastTask.lateFinish = lastTask.earlyFinish;
        lastTask.critical = true;
        levelKeys = levelKeys.sort((a, b) => b - a);
        this.nodes.push({
            key: this.nodes.length,
            text: "Finish",
            dependsOn: [lastTask.key],
            length: 0,
            earlyStart: lastTask.earlyFinish,
            earlyFinish: lastTask.earlyFinish,
            lateFinish: lastTask.earlyFinish,
            lateStart: lastTask.earlyFinish,
            level: lastTask.level + 1,
            critical: true,
        });

        this.levels[lastTask.level + 1] = [this.nodes.length - 1];

        levelKeys.forEach((levelKey) => {
            this.levels[levelKey].forEach((index) => {
                let task = this.nodes[index];
                let successors = this.nodes.filter(
                    (t) => t.dependsOn && t.dependsOn.includes(task.key)
                );

                let lateFinish;
                if (successors.length === 0) {
                    lateFinish = lastTask.lateFinish;
                } else {
                    lateFinish = Math.min(
                        ...successors.map((s) => s.lateFinish - s.length)
                    );
                }

                task.lateFinish = lateFinish;
                task.lateStart = task.lateFinish - task.length;
                task.critical = task.earlyFinish === task.lateFinish;
            });
        });
        return this.nodes;
    }

    getLevels() {
        this.levels = {};
        let nodes = [...this.data];
        const calcLevel = (task) => {
            if (!task.dependsOn) {
                task.level = 0;
            } else {
                let maxLevel = 0;
                task.dependsOn.forEach((dependency) => {
                    let dependencyTask = nodes.find(
                        (item) => item.key === dependency
                    );
                    if (dependencyTask.level === undefined) {
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
                    linkData.push({ from: dependency, to: task.key });
                });
            } else {
                linkData.push({ from: 0, to: task.key });
            }
        });
        this.nodes
            .filter(
                (task) =>
                    !dependencies.includes(task.key) &&
                    task.key !== this.nodes.length - 1
            )
            .forEach((node) => {
                linkData.push({
                    from: node.key,
                    to: this.nodes[this.nodes.length - 1].key,
                });
            });

        return linkData;
    }

    solve() {
        return {
            nodes: this.calculatePERT(),
            levels: this.levels,
            links: this.getNodeLinks(),
        };
    }
}

export default Pert;

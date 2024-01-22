function calculateDates(tasks) {
    if (!tasks) return [];

    const today = new Date();
    const taskDates = {};

    const sortedTasks = tasks
        .slice()
        .sort(
            (a, b) => (a.dependsOn?.length || 0) - (b.dependsOn?.length || 0)
        );

    sortedTasks.forEach((task) => {
        const dependenciesDates =
            task.dependsOn?.map((key) => taskDates[key]?.end) || [];
        const startDate =
            dependenciesDates.length > 0
                ? new Date(Math.max(...dependenciesDates))
                : today;
        const endDate = new Date(
            startDate.getTime() + task.length * 24 * 60 * 60 * 1000
        );

        taskDates[task.key] = {
            key: task.key,
            text: task.text,
            dependsOn: task.dependsOn,
            start: startDate,
            end: endDate,
        };
    });

    const result = Object.values(taskDates).map((task) => ({
        id: task.key,
        name: task.text,
        dependencies: task.dependsOn,
        start: task.start,
        end: task.end,
        type: "task",
    }));

    return result;
}

export default calculateDates;

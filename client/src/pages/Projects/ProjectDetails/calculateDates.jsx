function calculateDates(tasks) {
    if (!tasks) return [];
    console.log(tasks);
    const today = new Date();
    const taskDates = {};

    function calculateTaskDates(task) {
        if (taskDates[task.key]) return taskDates[task.key];

        const dependenciesDates = task.dependsOn?.map((key) =>
            calculateTaskDates(tasks.find((t) => t.key === key))
        );

        const startDate =
            dependenciesDates?.length > 0
                ? new Date(
                      Math.max(...dependenciesDates.map((d) => d.end.getTime()))
                  )
                : today;

        const endDate = new Date(
            startDate.getTime() + task.length * 24 * 60 * 60 * 1000
        );

        const taskDate = {
            key: task.key,
            text: task.text,
            dependsOn: task.dependsOn,
            start: startDate,
            end: endDate,
            critical: task.critical,
        };

        taskDates[task.key] = taskDate;
        return taskDate;
    }

    tasks.forEach((task) => calculateTaskDates(task));

    const result = Object.values(taskDates).map((task) => ({
        id: task.key,
        name: task.text,
        dependencies: task.dependsOn,
        start: task.start,
        progress: 0,
        end: task.end,
        type: "task",
        styles: {
            backgroundColor: task.critical ? "#dc3545" : "#5e6585",
            backgroundSelectedColor: task.critical ? "#b43642" : "#3f455d",
        },
    }));

    return result;
}

export default calculateDates;

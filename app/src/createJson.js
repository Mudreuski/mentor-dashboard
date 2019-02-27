const fs = require('fs');
const xlsx = require("xlsx");


(function jsonConstructor() {
    const mentors = xlsxRead("data/Mentors info.xlsx");
    const pairs = xlsxRead("data/Mentor-students pairs.xlsx");
    const score = xlsxRead("data/Mentor score.xlsx");
    const tasks = xlsxRead("data/Tasks.xlsx");

    function xlsxRead(xlsxFile) {
        const xlsxList = xlsx.readFile(xlsxFile);
        const sheet = xlsxList.SheetNames;
        
        return xlsx.utils.sheet_to_json(xlsxList.Sheets[sheet[0]]);
    };

    const studentsTasks = tasks.map(function (elem) {
        const elemToObj = {
            task: elem.task,
            taskLink: elem.link,
            status: elem.Status
        };

        return elemToObj;
    });

    const mentorsArr = [];

    for (let i = 0; i < pairs.length; i++) {
        if (!mentorsArr.includes(pairs[i].interviewer)) mentorsArr.push(pairs[i].interviewer)
    }

    const dashboard = mentorsArr.map(function (elem) {
        const elemToObj = {
            mentorName: elem
        };

        return elemToObj;
    });

    for (let i = 0; i < dashboard.length; i++) {
        for (let j = 0; j < mentors.length; j++) {
            if (dashboard[i].mentorName === mentors[j].Name + ' ' + mentors[j].Surname) {
                dashboard[i].mentorGitName = mentors[j].GitHub.substring(19);
                dashboard[i].mentorGitLink = mentors[j].GitHub;
            }
        }
    }

    for (let i = 0; i < dashboard.length; i++) {
        dashboard[i].students = [];

        for (let j = 0; j < pairs.length; j++) {
            if (dashboard[i].mentorName === pairs[j].interviewer) dashboard[i].students.push(pairs[j]['student github'])
        }
    }

    for (let i = 0; i < dashboard.length; i++) {
        dashboard[i].students = dashboard[i].students.map(function (elem) {
            const elemToObj = {
                studentName: elem,
                studentGit: "https://github.com/" + elem,
                studentTasks: []
            };

            return elemToObj;
        })
    }

    for (let i = 0; i < dashboard.length; i++) {
        for (let j = 0; j < dashboard[i].students.length; j++) {
            const name = new RegExp(dashboard[i].students[j].studentName);

            for (let k = 0; k < score.length; k++) {
                const str = score[k]["Ссылка на GitHub студента в формате: https://github.com/nickname"].toLowerCase();
                let bool = name.test(str);

                if (bool === true) {
                    dashboard[i].students[j].studentTasks.push(score[k]["Таск"]);
                }
            }
        }
    }

    dashboard.unshift(studentsTasks);

    const json = JSON.stringify(dashboard, 0, 2);

    fs.writeFile('./mentorsDashboard.json', json, 'utf8', () => {
        console.log('writing is done');
    });
})();

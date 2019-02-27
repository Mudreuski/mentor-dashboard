import React from 'react';
import Select from 'react-select';

import './App.css';
import mentorsDashboard from "./mentorsDashboard";

const taskArr = mentorsDashboard.splice(0, 1);

const Table = ({ selectedOption }) => {
  if (selectedOption !== null) {
    const taskArrObj = taskArr[0];
    let mentorStudents = " ";
    const studentsTasksArr = [];
    const headArr = [];

    mentorsDashboard.map(function (elem) {
      if (selectedOption.value === elem.mentorGitName) {
        mentorStudents = elem;
      }
    });

    const mentorTh =
      <th key={mentorStudents.mentorGitName}>
        <a
          href={mentorStudents.mentorGitLink}
          target="_blank"
          rel="noopener noreferrer">Mentor: {selectedOption.label}
        </a>
      </th>;

    headArr.push(mentorTh);

    mentorStudents.students.map(function (elem) {
      const studentTh =
        <th key={elem.studentName}>
          <a
            href={elem.studentGit}
            target="_blank"
            rel="noopener noreferrer">{elem.studentName}
          </a>
        </th>;

      headArr.push(studentTh);
    });

    studentsTasksArr.push(<tr key={mentorStudents.mentorName}>{headArr}</tr>);

    function getColorTd(keyId, color) {
      return <td key={keyId} style={{ backgroundColor: color }}></td>;
    }

    for (let i = 0; i < taskArrObj.length; i++) {
      const taskTdArr = [];
      const taskTd =
        <td key={taskArrObj[i].task}>
          <a
            href={taskArrObj[i].taskLink}
            target="_blank"
            rel="noopener noreferrer">{taskArrObj[i].task}
          </a>
        </td>;

      taskTdArr.push(taskTd);

      for (let j = 0; j < mentorStudents.students.length; j++) {
        let taskTd;
        const key = mentorStudents.students[j].studentName + taskArrObj[i].status;

        if (taskArrObj[i].status === "In Progress") taskTd = getColorTd(key, "gold");

        if (taskArrObj[i].status === "Checking" && !mentorStudents.students[j].studentTasks.includes(taskArrObj[i].task)) {
          taskTd = getColorTd(key, "lightcoral");
        }

        if (mentorStudents.students[j].studentTasks.includes(taskArrObj[i].task)) {
          taskTd = getColorTd(key, "green");
        }

        if (taskArrObj[i].status === "Checked" && !mentorStudents.students[j].studentTasks.includes(taskArrObj[i].task)) {
          taskTd = getColorTd(key, "maroon");
        }

        if (taskArrObj[i].status === "ToDo") taskTd = getColorTd(key, "grey");

        taskTdArr.push(taskTd);
      }

      studentsTasksArr.push(<tr key={taskArrObj[i].task}>{taskTdArr}</tr>);
    }

    return <table
      className="tableDashboard">
      <tbody key="studentsTasks">{studentsTasksArr}</tbody>
    </table>;
  }

  else return null;
};

const options = mentorsDashboard.map(function (elem) {
  const objElem = {
    value: elem.mentorGitName,
    label: elem.mentorGitName + ' (' + elem.mentorName + ')',
  };

  return objElem;
});

class App extends React.Component {
  state = {
    selectedOption: null,
  };

  handleChange = (selectedOption) => this.setState({ selectedOption });

  render() {
    const { selectedOption } = this.state;

    return (
      <div className="mainContainer">
        <h1>Enter your name or GH account</h1>

        <Select
          className="select"
          value={selectedOption}
          onChange={this.handleChange}
          options={options}
        />

        <Table selectedOption={selectedOption} />
      </div>
    );
  }
}

export default App;

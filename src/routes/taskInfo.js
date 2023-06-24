const taskRoutes = require("express").Router();
const bodyParser = require("body-parser");
const taskData = require("../tasks.json");
const validator = require("../helpers/validator");
const path = require("path");
const fs = require("fs");

taskRoutes.use(bodyParser.urlencoded({ extended: false }));
taskRoutes.use(bodyParser.json());

taskRoutes.get("/", (req, res) => {
  res.status(200).send(taskData);
});

taskRoutes.get("/:taskId", (req, res) => {
  let task = taskData.data;
  let taskPassed = req.params.taskId;
  let result = task.filter((val) => val.taskId == taskPassed);
  res.status(200).send(result);
});

taskRoutes.post("/", (req, res) => {
  const taskDetails = req.body;
  let writePath = path.join(__dirname, "..", "tasks.json");
  if (validator.validateTaskInfo(taskDetails, taskData).status) {
    let taskDataModified = taskData;
    taskDataModified.data.push(taskDetails);
    fs.writeFileSync(writePath, JSON.stringify(taskDataModified), {
      encoding: "utf-8",
      flag: "w",
    });
    res.status(200).send("Task added successfully");
  } else {
    res.status(400).json(validator.validateTaskInfo(taskDetails, taskData));
  }
});

taskRoutes.put("/:taskId", (req, res) => {
  const taskDetails = req.body;
  let taskPassed = parseInt(req.params.taskId);
  let task = taskData.data;
  let writePath = path.join(__dirname, "..", "tasks.json");
  let result = task.filter((val) => val.taskId == taskPassed);
  let data = result[0],
    newData;
  if (data) {
    data = { ...data, ...taskDetails };
    newData = fs.writeFileSync(
      writePath,
      JSON.stringify(
        { ...taskData, ...data },
        {
          encoding: "utf-8",
          flag: "w",
        }
      )
    );
    res.status(200).send(data);
  } else {
    res.status(400).send({
      message: "Task Id not found",
    });
  }
});

taskRoutes.delete("/:taskId", (req, res) => {
  let taskPassed = parseInt(req.params.taskId);
  let task = taskData;
  if (task.data.filter((val) => val.taskId == taskPassed)) {
    res.status(400).send({
      message: "Task Id not found",
    });
  } else {
    let result = task.data.filter((val) => val.taskId !== taskPassed);
    let writePath = path.join(__dirname, "..", "tasks.json");
    fs.writeFileSync(writePath, JSON.stringify({ data: result }), {
      encoding: "utf-8",
      flag: "w",
    });
    res.status(200).send("Task deleted successfully");
  }
});

module.exports = taskRoutes;

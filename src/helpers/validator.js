class validator{
    static validateTaskInfo(taskInfo, taskData){
        if(taskInfo.hasOwnProperty("taskId") && taskInfo.hasOwnProperty("title") && 
        taskInfo.hasOwnProperty("description") && taskInfo.hasOwnProperty("taskStatus") && this.validateUniqueTaskId(taskInfo, taskData)){
            return{
                "status": true,
                "message": "Task has been added"
            }
        }
        if(!this.validateUniqueTaskId(taskInfo, taskData)){
            return{
                "status": false,
                "message": "Task ID has to be Unique"
            }
        }
        return{
            "status": false,
            "message": "Data is malformed, please provide all the properties"
        }
    }

    static validateUniqueTaskId(taskInfo, taskData){
        let value = taskData.data.some(el=>el.taskId ==taskInfo.taskId);
        if(value) return false;
        return true;
    }
}

module.exports = validator
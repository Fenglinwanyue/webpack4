const inquirer = require("inquirer");
const generator = require("./generator");

const promptList = [
    // 具体交互内容
    {
        type: "list",
        message: "请选择创建的文件类型:",
        name: "type",
        choices: [
            {
                name: "页面",
                value: "view"
            }
        ],
        filter: function(val) {
            // 使用filter将回答变为小写
            return val.toLowerCase();
        }
    }
];

const pagePromptList = [
    {
        type: "input",
        message: "please enter view name:",
        name: "viewName"
    }
];

inquirer.prompt(promptList).then(answers => {
    // console.log(answers); // 返回的结果
    switch (answers.type) {
        case "view":
            inquirer.prompt(pagePromptList).then(answer => {
                console.log(answer.viewName);
                answer = Object.assign({}, answer, {
                    basePath: `/src/types/views/${answer.viewName}/${answer.viewName}.vue`
                });
                generator.createView(answer, () => {});
            });
            break;

        default:
            break;
    }
});

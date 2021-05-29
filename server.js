//Dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');

//Setting with the sql database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'employee_tracker',
});

console.log ("Welcome to the employee dashboard!");
console.log("----------------------------------------------------------------");
console.log("----------------------------------------------------------------");
console.log("Please select an option: ");


//Function to select one option: VIEW, ADD or UPDATE
const allOptions = () => {
   inquirer. prompt([
    {
        name: 'view',
        type: 'list',
        message: 'What do you want to perform?',
        choices: ["View deparments, roles or employees", "Add deparments, roles or employees", "Update employee roles", "Update employee managers", "View employees by manager", "Delete departments, roles, or employees", "View the total utilized budget of a department"]
    },
    ]).then((answer)=>{
        switch(answer.choices) {
            case "View deparments, roles or employees":
              view();
              break;
            case "Add deparments, roles or employees":
              add();
              break;
            case "Update employee roles":
              updateRoles();
              break;
            case "Update employee managers":
              updateManager();
              break;
            case "View employees by manager":
              employeeByManager();
              break;
            case "Delete departments, roles, or employees":
              del();
              break;
            case "View the total utilized budget of a department":
              budget();
              break;       
        }
    })
}

allOptions();

const view = () => {
    inquirer. prompt([
        {
            name: 'view',
            type: 'list',
            message: 'Please select what information you want to display: ',
            choices: ["Deparments", "Roles", "Employees"]
        },   
    ]).then((answer)=>{
        switch(answer.choices) {
            case "Deparments":
                show(department);
              break;
            case "Roles":
                show(role);
              break;
            case "Employees":
                show(employee);
              break;
        }
    })
}

const show = () => {
    connection.query( 'SELECT * FROM ?',
        (err) => {
          if (err) throw err;
        })
}
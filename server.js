//Dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');


//Setting with the sql database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'employee_dashboard',
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
        switch(answer.view) {
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
        
        }

    )
   
}

allOptions();


// First case: Show
const view =()=> {
    console.log("test")
    inquirer.prompt([
        {   
            name: 'show',
            type: 'list',
            message: 'Please select what information you want to display: ',
            choices: ["Departments", "Roles", "Employees"]
        },   
    ]).then((answer)=>{
        switch(answer.show) {
            case "Departments":
               showDepartments();
                break;
            case "Roles":
                showRoles();
             break;
            case "Employees":
                showEmployees();
            break;
        }
    })
}


//Second case: Add
const add=()=> {
    inquirer. prompt([
        {
            name: 'add',
            type: 'list',
            message: 'What do you want to add to the dashboard',
            choices: ["Deparments", "Roles",  "Employees"]
        },
        ]).then((answer)=>{
            switch(answer.add) {
                case "Employees":
                 addEmployee();
                break;
                case "Roles":
                 addRoles();
                break;
                case "Departments":
                 addDepartment();
            }
        })
 }



 // First case subfunctions
 const showDepartments=()=>{
    connection.query( 'SELECT * FROM departments ORDER BY id DESC',
    (err, res) => {
    if (err) throw err;
    console.log ("ID  | Name")
    console.log("-------------------------")
    res.forEach(({ id, name}) => {
        console.log(`${id} | ${name}`);
        console.log("......................")
      });
             })
 };

 const showRoles=()=>{
    connection.query( 'SELECT * FROM roles ORDER BY id DESC',
    (err, res) => {
    if (err) throw err;
    console.log ("ID  |     Title     |     Salary    |   Department ID")
    console.log("----------------------------------------------------------")
    res.forEach(({ id, title, salary, department_id}) => {
        console.log(`${id} | ${title}  |  $${salary}.00 |    ${department_id}`); 
      });
     })
 }

 const showEmployees=()=>{
    connection.query( 'SELECT * FROM employees ORDER BY id DESC',
    (err, res) => {
    if (err) throw err;
    console.log ("ID  |       Name       |   Role ID    |  Manager ID ")
    console.log("---------------------------------------------------------------------------")
    res.forEach(({ id, first_name, last_name, role_id, manager_id}) => {
        console.log(`${id} | ${first_name} ${last_name} |  ${role_id}  | ${manager_id}`); 
      });
     })
 }



 //Second case subfunctions
 const addEmployee = () =>{
    connection.query('SELECT title FROM roles', (err,res)=>{
        if(err) throw err;
    inquirer.prompt([        
        {
           name: 'firstName',
           type: 'input',
           message: 'Please enter the employee first name',
        },
        {
           name: 'secondName',
           type: 'input',
           message: 'Please enter the employee second name',
        },
        {
           name: 'role',
           type: 'rawlist',
           message: 'Please select the role of the employee',
           choices() {
            const roles = [];
            res.forEach(({ title }) => {
              roles.push(`${title}`);
            });
            return roles;
          },
        },
        {
           name: 'id',
           type: 'input',
           message: 'Please enter the employee id',
        }   
    ]).then((answer)=>{
      //Query to get the role id from the selected role
      connection.query('SELECT r.id FROM roles r JOIN employees e ON r.id = e.role_id AND title=?;', answer.role, (err, res)=> {
        if(err) throw err;
        const resId=res;
        console.log(resId); 
     //Query to get the manager id from the selected role
      connection.query('SELECT manager_id FROM employees WHERE role_id=?;', resId, (err, res)=>{
        if(err) throw err;
         const managerId=res;
         console.log(managerId);
    //Query to insert all the values in the new employee record
      connection.query('INSERT INTO employees (id, first_name, last_name, role_id, manager_id) VALUES ?;',
      {
       role_id:resId,
       id:answer.id,
       first_name: answer.firstName,
       last_name: answer.secondName,
       manager_id:managerId,
      })
    })
   }) 
 })
})
 }
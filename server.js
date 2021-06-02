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
        choices: ["View deparments, roles or employees", "Add deparments, roles or employees", "Update employee roles"]    
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
          }   
    })  
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
            choices: ["Departments", "Roles", "Employees", "Back to main menu"]
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
            case "Back to main menu":
                allOptions();
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
            choices: ["Departments", "Roles",  "Employees"]
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
                 break;
            }
        })
 }



 // First case subfunctions
 const showDepartments=()=>{
    connection.query( 'SELECT * FROM departments ORDER BY id DESC',
    (err, res) => {
    if (err) throw err;
    console.log ("ID  | Name")
    console.log("-----------------------------")
    console.log("----D E P A R T M E N T S----")
    console.log("-----------------------------")
    res.forEach(({ id, name}) => {
        console.log(`${id} | ${name}`);
        console.log("......................")
      });
      allOptions(); 
    }); 
 };

 const showRoles=()=>{
    connection.query( 'SELECT * FROM roles ORDER BY id DESC',
    (err, res) => {
    if (err) throw err;
    console.log("--------------------------------------------------------------------------------------")
    console.log("--------------------------------------R O L E S---------------------------------------")
    console.log("--------------------------------------------------------------------------------------")
    res.forEach(({ id, title, salary, department_id}) => {
        console.log(`ID: ${id}| Title: ${title} | Salary: $${salary}.00 | Department ID: ${department_id}`);
        console.log("-------------------------------------------------------------------------------------") 
      });
      allOptions();
     });
 }

 const showEmployees=()=>{
    connection.query( 'SELECT * FROM employees ORDER BY id DESC',
    (err, res) => {
    if (err) throw err;
    console.log("---------------------------------------------------------------------------")
    console.log("----------------------------E M P L O Y E E S------------------------------")
    console.log("---------------------------------------------------------------------------")
    res.forEach(({ id, first_name, last_name, role_id, manager_id}) => {
        console.log(`ID: ${id} | Name: ${first_name} ${last_name} | Role ID: ${role_id} | Manager ID: ${manager_id}`); 
        console.log("--------------------------------------------------------------------------")
      });
      allOptions();
     });
 }

 //Second case subfunctions

 //Add Employee
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
        res.forEach(({id})=>{
            resId=(`${id}`)
        })
     //Query to get the manager id from the selected role
      connection.query('SELECT manager_id FROM employees WHERE role_id=?;', (resId), (err, res)=>{
        if(err) throw err;
        res.forEach(({manager_id})=>{
            managerId=(`${manager_id}`)
        })
    //Query to insert all the values in the new employee record
      connection.query('INSERT INTO employees SET ?;', 
      {
        id:answer.id,
        first_name: answer.firstName,
        last_name: answer.secondName,
        role_id:resId,
        manager_id:managerId,
       }
       , (err)=>{
       if(err) throw err;
       console.log(`New employee: ${answer.firstName} ${answer.secondName}, added!`)
        })
      })
      allOptions();
     })
    }) 
  })
};

//Add role
const addRoles=()=>{
    connection.query('SELECT name FROM departments', (err,res)=>{
        if(err) throw err;
    inquirer.prompt([        
        {
           name: 'title',
           type: 'input',
           message: 'Please enter the role you want to add',
        },
        {
           name: 'id',
           type: 'input',
           message: 'Please enter the role id',
        },  
        {
            name: 'salary',
            type: 'input',
            message: 'Please enter the role salary',
            validate(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              },
         },
         {
            name: 'department',
            type: 'rawlist',
            message: 'Please select the department for this new role',
            choices() {
             const departments = [];
             res.forEach(({name}) => {
               departments.push(`${name}`);
             });
             return departments;
           },
         },

    ]).then((answer)=>{  
    //Query to get the dapartment id from the selected department name
    connection.query('SELECT d.id FROM departments d WHERE d.name=? LIMIT 1;', (answer.department), (err,res)=>{
        if(err) throw err;
        res.forEach(({id})=>{
            departmentId=(`${id}`)
        })
    connection.query('INSERT INTO roles SET ?;',
    {
     id:answer.id,
     title:answer.title,
     salary:answer.salary,
     department_id:departmentId,
    },
    (err)=>{
        if(err) throw err;
        console.log(`The new role: ${answer.title}, has been added!`)
      })
      allOptions();
     }) 
   })
  })
};

//Add department
const addDepartment =()=> {
    console.log("test")
    inquirer.prompt([        
        {
           name: 'name',
           type: 'input',
           message: "Please enter the department's name: ",
        },
        {
           name: 'id',
           type: 'input',
           message: "Please enter the department's id: ",
           validate(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          },
        },  
       ]).then((answer)=>{
           connection.query('INSERT INTO departments SET ?',
           {
               id:answer.id,
               name:answer.name
           },
           (err)=>{
               if(err) throw err;
               console.log(`The new department: ${answer.id} has been added!`);
               allOptions();
           }); 
       })
    };

//Third case functions
//Update role
const updateRoles=()=>{
    connection.query('SELECT DISTINCT e.id, e.first_name, e.last_name, r.title FROM employees e JOIN roles r ON e.role_id = r.id', (err, res)=>{
        if (err) throw err;
        inquirer.prompt([
            {
                name: "name",
                type: "rawlist",
                message: "Please select the employee to whom the role will be updated",
                choices(){
                    employeeList=[];
                    res.forEach(({first_name, last_name,id})=>{
                    nameConstructor= `ID:${id}---${first_name} ${last_name}`
                    employeeList.push(nameConstructor);
                });
                return employeeList;
               }
            }, 
            {
                name: "updateRole",
                type: "rawlist",
                message: "Which role do you want to set for this employee?: ",
                choices(){
                   roleList=[];
                    res.forEach(({title})=>{
                    roleList.push(`${title}`);
                   });
                 return roleList;
                  }
            },  
        ]).then((answer)=>{
            connection.query('SELECT id FROM roles WHERE title=?', answer.updateRole, (err,res)=>{
              if (err) throw err;
              updatedRoleId=[];
              res.forEach(({id})=>{
              updatedRoleId.push(`${id}`);
              })
              employeeArray=answer.name;
              employeeID=employeeArray.substring(3,6);
                //Query to update the employee role_id using his id
              connection.query(`UPDATE employees SET role_id=${updatedRoleId} WHERE id=${employeeID}`, (err)=>{
                if(err) throw err;
              console.log(`${answer.updateRole} is now the role for the employee ID:${employeeID}!`)
              allOptions();
            });
              
            });
          }); 
        });
      };
    

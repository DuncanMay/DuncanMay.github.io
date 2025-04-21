// Problem 1: Create JSON for each employee
let employees = [
    {
      firstName: "Sam",
      department: "Tech",
      designation: "Manager",
      salary: 40000,
      raiseEligible: true
    },
    {
      firstName: "Mary",
      department: "Finance",
      designation: "Trainee",
      salary: 18500,
      raiseEligible: true
    },
    {
      firstName: "Bill",
      department: "HR",
      designation: "Executive",
      salary: 21200,
      raiseEligible: false
    }
  ];
  
  console.log("// Problem 1");
  console.log("Employees:", employees);
  
  // Problem 2: Create JSON for the company
  let company = {
    companyName: "Tech Stars",
    website: "www.techstars.site",
    employees: employees
  };
  
  console.log("// Problem 2");
  console.log("Company:", company);
  
  // Problem 3: Add new employee Anna
  const newEmployee = {
    firstName: "Anna",
    department: "Tech",
    designation: "Executive",
    salary: 25600,
    raiseEligible: false
  };
  
  company.employees.push(newEmployee);
  
  console.log("// Problem 3");
  console.log("Updated Company with Anna:", company);
  
  // Problem 4: Calculate total salary
  let totalSalary = company.employees.reduce((sum, emp) => sum + emp.salary, 0);
  
  console.log("// Problem 4");
  console.log("Total Salary of All Employees:", totalSalary);
  
  // Problem 5: Apply raises if eligible
  function applyRaises(company) {
    for (let employee of company.employees) {
      if (employee.raiseEligible) {
        employee.salary *= 1.10;
        employee.raiseEligible = false;
      }
    }
  }
  
  applyRaises(company);
  
  console.log("// Problem 5");
  console.log("Company After Raises Applied:", company);
  
  // Problem 6: Working from home updates
  const workingFromHome = ["Anna", "Sam"];
  
  for (let employee of company.employees) {
    employee.wfh = workingFromHome.includes(employee.firstName);
  }
  
  console.log("// Problem 6");
  console.log("Company With Work From Home Updates:", company);
  
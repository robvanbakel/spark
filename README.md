# Spark

Spark aims to make it easy for employers to manage their staff, as well as create and share work schedules with their employees. Weekly schedules can be made in the app, which are then being pushed to a calendar feed that employees can subscribe to.

Read the [Demo section](#demo) to learn how to access the demo environment.

## Features

#### Managing Employees

Employers can manage a list of their staff, which includes adding and removing employees, updating their info (status, role, personal details, etc.) and setting the amount of working hours specified in their contract.

#### Creating Work Schedules

Employers can add, edit and remove shifts from a weekly planning. Each shift is assigned to an employee and holds information about the date, time and place they're scheduled to work at.

#### Calendar Subscriptions

Each employee will receive a unique link to automatically add their work schedule to their calendar via a subscription. Changes in the planning that are made by the employer will be automatically synchronized with the employees' calendars.

## Demo

To see Spark in action, visit the [public demo page](https://demo.sparkscheduler.com) and click on the _Enter Demo_ button below the login form. You'll be taken to the admin area, which is where employers will manage their staff and create schedules.

In order to login as an employee, use any of the demo employee email addresses available in the admin area. For all accounts, the password is the same as the email address.

## Feature Implementation Status

| Feature                                       | View     | Status      |
| --------------------------------------------- | -------- | ----------- |
| Login as employer                             | AUTH     | Done        |
| Activate account as employee                  | AUTH     | Done        |
| Login as employee                             | AUTH     | Done        |
| Create, read, update and delete employees     | STAFF    | Done        |
| Search and filter employees                   | STAFF    | Done        |
| Create, read, update and delete shifts        | PLANNER  | Done        |
| Search and filter shifts                      | PLANNER  | Done        |
| Setting to share notes with employees         | SETTINGS | Done        |
| View schedules in Employee login              | EMPLOYEE | Done        |
| Serve calendar subscription for each employee | EMPLOYEE | Done        |
| Accept shifts as employee                     | PLANNER  | In progress |
| Create planning draft before publishing       | PLANNER  | Upcoming    |
| Provide availability to planner               | EMPLOYEE | Upcoming    |

## Screenshots

###### List of employees

![EmployeeList](https://robvanbakel.com/images/spark_employeelist.jpg)

###### Modal to edit employee details

![EditEmployee](https://robvanbakel.com/images/spark_editemployee.jpg)

###### Weekly view of the planner

![Planner](https://robvanbakel.com/images/spark_planner.jpg)

###### Modal to edit a shift

![EditShift](https://robvanbakel.com/images/spark_editshift.jpg)

###### Single employees' schedule

![Planner](https://robvanbakel.com/images/spark_schedule.jpg)

###### Modal to view employees' shift details

![EditShift](https://robvanbakel.com/images/spark_shiftinfo.jpg)

#### Built With

- Vue 3
  - [Vue CLI](https://cli.vuejs.org)
  - [Vue Router](https://next.router.vuejs.org)
  - [Vuex](https://next.vuex.vuejs.org)
- Firebase
  - [Firebase Auth](https://firebase.google.com/docs/auth)

## Other repositories

- [robvanbakel/spark-admin](https://github.com/robvanbakel/spark-admin)
- [robvanbakel/spark-website](https://github.com/robvanbakel/spark-website)

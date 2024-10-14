# CanvasToDo
## How I got the Idea
I developed this project during my sophomore year. I was inspired by "TickTick," a task management app I used for classes. Unlike other to-do apps I had tried (Notion, Todoist, etc.), TickTick stuck with me because of its simplicity and easy access from the Macbook menubar. While using it, I had to manually enter my assignments and dates, which led me to try automating this process. After discovering the Canvas API, which my school uses, I decided to build an app to interact with it.

## Learning behind the Project
I was already familiar with React and had worked with APIs in previous projects, like MyMeals. However, working with the Canvas API was different because many of its calls are restricted due to its connection with school platforms. I had to find creative workarounds to access the data I needed. The Canvas LMS documentation helped with basic tasks, but for more complex issues, I relied on the Canvas LMS community help site. Through questions I received valuable insights on my posts from more experienced members of the community. Links to these resources are included below.

## Project Description
CanvasToDo requires users to generate an API key through their Canvas account to log in. Once the key is validated, a backend JavaScript file uses it to make API calls, sending the data to the React frontend.</br>

Key features include:</br>
- Header: Displays user’s name, ID, and profile picture.
- Courses: Shows current courses with the ability to add or remove them dynamically.
- To-Do List: Lists upcoming assignments, allows users to check off completed ones (with the option to move them back), add custom assignments, and set completion percentages.
- Modules: Displays course modules with a dropdown for each item, labeling assignments that need submission, are awaiting grading, and their respective grades.</br>

## Visual Walkthrough
When I open the program, it loads as a menubar application on the top of my computer screen.</br>
<img width="1512" alt="Screenshot 2024-09-07 at 10 25 13 PM" src="https://github.com/user-attachments/assets/cfaa5a5b-01a5-4cf3-afd3-ee94b1382e05">
Clicking on the icon, opens the CanvasToDo interface.</br>
When you open the applucation for the first time, you must enter your api token. If confused, users can click on the "Request an API token" which opens an step-by-step article on how to create one. Incorrect api keys will result in an invalid notification and users will be prompted to reenter.</br>
<img width="1512" alt="Screenshot 2024-09-15 at 1 11 26 PM" src="https://github.com/user-attachments/assets/8b93e84c-373c-4044-b26d-83e92878b22e">
After verifying the API token, the application will load. Displayed at the top is the users full name, canvas id, and profile picture (clicking this gives users the ability to logout).</br>
<img width="1512" alt="Screenshot 2024-09-15 at 1 17 09 PM" src="https://github.com/user-attachments/assets/815584ed-809b-486c-b50d-c19e961b44de">
Just below that is the courses section, for testing purposes I have just 1 active course listed.</br>
<img width="1512" alt="Screenshot 2024-09-15 at 1 21 15 PM" src="https://github.com/user-attachments/assets/2e42294a-e52b-4947-b27b-2657e2023bfd">
Clicking on the full name checkbox gives courses a more concise format.</br>
<img width="1512" alt="Screenshot 2024-09-15 at 1 22 50 PM" src="https://github.com/user-attachments/assets/3e82d086-430c-48cf-97b7-b93a1f66ae81">
Clicking the "X" will remove the course from the courses section.</br>
<img width="1512" alt="Screenshot 2024-09-15 at 1 24 21 PM" src="https://github.com/user-attachments/assets/9af9e6e9-75ca-47ae-b6f7-4206f7ee8ef7">
<img width="1512" alt="Screenshot 2024-09-15 at 1 25 15 PM" src="https://github.com/user-attachments/assets/856a8b34-4348-4ec9-83df-e2fdef70e066">
Clicking the "Re-add Course" button will allow to re-add removed courses.</br>
<img width="1512" alt="Screenshot 2024-09-15 at 1 26 07 PM" src="https://github.com/user-attachments/assets/66f07c0b-ac67-4130-bbac-4cedbc8b135e">
<img width="1512" alt="Screenshot 2024-09-15 at 1 26 52 PM" src="https://github.com/user-attachments/assets/b2fe0559-94a2-4b13-8208-a357ea54b076">
Next is the To-Do section. Here users will see their upcoming assignments displayed. Submitted assignments will be automatically removed, and new assignemnts will be automatically displayed.</br>
<img width="1512" alt="Screenshot 2024-09-15 at 1 29 41 PM" src="https://github.com/user-attachments/assets/5b063c46-cafb-4dd5-9500-650454ff7167">
Users can create new assignments using the top three input fields (entering task name, task due date, and adding the task).</br>
<img width="1512" alt="Screenshot 2024-09-15 at 1 32 14 PM" src="https://github.com/user-attachments/assets/653b1d15-5ba6-46ce-a593-95f47d1551b0">
Just below users can filter assignments based on their due dates. Choosing between showing assignments within the next week, next two weeks, next month, and all assignments.</br>
<img width="1512" alt="Screenshot 2024-09-15 at 1 35 30 PM" src="https://github.com/user-attachments/assets/43fe2f1c-4c9d-4290-acd7-d6b5d9fcdde3">
Tasks themselves are placed into two categories "Current" and "Completed". "Current" displays all upcoming assignments and any user created tasks. Items are sorted by due date, and color coded (red for past due, blue for due soon, and black for upcoming). By clicking the checkbox to the left of any "Current" task it is moved to the "Completed" section. "Completed" displays the 5 most recently completed tasks. Clicking the checkbox to the left of any of these items will move them back to the "Current" section.</br>
<img width="1512" alt="Screenshot 2024-09-15 at 1 38 30 PM" src="https://github.com/user-attachments/assets/0386c282-f1cf-46b6-871e-689e1d1feca2">
By clicking the gray line below any task you can set a completed percentage. Depending of where you click, it will set a certain percentage (in increments of 10). In this example I simply clicked the middle of the line. </br>
<img width="1512" alt="Screenshot 2024-09-15 at 1 45 50 PM" src="https://github.com/user-attachments/assets/99e8ffcc-3a4f-4bc8-a835-2092e8a9c107">
While hovering shows the completed percentage. Tasks will typically appear as follows.</br>
<img width="1512" alt="Screenshot 2024-09-15 at 1 47 42 PM" src="https://github.com/user-attachments/assets/72ad7c0a-3ffa-4b08-9483-5950483eb9db">
Lastly is the modules section. Here courses are displayed as items with a course name, grade, and dropdown.</br>
<img width="1512" alt="Screenshot 2024-09-15 at 1 49 07 PM" src="https://github.com/user-attachments/assets/c352924c-6d31-47ae-8b44-7a7f5038a15d">
Clicking the dropdown will expand the course item into a list of modules, all with their own dropdown.</br>
<img width="1512" alt="Screenshot 2024-09-15 at 1 50 28 PM" src="https://github.com/user-attachments/assets/37a1423d-b6c5-415f-ba70-c64ec2db1715">
Clicking on a subsquent module will display its items (files, quizzes, exams, assignments, etc). Graded items will display a score, while unsubmitted items will display a due date. Submittedable items will be color coded: 🟩 ~ item has been graded, 🟨 ~ item has been submitted.</br>
<img width="1512" alt="Screenshot 2024-09-15 at 1 57 36 PM" src="https://github.com/user-attachments/assets/60bd22ff-5fd4-4474-b602-304a80dfb074">


## Resources
Canvas API Documentation: [https://canvas.instructure.com/doc/api/](https://canvas.instructure.com/doc/api/)</br>
Canvas LMS Community: [https://docs.ultralytics.com/](https://community.canvaslms.com/)</br>

# LandmarkRemark

Landmark Remark web application allows users to save location based notes on a map. These notes can be displayed on the map where they were saved and viewed by the user that created the note as well as other users of the application. The application demonstrates the following functionality :
A user (of the application) I can see my current location on a map
- A user can save a short note at his current location
- A user can see notes that he has saved at the location they were saved on the map.
- A user can see the location, text, and user-name of notes other users have saved.
- A user can delete his notes.
- A user can search for a note based on contained text or user-name.

## Getting Started

### Start Application
                                                          
  Please read how to use application and then click on the website link below.
  
  https://landmark-remarks.herokuapp.com

### Use Application

1. Log into Application 

   - The application has 3 test users with username - `userA`, `userB`, `userC` and all have password `pass` for now.
   
2. Home page -  `Home`

   - The homepage has a map that shows markers of all users where, 📍 are markers of logged in user and rest markers in **Blue** are rest users.  
   - The user can `edit/delete` only his marker and `view-only` other markers, by clicking on them.
   - The user can add new notes at his currrent location **ONLY** by clicking on ` + Create Landmark` button in the `Navigation Bar`.
  
3. Landmarks - `Landmarks`

   - This displays a table with notes from all users with their respective note id, name, location, date last updated and note text.
   - Again logged in user can click on his note to `edit/delete` but can only `read` other users notes.
   - Search notes by `Text` or `User`,by entering search content and clicking respective search `buttons`.
  
4. Logout - `<-- Logout`
   
   - Click to log out from application.
   
### Development Environment
    - React+Redux - Front end libraries
    - npm - Dependency Management
    - Node Express - Server 
    - MongoDB - Database

### Author
    
    Afif Patel
    

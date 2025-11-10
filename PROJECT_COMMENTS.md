### Commit

`  ` Month/Day
**Purpose:**  
< >

### Commit

`Add: enable the patient to choose an insurance company from the insurances table and access,update insurance company in useraccount`

**Purpose:**  
<i made this commit to enable the patient to add insurance company when they in register form also he will be able to modify or delete the associated insurance comapny from the user account pag.>

'Fix: Docker Files' Oct/25
<frontend service wasn't working>

### commit

`Fix docker problems `
< i made this commit to fix some docker problems . The problem was when i made any change in frontend i cannot see the result of that change.>

### commit

`feat(frontend): enable each clinic to manage its insurance companies add,delete,read `
`feat(backend): enable each clinic to manage its insurance companies add,delete,read `
< i made this commit to enable each clinic to add delete read insurance companies by handle the insurance controller , insuranceClinic,Clinic models modify the insurances table by adding new column to handle soft delete feature , then test the backend APIs using postman and make sure all works successfully , then make the frontend design and connect it with backend by axios library finally test the user interface and make sure the design is taking the MediCina theme >

### Commit

`feat: enable each clinic to delete its associated doctors handle backend,frontend`
**Purpose:**  
< operate delete doctor from clinic also making it soft delete >

### Commit

`cleaning`
**Purpose:**  
< remove the doctorclinic controller and but its functions inside the clinicdoctor controller becuase the confusion issue between the naming of these two controllers>

### Commit

`feat: enable the patient to filter using the insurance company`
**Purpose:**  
< enable each patient to filter by its insurance company so now before choose the clinic he can check if his prefered clinic use the same as his insurance company >

### Commit

` Add: Create and Update consultation_duration for doctors.` Oct/29
**Purpose:**
<Purpose is clear>

### Commit

` fix: remove unwanted components` Oct/29
**Purpose:**
<Caused a failure on server launch>


### Commit

` feat: enable each doctor to see his associated clinics.` Oct/29
**Purpose:**  
< now each doctor can see his associated clinic . >


### Commit

` feat: implement the Lab User both in frontend and backend so now you can register,login as lab ` Oct/30
**Purpose:**  
< now you can register, login as lab the next step is handle lab features that will be after login>


### Commit

` Enhance: make the delete user account soft delete ` Oct/30
**Purpose:**  
< i made this change to make the delete user account soft delete >


### Commit

` Enhance: enhance the image upload issue when user choose his profile picture ` Oct/30
**Purpose:**  
< enhace the upload profile image for users so now the picture will not be added to the github repo it will be saved in laravelbackend/storage so that is the best practice for this feature . >


### Commit

` Implement the role feature to make each feature accessable for each role ` Nov/01
**Purpose:**  
< this role will help manage the users authorization and give access by role , this was handled before in the controllers but now we separate this to make the code more clean and readable to follow the principles of writing clean code >


### Commit

` feat: enable each lab to make request to upload the lab results , enable each patient to respond for lab request ` Nov/01
**Purpose:**  
< here enable each lab to make request then the patient will respond then the lab will be enabled to upload the lab results , build this using specific requests for each APIs function instead of the default ones with policy to secure the process of associated patient for each lab and for sure with middleware configration to check the role after checking if the user is authenticated >


### Commit

` Enhance: the notifications icon for the patient to occur the number of massages above the bill icon in toolbar ` Nov/02
**Purpose:**  
< enhance the UI for the notifications button for the patient user.>

### Commit

` feat: enable the patient to access his lab results by click on lab results in sidebar ` Nov/02
**Purpose:**  
< now the patient can access and see the lab results reports that the lab upload after he gave the lab a permision to do this. >




### Commit

` feat: implement new user which is Admin but in backend so if you want to access the admin user you must use port:8000 ` Nov/02
**Purpose:**  
< add new user (Admin) but i setup it in backend so if you want to use it you must use localhost:8000 but first rebuild the backend container because i add new dependencies for the project which is npm but for backend to handle the view pages using tailwind css styles also run docker compose exec backend npm run build to make these changes happen after build the project . >


### Commit

` feat: enable the admin user to read,creat,update,delete insurance companies ." Nov/03
**Purpose:**  
< now the admin can create delete read update any insurance company he want .>


### Commit

` feat: enable the admin user to delete any user account ` Nov/04
**Purpose:**  
< now the admin can delete any user from MediCina's system >

### Commit

` feat: enable each doctor to see his patient appointment for specific associated clinic ` Nov/06
**Purpose:**  
< now the doctor can see his patients and after finish the appointment he can click on finish appointment so the status will be changed
from booked to completed next step to operate the medical record so he will be enable to upload medical record with associated lab results for specific appointment ID >


### Commit

` enhance seeders and put profile image for each user ` Nov/07
**Purpose:**  
< enhance the seeders data and upload new profile picture for each user so now when you make --seed a profile picture will be inserted
so the overall design will be so great , also the uploaded pictures from the seeder where gone to backend storage. >


### Commit

`  make the loading spinner consistent for all component ` Nov/08
**Purpose:**  
< to make the spinner for loading icon the same for all components >


### Commit

` feat: enable each doctor to upload,read medical record for patient for specific appointment ` Nov/09
**Purpose:**  
< now the doctor can upload,read medical consultation for booked patients for specific appointment >

### Commit

`  feat: enable the patient to access his medical record with associated lab result for each appointment` Nov/10
**Purpose:**  
< now the patient can access his medical record and see the results with lab result that is associated with each medical record for every completed appointment >

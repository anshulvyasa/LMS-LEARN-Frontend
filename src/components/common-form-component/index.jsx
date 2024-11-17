//This is CommonForm.jsx file

//this file will contains only form tag and button i am using to structure the web application and reduce complexity
//here it will contains CommonForm function which will have five parameters
//handleSubmit => what will happen if the form is Submitted call for backned going tohappen here
//buttonText   => the Text to be Displayed on Button Component(imported from shadcn ui library) if it's not given the deafult text is 'Submit'
//formControl  => contrains feild to displayed on form (See FormControl for better understanding path={./form-control})
//formData   => now the user will write something on you form like email,password so you have to store it somewhere right
//setFormData => as User Changes the input then that changes will have to  reflect in formData

import { Button } from "../ui/button"; //Just a UI component from shadcn UI library
import FormControls from "./form-control"; // formControls to actually render the Fields of form

//function where my Logic will be written
function CommonForm({
  handleSubmit,
  buttonText,
  formControl = [],
  formData,
  setFormData,
  isDisabled=false
}) {

  
  return (
    <form onSubmit={handleSubmit}>
      <FormControls
        formControl={formControl}
        formData={formData}
        setFormData={setFormData}
      />
      <Button className="mt-5 w-full"  disabled={isDisabled} type="submit">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;

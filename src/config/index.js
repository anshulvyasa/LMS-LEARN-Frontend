//this Basically contains the field of signup form like username,password,email sort of things
export const signUpFormControl=[
    {
        name:'userName',
        label:'User Name',
        Placeholder:'Enter your User Name',
        type:'text',
        componentType:'input'
    }
    ,
    {
        name:'userEmail',
        label:'User Email',
        Placeholder:'Enter your User Email',
        type:'email',
        componentType:'input'
    },
    {
        name:'password',
        label:'Password',
        Placeholder:'Enter your Password',
        type:'password',
        componentType:'input'
    }
]

//this Basically contains the fields to require for login purpose
export const signInController=[
    {
        name:'userEmail',
        label:'User Email',
        Placeholder:'Enter your User Email',
        type:'email',
        componentType:'input'
    },
    {
        name:'password',
        label:'Password',
        Placeholder:'Enter your Password',
        type:'password',
        componentType:'input'
    }
]

//these will contains the detail that the user is entering while filling signin form
export const initialSignInFormData={
  userEmail:"",
  password:""
}

//these will contains the detail that the user is entering while filling the signup form
export const initialSignUpFormData={
    userName:"",
    userEmail:"",
    password:""
  }
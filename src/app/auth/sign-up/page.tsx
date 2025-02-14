import { getCurrentSession, loginUser, registerUser } from "@/actions/auth"
import Signup from "@/components/auth/sign-up";
import { redirect } from "next/navigation";
import zod from 'zod'

const SignUpSchema = zod.object({
  email:zod.string().email(),
  password:zod.string().min(6),
})

const SignupPage = async () => {
  const {user} = await getCurrentSession();

  if(user){
    return redirect('/');
  }

  const action = async (prevState:any,formData:FormData) => { 
    "use server"
    const parsed = SignUpSchema.safeParse(Object.fromEntries(formData));
    if(!parsed.success){
      return{
        message:"Invalid form data"
      }
    }
    const {email,password} = parsed.data;
    const {user,error} = await registerUser(email,password);
    if(error){
      return {
        message:error
      }
    }else if(user){
      await loginUser(email,password);
      return redirect('/')
    }
  }

  return <Signup action={action}/>
}

export default SignupPage
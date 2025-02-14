import { getCurrentSession, loginUser} from "@/actions/auth"
import Signin from "@/components/auth/sign-in";
import { redirect } from "next/navigation";
import zod from 'zod'

const SignInSchema = zod.object({
  email:zod.string().email(),
  password:zod.string().min(6),
})

const SigninPage = async () => {
  const {user} = await getCurrentSession();

  if(user){
    return redirect('/');
  }

  const action = async (prevState:any,formData:FormData) => { 
    "use server"
    const parsed = SignInSchema.safeParse(Object.fromEntries(formData));
    if(!parsed.success){
      return{
        message:"Invalid form data"
      }
    }
    const {email,password} = parsed.data;
    const {user,error} = await loginUser(email,password);
    if(error){
      return {
        message:error
      }
    }else if(user){
      await loginUser(email,password);
      return redirect('/')
    }
  }

  return <Signin action={action}/>
}

export default SigninPage
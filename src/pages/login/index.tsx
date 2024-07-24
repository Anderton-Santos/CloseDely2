import {useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'

import {Form} from '../../components/form'
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import {signInWithEmailAndPassword, signOut} from 'firebase/auth'
import {auth} from '../../components/services/firebaseConnection'

const schema = z.object({
    email: z.string().email("Insira um email válido").min(1, "O campo email é obrigatório"),
    password: z.string().min(1, "O campo senha é obrigatório")
})

type FormData = z.infer<typeof schema>


export function Login(){
    const navigate = useNavigate()
    const {register, handleSubmit, formState: {errors}} = useForm<FormData>({
        resolver: zodResolver(schema),
        mode:"onChange"
    })  

    useEffect(()=>{
        async function handleLogout(){
            await signOut(auth)
        }

        handleLogout();
    },[])


    function onSubmit(data: FormData){
        signInWithEmailAndPassword(auth, data.email, data.password)
        .then((user)=>{
            console.log("Logado com sucesso")
            console.log(user)
            navigate("/home", {replace: true})
        })
        .catch((err)=>{
            console.log("Erro ao fazer login")
            console.log(err)

        })
    }


    return(
        <div className='flex h-screen w-full items-center justify-center flex-col'>
            <Link to='/'>
                <h1 className='mt-11 text-vlck mb-7 font-bold text-5xl'>Close
                <span className='bg-gradient-to-r from-yellow-500 to-orange-400 bg-clip-text text-transparent'>Dely</span>
                </h1>

            </Link>
                
                <form onSubmit={handleSubmit(onSubmit)} className='w-full max-w-xl flex flex-col px-2'>
                    <div>
                        <Form
                        placeholder='Digite seu usuário'
                        type='email'
                        name='email'
                        error={errors.email?.message}
                        register={register}
                        />
                    </div>

                    <div>
                        <Form
                        placeholder='Digite seu usuário'
                        type='password'
                        name='password'
                        error={errors.password?.message}
                        register={register}
                        />
                    </div>




                    <button
                    type='submit' 
                    className='h-9 bg-blue-600 rounded border-0 text-lg font-medium text-white'>
                        Acessar
                    </button>


                </form>

                
                <Link to="/register">
                    Ainda não possui um cadastro? Fazer Cadastro!
                </Link>
            
            
            

        </div>
    )










    }


import {useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'

import {Form} from '../../components/form'
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'

import {auth} from '../../components/services/firebaseConnection'
import {createUserWithEmailAndPassword, updateProfile, signOut} from 'firebase/auth'

import styles from "./register.module.css";

const schema = z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    email: z.string().email("Insira um email válido").min(1, "O campo email é obrigatório"),
    password: z.string().min(6, "A senha deve conter pelo menos 6 caracteres").min(1, "O campo senha é obrigatório")
})

type FormData = z.infer<typeof schema>


export function Register(){
    const navigate = useNavigate();
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


    async function onSubmit(data: FormData){
        createUserWithEmailAndPassword(auth, data.email, data.password)
        .then(async(user)=>{
            await updateProfile(user.user, {
                displayName: data.name
            })

            console.log('cadastrado com sucesso')
            navigate("/home", {replace:true})
        })
        .catch((error)=>{
            console.log("error ao cadastrar o usuario")
            console.log(error)
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

                <div className={styles.div}>
                        <Form
                        placeholder='Digite seu usuário'
                        type='text'
                        name='name'
                        error={errors.name?.message}
                        register={register}
                        />
                    </div>

                    <div className={styles.div}>
                        <Form
                        placeholder='Digite seu email'
                        type='email'
                        name='email'
                        error={errors.email?.message}
                        register={register}
                        />
                    </div>

                    <div className={styles.div}>
                        <Form
                        placeholder='Digite seu senha'
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

                <Link to="/" className={styles.pfazerLogin}>
                    Já possui um cadastro? <span>Fazer Login!</span>
                </Link>
            
            

        </div>
    )










    }


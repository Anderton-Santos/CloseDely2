
import styles from './input.module.css'

import { Form } from '../../components/form'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { db } from '../../components/services/firebaseConnection'
import { addDoc, collection } from 'firebase/firestore'

const schema = z.object({
    cliente: z.string().min(1, 'O nome é obrigatório'),
    valor: z.string().min(1, 'O valor da entrega não foi preenchido'),
    formPag: z.string().min(1, 'A forma de pagamento é obrigatória'),
    entregador: z.string().min(1, 'Informe o entregador para melhor fechamento'),
    app: z.string().min(1, 'Informe a plataforma'),
})

type FormData = z.infer<typeof schema>;






export function Input() {





    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })

    //const appFilter = listApp.findIndex(i => i.id === 2 && i.name === "WPP")



    function onSubmit(data: FormData) {


        addDoc(collection(db, "pedidos"), {
            cliente: data.cliente,
            valor: data.valor,
            formPag: data.formPag,
            entregador: data.entregador,
            app: data.app,
            created: new Date(),

        })
            .then(() => {
                reset();
                console.log("Cadastrado com sucesso")

            })
            .catch((error) => {
                console.log(error)
                console.log("erro ao cadastra")


            })



    }


    return (
        <div className={styles.main}>

            <div className={styles.divForm}>


                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className={styles.form}
                >




                    <div>
                        <label className={styles.label}>CLIENTE:</label>
                        <Form
                            type='text'
                            register={register}
                            name="cliente"
                            error={errors.cliente?.message}
                            placeholder='Ex. Ane Camille'
                        />
                    </div>

                    <div>
                        <label className={styles.label}>VALOR:</label>
                        <Form
                            type='any'
                            register={register}
                            name="valor"
                            error={errors.valor?.message}
                            placeholder='Ex. R$33.90'
                        />
                    </div>

                    <div>
                        <label className={styles.label}>FORMA DE PAGAMENTO:</label>

                        <select {...register("formPag")}>
                            <option value="Din">Din</option>
                            <option value="Cart">Cart</option>
                            <option value="Pix">Pix</option>
                            <option value="Pix Cnpj">Pix Cnpj</option>

                        </select>

                        {/* <Form
                            type='text'
                            register={register}
                            name="formPag"
                            error={errors.formPag?.message}
                            placeholder='Ex. Din, Pix, Cart'
                        /> */}
                    </div>

                    <div>
                        <label className={styles.label}>ENTREGADOR:</label>
                        <Form
                            type='text'
                            register={register}
                            name="entregador"
                            error={errors.entregador?.message}
                            placeholder='Ex. Zelito'
                        />
                    </div>

                    <div>
                        <label className={styles.label}>PLATAFORMA:</label>
                        
                        {/* <Form
                            type='select'
                            register={register}
                            name="app"
                            error={errors.entregador?.message}
                            placeholder='QD'
                        /> */}
                        

                        <select {...register("app")}>
                            <option value="WPP">WPP</option>
                            <option value="QD">QD</option>

                        </select>

                    </div>




                    <button type="submit" className={styles.button}>
                        Cadastrar
                    </button>

                </form>
            </div>

        </div>
    )
}
import styles from './inputCliente.module.css'
import { Form } from '../../../components/form'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { db } from '../../../components/services/firebaseConnection'
import { addDoc, collection } from 'firebase/firestore'


const schema = z.object({
    cliente: z.string().min(1, 'O nome é obrigatório'),
    categoria: z.string().min(1, 'Selecione a categoria'),
    cidade: z.string().min(1, 'Informe a cidade/Estado'),
    rua: z.string().min(1, 'Informe o endereço'),
    celular: z.string().min(1, 'Informe o numero de celular'),
})

type FormData = z.infer<typeof schema>;





export function InputCliente() {


    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })

    function onSubmit(data: FormData) {


        addDoc(collection(db, "clientes"), {
            cliente: data.cliente,
            categoria: data.categoria,
            cidade: data.cidade,
            rua: data.rua,
            celular: data.celular,

            created: new Date(),

        })
            .then(() => {
                reset();


            })
            .catch((error) => {
                console.log(error)
                console.log("erro ao cadastra")


            })



    }

    return (
        <div className={styles.main}>
            <form onSubmit={handleSubmit(onSubmit)}>

                <div>
                    <label htmlFor="">Nome:</label>
                    <Form
                        type='text'
                        register={register}
                        name="cliente"
                        error={errors.cliente?.message}
                        placeholder='Ex. Ane Camille'
                    />
                </div>

                <div>
                        <label>Categoria:</label>

                        <select {...register("categoria")}>
                            <option value="Lanchonete">Lanchonete</option>
                            <option value="Restaurante">Restaurante</option>
                            <option value="Clínica">Clínica</option>
                            <option value="Academia">Academia</option>

                        </select>

                    </div>


                    <label htmlFor="">Endereço:</label>
                    <div>
                        <label htmlFor="">Cidade/Estado</label>


                        <Form
                        type='text'
                        register={register}
                        name="cidade"
                        error={errors.cidade?.message}
                        placeholder='Lagarto/Se'
                    />

                    <label htmlFor="">Rua:</label>
                    <Form
                        type='text'
                        register={register}
                        name="rua"
                        error={errors.rua?.message}
                        placeholder='Av Contorno'
                    />


                    </div>

                    <div>
                        <label htmlFor="">Celular: </label>
                        <span>+55</span>
                        <Form
                        type='text'
                        register={register}
                        name="celular"
                        error={errors.celular?.message}
                        placeholder='Ex. DDD X XXXX-XXXX'
                    />
                    </div>



                <button type='submit'>Cadastar</button>




            </form>
        </div>
    )
}
import styles from './todos.module.css'
import { BarNvigation } from '../../components/barnavigation';

import { useState, useEffect } from "react";

import {
    collection,
    query,
    getDocs,
    orderBy
} from 'firebase/firestore'
import {db} from '../../components/services/firebaseConnection'



export interface DelyProps{
    cliente: string;
    valor: string | number;
    formPag: string;
    entregador: string;
    app: string;
}


export function Todos(){
    const [dely, setDely] = useState<DelyProps[]>([])


    const [filted, setFilted] = useState('')


    const filterItems = [...new Set(dely.map((filt) => filt.formPag))]

    // const updateItems = (formP) => {


    
    //     const newItems = dely.filter((newVal) => newVal.formPag === formP)
    //     //setDely(dely)
    //     //alert('trocou')

    //     setDely(newItems)
        

    // }

    // function Alltask(){
    //     const all = [...dely]
    //     setDely(all)
    //      console.log(all)

    // }





    








    useEffect(()=>{
        function loadDely(){
            const delyRef = collection(db, "pedidos")
            const queryRef = query(delyRef, orderBy("created", "asc"))

            getDocs(queryRef)
            .then((snapshot)=>{
                let listDely = [] as DelyProps[];

                snapshot.forEach(doc =>{
                    listDely.push({
                        cliente: doc.data().cliente,
                        valor: doc.data().valor,
                        formPag: doc.data().formPag,
                        entregador: doc.data().entregador,
                        app: doc.data().app
                    })
                })

                // console.log(listDely)

                setDely(listDely)
                

            })
        }

        loadDely();
    },[])

    return(
        

        <section className={styles.section}>
            <BarNvigation
                filterItems = {filterItems}
                // updateItems = {updateItems}
                setDely={dely}
                //  Alltask = {Alltask}
                
                
                


            />

            <div className={styles.table}>
                    <p className={styles.tableCliente}>CLIENTE</p>
                    <p className={styles.tableValor}>VALOR</p>
                    <p className={styles.tableformPag}>FORMA PAGAMENTO</p>
                    <p className={styles.tableEntregador}>ENTREGADOR</p>
                    <p className={styles.tableApp}>APP</p>
                    
            </div>
            {dely.map(ped =>(
                <div className={styles.divMain}>
                    <p className={styles.cliente}>{ped.cliente}</p>
                    <p className={styles.valor}>{ped.valor}</p>
                    <p className={styles.formPag}>{ped.formPag}</p>
                    <p className={styles.entregador}>{ped.entregador}</p>
                    <p className={styles.app}>{ped.app}</p>
                    
                </div>
            ))}
        </section>
    )
}
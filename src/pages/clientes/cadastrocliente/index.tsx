import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../../components/services/firebaseConnection"

import styles from './cadastroCliente.module.css'

import { useState, useEffect,  } from "react";

interface TodosClientes{
    cliente: string;
    categoria: string;
    cidade: string;
    rua: string;
    celular: string;
    id: string
}


export function CadastroCliente() {
    const [cadastroCliente, setCadastroCliente] = useState<TodosClientes[]>([])

    useEffect(() => {
        function loadTodos() {
            const todosRef = collection(db, "clientes");
            const queryRef = query(todosRef, orderBy("created", "asc"));

            getDocs(queryRef).then((snapshot) => {
                const listClientes = [] as TodosClientes[];

                snapshot.forEach((doc) => {
                    listClientes.push({
                        id: doc.id,
                        cliente: doc.data().cliente,
                        categoria: doc.data().categoria,
                        cidade: doc.data().cidade,
                        rua: doc.data().rua,
                        celular: doc.data().celular,

                    });
                });

                setCadastroCliente(listClientes);



            });
        }

        loadTodos();
    }, []);

    return (
        <div className={styles.main}>
            {cadastroCliente.map( client =>(
                <div>
                   <span>{client.cliente}</span>
                   <span>{client.categoria}</span>
                   <span>{client.cidade}</span>

                </div>
                
            ))}
        </div>
    )
}
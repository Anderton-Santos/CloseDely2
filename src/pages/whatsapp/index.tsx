

import { IoIosRemoveCircle } from "react-icons/io";
import styles from "./whatsapp.module.css";
import { BarNvigation } from "../../components/barnavigation";

import { collection, query, getDocs, where, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../components/services/firebaseConnection";

import { useState, useEffect, useRef } from "react";
import { useReactToPrint } from 'react-to-print';

export interface TodosProps {
    cliente: string;
    valor: number;
    formPag: string;
    entregador: string;
    app: string;
    soma?: number;
    id: string
}

function filteredTodos(todos: TodosProps[], paymentMethod?: string) {
    if (!paymentMethod) {
        // Se o filtro for undefined, retorna o estado original, ou seja, a lista inicial.
        
        
        console.log('zerou')
        return todos;
    }else{
        const filt =  todos.filter((todo) => todo.formPag === paymentMethod);
        console.log("atualizou")
        return filt

       
    }

}



export function Whatsapp() {
    const [todos, setTodos] = useState<TodosProps[]>([]); // Lista inicial, nunca é modificada por filtros
    const [currentFilter, setCurrentFilter] = useState<string>(); // Filtro selecionado atualmente, ex: 'Din', 'Cart', etc
    const filters = [...new Set(todos.map((filt) => filt.formPag))]; // Filtros possíveis, ex: ['Din', 'Cart', 'Pix Maq']

    const [total, setTotal] = useState('') // Soma dos valores

    
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
    });


    useEffect(() => {
        function loadTodos() {
            const todosRef = collection(db, "pedidos");
            const queryRef = query(todosRef, where("app", "==", "WPP"))

            getDocs(queryRef).then((snapshot) => {
                const listTodos = [] as TodosProps[];

                snapshot.forEach((doc) => {
                    listTodos.push({
                        id: doc.id,
                        cliente: doc.data().cliente,
                        valor: doc.data().valor,
                        formPag: doc.data().formPag,
                        entregador: doc.data().entregador,
                        app: doc.data().app,
                    });
                });

                setTodos(listTodos);
                TotalResultDely(listTodos)
            });
        }

        loadTodos();
    }, []);


    function TotalResultDely(items: TodosProps[]){
         let myTotal = items;
        let totalResult = myTotal.reduce((acc, obj) => {return Number(acc) + Number(obj.valor)}, 0)
        const totalResulFormated = totalResult.toLocaleString("pt-BR", {style: 'currency', currency: "BRL"})
        setTotal(totalResulFormated)
        return
        
    }

    async function RemoveItem(id: string){
        const docRef = doc(db, "pedidos", id)
        await deleteDoc(docRef)

    }
    

    return (
        <section className={styles.section}>
            <BarNvigation
                filters={filters}
                onFilterClick={(filter:any) => {
                    // Seta o filtro atual selecionado. Quando o filtro for "ALL", o retorno é undefined, zerando o filtro.
                    setCurrentFilter(filter);
                    // TotalResultDely(filter)
                    
                    
                    
                   
                    
                    
                }}
            />

            <table className={styles.table} ref={componentRef}>
                <thead>
                    <tr>
                        <th scope="col" className={styles.tableCliente}>CLIENTE</th>
                        <th scope="col" className={styles.tableValor}>VALOR</th>
                        <th scope="col" className={styles.tableformPag}>FORMA PAGAMENTO</th>
                        <th scope="col" className={styles.tableEntregador}>ENTREGADOR</th>
                        <th scope="col" className={styles.tableApp}>APP</th>
                    </tr>
                </thead>


                {/* Sempre que "todos" ou "currentFilter" forem atualizados, a função filteredTodos() irá renderizar novamente, aplicando o filtro necessário. */}
                {filteredTodos(todos, currentFilter).map((ped) => (
                    <tbody id="tbody">
                        <tr className={styles.divMain}>
                            <td className={styles.tdLabel}>{ped.cliente}</td>
                            <td className={styles.tdLabel}>{ped.valor}</td>
                            <td className={styles.tdLabel}>{ped.formPag}</td>
                            <td className={styles.tdLabel}>{ped.entregador}</td>
                            <td className={styles.tdLabel}>{ped.app}</td>

                            <td className={styles.removeItem} onClick={()=>RemoveItem(ped.id)}><IoIosRemoveCircle /></td>

                        </tr>

                    </tbody>
                    
                ))}
                <p className={styles.total}><span>Total :</span> {total}</p>
            </table>


            <button onClick={handlePrint}>Print</button>
        </section>
    );
}
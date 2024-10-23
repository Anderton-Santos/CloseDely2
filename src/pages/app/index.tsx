

import { IoIosRemoveCircle } from "react-icons/io";
import { FaCloudDownloadAlt } from "react-icons/fa";
import styles from "./app.module.css";
import { BarNvigation } from "../../components/barnavigation";

import { collection, query, getDocs, where, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../components/services/firebaseConnection";

import { useState, useEffect, useRef } from "react";
import { useReactToPrint } from 'react-to-print';
import { toast } from "react-toastify";

export interface TodosProps {
    cliente: string;
    valor: number;
    formPag: string;
    entregador: string;
    taxa: number;
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



export function App() {
    const [todos, setTodos] = useState<TodosProps[]>([]); // Lista inicial, nunca é modificada por filtros
    const [currentFilter, setCurrentFilter] = useState<string>(); // Filtro selecionado atualmente, ex: 'Din', 'Cart', etc
    const filters = [...new Set(todos.map((filt) => filt.formPag))]; // Filtros possíveis, ex: ['Din', 'Cart', 'Pix Maq']

    const [total, setTotal] = useState('') // Soma dos valores

    const [quantApp, setQuantApp] = useState(0)

    const [totalApp, setTotalApp] = useState('')

    const [taxaApp, setTaxaApp] = useState('')

    const [loading, setLoading] = useState(true)

    
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
    });


    useEffect(() => {
        function loadTodos() {
            const todosRef = collection(db, "pedidos");
            const queryRef = query(todosRef, where("app", "==", "QD"))

            getDocs(queryRef).then((snapshot) => {
                const listTodos = [] as TodosProps[];

                snapshot.forEach((doc) => {
                    listTodos.push({
                        id: doc.id,
                        cliente: doc.data().cliente,
                        valor: doc.data().valor,
                        formPag: doc.data().formPag,
                        entregador: doc.data().entregador,
                        taxa: doc.data().taxa,
                        app: doc.data().app,
                    });
                });

                setTodos(listTodos);
                calculateTotal(listTodos, currentFilter);
                calculateQuantidadeApp(listTodos)
                calculateTotalApp(listTodos)
                calculateTotalTaxaApp(listTodos)
                setLoading(false)
            });
        }

        loadTodos();
    }, []);

    useEffect(() => {
        calculateTotal(todos, currentFilter);
    }, [todos, currentFilter]);

    function calculateTotal(items: TodosProps[], filter?: string) {
        const filteredItems = filteredTodos(items, filter);
        const totalResult = filteredItems.reduce((acc, obj) => acc + Number(obj.valor), 0);
        const totalFormatted = totalResult.toLocaleString("pt-BR", { style: 'currency', currency: "BRL" });
        setTotal(totalFormatted);
    }

        // Função para retorna a quantidade de pedidos QD
        function calculateQuantidadeApp(items: TodosProps[]) {
            const filteredItems = items.filter(item => item.app === 'QD');
            setQuantApp(filteredItems.length);
        }
    
    
    
        // Função para calcular o total de pedidos QD
        function calculateTotalApp(items: TodosProps[]) {
            const filteredItems = items.filter(item => item.app === 'QD');
            const totalResult = filteredItems.reduce((acc, obj) => acc + Number(obj.valor), 0);
            const totalFormatted = totalResult.toLocaleString("pt-BR", { style: 'currency', currency: "BRL" });
            setTotalApp(totalFormatted);
        }
    
    
            // Função para calcular o total de taxas de entrega feita pelo QD
            function calculateTotalTaxaApp(items: TodosProps[]) {
                const filteredItems = items.filter(item => item.app === 'QD');
                const totalResult = filteredItems.reduce((acc, obj) => acc + Number(obj.taxa), 0);
                const totalFormatted = totalResult.toLocaleString("pt-BR", { style: 'currency', currency: "BRL" });
                setTaxaApp(totalFormatted);
            }

            

    async function RemoveItem(id: string){
        const docRef = doc(db, "pedidos", id)
        await deleteDoc(docRef)
        window.location.reload();
        toast.success('Pedido removido com sucesso')

    }
    
    if(loading){
        return(
            <div className={styles.load}>
            <p className={styles.loadLogo}> <FaCloudDownloadAlt /> </p>
            <span className={styles.loadText}>Carregando pedidos...</span>
            </div>

        )
    }

    return (
        <section className={styles.section}>
            <BarNvigation
                filters={filters}
                onFilterClick={(filter:any) => {
                    // Seta o filtro atual selecionado. Quando o filtro for "ALL", o retorno é undefined, zerando o filtro.
                    setCurrentFilter(filter);

                    
                    
                    
                   
                    
                    
                }}
            />

            <table className={styles.table} ref={componentRef}>
                <thead>
                    <tr>
                        <th scope="col"></th>
                        <th scope="col" className={styles.tableCliente}>CLIENTE</th>
                        <th scope="col" className={styles.tableValor}>VALOR</th>
                        <th scope="col" className={styles.tableformPag}>FORMA PAGAMENTO</th>
                        <th scope="col" className={styles.tableEntregador}>ENTREGADOR</th>
                        <th scope="col" className={styles.tableTaxa}>TAXA ENTREGA</th>
                        <th scope="col" className={styles.tableApp}>APP</th>
                    </tr>
                </thead>


                <tbody id="tbody">
                    {(() => {
                        let count = 0;
                        {/* Sempre que "todos" ou "currentFilter" forem atualizados, a função filteredTodos() irá renderizar novamente, aplicando o filtro necessário. */}
                        return filteredTodos(todos, currentFilter).map((ped) => {
                            if (ped.app === "QD") {
                                count++; 
                            }
                            return (
                                <tr key={ped.id} className={styles.divMain}>
                                   
                                    <td className={styles.iconWppMain}>
                                        <span className={styles.IconApp}>{ped.app === "QD" ? `#${count}` : "" }</span>
                                    </td>
                                    <td className={styles.tdLabel}>{ped.cliente}</td>
                                    <td className={styles.tdLabel}>R$ {ped.valor}</td>
                                    <td className={styles.tdLabel}>{ped.formPag}</td>
                                    <td className={styles.tdLabel}>{ped.entregador}</td>
                                    <td className={styles.tdLabel}>R$ {ped.taxa}</td>
                                    <td className={styles.tdLabel}>{ped.app}</td>

                                    <td className={styles.removeItem} onClick={()=>RemoveItem(ped.id)}><IoIosRemoveCircle /></td>
                                </tr>
                            );
                        });
                    })()}
                </tbody>
                <p className={styles.total}><span>Total :</span> {total}</p>
            </table>



            <button className={styles.print} onClick={handlePrint}>Baixar em Pdf</button>

            <section>
            <div className={styles.headerFechamento}>
                    <p>Fechamento</p>

                </div>

                            <div className={styles.Infofechamento}>
                    <span>Quantidade Pedidos: <span className={styles.infoTotal}>{quantApp}</span> </span>
                    <span>Total pedidos: <span className={styles.infoTotal}>{totalApp}</span> </span>
                    <span>Total Taxa entregador: <span className={styles.infoTotal}>{taxaApp}</span> </span>
                </div>
            </section>
        </section>
    );
}
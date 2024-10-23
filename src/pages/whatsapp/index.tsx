import { IoIosRemoveCircle } from "react-icons/io";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";

import styles from "./whatsapp.module.css";
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
        return todos;
    } else {
        return todos.filter((todo) => todo.formPag === paymentMethod);
    }
}

export function Whatsapp() {
    const [todos, setTodos] = useState<TodosProps[]>([]);
    const [currentFilter, setCurrentFilter] = useState<string | undefined>(); 
    const [total, setTotal] = useState(''); 

    const [quantWpp, setQuantWpp] = useState(0)

    const [totalWpp, setTotalWpp] = useState('')

    const [taxaWpp, setTaxaWpp] = useState('')

    const [loading, setLoading] = useState(true)



    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    useEffect(() => {
        async function loadTodos() {
            const todosRef = collection(db, "pedidos");
            const queryRef = query(todosRef, where("app", "==", "WPP"));
            const snapshot = await getDocs(queryRef);
            const listTodos: TodosProps[] = snapshot.docs.map(doc => ({
                id: doc.id,
                cliente: doc.data().cliente,
                valor: doc.data().valor,
                formPag: doc.data().formPag,
                entregador: doc.data().entregador,
                taxa: doc.data().taxa,
                app: doc.data().app,
            }));

            setTodos(listTodos);
            calculateTotal(listTodos, currentFilter);
            calculateQuantidadeWpp(listTodos)
            calculateTotalWpp(listTodos)
            calculateTotalTaxaWpp(listTodos)
            setLoading(false)
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

    
    
        // Função para retorna a quantidade de pedidos WPP
        function calculateQuantidadeWpp(items: TodosProps[]) {
            const filteredItems = items.filter(item => item.app === 'WPP');
            setQuantWpp(filteredItems.length);
        }
    
    
    
        // Função para calcular o total de pedidos WhatsApp
        function calculateTotalWpp(items: TodosProps[]) {
            const filteredItems = items.filter(item => item.app === 'WPP');
            const totalResult = filteredItems.reduce((acc, obj) => acc + Number(obj.valor), 0);
            const totalFormatted = totalResult.toLocaleString("pt-BR", { style: 'currency', currency: "BRL" });
            setTotalWpp(totalFormatted);
        }
    
    
            // Função para calcular o total de taxas de entrega feita pelo Whatsapp
            function calculateTotalTaxaWpp(items: TodosProps[]) {
                const filteredItems = items.filter(item => item.app === 'WPP');
                const totalResult = filteredItems.reduce((acc, obj) => acc + Number(obj.taxa), 0);
                const totalFormatted = totalResult.toLocaleString("pt-BR", { style: 'currency', currency: "BRL" });
                setTaxaWpp(totalFormatted);
            }

            
    
    
    

    async function RemoveItem(id: string) {
        const docRef = doc(db, "pedidos", id);
        await deleteDoc(docRef);
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
                filters={[...new Set(todos.map((filt) => filt.formPag))]}
                onFilterClick={(filter) => setCurrentFilter(filter)}
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
                <tbody>
                    {filteredTodos(todos, currentFilter).map((ped) => (
                        <tr key={ped.id} className={styles.divMain}>
                            <td className={styles.iconWppMain}>
                                        <span className={styles.iconWpp}>{ped.app === "WPP" && <FaWhatsapp  />}</span>

                                    </td>
                            <td className={styles.tdLabel}>{ped.cliente}</td>
                            <td className={styles.tdLabel}>{ped.valor}</td>
                            <td className={styles.tdLabel}>{ped.formPag}</td>
                            <td className={styles.tdLabel}>{ped.entregador}</td>
                            <td className={styles.tdLabel}>{ped.taxa}</td>
                            <td className={ped.app === "WPP" ? styles.tdLabelWpp : styles.tdLabel}>
                                        {ped.app}
                                    </td>
                            <td className={styles.removeItem} onClick={() => RemoveItem(ped.id)}>
                                <IoIosRemoveCircle />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p className={styles.total}><span>Total:</span> {total}</p>
            <button className={styles.print} onClick={handlePrint}>Baixar em Pdf</button>

            <section>
            <div className={styles.headerFechamento}>
                    <p>Fechamento</p>

                </div>

                            <div className={styles.Infofechamento}>
                    <span>Quantidade Pedidos: <span className={styles.infoTotal}>{quantWpp}</span> </span>
                    <span>Total pedidos WhatSapp: <span className={styles.infoTotal}>{totalWpp}</span> </span>
                    <span>Total Taxa entregador: <span className={styles.infoTotal}>{taxaWpp}</span> </span>
                </div>
            </section>

        </section>

        
    );
}

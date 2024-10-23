

import { FaWhatsapp } from "react-icons/fa";
import { FaCloudDownloadAlt } from "react-icons/fa";

import styles from "./todos.module.css";

import { collection, query, getDocs, orderBy, } from "firebase/firestore";
import { db } from "../../components/services/firebaseConnection";

import { useState, useEffect, useRef } from "react";
import { useReactToPrint } from 'react-to-print';


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
        return todos;
    }
    const filt = todos.filter((todo) => todo.formPag === paymentMethod);
    console.log(filt)


    return filt

}




export function Todos() {


    const [todos, setTodos] = useState<TodosProps[]>([]); // Lista inicial, nunca é modificada por filtros

    const [total, setTotal] = useState('') // Soma dos valores

    const [quantWpp, setQuantWpp] = useState(0)
    const [quantApp, setQuantApp] = useState(0)

    const [totalWpp, setTotalWpp] = useState('')
    const [totalApp, setTotalApp] = useState('')

    const [taxaWpp, setTaxaWpp] = useState('')
    const [taxaApp, setTaxaApp] = useState('')

    const [loading, setLoading] = useState(true)




    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });


    useEffect(() => {
        function loadTodos() {
            const todosRef = collection(db, "pedidos");
            const queryRef = query(todosRef, orderBy("created", "asc"));

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
                calculateTotal(listTodos);
                calculateTotalWpp(listTodos);
                calculateTotalApp(listTodos)
                calculateQuantidadeWpp(listTodos)
                calculateQuantidadeApp(listTodos)
                calculateTotalTaxaWpp(listTodos)
                calculateTotalTaxaApp(listTodos)
                setLoading(false)


            });
        }

        loadTodos();
    }, []);


    useEffect(() => {
        calculateTotal(todos,);
    }, [todos]);


    // Filtro total de acordo com a forma de pagamento
    function calculateTotal(items: TodosProps[], filter?: string) {
        const filteredItems = filteredTodos(items, filter);
        const totalResult = filteredItems.reduce((acc, obj) => acc + Number(obj.valor), 0);
        const totalFormatted = totalResult.toLocaleString("pt-BR", { style: 'currency', currency: "BRL" });
        setTotal(totalFormatted);
    }


    // função para retorna a quantidade de pedidos WPP
    function calculateQuantidadeWpp(items: TodosProps[]) {
        const filteredItems = items.filter(item => item.app === 'WPP');
        setQuantWpp(filteredItems.length);
    }

    //função para retorna a quantidade de pedidos App
    function calculateQuantidadeApp(items: TodosProps[]) {
        const filteredItems = items.filter(item => item.app === 'QD');
        setQuantApp(filteredItems.length);
    };



    // Crie a função para calcular o total de pedidos WhatsApp
    function calculateTotalWpp(items: TodosProps[]) {
        const filteredItems = items.filter(item => item.app === 'WPP');
        const totalResult = filteredItems.reduce((acc, obj) => acc + Number(obj.valor), 0);
        const totalFormatted = totalResult.toLocaleString("pt-BR", { style: 'currency', currency: "BRL" });
        setTotalWpp(totalFormatted);
    }

    // Crie a função para calcular o total de pedidos App Delivery
    function calculateTotalApp(items: TodosProps[]) {
        const filteredItems = items.filter(item => item.app === 'QD');
        const totalResult = filteredItems.reduce((acc, obj) => acc + Number(obj.valor), 0);
        const totalFormatted = totalResult.toLocaleString("pt-BR", { style: 'currency', currency: "BRL" });
        setTotalApp(totalFormatted);
    }

    // Crie a função para calcular o total de taxas de entrega feita pelo Whatsapp
    function calculateTotalTaxaWpp(items: TodosProps[]) {
        const filteredItems = items.filter(item => item.app === 'WPP');
        const totalResult = filteredItems.reduce((acc, obj) => acc + Number(obj.taxa), 0);
        const totalFormatted = totalResult.toLocaleString("pt-BR", { style: 'currency', currency: "BRL" });
        setTaxaWpp(totalFormatted);
    }

    // Crie a função para calcular o total de taxas de entrega feita pelo Whatsapp
    function calculateTotalTaxaApp(items: TodosProps[]) {
        const filteredItems = items.filter(item => item.app === 'QD');
        const totalResult = filteredItems.reduce((acc, obj) => acc + Number(obj.taxa), 0);
        const totalFormatted = totalResult.toLocaleString("pt-BR", { style: 'currency', currency: "BRL" });
        setTaxaApp(totalFormatted);
    }










    if (loading) {
        return (
            <div className={styles.load}>
                <p className={styles.loadLogo}> <FaCloudDownloadAlt /> </p>
                <span className={styles.loadText}>Carregando pedidos...</span>
            </div>

        )

    }





    return (
        <section className={styles.section}>



            <table className={styles.table} ref={componentRef}>
                <thead>
                    <tr className={styles.tr}>
                        <th scope="col" ></th>
                        <th scope="col" className={styles.tableCliente}>CLIENTE</th>
                        <th scope="col" className={styles.tableValor}>VALOR</th>
                        <th scope="col" className={styles.tableformPag}>FORMA PAGAMENTO</th>
                        <th scope="col" className={styles.tableEntregador}>ENTREGA</th>
                        <th scope="col" className={styles.tableTaxa}>TAXA ENTREGA</th>
                        <th scope="col" className={styles.tableApp}>APP</th>
                    </tr>
                </thead>


                <tbody id="tbody">
                    {(() => {
                        let count = 0; // Variável para contar apenas pedidos "QD"
                        {/* Sempre que "todos" ou "currentFilter" forem atualizados, a função filteredTodos() irá renderizar novamente, aplicando o filtro necessário. */}
                        return filteredTodos(todos).map((ped) => {
                            if (ped.app === "QD") {
                                count++; // Incrementa a contagem somente para pedidos "QD"
                            }
                            return (
                                <tr key={ped.id} className={styles.divMain}>
                                    {/* Adiciona a numeração apenas para pedidos feitos no "QD" */}
                                    <td className={styles.iconWppMain}>
                                        <span className={styles.iconWpp}>{ped.app === "WPP" && <FaWhatsapp  />}</span>
                                        <span className={styles.IconApp}>{ped.app === "QD" ? `#${count}` : "" }</span>
                                    </td>
                                    <td className={styles.tdLabel}>{ped.cliente}</td>
                                    <td className={styles.tdLabel}>R$ {ped.valor}</td>
                                    <td className={styles.tdLabel}>{ped.formPag}</td>
                                    <td className={styles.tdLabel}>{ped.entregador}</td>
                                    <td className={styles.tdLabel}>R$ {ped.taxa}</td>
                                    <td className={ped.app === "WPP" ? styles.tdLabelWpp : styles.tdLabel}>
                                        {ped.app}
                                    </td>
                                </tr>
                            );
                        });
                    })()}
                </tbody>
                <p className={styles.total}><span>Total :</span> {total}</p>
            </table>


            <button className={styles.print} onClick={handlePrint}>Baixar em Pdf</button>

            <section className={styles.fechamento}>
                <div className={styles.headerFechamento}>
                    <p>Fechamento</p>

                </div>

                <div className={styles.Infofechamento}>
                    <span>Quantidade Pedidos Whatsapp: <span className={styles.infoTotal}>{quantWpp}</span> </span>
                    <span>Quantidade Pedidos App Delivery: <span className={styles.infoTotal}>{quantApp}</span> </span>
                    <span>Total pedidos WhatSapp: <span className={styles.infoTotal}>{totalWpp}</span> </span>
                    <span>Total pedidos App Delivery: <span className={styles.infoTotal}>{totalApp}</span> </span>
                    <span>Total Taxa entregador Whatsapp: <span className={styles.infoTotal}>{taxaWpp}</span> </span>
                    <span>Total taxa entregador App Delivery: <span className={styles.infoTotal}>{taxaApp}</span> </span>
                </div>


            </section>
        </section>
    );

}
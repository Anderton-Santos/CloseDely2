import styles from "./todos.module.css";
import { BarNvigation } from "../../components/barnavigation";

import { useState, useEffect } from "react";

import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../components/services/firebaseConnection";

export interface TodosProps {
  cliente: string;
  valor: string | number;
  formPag: string;
  entregador: string;
  app: string;
}

function filteredTodos(todos: TodosProps[], paymentMethod?: string) {
  if (!paymentMethod) {
    // Se o filtro for undefined, retorna o estado original, ou seja, a lista inicial.
    return todos;
  }

  return todos.filter((todo) => todo.formPag === paymentMethod);
}

export function Todos() {
  const [todos, setTodos] = useState<TodosProps[]>([]); // Lista inicial, nunca é modificada por filtros
  const [currentFilter, setCurrentFilter] = useState<string>(); // Filtro selecionado atualmente, ex: 'Din', 'Cart', etc
  const filters = [...new Set(todos.map((filt) => filt.formPag))]; // Filtros possíveis, ex: ['Din', 'Cart', 'Pix Maq']

  useEffect(() => {
    function loadTodos() {
      const todosRef = collection(db, "pedidos");
      const queryRef = query(todosRef, orderBy("created", "asc"));

      getDocs(queryRef).then((snapshot) => {
        const listTodos = [] as TodosProps[];

        snapshot.forEach((doc) => {
          listTodos.push({
            cliente: doc.data().cliente,
            valor: doc.data().valor,
            formPag: doc.data().formPag,
            entregador: doc.data().entregador,
            app: doc.data().app,
          });
        });

        setTodos(listTodos);
      });
    }

    loadTodos();
  }, []);

  return (
    <section className={styles.section}>
      <BarNvigation
        filters={filters}
        onFilterClick={(filter) => {
          // Seta o filtro atual selecionado. Quando o filtro for "ALL", o retorno é undefined, zerando o filtro.
          setCurrentFilter(filter);
        }}
      />

      <div className={styles.table}>
        <p className={styles.tableCliente}>CLIENTE</p>
        <p className={styles.tableValor}>VALOR</p>
        <p className={styles.tableformPag}>FORMA PAGAMENTO</p>
        <p className={styles.tableEntregador}>ENTREGADOR</p>
        <p className={styles.tableApp}>APP</p>
      </div>

      {/* Sempre que "todos" ou "currentFilter" forem atualizados, a função filteredTodos() irá renderizar novamente, aplicando o filtro necessário. */}
      {filteredTodos(todos, currentFilter).map((ped) => (
        <div className={styles.divMain}>
          <p className={styles.cliente}>{ped.cliente}</p>
          <p className={styles.valor}>{ped.valor}</p>
          <p className={styles.formPag}>{ped.formPag}</p>
          <p className={styles.entregador}>{ped.entregador}</p>
          <p className={styles.app}>{ped.app}</p>
        </div>
      ))}
    </section>
  );
}

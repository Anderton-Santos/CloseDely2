
//import { Todos } from '../../pages/todos'
import styles from './barnavigation.module.css'




export function BarNvigation({filterItems, updateItems, setDely, Alltask}){


    return(
        <header className={styles.header}>
            <section className={styles.main}>
                {filterItems.map(val => (
                    <button
                    onClick={()=>updateItems(val)}>
                        {val}
                        
                    </button>
                ))}
                <button onClick={()=>Alltask()}>
                    ALL
                </button>
                


            </section>
        </header>
    )
}
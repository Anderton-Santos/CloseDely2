import { FaWhatsapp } from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";
import { HiArrowSmallRight } from "react-icons/hi2";

import { Link } from 'react-router-dom'


import styles from './home.module.css'
// import back from '../../components/background/back.png'

export function Home() {
    return (
        
        <div className={styles.contain}>

            {/* <div className={styles.logo}>

                <h1 className=' p-1 text-vlck font-bold text-4xl'>Close
                <span className='bg-gradient-to-r from-yellow-500 to-orange-400 bg-clip-text text-transparent'>Dely</span>
                </h1 >
                

            </div> */}
            


            


            <section className={styles.main}>
{/* 
                <div className={styles.logo}>
                    <img src={back} alt="" />
                </div> */}



                <div className={styles.boxButton}>
                    <Link to="/wpp">
                        <button className={styles.wpp}>
                            <FaWhatsapp />
                        </button>
                        <span className={styles.textIcon}>whatsapp</span>
                    </Link>
                </div>



                <div className={styles.boxButton}>
                    <Link to="/app">
                        <button className={styles.dely}>
                            <MdDeliveryDining />
                        </button>
                        <span className={styles.textIcon}>Aplicativo</span>
                    </Link>

                </div>

                <div className={styles.boxButton}>
                    <Link to="/todos">
                        <button className={styles.all}>
                            <HiArrowSmallRight />
                        </button>
                        <span className={styles.textIcon}>Todos</span>
                    </Link>

                </div>
            </section>

            <footer>
                <Link to='/input'>
                    <button>
                        <span className='text-footer'>Adicionar Novo Pedido?</span>
                    </button>
                </Link>

            </footer>




        </div>
    )
}
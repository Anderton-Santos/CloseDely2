import { createContext, ReactNode, useState } from "react";

interface DelyProps{
    dely: DelyContextProps[]

}

interface DelyContextProps{
    formPag: string;
    total: any;
}

interface DelyProviderProps{
    children: ReactNode;
}

export const DelyContext = createContext({} as DelyProps)

function DelyProvider({children}: DelyProviderProps){
    const [dely, setDely] = useState<DelyContextProps[]>([])






    return(
        <DelyContext.Provider value={{dely}}>
            {children}

        </DelyContext.Provider>
    )
}

export default DelyProvider
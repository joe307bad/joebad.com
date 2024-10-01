import styles from "../styles/v2.module.scss";
import {ReactNode} from "react";

export default function Page({children}: { children: ReactNode }) {
    return (
        <>
            <style global jsx>{`
                html,
                body {
                    background-color: black;
                }
            `}</style>
            <div className='flex justify-center'>
                <div id={styles.v2} className='p-5 max-w-[600px]'>
                    {children}
                </div>
        </div>
        </>
    )
}

import styles from "../styles/v2.module.scss";
import Link from "next/link";
import Image from "next/legacy/image";

export default function V2() {

    return (
        <>
            <style global jsx>{`
                html,
                body {
                    background-color: black;
                }
            `}</style>
            <div id={styles.v2} className='p-5'>
                <div className='w-full items-end'>
                    <img className='pb-5' height={100} width={100} src="/penguin-2.png"/>
                    <h1 className='h-[27px] text-lg font-bold'>Joe Badaczewski</h1>
                    <h2 className='h-[37px] '>Senior Software Engineer at{' '}
                        <Link href="/">
                            SoftWriters
                        </Link></h2>
                    <h2 className='h-[37px] '>BA in Digital Media Arts + MS in Multimedia Technology</h2>
                </div>
                <br/>
                <div className='inline'>
                    <span><Link href="/">Experience</Link></span>
                    <span className='pl-2'>◆</span>
                    <span className='pl-2'><Link href="/">Twitter</Link></span>
                    <span className='pl-2'>◆</span>
                    <span className='pl-2'><Link href="/">LinkedIn</Link></span>
                    <span className='pl-2'>◆</span>
                    <span className='pl-2'><Link href="/">Email</Link></span>
                </div>
                <br/>
                <br/>
                <br/>
                <h2 className='h-[37px] font-bold'>Projects</h2>
                <div className="border-l-[5px] border-l-[#f26130] p-1 pl-5">
                    <h3 className='font-bold text-lg'>end</h3>
                    <br/>
                    <p>Interplanetary macroeconomic simulator with RPG elements</p>
                    <br/>
                    <p className='pl-2'>◆ Built with: TypeScript, React, React Native, Nx, Three.js, React Three Fiber</p>
                    <p className='pl-2'>◆ Principles: Cross-platform, offline-first</p>
                    <br/>
                    <div className='inline'>
                        <span><Link href="/">Github</Link></span>
                        <span className='pl-2'>◆</span>
                        <span className='pl-2'><Link href="/">Website</Link></span>
                        <span className='pl-2'>◆</span>
                        <span className='pl-2'><Link href="/">Download</Link></span>
                    </div>
                </div>
                <br/>
                <br/>
                <div className="border-l-[5px] border-l-[#f26130] p-1 pl-5">
                    <h3 className='font-bold text-lg'>act</h3>
                    <br/>
                    <p>General purpose achievement tracker</p>
                    <br/>
                    <p className='pl-2'>◆ Built with: TypeScript, React, React Native, Nx</p>
                    <p className='pl-2'>◆ Principles: Cross-platform, offline-first</p>
                    <br/>
                    <div className='inline'>
                        <span><Link href="/">Github</Link></span>
                        <span className='pl-2'>◆</span>
                        <span className='pl-2'><Link href="/">Website</Link></span>
                        <span className='pl-2'>◆</span>
                        <span className='pl-2'><Link href="/">Download</Link></span>
                    </div>
                </div>
            </div>
        </>)
}
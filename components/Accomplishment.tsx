export default function Accomplishment({children}) {
    return (
        <div className='flex'>
            <div className='pr-2'>◆</div>
            <div>{children}</div>
        </div>
    )
}
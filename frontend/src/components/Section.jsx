


function Section(props){

    return (
        <div className='bg-black/60 p-10 backdrop-blur-sm rounded-xl border-2 border-blue-800 ring-2 ring-black text-slate-300 shadow-lg shadow-black grid grid-cols-1 '>
            {
                props.children
            }
        </div>
    )
}
export default Section;
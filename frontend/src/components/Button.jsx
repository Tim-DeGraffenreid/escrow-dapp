
function Button(props){
    return(
        <div className="cursor-pointer">
            <a href={props.href} target={props.target} onClick={props.onClick} className={`${props.className} bg-gradient-to-t from-blue-500 to-blue-800 m-2 w-full border-slate-400  hover:bg-gradient-to-b border-[1px] rounded-lg py-4 px-4 block  font-bold text-2xl  hover:text-black shadow-inner shadow-black/70 text-black `}>{props.caption}</a>
        </div>
    )
}

export default Button;
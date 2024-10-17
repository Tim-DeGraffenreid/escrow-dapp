
function Button(props){
    return(
        <div>
            <a href={props.href} className="bg-blue-800 m-4  border-slate-400  border-[1px] rounded-lg py-4 px-6 block w-fit  font-bold text-lg hover:bg-opacity- hover:text-slate-200 shadow-inner shadow-black/50 text-slate-300">{props.caption}</a>
        </div>
    )
}

export default Button;
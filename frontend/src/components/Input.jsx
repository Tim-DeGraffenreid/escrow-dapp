
function Input(props){

    return (
        <>
        <label className={`${props.labelClass} text-slate-300 font-semibold text-left`} htmlFor={props.name}>{props.label}</label>
        <input 
            name={props.name}
            className={`${props.className} p-2 bg-slate-700  `}
            id={props.id}
            value={props.value}
            placeholder={props.placeholder}
            type={props.type || 'text'}
            >
            </input>
        </>
    )
}

export default Input;
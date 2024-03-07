import './style.css';

const Button = ({text, onClick, disabled, width}) => {
    return (
        <div 
         onClick={onClick}
         disabled={disabled}
         className='custom-btn'
         style={{width:width}}
        >
            {text}
        </div>
    )
};

export default Button;
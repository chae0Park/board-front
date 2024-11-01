import './Icon.css';

const Icon = ({term}) => {
    return(
        <div className='Icon'>
            <button className='popularIcon'>{term}</button>
        </div>
    )
}

export default Icon;
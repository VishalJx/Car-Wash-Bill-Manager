// src/components/Icon.jsx
const Icon = ({ name, className = "" }) => {
    return (
      <img 
        src={`/icons/${name}.svg`} 
        alt={`${name} icon`}
        className={className}
      />
    );
  };
  
  export default Icon;
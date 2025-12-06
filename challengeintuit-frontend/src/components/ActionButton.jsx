import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';

const ActionButton = ({ onClick, variant, tooltipText, children }) => {
    const baseClass = "btn-circle shadow-sm border-0 d-flex align-items-center justify-content-center";
    
    const variantClass = variant === 'purple' ? 'btn-custom-purple' 
                       : variant === 'red' ? 'btn-custom-red' 
                       : 'btn-light'; // Default

    const button = (
        <Button 
            className={`${baseClass} ${variantClass}`}
            onClick={onClick}
            style={{ width: '38px', height: '38px' }} 
        >
            {children}
        </Button>
    );

    if (tooltipText) {
        return (
            <OverlayTrigger 
                placement="top" 
                overlay={<Tooltip id={`tooltip-${Math.random()}`}>{tooltipText}</Tooltip>}
            >
                {button}
            </OverlayTrigger>
        );
    }

    return button;
};

export default ActionButton;
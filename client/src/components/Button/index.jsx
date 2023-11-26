import "./style.css";

/**
 * Button component.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {ReactNode} props.children - Children to be rendered inside button.
 * @param {function} props.onClick - Function to be called on button click.
 * @param {string} props.type - Button type.
 * @param {string} props.buttonStyle - Button style.
 * @returns {JSX.Element} - Button component template.
 *
 * @example
 * // Primary button
 * <Button buttonStyle="btn--primary">Click Me</Button>
 *
 * // Secondary button
 * <Button buttonStyle="btn--secondary">Click Me</Button>
 *
 * // Danger button
 * <Button buttonStyle="btn--danger">Click Me</Button>
 */

const Button = ({ children, onClick, type, buttonStyle }) => {
    return (
        <button
            className={`btn ${buttonStyle || ""}`}
            onClick={onClick}
            type={type}
        >
            {children}
        </button>
    );
};

export default Button;

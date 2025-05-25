import { cc } from 'utils/combineClasses'
import styles from './styles.module.scss'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input = ({ className, ...rest }: Props) => {
  return <input className={cc(styles.inputRoot, className)} {...rest} />;
};

export default Input;

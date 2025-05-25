import { cc } from 'utils/combineClasses'
import styles from './styles.module.scss'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  icon: string;
}

const IconButton = ({ className, icon, ...rest }: Props) => {
  return (
    <button className={cc(styles.iconButtonRoot, className)} {...rest}>
      <img src={icon} />
    </button>
  );
};

export default IconButton;

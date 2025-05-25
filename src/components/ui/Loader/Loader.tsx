import { Icons } from 'constants/icons'
import { cc } from 'utils/combineClasses'
import CustomSVG from '../CustomSVG'
import styles from './styles.module.scss'

interface Props {
  className?: string
  iconClassName?: string
  color?: 'first' | 'second' | 'third' | 'fourth'
  size?: 'S' | 'M' | 'L'
}

const Loader = ({ className, color = 'first', size = 'S' }: Props) => {
  return (
    <div className={cc(styles.loaderRoot, className)}>
      <CustomSVG className={cc(styles[`loader_color_${color}`], styles.loaderIcon, styles[`loader_size${size}`])}>
        {Icons.common.loader}
      </CustomSVG>
    </div>
  )
}

export default Loader